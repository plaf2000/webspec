from django.urls import path, include
from . import views

urlpatterns = [
    path('clear/', views.clear_data, name='clear data'),
    path('<int:tstart>/<int:tend>/<str:fstart>/<str:fend>', views.spec)
]
