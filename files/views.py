from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .models import File
from devices.models import DeviceContext
from projects.models import Project
from files.models import File
import datetime as dt
import webspec.settings as settings
from pytz import timezone

# Create your views here.


def list_files(request, proj_id, device_id):
    device = DeviceContext.objects.get(id=device_id)
    return render(request, 'files_list.html', {
        'files': device.all_files.order_by('tstart'),
        'project': Project.objects.get(id=proj_id),
        'device': device
    })


def get_files(request, proj_id, device_id, tstart, tend):
    tz = timezone(settings.TIME_ZONE)
    ts = dt.datetime.fromtimestamp(tstart/1000,tz)
    te = dt.datetime.fromtimestamp(tend/1000,tz)
    print(ts,te)
    files = list(File.objects.exclude(
        tstart__gt=te
    ).exclude(
        tend__lt=ts
    ).filter(
        device=device_id
    ).values())
    return JsonResponse(files, safe=False)


def get_audio(request, proj_id, device_id, file_id):

    fname = File.objects.get(id=file_id).path

    f = open(fname, 'rb')
    audio = f.read()
    response = HttpResponse(audio, content_type="audio/wav")
    response["Accept-Ranges"] = "bytes"
    f.close()

    return response
