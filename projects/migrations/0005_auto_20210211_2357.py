# Generated by Django 3.1.3 on 2021-02-11 23:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_auto_20210211_2356'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='last_edit',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='last_edit_user',
            field=models.PositiveIntegerField(),
        ),
    ]
