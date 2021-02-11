from django.urls import path
from . import views

urlpatterns = [
    path('spec/', views.create_spec, name='create_spec'),
    # path('projects/<int:proj_id>/<int:dev_id>/<int:file_id>', views.spec, name='test'),
    path('test/', views.spec, name='test'),
    # path('files/<int:file_id>', views.get_audio, name='get_audio')
    path('audio/', views.get_audio, name='get_audio')

]
