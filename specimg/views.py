import os
from django.shortcuts import render
from django.http import HttpResponse

from tempfile import gettempdir
import os.path as path
import numpy as np
import pandas as pd
import librosa
import soundfile as sf
import struct
import time
from PIL import Image, ImageOps
from io import BytesIO
from files.models import File
from projects.models import Project
import datetime as dt
from webspec import settings
from pytz import timezone
from skimage import transform
import multiprocessing
import threading
import math
from dateutil.parser import isoparse

JOBS_PER_CORE = 3


class PropGetter():
    def __init__(self, request):
        self.request = request
    def get(self, name, format):
        return format(self.request.GET[name])
        

class CachedFile():
    def __init__(self, file_id, tstart, tend, nfft, wfft):
        """
            Parameters
            ----------
             - `file_id` : id of the file
             - `tstart` : time start in datetime object
             - `tend` : time end in datetime object
             - `nfft` : fft number for stft algorithm
             - `wfft` : fft window len for stft algorithm
        """
        self.file_obj = File.objects.get(id=file_id)

        self.nfft = nfft
        self.wfft = wfft
        self.hop_l = wfft//4
        self.fftws_per_block = 10
        self.last_fftw_pos = (self.fftws_per_block-1)*self.hop_l
        self.frames_per_block = self.last_fftw_pos+self.wfft
        self.overlap = self.wfft - self.hop_l
        self.blocks_per_chunk = multiprocessing.cpu_count()*JOBS_PER_CORE
        self.chunk_l = self.fftws_per_block * \
            (self.blocks_per_chunk-1)*self.hop_l + \
            (self.fftws_per_block-1)*self.hop_l+self.wfft
        self.hops_per_chunk = self.fftws_per_block*self.blocks_per_chunk
        self.tot_frames = self.file_obj.length*self.file_obj.sample_rate


        self.last_i = math.floor(
            (self.tot_frames - self.wfft)/self.hop_l/self.hops_per_chunk)
        self.nchunks = self.last_i+1

        self.cache_fn = path.join(gettempdir(), f"{file_id}_{nfft}_{wfft}.dat")
        self.cache_w = int((self.tot_frames - self.wfft)//self.hop_l)+1
        self.pxs = self.cache_w/self.file_obj.length
        if not self.file_obj.stereo:
            shape = (1+self.nfft//2, self.cache_w)
        else:
            shape = (2, 1+self.nfft//2, self.cache_w)

        
        self.cache = np.memmap(
            self.cache_fn, dtype="float32", mode="w+", shape=shape)

        self.last_access = time.time()

        self.requested_chunks_ixs = []
        self.cached_ixs = []

        self.cached_ixs_ptr = 0

        ts, te = self.to_seconds(tstart),self.to_seconds(tend)

        self.enqueue_chunks_request(ts, te)

        threading.Thread(target=self.fill_raw_stft).start()

        self.cv = threading.Condition()

    @property
    def cur_cache_range(self):
        return self.cached_ixs[self.cached_ixs_ptr]

    def enqueue_chunks_request(self, ts, te):
        """
            Parameters
            ----------
             - `ts` : time start in seconds from the start of the audio track
             - `te` : time end in seconds from the start of the audio track
        """
        i_s = self.time_to_chunk(ts)
        i_e = self.time_to_chunk(te)
        for i in range(i_s, i_e+1):
            self.requested_chunks_ixs.append(i)

    def to_seconds(self, t):
        """
            Parameters
            ----------
             - `t` : time in datetime object

            Returns
            ----------
            Time in seconds from the start of the audio track.
        """
        return (t-self.file_obj.tstart).total_seconds()
    def to_datetime(self, t):
        """
            Parameters
            ----------
             - `t` : time in seconds

            Returns
            ----------
            Time as a datetime object.
        """
        return self.file_obj.tstart+dt.timedelta(seconds=t)

    def chunk_pos(self, i):
        """
            Parameters
            ----------
             - `i` : index of the chunk

            Returns
            ----------
            The index of the first frame of the i-th chunk.
        """
        return i*self.hop_l*self.blocks_per_chunk*self.fftws_per_block

    def time_to_chunk(self, t):
        """
            Parameters
            ----------
             - `t` : time in seconds from the start of the audio track

            Returns
            ----------
            The index of chunk that covers the time point `t`.
        """
        return math.floor(t*self.file_obj.sample_rate/(self.hop_l*self.blocks_per_chunk*self.fftws_per_block))

    def reaches_end(self):
        """
            Returns
            ----------
            `True` iff the cache reaches the end of the file.
        """
        return self.cached_ixs and self.cached_ixs[-1][1] == self.last_i

    def reaches_start(self):
        """
            Returns
            ----------
            `True` iff the cache reaches the start of the file.
        """
        return self.cached_ixs and self.cached_ixs[0][0] == 0

    def is_filled(self):
        """
            Returns
            ----------
            `True` iff the cache covers the entire file.
        """
        return self.reaches_start() and self.reaches_end() and len(self.cached_ixs) == 1

    def fill_raw_stft(self):
        """
            Fills the cache.
        """
        even = True
        while not self.is_filled():
            while self.requested_chunks_ixs:
                i = self.requested_chunks_ixs.pop(0)
                self.load_chunk(i)
            if even:
                if not self.reaches_end():
                    self.load_chunk(self.cur_cache_range[1]+1)
                if not self.reaches_start():
                    even = not even
            else:
                if not self.reaches_start():
                    self.load_chunk(self.cur_cache_range[0]-1)
                if not self.reaches_end():
                    even = not even

    def load_chunk(self, i):
        """
            Load `i`-th chunk into the cache.
            Parameters
            ----------
             - `i` : index of the chunk to load
        """
        j = 0
        while j < len(self.cached_ixs) and i > self.cached_ixs[j][0]-1:
            j += 1
        if j>0 and self.cached_ixs[j-1][1]+1==i:
            j-=1
        self.cached_ixs_ptr = j
        if j < len(self.cached_ixs):
            if self.cur_cache_range[0] <= i and self.cur_cache_range[1] >= i:
                return

        blocks = sf.blocks(self.file_obj.path, blocksize=self.frames_per_block,
                           frames=self.chunk_l, start=self.chunk_pos(i), overlap=self.overlap)

        def compute_stft(block,k, j):
            self.cache[k, :, j:j+self.fftws_per_block] = np.log10(
                np.abs(librosa.stft(block, n_fft=self.nfft, win_length=self.wfft,
                                    hop_length=self.hop_l, center=False, dtype=np.complex64), dtype=np.float32)**2

            )

        j = i*self.fftws_per_block*self.blocks_per_chunk

        threads = []

        for block in blocks:
            if self.file_obj.stereo:
                for k in range(2):
                    thread = threading.Thread(
                        target=compute_stft, args=(block.T[k], k,j,))

            else:
                thread = threading.Thread(
                    target=compute_stft, args=(block.T,0, j,))
            
            threads.append(thread)
            thread.start()
            j += self.fftws_per_block

        for thread in threads:
            thread.join()

        self.update_cached(i)
        self.noty_all()
    
    def noty_all(self):
        with self.cv:
            self.cv.notify_all()

    def update_cached(self, i):
        """
            Add the i-th chunk into cached chunks and eventually merges ranges of loaded cache.
            Parameters
            ----------
             - `i` : index of the chunk to add to the cached ones
        """
        def check_merge(left):
            if left and self.cached_ixs_ptr > 0 and self.cached_ixs[self.cached_ixs_ptr-1][1] == self.cur_cache_range[0]-1:
                self.cur_cache_range[0] = self.cached_ixs[self.cached_ixs_ptr-1][0]
                self.cached_ixs.pop(self.cached_ixs_ptr-1)
                self.cached_ixs_ptr -= 1
            elif not left and self.cached_ixs_ptr < len(self.cached_ixs)-1 and self.cached_ixs[self.cached_ixs_ptr+1][0] == self.cur_cache_range[1]+1:
                self.cur_cache_range[1] = self.cached_ixs[self.cached_ixs_ptr+1][1]
                self.cached_ixs.pop(self.cached_ixs_ptr+1)
            self.noty_all()

        if not self.cached_ixs:
            self.cached_ixs.append([i,i])
            self.cached_ixs_ptr = 0
            self.noty_all()
            return

        if self.cached_ixs_ptr < len(self.cached_ixs):
            if self.cached_ixs[self.cached_ixs_ptr][0]-1 == i:
                self.cached_ixs[self.cached_ixs_ptr][0] = i
                check_merge(True)
                return
            if self.cached_ixs[self.cached_ixs_ptr][1]+1 == i:
                self.cached_ixs[self.cached_ixs_ptr][1] = i
                check_merge(False)
                return

        if self.cached_ixs_ptr == len(self.cached_ixs) or not (i >= self.cached_ixs[self.cached_ixs_ptr][0] and i <= self.cached_ixs[i][0]):
            self.cached_ixs.insert(self.cached_ixs_ptr, [i,i])
            self.cached_ixs_ptr = self.cached_ixs_ptr
            self.noty_all()

    def get_stft_raw(self, ts, te, ch):
        """
            Get the values from the stft cached array between `ts` and `te` and from channel `ch`

            Parameters
            ----------
             - `ts` : time start in seconds from the start of the audio track
             - `te` : time end in seconds from the start of the audio track
             - `ch` : channel, either `l`, `r` or any other string for mono
            
            Returns
            ----------
             - `ts` : actual time start of `raw_stft` in seconds from the start of the audio track
             - `te` : actual time end of `raw_stft` in seconds from the start of the audio track
             - `raw_stft` : a copy of the unelaborated stft cached subarray covering time range from `ts` to `te`

        """

        i_s = int(self.pxs*ts)
        i_e = int(self.pxs*te)+1

        if ch == "l":
            raw_stft = self.cache[0, :, i_s:i_e]
        elif ch == "r":
            raw_stft = self.cache[1, :, i_s:i_e]
        else:
            if not self.file_obj.stereo:
                raw_stft = self.cache[:, i_s:i_e]
            else:
                raw_stft = np.sum(self.cache[:, :, i_s:i_e], axis=0)

        ts = i_s/self.pxs
        te = i_e/self.pxs

        return ts, te, np.copy(raw_stft)

    def is_req_sat(self, ts, te):
        """
            Parameters
            ----------
             - `ts` : time start in seconds
             - `te` : time end in seconds
             - `ch` : channel, either `l`, `r` or any other string for mono

             Returns
             -------
             `True` iff. the time range between `ts` and `te` is covered by the cache.
        """

        i_s, i_e = self.time_to_chunk(ts), self.time_to_chunk(te)
        j = 0
        while j < len(self.cached_ixs) and i_s < self.cached_ixs[j][0]:
            j += 1
        if j == len(self.cached_ixs):
            return False
        return self.cached_ixs[j][0] <= i_s and i_e <= self.cached_ixs[j][1]

    def get(self, tstart, tend, request):
        """
            Parameters
            ----------
             - `tstart` : time start in datetime object
             - `tend` : time end in datetime object
             - `request` : PropGetter with request containing following `GET` attributes: `ch`,`sens`,`con`,`pxs`
             
             Returns
             -------
             - starting time of the image, in ms from 1970-01-01 00:00 UTC
             - ending time of the image, in ms from 1970-01-01 00:00 UTC
             - starting frequence of the image
             - ending frequence of the image
             - image as Image object (Pillow)
        """

        ts, te = self.to_seconds(tstart), self.to_seconds(tend)

        with self.cv:
            self.cv.wait_for(lambda: self.is_req_sat(ts, te))

        ch = request.get('ch', str)

        tstart, tend, data = self.get_stft_raw(ts, te, ch)

        sens = 100-request.get('sens', float)
        con = 100-request.get('con', float)
        thresholds = ((sens/25-2)+con*3/50, 255/((sens/25-7)-con*3/50))

        data -= thresholds[0]
        data *= thresholds[1]
        data = np.clip(data, 0, 255)
        data = data.astype(np.uint8)

        dur = te-ts
        width = round(dur*request.get('pxs', float))

        data = transform.resize(data, (data.shape[0], min(
            width, data.shape[1])), order=0, anti_aliasing=False)

        img = Image.fromarray(data, 'L')
        img = ImageOps.flip(img)

        self.last_access = time.time()

        tstart = self.to_datetime(tstart)
        tend = self.to_datetime(tend)

        return tstart.timestamp()*1000, tend.timestamp()*1000, 0, self.file_obj.sample_rate/2, img

    def clear(self):
        del self.cache
        os.remove(self.cache_fn)
        pass


class Cache:
    def __init__(self, max_count):
        self.files = {}
        self.max_count = max_count

    def index(self, file_id, nfft, wfft):
        return f"{file_id}_{nfft}_{wfft}"

    def f(self, file_id, nfft, wfft):
        return self.files[self.index(file_id, nfft, wfft)]

    def add(self, file_id, tstart, tend, nfft, wfft):
        if len(self.files) == self.max_count:
            self.evict()
        self.files[self.index(file_id, nfft, wfft)] = CachedFile(
            file_id, tstart, tend, nfft, wfft)
        return self.f(file_id, nfft, wfft)

    def evict(self):
        self.files = dict(sorted(self.files.items(),
                                 key=lambda file: file[1].last_access, reverse=True))
        f = self.files.popitem()
        f[1].clear()

    def get(self, file_id, tstart, tend, nfft, wfft, request):
        if self.index(file_id,nfft,wfft) in self.files:
            return self.f(file_id, nfft, wfft).get(tstart, tend, request)
        return self.add(file_id, tstart, tend, nfft, wfft).get(tstart, tend, request)




CACHE = Cache(10)

def render_spec_img(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):

    tstart = isoparse(tstart)
    tend = isoparse(tend)

    request = PropGetter(request)

    wfft = request.get("wfft",int)
    nfft = request.get("nfft",int)

    # _, _, _, _, img = spec_multi_threaded(file_id,tstart,tend,request.request)
    _, _, _, _, img = CACHE.get(file_id, tstart, tend, nfft,wfft, request)
    buffered = BytesIO()
    img.save(buffered, format="png")

    return HttpResponse(buffered.getvalue(), content_type="image/png")

def render_spec_data(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):
    tstart = isoparse(tstart)
    tend = isoparse(tend)

    request = PropGetter(request)

    wfft = request.get("wfft",int)
    nfft = request.get("nfft",int)

    ts, te, fs, fe, img = CACHE.get(file_id, tstart, tend,nfft,wfft, request)
    buffered = BytesIO()
    buffered.write(struct.pack('QQdd', round(ts), round(te), fs, fe))
    img.save(buffered, format="png")

    return HttpResponse(buffered.getvalue(), content_type="application/octet-stream")





'''





        Old version not using cache






'''


def spec_multi_threaded(file_id, tstart, tend, request):
    sr = 44100
    last_time = time.time()
    file_obj = File.objects.get(id=file_id)
    ts = isoparse(tstart)
    te = isoparse(tend)

    def reqprop(name, format): return format(request.GET[name])

    
    ch = reqprop('ch', str)
    sens = 100-reqprop('sens', float)
    con = 100-reqprop('con', float)
    nfft = reqprop('nfft', int)
    wfft = reqprop('wfft', int)

    # ch = str(request.GET['ch'])
    # sens = 100-float(request.GET['sens'])
    # con = 100-float(request.GET['con'])
    # nfft = int(request.GET['nfft'])
    # wfft = int(request.GET['wfft'])

    if ts >= file_obj.tend:
        return None, None, None, None, None
    elif ts < file_obj.tstart:
        ts = file_obj.tstart

    offset = (ts - file_obj.tstart).total_seconds()
    if te < ts:
        return None, None, None, None, None
    else:
        if file_obj.tend < te:
            te = file_obj.tend
        dur = (te-ts).total_seconds()

    print(offset, dur)

    mono = ch == "mono"

    hop_length = int(3*(wfft//4))
    frame_length = wfft
    n_approx = multiprocessing.cpu_count()*2
    # n_approx = 8
    block_width_approx = dur*file_obj.sample_rate/n_approx
    # exp = int(math.log2((block_width_approx-frame_length)/hop_length+1))
    # block_length = min(256, 2**exp)
    block_length = int((block_width_approx-frame_length)/hop_length+1)//2
    if block_length == 0:
        n_approx = 1
        # n_approx = 8
        block_width_approx = dur*file_obj.sample_rate/n_approx
        # exp = int(math.log2((block_width_approx-frame_length)/hop_length+1))
        # block_length = min(256, 2**exp)
        block_length = int((block_width_approx-frame_length)/hop_length+1)//2

    stream = librosa.stream(file_obj.path, block_length=block_length, frame_length=frame_length, hop_length=hop_length,
                            duration=dur, offset=offset, mono=mono, dtype=np.float32)

    thresholds = ((sens/25-2)+con*3/50, (sens/25-7)-con*3/50)

    tot_width = int(file_obj.sample_rate*dur)

    block_width = (block_length-1)*hop_length+frame_length
    n_frames = int(math.ceil((tot_width-frame_length)/hop_length))+1
    print("n_frames raw, actual", (tot_width-frame_length)/hop_length, n_frames)
    n_blocks = int(math.ceil(n_frames/block_length))
    fft_hop_l = wfft//4
    width = int(math.ceil((sr*dur)/fft_hop_l))
    fft_block_width = int(math.ceil((block_width - wfft)/fft_hop_l))
    # last_block_width = tot_width - hop_length*(n_blocks-1)*(block_length)
    last_frame_length = tot_width - hop_length*(n_frames-1)
    # print("Frame, last frame",frame_length,last_frame_length)
    # last_block_width = tot_width-(n_blocks-1)*block_width
    # last_block_width =   (n_frames - block_length*(n_blocks-1)-1)*hop_length+last_frame_length
    last_block_width = tot_width - hop_length*(n_blocks-1)*(block_length)
    fft_last_block_width = max(
        int(math.ceil((last_block_width - wfft)/fft_hop_l)), 1)

    data = np.empty([int(nfft//2+1), fft_block_width *
                     (n_blocks-1)+fft_last_block_width], dtype=np.uint8)
    i = 0
    threads = []
    last_block_widths = [fft_block_width]
    block_samples = block_width
    tw = 0
    s = 255/thresholds[1]

    def compute_stft(block, i):
        fft_block = np.log10(
            np.abs(librosa.stft(block, n_fft=nfft, win_length=wfft,
                                hop_length=fft_hop_l, center=False, dtype=np.complex64), dtype=np.float32)**2

        )-thresholds[0]
        fft_block *= s
        fft_block = np.clip(fft_block, 0, 255)
        fft_block = fft_block.astype(np.uint8)
        width = fft_block.shape[1]
        last_block_widths[0] = min(last_block_widths[0], width)
        start = i*fft_block_width
        data[:, start:start+fft_block.shape[1]] = fft_block

    for block in stream:
        if not mono:
            b = block[0] if ch == "l" else block[1]
        else:
            b = block
        tw += b.shape[0]
        thread = threading.Thread(target=compute_stft, args=(b, i,))
        if b.shape[0] < block_samples:
            block_samples = b.shape[0]
            print("bs, lbw", block_samples == last_block_width,
                  block_samples, last_block_width)
        thread.start()
        threads.append(thread)
        i += 1

    print("blocks number", n_blocks, i)

    for thread in threads:
        thread.join()

    # print(last_block_widths[0] == fft_last_block_width,
        #   last_block_widths[0], fft_last_block_width)
    cur_time = time.time()
    print("read, fft computed {:.4f}".format(cur_time - last_time))
    last_time = cur_time

    width = round(dur*float(request.GET["pxs"]))

    data = transform.resize(data, (data.shape[0], min(
        width, data.shape[1])), order=0, anti_aliasing=False)
    # data = transform.resize(data, (data.shape[0], width), order=0, anti_aliasing=False)

    cur_time = time.time()
    print("data resize {:.4f}".format(cur_time - last_time))
    last_time = cur_time

    img = Image.fromarray(data, 'L')
    img = ImageOps.flip(img)

    return ts.timestamp()*1000, te.timestamp()*1000, 0, sr/2, img


data_requests = {}


# def render_spec_img(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):

#     # project = Project.objects.get(id=proj_id)
#     # proj_fft = int(project.fft_window_view)
#     # nfft = int(request.GET['nfft'])
#     # wfft = int(request.GET['wfft'])
#     # offset=float(request.GET['offset'])
#     # factor = int(request.GET['factor'])
#     # if not nfft in data_requests:
#     #     data_requests[nfft] = {}
#     # if not wfft in data_requests[nfft]:
#     #     data_requests[nfft][wfft] = {}
#     # if not offset in data_requests[nfft][wfft]:
#     #     data_requests[nfft][wfft][offset] = Data(request, proj_id, device_id, file_id)
#     # else:
#     #     print("present")
#     # return data_requests[nfft][wfft][offset].get_img_response(factor)

#     # To test: 2020-11-12T07:11:30.000+01:00/2020-11-12T07:12:30.000+01:00

#     _, _, _, _, img = spec_multi_threaded(file_id, tstart, tend, request)
#     buffered = BytesIO()
#     img.save(buffered, format="png")

#     return HttpResponse(buffered.getvalue(), content_type="image/png")


# def render_spec_data(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):
#     ts, te, fs, fe, img = spec_multi_threaded(file_id, tstart, tend, request)
#     buffered = BytesIO()
#     buffered.write(struct.pack('QQdd', round(ts), round(te), fs, fe))
#     img.save(buffered, format="png")

#     return HttpResponse(buffered.getvalue(), content_type="application/octet-stream")


def render_spec_single_core(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):

    # Width is here given by the following formula:
    #   ceil((sr*dur-fft_win)/hop_length)

    width = 7718
    last_time = time.time()
    file_obj = File.objects.get(id=file_id)
    ts = isoparse(tstart)
    te = isoparse(tend)

    ch = str(request.GET['ch'])
    sens = 100-float(request.GET['sens'])
    con = 100-float(request.GET['con'])
    nfft = int(request.GET['nfft'])
    wfft = int(request.GET['wfft'])

    if ts >= file_obj.tend:
        return HttpResponse('', content_type="text/html")
    elif ts < file_obj.tstart:
        ts = file_obj.tstart

    offset = (ts - file_obj.tstart).total_seconds()
    if te < ts:
        return HttpResponse('', content_type="text/html")
    else:
        if file_obj.tend < te:
            te = file_obj.tend
        dur = (te-ts).total_seconds()

    print(offset, dur)

    mono = ch == "mono"

    print("Width", math.ceil(((file_obj.sample_rate*dur)-wfft)*4/wfft))

    raw_data, _ = librosa.load(
        file_obj.path, duration=dur, offset=offset, mono=mono, sr=file_obj.sample_rate)

    thresholds = ((sens/25-2)+con*3/50, (sens/25-7)-con*3/50)

    data = np.log10(
        np.abs(librosa.stft(raw_data, n_fft=nfft,
               win_length=wfft, center=False))**2
    )-thresholds[0]
    data *= 255/thresholds[1]
    data = np.clip(data, 0, 255)
    data = data.astype(np.uint8)

    # data = transform.resize(data, (data.shape[0], width), order=0, anti_aliasing=False)

    cur_time = time.time()
    print("data resize {:.4f}".format(cur_time - last_time))
    last_time = cur_time

    img = Image.fromarray(data, 'L')
    buffered = BytesIO()
    img = ImageOps.flip(img)
    img.save(buffered, format="png")
    res = buffered.getvalue()

    return HttpResponse(res, content_type="image/png")
