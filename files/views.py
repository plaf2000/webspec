from io import BytesIO
from django.shortcuts import render
from django.http import HttpResponse
import librosa
import soundfile as sf
from .models import File
from devices.models import DeviceContext
from projects.models import Project
import scipy.io.wavfile as sa


# Create your views here.



def list_files(request, proj_id, device_id):
    device = DeviceContext.objects.get(id=device_id)
    return render(request, 'files_list.html',{
        'files' : device.all_files.order_by('tstart'), 
        'project': Project.objects.get(id=proj_id),
        'device' : device
    })

def get_audio(request, proj_id, device_id, file_id):
    
    offset = 0
    if "offset" in request.GET:
        offset = request.GET["offset"]


    file_entry = File.objects.get(id=file_id)
    fname = file_entry.path
    
    buffer = BytesIO()

    
    print("cnaisdn")

    y, _ = librosa.load(fname,sr=file_entry.sample_rate,offset=float(),mono=not file_entry.stereo)

    sa.write(buffer,file_entry.sample_rate,y)

    
    response=HttpResponse(buffer,content_type="audio/wav")
    response["Accept-Ranges"] = "bytes"

    return response