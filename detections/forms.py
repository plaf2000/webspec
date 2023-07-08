from django import forms
from django.core.validators import FileExtensionValidator
from .upload_detections import TABLE_FORMATS



class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result

class UploadDetections(forms.Form):
    file = MultipleFileField(validators=[FileExtensionValidator(["txt","csv"])],label="File")
    data_format_types = [(k,tf["name"]) for k, tf in TABLE_FORMATS.items()]
    data_format = forms.ChoiceField(widget=forms.RadioSelect, choices=data_format_types, initial="sv")


    def __init__(self, ctype, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if ctype:
            self.fields['ctype'] = forms.BooleanField(label=f"Assign default call type \"{ctype.name}\"", required=False, initial=True)
