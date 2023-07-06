from django.contrib import admin

from .models import Recorder, Device, DeviceContext,TimeZone


admin.site.register(Recorder)
admin.site.register(Device)
admin.site.register(DeviceContext)
admin.site.register(TimeZone)