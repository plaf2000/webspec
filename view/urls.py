from django.urls import path, include
from . import views

urlpatterns = [
    path('clear/', views.clear_data, name='clear data'),
    path('<str:tstart>/<str:tend>/<str:fstart>/<str:fend>', views.spec)
]
