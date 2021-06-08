from django.shortcuts import render
from django.http import HttpResponse
from projects.models import Project
from .models import Device, DeviceContext, Recorder


# Create your views here.


def list_devices(request, proj_id):
    project = Project.objects.get(id=proj_id)
    return render(request, 'list_devices.html',{
        'project' : project,
        'devices' : DeviceContext.objects.filter(project=project)
    })