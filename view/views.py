from django.shortcuts import render
from django.http import HttpResponse
import numpy as np
import pandas as pd
import librosa
import time
from PIL import Image
import base64
from io import BytesIO
import math
from pathlib import Path
from files.models import File
from projects.models import Project

def callback(event):
    line_x=event.x

def spec(request, proj_id, device_id, file_id):
    project = Project.objects.get(id=proj_id)
    file_obj = File.objects.get(id=file_id)
    return render(request, 'spec_view.html',{
        'file' : file_obj,
        'project' : project
    })


def create_spec(request, proj_id, device_id, file_id):
    project = Project.objects.get(id=proj_id)
    file_obj = File.objects.get(id=file_id)

    offset=float(request.GET['offset'])
    dur=float(request.GET['dur'])
    ch=str(request.GET['ch'])
    sens=100-float(request.GET['sens'])
    con=100-float(request.GET['con'])
    fname=File.objects.get(id=file_id).path
    nfft=int(request.GET['nfft'])
    wfft=int(request.GET['wfft'])
    last=bool(int(request.GET['last']))
    sr=file_obj.sample_rate
    spx = wfft/sr/4
    mono = ch=="mono"
    try:
        f_ulim=int(request.GET['hf'])
    except:
        f_ulim=None
    try:
        f_llim=int(request.GET['lf'])
    except:
        f_llim=None

    first = offset==0

    i_ch = 0 if ch=="l" else 1 if ch=="r" else None

    thresholds = ((sens/25-2)+con*3/50,(sens/25-7)-con*3/50)

    
    margin_factor = 2

    if first:
        dur+=spx*margin_factor
    else:
        offset-=spx*margin_factor
        dur+=2*spx*margin_factor



    y, _ = librosa.load(fname,sr=sr,duration=dur,offset=offset,mono=mono)
    val = (librosa.get_duration(y, sr)-dur)*sr
    to_append = False
    if -1<val<0:
        to_append = True
        y_append, _ = librosa.load(fname,sr=sr,duration=1/sr,offset=offset+dur,mono=mono)
            
    elif 0<val<1:
        if mono:
            y = y[:-1]
        else:
            y = y[i_ch,:-1]
    
    
    


    if not mono:
        y=np.asfortranarray(y[i_ch])
    
    if to_append:
        if mono:
            y=np.append(y,y_append[0])
        else :
            y=np.append(y,np.asfortranarray(y_append[i_ch,0]))
    
    print((librosa.get_duration(y, sr)-dur)*sr)


    data = np.log10(np.abs(librosa.stft(y,n_fft=nfft,win_length=wfft))**2)-thresholds[0]
    # data = librosa.amplitude_to_db(np.abs(librosa.stft(y,n_fft=nfft,win_length=wfft)),ref=sens*200)


    # print(data.shape)
    i_ulim=int((data.shape[0]*2/sr)*f_ulim) if f_ulim is not None else None
    i_llim=int((data.shape[0]*2/sr)*f_llim) if f_llim is not None else None


    data = data[i_llim:i_ulim]
    if not last:
        data=data[:,:-margin_factor]
    if not first:
        data=data[:,margin_factor:]

    # print(data.shape)

    # data[data>0]=0
    data[data>0]=0
    data[data<thresholds[1]]=thresholds[1]

    data/=thresholds[1]
    data*=255
    data[data>255]=255
    data=data.astype(np.uint8)
    data=np.flip(data,axis=0)
    img = Image.fromarray(data, 'L')
    buffered = BytesIO()
    img.save(buffered, format="png")
    img_str = base64.b64encode(buffered.getvalue())
    response=HttpResponse(img_str,content_type="text/plain")
    # img.save(response, "PNG")
    # return render(request, 'base.html' , {'script': script, 'div':div})
    return response
