from django.shortcuts import render
from django.http import HttpResponse

import numpy as np
import pandas as pd
import librosa
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

def compute_stft(data, block, i, nfft, wfft, fft_hop_l, threshold, fft_block_width, last_block_width):
    fft_block = np.log10(
        np.abs(librosa.stft(block, n_fft=nfft, win_length=wfft, hop_length= fft_hop_l, center=False))**2
    )-threshold
    width = fft_block.shape[1]
    last_block_width[0] = min(width,last_block_width[0])
    start = i*fft_block_width
    data[:,start:start+fft_block.shape[1]] = fft_block 


data_requests = {}


def render_spec(request, proj_id, device_id, file_id, tstart, tend, fstart, fend):

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

    width = 1920
    last_time = time.time()
    file_obj = File.objects.get(id=file_id)
    tz = timezone(settings.TIME_ZONE)
    ts = dt.datetime.fromtimestamp(tstart/1000, tz)
    te = dt.datetime.fromtimestamp(tend/1000, tz)

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
    if te<ts:
        return HttpResponse('', content_type="text/html")
    else:
        if file_obj.tend<te:
            te = file_obj.tend
        dur = (te-ts).total_seconds() 


    print(offset,dur)

    mono = ch == "mono"

    hop_length = int(3*(wfft//4))
    frame_length = wfft
    block_length = 256

    stream = librosa.stream(file_obj.path, block_length = block_length, frame_length = frame_length, hop_length = hop_length,
                        duration=dur, offset=offset, mono=mono)
    
    thresholds = ((sens/25-2)+con*3/50, (sens/25-7)-con*3/50)

    block_width = (block_length-1)*hop_length+frame_length
    fft_hop_l = wfft//4
    fft_block_width = int(math.ceil((block_width - wfft)/fft_hop_l) + 1)
    n_blocks = int(math.ceil(dur*file_obj.sample_rate/block_width))
    data_ = np.empty([int(wfft//2+1),fft_block_width*n_blocks])
    i=0
    last_block_width = 0
    threads=[]
    last_block_width = [fft_block_width]
    for block in stream:
        thread = threading.Thread(target=compute_stft, args=(data_, block, i, nfft, wfft, fft_hop_l, thresholds[0], fft_block_width,last_block_width,))
        thread.start()
        threads.append(thread)
        i+=1
    
    for thread in threads:
        thread.join()

    data = data_[:,:fft_block_width*(n_blocks-1)+last_block_width[0]]
    cur_time = time.time()
    print("read and fft computed {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time


    # data = np.abs(librosa.stft(y, n_fft=nfft, win_length=wfft))-thresholds[0]



    s=255/thresholds[1]
    data *= s

    cur_time = time.time()
    print("scaled {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    data = np.clip(data,0,255)

    cur_time = time.time()
    print("clipped {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    data = data.astype(np.uint8)

    cur_time = time.time()
    print("int8 {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    data = transform.resize(data,(data.shape[0],width),order=0,anti_aliasing=False)
    
    cur_time = time.time()
    print("data resize {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    img = Image.fromarray(data, 'L')
    buffered = BytesIO()
    img = ImageOps.flip(img)
    img.save(buffered, format="png")
    res = buffered.getvalue()

    return HttpResponse(res, content_type="image/png")
