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
    
    def to_seconds(self, t):
        """
            Parameters
            ----------
                - `t` : time in datetime object

            Returns
            ----------
            Time in seconds from the start of the audio track.
        """
        return min(max((t-self.tstart).total_seconds(), 0), self.length)

    def to_datetime(self, t):
        """
            Parameters
            ----------
                - `t` : time in seconds

            Returns
            ----------
            Time as a datetime object.
        """
        return self.tstart+td(seconds=t)

