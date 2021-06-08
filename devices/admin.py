from django.contrib import admin

from .models import Recorder, Device, DeviceContext


admin.site.register(Recorder)
admin.site.register(Device)
admin.site.register(DeviceContext)