# Generated by Django 3.1.3 on 2021-02-11 23:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_remove_project_pinned'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='created',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='last_edit_user',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
