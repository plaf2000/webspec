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
        dur = 0
    else:
        dur = (te-ts).total_seconds() 


    mono = ch == "mono"

    y, _ = librosa.load(file_obj.path, sr=file_obj.sample_rate,
                        duration=dur, offset=offset, mono=mono)
                        
    cur_time = time.time()
    print("file read {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    thresholds = ((sens/25-2)+con*3/50, (sens/25-7)-con*3/50)

    # data = np.abs(librosa.stft(y, n_fft=nfft, win_length=wfft))-thresholds[0]
    data = np.log10(
                np.abs(librosa.stft(y, n_fft=nfft, win_length=wfft))**2
           )-thresholds[0]

    cur_time = time.time()
    print("fft computed {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time




    data *= 255/thresholds[1]
    cur_time = time.time()
    print("scaled {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    data = np.maximum(0,data)
    cur_time = time.time()
    print("minned {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    data = np.minimum(255,data)

    cur_time = time.time()
    print("maxxed {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    data = data.astype(np.uint8)

    cur_time = time.time()
    print("flipped {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    img = Image.fromarray(data, 'L')
    
    cur_time = time.time()
    print("img obj created {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time
    
    buffered = BytesIO()
    img = img.resize((1920,img.size[1]),resample=Image.NEAREST)
    
    cur_time = time.time()
    print("img obj resize {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time
    
    img = ImageOps.flip(img)
    
    cur_time = time.time()
    print("img obj flip {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    img.save(buffered, format="png")

    cur_time = time.time()
    print("img saved {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    res = buffered.getvalue()

    cur_time = time.time()
    print("raw val {t:.4f}".format(t=cur_time - last_time))
    last_time = cur_time

    return HttpResponse(res, content_type="image/png")
