from django.shortcuts import render
from .models import Place
from django.views.decorators.clickjacking import xframe_options_sameorigin
# Create your views here.

@xframe_options_sameorigin
def get_point_map(request,place_id,zoom=13):
    return render(request, 'map_point.html',{
        'place' : Place.objects.get(id=place_id),
        'zoom' : zoom
    })

@xframe_options_sameorigin
def get_point_map_geo_admin(request,place_id,zoom=13):
    return render(request, 'map_geo_admin_point.html',{
        'place' : Place.objects.get(id=place_id),
        'zoom' : zoom
    })
