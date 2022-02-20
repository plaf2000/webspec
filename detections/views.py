from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from .models import Detection

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
        analysis_id = request.POST["analysisid"],
        files_id = 1,
        cluster_id = 1
    )
    new_detection.save()
    print(new_detection.pk)
    return JsonResponse({"id": new_detection.pk})

def delete(request):
    Detection.objects.filter(pk=request.POST["id"]).delete()
    return HttpResponse("Detection successfully created",content_type="text/plain")
