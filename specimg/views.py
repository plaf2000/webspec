from django.shortcuts import render
from django.http import HttpResponse

import numpy as np
import pandas as pd
import librosa
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


# Create your views here.


class Data():
    def __init__(self, request, proj_id, device_id):

        file_obj = File.objects.get(id=file_id)

        offset = float(request.GET['offset'])
        dur = float(request.GET['dur'])
        ch = str(request.GET['ch'])
        sens = 100-float(request.GET['sens'])
        con = 100-float(request.GET['con'])
        fname = File.objects.get(id=file_id).path
        nfft = int(request.GET['nfft'])
        wfft = int(request.GET['wfft'])
        last = bool(int(request.GET['last']))
        sr = file_obj.sample_rate
        spx = wfft/sr/4
        mono = ch == "mono"
        try:
            f_ulim = int(request.GET['hf'])
        except:
            f_ulim = None
        try:
            f_llim = int(request.GET['lf'])
        except:
            f_llim = None

        first = offset == 0

        i_ch = 0 if ch == "l" else 1 if ch == "r" else None

        thresholds = ((sens/25-2)+con*3/50, (sens/25-7)-con*3/50)

        margin_factor = 10

        if first:
            dur += spx*margin_factor
        else:
            offset -= spx*margin_factor
            dur += 2*spx*margin_factor

        y, _ = librosa.load(fname, sr=sr, duration=dur,
                            offset=offset, mono=mono)
        val = (librosa.get_duration(y, sr)-dur)*sr
        to_append = False
        print((librosa.get_duration(y, sr)-dur)*sr)
        if -1 < val < 0:
            to_append = True
            y_append, _ = librosa.load(
                fname, sr=sr, duration=1/sr, offset=offset+dur, mono=mono)

        elif 0 < val < 1:
            if mono:
                y = y[:-1]
            else:
                y = y[i_ch, :-1]

        elif 0 < val < 1:
            if mono:
                y = y[1:]
            else:
                y = y[i_ch, 1:]

        if not mono:
            y = np.asfortranarray(y[i_ch])

        if to_append:
            if mono:
                y = np.append(y, y_append[0])
            else:
                y = np.append(y, np.asfortranarray(y_append[i_ch, 0]))
        if to_append:
            if mono:
                y = np.append(y, y_append[0])
            else:
                y = np.insert(y, 0, y_append[i_ch, -1])

        print((librosa.get_duration(y, sr)-dur)*sr)

        self.data = np.log10(
            np.abs(librosa.stft(y, n_fft=nfft, win_length=wfft))**2)-thresholds[0]
        # self.data = librosa.amplitude_to_db(np.abs(librosa.stft(y,n_fft=nfft,win_length=wfft)),ref=sens*200)

        # print(self.data.shape)
        i_ulim = int((self.data.shape[0]*2/sr) *
                     f_ulim) if f_ulim is not None else None
        i_llim = int((self.data.shape[0]*2/sr) *
                     f_llim) if f_llim is not None else None

        self.data = self.data[i_llim:i_ulim]
        if not last:
            self.data = self.data[:, :-margin_factor]
        if not first:
            self.data = self.data[:, margin_factor:]

        print(self.data.shape)

        # self.data[self.data>0]=0
        self.data[self.data > 0] = 0
        self.data[self.data < thresholds[1]] = thresholds[1]

        self.data /= thresholds[1]
        self.data *= 255
        self.data[self.data > 255] = 255
        self.data = self.data.astype(np.uint8)
        self.data = np.flip(self.data, axis=0)
        self.dsize = self.data.shape
        self.img = Image.fromarray(self.data, 'L')
        self.img_bytes = {}

    def get_img(self, factor):
        img = self.img
        if(factor != 1):
            new_size = (self.dsize[1]//factor, self.dsize[0])
            img = img.resize(new_size)
        buffered = BytesIO()
        img.save(buffered, format="png")
        return buffered

    def get_img_response(self, factor=1):
        if not hasattr(self, 'img_text'):
            img_bytes = self.get_img(factor).getvalue()
            self.img_text = img_bytes.decode('latin1')
        return HttpResponse(self.img_text, content_type="text/plain")


def spec_multi_threaded(file_id, tstart, tend, request):
    sr = 44100
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

    stream = librosa.stream(file_obj.path, block_length=block_length, frame_length=frame_length, hop_length=hop_length,
                            duration=dur, offset=offset, mono=mono)

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
                hop_length=fft_hop_l, center=False))**2
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
          b=block[0] if ch=="l" else block[1] 
        else:
          b=block
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

    width=round(dur*float(request.GET["pxs"]))

    data = transform.resize(data, (data.shape[0], min(width, data.shape[1])), order=0, anti_aliasing=False)
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

    _, _,_, _, img = spec_multi_threaded(file_id, tstart, tend, request)
    buffered = BytesIO()
    img.save(buffered, format="png")
   

    return HttpResponse(buffered.getvalue(), content_type="image/png")


def render_spec_data(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):
    ts, te, fs, fe, img = spec_multi_threaded(file_id, tstart, tend, request)
    buffered = BytesIO()
    buffered.write(struct.pack('QQdd',round(ts),round(te),fs,fe))
    img.save(buffered, format="png")

    return HttpResponse(buffered.getvalue(), content_type="application/octet-stream")






def render_spec_single_core(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):

    # Width is here given by the following formula:
    #   ceil((sr*dur)/hop_length)

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

    raw_data, _ = librosa.load(
        file_obj.path, duration=dur, offset=offset, mono=mono, sr=file_obj.sample_rate)

    thresholds = ((sens/25-2)+con*3/50, (sens/25-7)-con*3/50)

    data = np.log10(
        np.abs(librosa.stft(raw_data, n_fft=nfft,
               win_length=wfft, center=True))**2
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
