from io import BytesIO
from .forms import UploadDetections
from django.views.generic.edit import UpdateView
from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from .models import Detection
from django.utils import timezone as django_tz
from labels.models import *
from projects.models import Project
from devices.models import DeviceContext
from .upload_detections import uploadDetections
from pydub import AudioSegment


def getvis(request):
    queryset = list(
        Detection.objects
        .order_by(["tstart","tend"][int(request.GET["ord"])]).
        values()
        .filter(
            tstart__lt=request.GET["te"],
            tend__gt=request.GET["ts"]
        )
    )
    return JsonResponse(queryset,safe=False)

def getleft(request):
    queryset = list(
        Detection.objects
        .order_by(["tstart","tend"][int(request.GET["ord"])]).
        values()
        .filter(
            tend__lte=request.GET["te"],
            tstart__lte=request.GET["ms"],
            tstart__gte=request.GET["ts"]
        )
    )
    return JsonResponse(queryset,safe=False)

def save(request):
    Detection.objects.filter(pk=request.POST["id"]).update(
        pinned = request.POST["pinned"] == 'true',
        manual = request.POST["manual"] == 'true',
        tstart = request.POST["tstart"],
        tend = request.POST["tend"],
        fstart = request.POST["fstart"],
        fend = request.POST["fend"],
        label_id = request.POST["labelid"]
    )
    return HttpResponse("Detection successfully updated",content_type="text/plain")

def create(request):
    new_detection = Detection(
        pinned = request.POST["pinned"] == 'true',
        manual = request.POST["manual"] == 'true',
        tstart = request.POST["tstart"],
        tend = request.POST["tend"],
        fstart = request.POST["fstart"],
        fend = request.POST["fend"],
        label_id = request.POST["labelid"],
        file_id = request.POST["fileid"],
    )
    new_detection.save()
    print(new_detection.pk)
    return JsonResponse({"id": new_detection.pk})

def delete(request):
    Detection.objects.filter(pk=request.POST["id"]).delete()
    return HttpResponse("Detection successfully created",content_type="text/plain")


def list_all(request, proj_id, device_id):
    project = Project.objects.get(id=proj_id)
    device = DeviceContext.objects.get(id=device_id)
    if request.method == "POST":
        form = UploadDetections(project.default_call_type,request.POST,request.FILES)
        if form.is_valid():
            uploadDetections(device, default_ctype=project.default_call_type, user=request.user, **form.cleaned_data)
            return HttpResponseRedirect(".")
    else:
        form = UploadDetections(project.default_call_type,)

    django_tz.activate(device.timezone.tz)
    dets = Label.objects.filter(detection_id__file_id__device = device_id, detection_id__file_id__device__project=proj_id).order_by("detection_id__dtstart")

    return render(request, 'list_detections.html',{
        'upload_form': form,
        'project': project,
        'device': device,
        'dets': dets
    })


def play(request, proj_id, device_id, detection_id):
    MARGIN = 1
    detection = Detection.objects.get(id=detection_id)
    audio_segment = AudioSegment.from_file(detection.file_id.path)

    msstart = int((detection.tstart - MARGIN) * 1000)
    msend = int((detection.tend+ MARGIN) * 1000 )

    extracted = audio_segment[msstart:msend] + 10

    buffer = BytesIO()
    extracted.export(buffer, format="mp3")

    return HttpResponse(buffer.getvalue(),content_type="audio/mp3")

def open(request, proj_id, device_id, detection_id):
    return render(request, "view_detection.html", {

    })
    

class DetectionUpdateView(UpdateView):
    model = Detection
    fields = ["tstart", "tend"]
    template_name_suffix = "_update_form"