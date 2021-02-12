from django.shortcuts import render
from django.http import HttpResponse
from .models import File

# Create your views here.



def list_files(request, proj_id, device_id):
    return HttpResponse('Ciao')

def get_audio(request, proj_id, device_id, file_id):

    fname = File.objects.get(id=file_id).path

    f=open(fname,'rb')
    audio=f.read()
    response=HttpResponse(audio,content_type="audio/wav")
    response["Accept-Ranges"] = "bytes"
    f.close()

    return response