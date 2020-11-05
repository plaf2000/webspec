from django.db import models

class Detection(models.Model):
    pinned = models.BooleanField()
<<<<<<< HEAD
=======
    manual = models.BooleanField(default=False)
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
    fstart = models.FloatField()
    fend = models.FloatField()
    tstart = models.FloatField()
    tend = models.FloatField()
    analysis_id = models.PositiveIntegerField()
    label_id = models.PositiveIntegerField()
    files_id = models.PositiveIntegerField()
    cluster_id = models.PositiveIntegerField()
