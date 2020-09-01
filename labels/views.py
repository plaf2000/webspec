from django.shortcuts import render
from django.http import JsonResponse
from .models import Label
from .models import Species

# Create your views here.

def getLabel(request):
    label = Label.objects.values().filter(pk=request.GET["id"])
    print(label.all())
    return JsonResponse(label,safe=False)

def getSpecies(request):
    species = Species.objects.get(pk=request.GET["id"])
    return JsonResponse(species,safe=False)
