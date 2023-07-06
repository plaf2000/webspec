from django.db import models
from places.models import Place
from projects.models import Project
from files.models import File
import pytz


# Create your models here.

digits = {
    "%Y": 4,
    "%y": 2,
    "%m": 2,
    "%d": 2,
    "%j": 3,
    "%H": 2,
    "%I": 2,
    "%p": 2,
    "%M": 2,
    "%S": 2,
    "%f": 6,
}

class Recorder(models.Model):
    name = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)

class Device(models.Model):
    name = models.CharField(max_length=50)
    recorder = models.ForeignKey(Recorder,on_delete=models.PROTECT,related_name='recorder')

class TimeZone(models.Model):
    name=models.CharField(max_length=100)
    @property
    def tz(self):
        return pytz.timezone(self.name)

class DeviceContext(models.Model):
    project = models.ForeignKey(Project,on_delete=models.PROTECT,related_name='project')
    place = models.ForeignKey(Place,on_delete=models.PROTECT,related_name='place')
    device = models.ForeignKey(Device,on_delete=models.PROTECT,related_name='device')
    file_format = models.CharField(max_length=255)
    timezone = models.ForeignKey(TimeZone,on_delete=models.PROTECT,related_name='timezone')
    
    @property
    def all_files(self):
        return File.objects.filter(device=self)
    @property
    def first_file(self):
        return self.all_files.order_by('tstart').first()
    @property
    def last_file(self):
        return self.all_files.order_by('tend').last()
    
    @property
    def file_re(self):
        fre = self.file_format
        for k, v in digits.items():
            fre = fre.replace(k,r"\d{" + str(v) + r"}")
        return fre
        
    

    