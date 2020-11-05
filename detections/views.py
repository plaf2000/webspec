from django.shortcuts import render
from django.http import JsonResponse
from .models import Detection
from django.core import serializers

def get(request):
    queryset = list(Detection.objects.values().filter(tstart__lte=request.GET["te"],tend__gte=request.GET["ts"]))
    # queryset_json = serializers.serialize('json', queryset)
    return JsonResponse(queryset,safe=False)
