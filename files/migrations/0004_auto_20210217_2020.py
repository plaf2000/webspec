# Generated by Django 3.1.3 on 2021-02-17 20:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0004_auto_20210217_1935'),
        ('files', '0003_file_stereo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='file',
            name='device_id',
        ),
        migrations.AddField(
            model_name='file',
            name='device',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='file_device', to='devices.devicecontext'),
            preserve_default=False,
        ),
    ]
