from django.urls import path, include
from . import views

#This is urls.py

urlpatterns = [
    path('', views.list_devices),
    path('<int:device_id>/files/', include('files.urls')),
    path('<int:device_id>/detections/', include('detections.urls')),
    path('<int:device_id>/spec/', include('specimg.urls')),
    path('<int:device_id>/view/', include('view.urls')),
]
