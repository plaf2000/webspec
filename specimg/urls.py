from django.urls import path, include
from . import views

urlpatterns = [
    path('img/<int:file_id>/<str:tstart>/<str:tend>/<str:fstart>/<str:fend>/', views.render_spec_img, name='spec img'),
    path('img_single/<int:file_id>/<str:tstart>/<str:tend>/<str:fstart>/<str:fend>/', views.render_spec_single_core, name='spec img single core'),
    path('<int:file_id>/<str:tstart>/<str:tend>/<str:fstart>/<str:fend>/', views.render_spec_data, name='spec full data'),
    path('oldv/<int:file_id>/<str:tstart>/<str:tend>/<str:fstart>/<str:fend>/', views.render_spec_data_oldv, name='spec full data old version'),
]
