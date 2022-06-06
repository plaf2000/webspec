from django.shortcuts import render
from django.http import HttpResponse

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

class CachedFile():
    def __init__(self, file_id, tstart, tend, nfft, wfft):
        self.file_obj = File.objects.get(id=file_id)
        self.last_access = time.time()
        file_obj = File.objects.get(id=file_id)

        self.nfft = nfft
        self.wfft = wfft
        self.hop_l = wfft//4
        self.fftws_per_block = 20
        self.last_fftw_pos = (self.fftws_per_block-1)*self.hop_l
        self.frames_per_block = self.last_fftw_pos+self.wfft
        self.overlap = self.wfft - self.hop_l
        self.blocks_per_chunk = multiprocessing.cpu_count()*JOBS_PER_CORE
        self.chunk_l = self.fftws_per_block*(self.blocks_per_chunk-1)*self.hop_l+(self.fftws_per_block-1)*self.hop_l+self.wfft

        self.cv = threading.Condition()

        ts = isoparse(tstart)
        te = isoparse(tend)

    def chunk_pos(self,i):
        return i*self.hop_l*self.blocks_per_chunk*self.fftws_per_block

    def is_filled(self):
        return self.ts == self.file_obj.tstart and self.te == self.file_obj.te
    
    def fill_raw_stft(self):
        pass

    def load_chunk(self, ts, te):
        hop_length = int(3*(self.wfft//4))
        frame_length = self.wfft
        n_approx = multiprocessing.cpu_count()*2
        # n_approx = 8
        block_width_approx = dur*file_obj.sample_rate/n_approx
        # exp = int(math.log2((block_width_approx-frame_length)/hop_length+1))
        # block_length = min(256, 2**exp)
        block_length = int((block_width_approx-frame_length)/hop_length+1)//2
        if block_length == 0:
            n_approx = 1
            # n_approx = 8
            block_width_approx = dur*self.file_obj.sample_rate/n_approx
            # exp = int(math.log2((block_width_approx-frame_length)/hop_length+1))
            # block_length = min(256, 2**exp)
            block_length = int((block_width_approx-frame_length)/hop_length+1)//2

        stream = librosa.stream(file_obj.path, block_length=block_length, frame_length=frame_length, hop_length=hop_length,
                                duration=dur, offset=ts, mono=mono)

        tot_width = int(file_obj.sample_rate*dur)

        block_width = (block_length-1)*hop_length+frame_length
        n_frames = int(math.ceil((tot_width-frame_length)/hop_length))+1
        print("n_frames raw, actual", (tot_width-frame_length)/hop_length, n_frames)
        n_blocks = int(math.ceil(n_frames/block_length))
        fft_hop_l = self.wfft//4
        fft_block_width = int(math.ceil((block_width - self.wfft)/fft_hop_l))
        last_block_width = tot_width - hop_length*(n_blocks-1)*(block_length)
        fft_last_block_width = max(
            int(math.ceil((last_block_width - self.wfft)/fft_hop_l)), 1)

        data = np.empty([int(self.nfft//2+1), fft_block_width *
                        (n_blocks-1)+fft_last_block_width], dtype=np.uint8)

    def offset_dur_block(self, i):
        pass

    def get_stft_raw(self,tstart,tend,ch):
        pass

    def is_req_sat(self,tstart,tend):
        return self.ts <= tstart and self.te<=tend

    def get(self, tstart, tend, request):
        with self.cv:
            self.cv.wait_for(lambda: self.is_req_sat(tstart,tend))
        
        reqprop = lambda name, format: format(request.GET[name])
        ch = reqprop('ch',str)

        fft_raw, tstart, tend = self.get_stft_raw(tstart,tend,ch)
        
        
        sens = 100-reqprop('sens',float)
        con = 100-reqprop('con',float)
        thresholds = ((sens/25-2)+con*3/50, 255/((sens/25-7)-con*3/50))


        fft_block-= thresholds[0]
        fft_block *= thresholds[1]
        fft_block = np.clip(fft_block, 0, 255)
        fft_block = fft_block.astype(np.uint8)

        dur = (tend-tstart).total_seconds()
        width = round(dur*float(request.GET["pxs"]))

        data = transform.resize(data, (data.shape[0], min(width, data.shape[1])), order=0, anti_aliasing=False)

        img = Image.fromarray(data, 'L')
        img = ImageOps.flip(img)

        self.last_access = time.time()

        return tstart.timestamp()*1000, tend.timestamp()*1000, 0, self.file_obj.sr/2, img


    def fill(self):
        pass


class Cache:
    def __init__(self, max_count):
        self.files = {}
        self.max_count = max_count

    def index(self, file_id, nfft, wfft):
        return f"{file_id}_{nfft}_{wfft}"

    def f(self, file_id, nfft,wfft):
        return self.files[self.index(file_id,nfft,wfft)]

    def add(self, file_id, tstart, tend, nfft, wfft):
        if len(self.count) == self.max_count:
            self.evict()
        self.files[self.index(file_id,nfft,wfft)] = CachedFile(file_id, tstart, tend, nfft, wfft)
        return self.f(file_id,nfft,wfft)

    def evict(self):
        self.files = dict(sorted(self.files.items(), key = lambda file: file[1].last_access, reverse=True))
        self.files.popitem()

    def get(self, file_id,tstart, tend, nfft, wfft, request):

        f = self.f(file_id,nfft,wfft)

        if f is not None:
            return f.get(tstart, tend, request)
        return self.add(self,file_id,tstart,tend,nfft,wfft).get(tstart, tend, request)
        


def spec_multi_threaded(file_id, tstart, tend, request):
    sr = 44100
    last_time = time.time()
    file_obj = File.objects.get(id=file_id)
    ts = isoparse(tstart)
    te = isoparse(tend)

    reqprop = lambda name, format: format(request.GET[name])
    ch = reqprop('ch',str)
    sens = 100-reqprop('sens',float)
    con = 100-reqprop('con',float)
    nfft = reqprop('nfft',int)
    wfft = reqprop('wfft',int)
    

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


def render_spec_img(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):

    # project = Project.objects.get(id=proj_id)
    # proj_fft = int(project.fft_window_view)
    # nfft = int(request.GET['nfft'])
    # wfft = int(request.GET['wfft'])
    # offset=float(request.GET['offset'])
    # factor = int(request.GET['factor'])
    # if not nfft in data_requests:
    #     data_requests[nfft] = {}
    # if not wfft in data_requests[nfft]:
    #     data_requests[nfft][wfft] = {}
    # if not offset in data_requests[nfft][wfft]:
    #     data_requests[nfft][wfft][offset] = Data(request, proj_id, device_id, file_id)
    # else:
    #     print("present")
    # return data_requests[nfft][wfft][offset].get_img_response(factor)

    # To test: 2020-11-12T07:11:30.000+01:00/2020-11-12T07:12:30.000+01:00

    _, _, _, _, img = spec_multi_threaded(file_id, tstart, tend, request)
    buffered = BytesIO()
    img.save(buffered, format="png")

    return HttpResponse(buffered.getvalue(), content_type="image/png")


def render_spec_data(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):
    ts, te, fs, fe, img = spec_multi_threaded(file_id, tstart, tend, request)
    buffered = BytesIO()
    buffered.write(struct.pack('QQdd', round(ts), round(te), fs, fe))
    img.save(buffered, format="png")

    return HttpResponse(buffered.getvalue(), content_type="application/octet-stream")


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

    print("Width",math.ceil(((file_obj.sample_rate*dur)-wfft)*4/wfft))


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
