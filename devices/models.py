from django.db import models
from places.models import Place
from projects.models import Project
from files.models import File


# Create your models here.

class Recorder(models.Model):
    name = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)

class Device(models.Model):
    name = models.CharField(max_length=50)
    recorder = models.ForeignKey(Recorder,on_delete=models.PROTECT,related_name='recorder')

class DeviceContext(models.Model):
    project = models.ForeignKey(Project,on_delete=models.PROTECT,related_name='project')
    place = models.ForeignKey(Place,on_delete=models.PROTECT,related_name='place')
    device = models.ForeignKey(Device,on_delete=models.PROTECT,related_name='device')
    @property
    def all_files(self):
        return File.objects.filter(device=self)
    @property
    def first_file(self):
        return self.all_files.order_by('tstart').first()
    @property
    def last_file(self):
        return self.all_files.order_by('tend').last()
    

    