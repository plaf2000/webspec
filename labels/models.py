from django.db import models

class Label(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    species_id = models.PositiveIntegerField()

class Species(models.Model):
    code = models.CharField(max_length=6)
    lat = models.CharField(max_length=100)
    it = models.CharField(max_length=100)
    de = models.CharField(max_length=100)
    fr = models.CharField(max_length=100)
    es = models.CharField(max_length=100)
    pt = models.CharField(max_length=100)
    en = models.CharField(max_length=100)