# Generated by Django 3.0.8 on 2020-08-25 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Detection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pinned', models.BooleanField()),
                ('fstart', models.FloatField()),
                ('fend', models.FloatField()),
                ('tstart', models.FloatField()),
                ('tend', models.FloatField()),
                ('analysisid', models.PositiveIntegerField()),
                ('labelid', models.PositiveIntegerField()),
                ('filesid', models.PositiveIntegerField()),
                ('clusterid', models.PositiveIntegerField()),
            ],
        ),
    ]
