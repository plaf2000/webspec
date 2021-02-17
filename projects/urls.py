from django.urls import path, include
from . import views

#This is urls.py

urlpatterns = [
    path('', views.list_projects),
    path('edit/<int:proj_id>/', views.edit_project),
    path('create/', views.create_project),
    path('<int:proj_id>/', include('devices.urls'))
]
