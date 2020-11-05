from django.shortcuts import render
from django.http import JsonResponse
<<<<<<< HEAD
from .models import Detection
from django.core import serializers
=======
from django.http import HttpResponse
from .models import Detection
from django.core import serializers
import json
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

def get(request):
    queryset = list(Detection.objects.values().filter(tstart__lte=request.GET["te"],tend__gte=request.GET["ts"]))
    # queryset_json = serializers.serialize('json', queryset)
    return JsonResponse(queryset,safe=False)
<<<<<<< HEAD
=======

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
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
