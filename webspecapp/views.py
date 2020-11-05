from django.shortcuts import render
from django.http import HttpResponse
from bokeh.plotting import figure, ColumnDataSource
from bokeh.embed import components
from bokeh.models import Range1d, CustomJS
from bokeh.events import DoubleTap
from bokeh.transform import cumsum
import numpy as np
import pandas as pd
import librosa
import time
from PIL import Image
import base64
from io import BytesIO
import math

def callback(event):
    line_x=event.x

def ajax_spec(request):
    return render(request, 'ajaxspec.html' ,{})

def home(request):
    t=[0,0,0,0]
    ulim=8000
    n_fft=2048

    y, sr = librosa.load('/home/plaf2000/webspec/webspec/webspecapp/audio/folaga.WAV',sr=44100)
    t[1]=time.time()
    data = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
    t[2]=time.time()
    i_ulim=int((data.shape[0]*2/sr)*ulim)
    data=data[:i_ulim]
    data/=data.min()
    data=np.abs(data-data.max())
    time_end=n_fft*data.shape[1]/sr
    left=0
    bottom=0
    right=time_end
    top=ulim
    plot = figure(width=data.shape[1],height=data.shape[0],active_scroll='wheel_zoom')
    plot.xgrid.visible = False
    plot.ygrid.visible = False
    plot.sizing_mode = 'scale_width'
    plot.x_range=Range1d(left, right, bounds=(left, right))
    plot.y_range=Range1d(bottom, top, bounds=(bottom, top))
    t[3]=time.time()
    plot.image(image=[data], x=0, y=0, dw=time_end, dh=ulim, palette="Inferno11", level="image")
    line_x=time_end/2
    line=plot.line([line_x,line_x],[0,ulim],line_width=1,line_color="#000000")
    plot.js_on_event(DoubleTap, CustomJS(args=dict(line=line), code="""
        console.log(cb_obj);
        console.log(line.data_source.data.x);
        line.data_source.data.x=[cb_obj.x,cb_obj.x];
        console.log(line.data_source.data.x);


    """))
    script, div = components(plot)

    return render(request, 'base.html' , {'script': script, 'div':div})

def create_spec(request):
    offset=float(request.GET['offset'])
    dur=float(request.GET['dur'])
    ch=str(request.GET['ch'])
    sens=100-float(request.GET['sens'])
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

    response=HttpResponse(audio,content_type="audio/wav")

    f.close()

    return response
