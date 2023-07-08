import re
import pandas as pd
import os
import soundfile as sf
import datetime as dt
import re
from pydub import AudioSegment
from django.core.files.uploadedfile import UploadedFile
from .models import Detection
from labels.models import *
from files.models import File
from devices.models import DeviceContext


ORIG_RECS_DIR = "."
EXTRACTED_DIR = "./extracted/"

def sonic_parser(table_filename):
    return pd.read_csv(table_filename)



def raven_parser(table_filename):
    df = pd.read_csv(table_filename, sep="\t")
    df = df.rename(columns={
        "Begin Time (s)": "START",
        "End Time (s)": "END",
        "Annotation": "LABEL",
        "Low Freq (Hz)": "EXTENT START",
        "High Freq (Hz)": "EXTENT END"

    })
    return df

TABLE_FORMATS = {
    "sv": {
        "name": "Sonic Visualiser",
        "parser": sonic_parser
    },
    "rv": {
        "name": "Raven",
        "parser": raven_parser
    }
}

OUT_TYPES = ["flac","mp3"]

THRESHOLD = 5
MARGIN = 1.5



def check(extracted):
    new = False
    for format_f in os.listdir(DATA_DIR):
        full_format_f = os.path.join(DATA_DIR,format_f)
        if not os.path.isdir(full_format_f):
            continue
        for tf in TABLE_FORMATS:
            if format_f not in tf["folder"]:
                continue
        
            for f in os.listdir(full_format_f):

                data_fname = os.path.join(DATA_DIR,f)
                if f in extracted and os.path.getmtime(data_fname)<=float(extracted[f]):
                    continue
                old_new = new
                new = True
                fname = os.path.splitext(f)[0]
                sound_data = None
                for ext in IN_TYPES:
                    f_in = os.path.join(ORIG_RECS_DIR,f"{fname}.{ext}")
                    f_in_upper = os.path.join(ORIG_RECS_DIR,f"{fname}.{ext.upper()}")
                    if os.path.isfile(f_in):
                        sound_data = AudioSegment.from_file(f_in,ext)
                        break
                    elif os.path.isfile(f_in_upper):
                        sound_data = AudioSegment.from_file(f_in_upper,ext)
                        break
                if sound_data is None:
                    new = old_new
                    break
                
                data = tf["parser"](data_fname)
                data.sort_values("START", inplace=True)
                segments = []
                for i, d in data.iterrows():
                    s, e, l = d["START"], d["END"], d["LABEL"]
                    if len(segments)>0:
                        if abs(d["START"]-segments[-1]["s"])<=THRESHOLD:
                            segments[-1]["e"] = e
                            segments[-1]["labels"].add(l)
                            continue
                        segments.append({"s": s, "e": e, "labels": {l}})
                        continue
                    segments.append({"s": s, "e": e, "labels": {l}})
                for s in segments:
                    out_s = int(max(s["s"]-MARGIN,0))*1000
                    out_e = int(s["e"]+MARGIN)*1000
                    cut_data = sound_data[out_s:out_e]
                    date_str = re.findall(DT_REGEX,fname)[0]
                    dt_obj = dt.datetime.strptime(date_str,DT_FORMAT)
                    td_s = dt.timedelta(seconds=s["s"])
                    dt_s = dt_obj+td_s
                    labels = ["".join(c for c in l if c.isalnum() or c in {'.','_'}).rstrip() for l in s["labels"]]
                    fout_name = f"{re.sub(DT_REGEX,dt_s.strftime(DT_FORMAT),fname)}_{'_'.join(sorted(labels))}"

                    for t in OUT_TYPES:
                        folder = os.path.join(EXTRACTED_DIR,t)
                        if not os.path.isdir(folder):
                            os.mkdir(folder)
                        folder = os.path.join(folder,fname)
                        if not os.path.isdir(folder):
                            os.mkdir(folder)
                        full_fout_name=os.path.join(folder, f"{fout_name}.{t}")
                        print(full_fout_name)
                        cut_data.export(full_fout_name)


                extracted.setdefault(f,os.path.getmtime(data_fname))
            
    
    return new, extracted

def uploadDetections(device: DeviceContext,default_ctype, user, file, data_format, ctype):
    for f in file:
        f: UploadedFile = f
        tstart = device.parse_date(f.name)
        if not tstart:
            print("Unable to parse filename.", f.name)
            continue
        try:
            file_entry = File.objects.get(tstart = tstart, device=device)
        except File.DoesNotExist:
            print("File with such date doesn't exist:",f.name)
            continue
        
        file_entry.manually_checked_by = user
        file_entry.save()

        Detection.objects.filter(file_id=file_entry).delete()
        
        data: pd.DataFrame = TABLE_FORMATS[data_format]["parser"](f)
        for i, d in data.iterrows():
            det = Detection(pinned=False, manual=True, fstart=d["EXTENT START"], fend=d["EXTENT END"], tstart=d["START"], tend=d["END"], file_id = file_entry)
            det.save()

            labels = d["LABEL"].lower().split(" ")

            confidence = 1/len(labels)

            for l in labels:
                if l=="mysb":
                    l="avesp."
                if l.endswith("?"):
                    confidence/=2
                    l = l[:-1]
                try:
                    noise = Noise.objects.get(name=l, species=None, call=None)
                except Noise.DoesNotExist:
                    call_type = None
                    if "-" in l:
                        sp, call_type = l.split("-")
                    else:
                        sp = l
                        if ctype and default_ctype:
                            call_type = default_ctype.name
                    species = Species.objects.get(code=sp)
                    if not call_type or call_type=="":
                        ct = None
                    else:
                        ct, _ = CallType.objects.get_or_create(name=call_type)
                    noise, _ = Noise.objects.get_or_create(name=f"{sp}-{call_type}",species = species, call = ct)
                    
                lab = Label(detection_id = det, noise_id = noise, confidence=confidence)
                lab.save()
            




        