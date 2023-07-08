from django.db import models

class CallType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'call_type'


class Noise(models.Model):
    name = models.CharField(max_length=60, blank=True, null=True)
    species = models.ForeignKey('Species', models.PROTECT, blank=True, null=True)
    call = models.ForeignKey(CallType, models.SET_NULL, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'noise'
        unique_together = (('name', 'species', 'call'),)


class Species(models.Model):
    id = models.IntegerField(primary_key=True)
    lat = models.CharField(max_length=255, db_collation='utf8_general_ci', blank=True, null=True)
    it = models.CharField(max_length=255, db_collation='utf8_general_ci', blank=True, null=True)
    de = models.CharField(max_length=255, db_collation='utf8_general_ci', blank=True, null=True)
    fr = models.CharField(max_length=255, db_collation='utf8_general_ci', blank=True, null=True)
    es = models.CharField(max_length=255, db_collation='utf8_general_ci', blank=True, null=True)
    pt = models.CharField(max_length=255, db_collation='utf8_general_ci', blank=True, null=True)
    en = models.CharField(max_length=255, db_collation='utf8_general_ci', blank=True, null=True)
    code = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'species'

    
class Label(models.Model):
    detection_id = models.ForeignKey("detections.Detection", models.CASCADE, blank=False, null=False)
    noise_id = models.ForeignKey("Noise", models.PROTECT, blank=False, null=False)
    confidence = models.FloatField(default=1.)
    # analysis_id = models.PositiveIntegerField()
    # cluster_id = models.PositiveIntegerField()
