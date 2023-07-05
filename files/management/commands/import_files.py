from django.core.management.base import BaseCommand, CommandError, CommandParser
from tkinter import Tk    
from tkinter.filedialog import askopenfilenames
from optparse import OptionParser
# from devices.models import DeviceContext
from files.models import File
from devices.models import DeviceContext
import os
import re

# https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes



class Command(BaseCommand):
    def add_arguments(self, parser: CommandParser) -> None:
        
        parser.add_argument("device_id")
        parser.add_argument("-l", "--list", dest="list", default="", type=str, help="Path to a list containing all the filenames/folders to add.")
        parser.add_argument("-i", "--include-subfolders", action="store_true", dest="subfolders", default=False, help="Include all subfolders too.")
        parser.add_argument("-f", "--folder", dest="folder", default="", type=str, help="Import all files in this folder.")
        parser.add_argument("-p", "--file", dest="file", default="", type=str, help="Import this file.")
        parser.add_argument("-g", "--gui", action="store_true", dest="gui", default=False, help="Open a window to select the files to add.")

    def handle(self, *args, **options):


        dev_id = options["device_id"]
        dev_obj = DeviceContext.objects.filter(pk=dev_id)[0]

        print("Adding to device:",dev_obj.device.name)

        files = []
        folders = []

        if options["gui"]:
            Tk().withdraw()
            files = askopenfilenames()
        else:
            if os.path.isfile(options["list"]):
                try:
                    with open(options["list"],"r") as fp:
                        for l in fp.readlines():
                            l = l.strip()
                            if os.path.isfile(l):
                                files.append(l)
                                continue
                            if os.path.isdir(l):
                                folders.append(l)
                                continue
                            print("Warning:",l,"not found.")
                except Exception as e:
                    print("Exception while reading the list", e)
                    exit()

            if os.path.isfile(options["folder"]):
                folders.append(options["folder"])

            
            for f in folders:
                for ff in os.listdir(f):
                    full_ff = os.path.join(f,ff)
                    if os.path.isdir(full_ff) and options["subfolders"]:
                        folders.append(full_ff)
                        continue
                    if os.path.isfile(full_ff):
                        if re.match(dev_obj.file_re,ff):
                            files.append(full_ff)

        print("Files found:")
        print("\n".join(files[:10]))
        rest = len(files)-10
        if rest>0:
            print(f"and {rest} others.")

        for f in files:
            pass







