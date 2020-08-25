from django.urls import path
from . import views

#This is urls.py

urlpatterns = [
    path('get/', views.get, name='getdet'),

]
