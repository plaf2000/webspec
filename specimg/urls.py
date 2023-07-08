from django.urls import path, include
from . import views

base_url_request = "<int:file_id>/<str:tstart>/<str:tend>/<str:fstart>/<str:fend>/"

urlpatterns = [
    path(f"img/{base_url_request}", views.render_spec_img, name="spec img"),
    path(f"img_single/{base_url_request}", views.render_spec_single_core, name="spec img single core"),
    path(base_url_request, views.render_spec_data, name="spec full data"),
    path(f"oldv/{base_url_request}", views.render_spec_data_oldv, name="spec full data old version"),
    path(f"oldv-img/{base_url_request}", views.render_spec_img_oldv, name="spec img old version"),
]
