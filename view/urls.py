from django.urls import path, include
from . import views

urlpatterns = [
    path('spec/', views.create_spec, name='create spec'),
    path('', views.spec, name='spec'),
    path('clear/', views.clear_data, name='clear data'),
    
]
