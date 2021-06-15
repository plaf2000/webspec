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
from django.shortcuts import redirect

def redirect_to_projects(request):
    response = redirect('/projects')
    return response

def callback(event):
    line_x=event.x

def spec(request):
    return render(request, 'spec.html' ,{})


def create_spec(request):

    
    offset=float(request.GET['offset'])
    dur=float(request.GET['dur'])
    ch=str(request.GET['ch'])
    sens=100-float(request.GET['sens'])
    print("Sens:",sens)
    con=100-float(request.GET['con'])
    fname=request.GET['fname']
    spx=float(request.GET['spx'])
    nfft=int(request.GET['nfft'])
    wfft=int(request.GET['wfft'])
    sr=int(request.GET['sr'])
    try:
        f_ulim=int(request.GET['hf'])
    except:
        f_ulim=None
    try:
        f_llim=int(request.GET['lf'])
    except:
        f_llim=None


    i_ch = 0 if ch=="l" else 1 if ch=="r" else None

    thresholds = ((sens/25-2)+con*3/50,(sens/25-7)-con*3/50)

    margin_factor = 5

    if offset == 0:
        dur+=spx*margin_factor
    else:
        offset-=spx*margin_factor
        dur+=2*spx*margin_factor



    y, sr = librosa.load(fname,sr=sr,duration=dur,offset=offset,mono=(ch=="mono"))


    if len(y.shape)>1:
        y=np.asfortranarray(y[i_ch])

    last=(dur*sr != y.shape[0])



    data = np.log10(np.abs(librosa.stft(y,n_fft=nfft,win_length=wfft))**2)-thresholds[0]
    # data = librosa.amplitude_to_db(np.abs(librosa.stft(y,n_fft=nfft,win_length=wfft)),ref=sens*200)

    i_ulim=int((data.shape[0]*2/sr)*f_ulim) if f_ulim is not None else None
    i_llim=int((data.shape[0]*2/sr)*f_llim) if f_llim is not None else None

    data = data[i_llim:i_ulim]
    if not last:
        data=data[:,:-margin_factor]
    if offset>0:
        data=data[:,margin_factor:]


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

def get_audio(request):

    fname = request.GET["f"]

    f=open(fname,'rb')
    audio=f.read()
    size=str(Path(fname).stat().st_size)
    response=HttpResponse(audio,content_type="audio/wav")
    response["Accept-Ranges"] = "bytes"
    f.close()

    return response
