from django.shortcuts import render
from django.http import HttpResponse

from projects.models import Project
from devices.models import DeviceContext




def callback(event):
    line_x=event.x

def spec(request, proj_id, device_id, tstart, tend, fstart, fend):
    project = Project.objects.get(id=proj_id)
    device = DeviceContext.objects.get(id=device_id)
    return render(request, 'spec_view.html',{
        'project' : project,
        'device': device,
        'tstart': tstart,
        'tend': tend,
        'fstart': fstart,
        'fend': fend
    })

def clear_data(request):
    global data_requests
    data_requests={}
    return HttpResponse("",content_type="text/html")