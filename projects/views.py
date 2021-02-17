from django.shortcuts import render
from django.http import HttpResponse
from .models import Project
from .forms import ProjectForm
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

# Create your views here.


def list_projects(request):
    return render(request, 'list_projects.html',{
        'createdusers' : User.objects,
        'projects' : Project.objects.all()
    })

def edit_project(request,proj_id):
    project = Project.objects.get(id=proj_id)
    if request.method == "POST":
        project_entry = Project.objects.filter(pk=proj_id)
        form = ProjectForm(request.POST)
        if form.is_valid():
            project.save()
            project_entry.update(**form.cleaned_data)
        else:
            print(form.errors)
    else:
        data = {
            'title': project.title,
            'description' : project.description,
            'hf' : project.hf,  
            'lf' : project.lf,
            'nfft_view' : project.nfft_view,
            'nfft_project' : project.nfft_project,
            'fft_window_view' : project.fft_window_view,         
            'fft_window_project' : project.fft_window_project,
        }
        form = ProjectForm(data)

    return render(request, 'edit_form.html',{
        'project' : project,
        'form' : form
    })

def create_project(request):
    form = ProjectForm()
    if request.method == "POST":
        form = ProjectForm(request.POST)
        if form.is_valid():
            return add_project(request,form)

    return render(request, 'edit_form.html',{
        'form' : form
    })

def add_project(request,form):
    data = form.cleaned_data
    data['last_edit_user'] = request.user
    data['created_user'] = request.user
    new_project = Project.objects.create(**data)
    new_project.save()
    return HttpResponseRedirect('/projects/')

    