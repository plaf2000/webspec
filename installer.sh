#!/bin/bash
pip3 install -r requirements.txt
sh keygen.sh
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver