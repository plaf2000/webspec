from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def list_devices(request, proj_id):
    return HttpResponse(proj_id)