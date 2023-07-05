# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models



class Detection(models.Model):
    pinned = models.BooleanField()
    manual = models.BooleanField(default=True)
    fstart = models.FloatField()
    fend = models.FloatField()
    tstart = models.FloatField()
    tend = models.FloatField()
    label_id = models.PositiveIntegerField()
    file_id = models.ForeignKey("files.File", models.DO_NOTHING, blank=False, null=False)

