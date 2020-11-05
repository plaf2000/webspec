from django.urls import path
from . import views

#This is urls.py

urlpatterns = [
    path('get/', views.get, name='get'),
<<<<<<< HEAD
=======
    path('save/', views.save, name='save'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

]
