from django.db import models

# Create your models here.

class Place(models.Model):
    name = models.CharField(max_length=50)
    lat = models.FloatField()
    lon = models.FloatField()
    description = models.TextField(blank=True)
