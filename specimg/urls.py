from django.urls import path, include
from . import views

urlpatterns = [
    path('img/<int:file_id>/<str:tstart>/<str:tend>/<str:fstart>/<str:fend>/', views.render_spec_img, name='spec img'),
    path('<int:file_id>/<str:tstart>/<str:tend>/<str:fstart>/<str:fend>/', views.render_spec_data, name='spec full data'),
]
