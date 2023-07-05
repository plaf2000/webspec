from django.contrib import admin
from .models import Label, Species, Noise, CallType

admin.site.register(Label)
admin.site.register(Species)
admin.site.register(Noise)
admin.site.register(CallType)
