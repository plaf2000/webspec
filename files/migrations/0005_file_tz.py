# Generated by Django 4.0.2 on 2022-02-20 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0004_auto_20210217_2020'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='tz',
            field=models.FloatField(default=1),
            preserve_default=False,
        ),
    ]