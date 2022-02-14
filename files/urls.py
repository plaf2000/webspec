from django.urls import path, include
from . import views

#This is urls.py

urlpatterns = [
    path('', views.list_files),
    path('<int:file_id>/', views.get_audio),
    path('<int:tstart>/<int:tend>/<str:fstart>/<str:fend>', include('view.urls')),
]
