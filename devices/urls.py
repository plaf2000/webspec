from django.urls import path, include
from . import views

#This is urls.py

urlpatterns = [
    path('', views.list_devices),
    path('<int:device_id>/', include('files.urls')),
]
