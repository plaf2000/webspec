from django.urls import path
from . import views

#This is urls.py

urlpatterns = [
    path('getlabel/', views.getLabel, name='getlabel'),
    path('getspecies/', views.getSpecies, name='getspecies'),

]
