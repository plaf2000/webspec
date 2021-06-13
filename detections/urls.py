from django.urls import path
from . import views

#This is urls.py

urlpatterns = [
    path('getvis/', views.getvis, name='getvis'),
    path('getleft/', views.getleft, name='getleft'),
    path('save/', views.save, name='save'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),

]