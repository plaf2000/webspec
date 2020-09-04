from django.urls import path
from . import views

#This is urls.py

urlpatterns = [
    path('get/', views.get, name='get'),
    path('save/', views.save, name='save'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),

]
