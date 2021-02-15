from django.db import models

class File(models.Model):
    path = models.CharField(max_length=255)
    tstart = models.DateTimeField()
    tend = models.DateTimeField() 
    length = models.FloatField()
    sample_rate = models.PositiveIntegerField()
    stereo = models.BooleanField(default=False)
    device_id = models.PositiveIntegerField()
    

