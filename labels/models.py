from django.db import models

class Labels(models.Model):
    name = models.CharField()
    description = models.TextField()
    
