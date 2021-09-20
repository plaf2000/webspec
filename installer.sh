#!/bin/bash
pip3 install -r requirements.txt
echo "`python3 generatekey.py`" > key
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver