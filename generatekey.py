from django.core.management.utils import get_random_secret_key
import os

os.system('export SECRET_KEY='+get_random_secret_key())