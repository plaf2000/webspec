from django.shortcuts import render
<<<<<<< HEAD

# Create your views here.
=======
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
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
