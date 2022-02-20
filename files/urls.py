from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.list_files),
    path('<int:file_id>/', views.get_audio),
    path('spec/', include('specimg.urls')),
    path('view/', include('view.urls')),
    path('files/<int:tstart>/<int:tend>/', views.get_files)
]
