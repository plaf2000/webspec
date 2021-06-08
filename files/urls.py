from django.urls import path, include
from . import views

#This is urls.py

urlpatterns = [
    path('', views.list_files),
    path('<int:file_id>/', views.get_audio),
    path('<int:file_id>/view/', include('view.urls')),
]
