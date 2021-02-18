from django.urls import path, include
from . import views

#This is urls.py

urlpatterns = [
    # path('', views.list_places),
    path('map/<int:place_id>/', views.get_point_map),
    path('map/<int:place_id>/<int:zoom>', views.get_point_map),
    path('map_geo_admin/<int:place_id>/<int:zoom>', views.get_point_map_geo_admin),
]
