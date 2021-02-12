from django.db import models

class Project(models.Model):
    hf = models.PositiveIntegerField(default=18000)
    lf = models.PositiveIntegerField(default=0)
    nfft_view = models.PositiveIntegerField(default=2048)
    nfft_project = models.PositiveIntegerField(default=2048)
    fft_window_view = models.PositiveIntegerField(default=2048)
    fft_window_project = models.PositiveIntegerField(default=2048)
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    created_user = models.PositiveIntegerField()
    last_edit = models.DateTimeField(auto_now=True)
    last_edit_user = models.PositiveIntegerField()
    