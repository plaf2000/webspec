from .models import Project
from django import forms

class ProjectForm(forms.Form):
    title               = forms.CharField()
    description         = forms.CharField(widget=forms.Textarea,required=False)
    hf                  = forms.IntegerField()
    lf                  = forms.IntegerField()
    nfft_choices = [
        (256, 256), 
        (512, 512), 
        (1024, 1024), 
        (2048, 2048), 
        (4096, 4096), 
        (8192, 8192),
    ]
    nfft_view           = forms.ChoiceField(choices=nfft_choices, initial=2048)
    nfft_project        = forms.ChoiceField(choices=nfft_choices, initial=2048)
    fft_window_view     = forms.ChoiceField(choices=nfft_choices, initial=2048)
    fft_window_project  = forms.ChoiceField(choices=nfft_choices, initial=2048)
    # last_edit_user      = forms.IntegerField(widget=forms.HiddenInput, initial=request.user.id)
    # if new:
    #     created_user    = forms.IntegerField(widget=forms.HiddenInput, initial=request.user.id)