from django.urls import path, include
from . import views

#This is urls.py

urlpatterns = [
    path('', views.list_projects),
    path('<int:proj_id>/', include('devices.urls'))
]
