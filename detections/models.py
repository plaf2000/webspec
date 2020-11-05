from django.db import models

class Detection(models.Model):
    pinned = models.BooleanField()
    fstart = models.FloatField()
    fend = models.FloatField()
    tstart = models.FloatField()
    tend = models.FloatField()
    analysis_id = models.PositiveIntegerField()
    label_id = models.PositiveIntegerField()
    files_id = models.PositiveIntegerField()
    cluster_id = models.PositiveIntegerField()
