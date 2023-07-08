from django.urls import path, re_path
from . import views


urlpatterns = [
    path('', views.list_all, name='List all detections'),
    path('getvis/', views.getvis, name='getvis'),
    path('getleft/', views.getleft, name='getleft'),
    path('save/', views.save, name='save'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),
    path('play/<int:detection_id>', views.play, name='upload'),
    path('view/<pk>', views.DetectionUpdateView.as_view(), name='upload'),
    re_path(r'play/(?P<detection_id>[0-9]+)/[\w\-. ]+.mp3', views.play, name='upload'),

]