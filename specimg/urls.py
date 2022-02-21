from django.urls import path, include
from . import views

urlpatterns = [
    path('<int:file_id>/<int:tstart>/<int:tend>/<str:fstart>/<str:fend>/', views.render_spec, name='spec'),
]
