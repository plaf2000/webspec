from django.shortcuts import render
from django.http import HttpResponse
from .models import Project

# Create your views here.


def list_projects(request):
    return HttpResponse('Ciao')