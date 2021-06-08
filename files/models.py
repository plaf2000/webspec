from django.db import models
import os
from datetime import timedelta as td

class File(models.Model):
    path = models.CharField(max_length=255)
    tstart = models.DateTimeField()
    tend = models.DateTimeField() 
    length = models.FloatField()
    sample_rate = models.PositiveIntegerField()
    stereo = models.BooleanField(default=False)
    device = models.ForeignKey('devices.DeviceContext',on_delete=models.PROTECT,related_name='file_device')
    @property
    def filename(self):
        return os.path.basename(self.path)
    
    @property
    def duration(self):
        dur=td(seconds=self.length)
        return str(dur)

