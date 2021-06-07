#!/bin/bash
pip3 install -r requirements.txt
export SECRET_KEY="`python3 generatekey.py`"
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver