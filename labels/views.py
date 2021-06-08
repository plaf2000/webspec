from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from .models import Label
from .models import Species

# Create your views here.

def getLabel(request):
    label = Label.objects.values().filter(pk=request.GET["id"])[0]
    return JsonResponse(label,safe=False)

def getSpecies(request):
    species = Species.objects.values().filter(pk=request.GET["id"])[0]
    return JsonResponse(species,safe=False)
