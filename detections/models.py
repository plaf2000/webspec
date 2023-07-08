# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from files.models import File
from datetime import timedelta, datetime


class Detection(models.Model):
    margin = 2 # margin in seconds around box
    pinned = models.BooleanField()
    manual = models.BooleanField(default=True)
    fstart = models.FloatField()
    fend = models.FloatField()
    tstart = models.FloatField()
    tend = models.FloatField()
    file_id = models.ForeignKey(File, models.DO_NOTHING, blank=False, null=False)
    dtstart = models.DateTimeField()
    def save(self, *args, **kwargs):
        self.dtstart = self.file_id.tstart + timedelta(seconds=self.tstart)
        super().save(*args, **kwargs)

    
    @property
    def dtend(self):
        return self.dtstart + timedelta(seconds=self.dur)
    
    @property 
    def dur(self):
        return (self.tend - self.tstart)

    @property
    def millisdur(self):
        return datetime.fromtimestamp(self.dur)
    
    
    @property
    def tstart_iso(self):
        return self.dtstart.isoformat()

    
    @property
    def tend_iso(self):
        return self.dtend.isoformat()
    
    @property
    def tstart_iso_margin(self):
        return (self.dtstart - timedelta(seconds=self.margin)).isoformat()

    
    @property
    def tend_iso_margin(self):
        return (self.dtend + timedelta(seconds=self.margin)).isoformat()





