from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone as django_tz
from .models import File
from devices.models import DeviceContext
from projects.models import Project
from files.models import File
import datetime as dt
import webspec.settings as settings
from pytz import timezone
from dateutil.parser import isoparse
from datetime import timedelta


def list_files(request, proj_id, device_id):
    device = DeviceContext.objects.get(id=device_id)
    files = device.all_files.order_by('tstart')
    django_tz.activate(device.timezone.tz)
    for f in files:
        f.tstart_iso = f.tstart.isoformat()
        # Link to the the first 20 seconds of the file
        te = f.tstart + timedelta(seconds=20)
        f.tend_iso = te.isoformat()
    return render(request, 'files_list.html', {
        'files': files,
        'project': Project.objects.get(id=proj_id),
        'device': device
    })


def get_files(request, proj_id, device_id, tstart, tend):
    ts = isoparse(tstart)
    te = isoparse(tend)
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
