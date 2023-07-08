from django.contrib import admin
from .models import *

class DetectionAdmin(admin.ModelAdmin):
    readonly_fields = ("dtstart",)

admin.site.register(Detection, DetectionAdmin)