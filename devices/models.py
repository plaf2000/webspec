from django.db import models

# Create your models here.


class DeviceContext(models.Model):
    project_id = models.PositiveIntegerField()
    place_id = models.PositiveIntegerField()
    device_id = models.PositiveIntegerField()


class Device(models.Model):
    name = models.CharField(max_length=50)
    recorder_id = models.PositiveIntegerField()
    
    
class Recorder(models.Model):
    name = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    