from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('spec/', views.create_spec, name='create_spec'),
    path('test/', views.ajax_spec, name='test'),
    path('audio/', views.get_audio, name='get_audio')

]
