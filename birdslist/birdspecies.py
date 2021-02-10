import urllib.request
import re

langs = [
    'IT',
    'DE',
    'FR',
    'ES',
    'PT',
]

url ="https://avibase.bsc-eoc.org/checklist.jsp?lang=IT&p2=1&list=ebird&synlang={}&region=EUC&version=text&lifelist=&highlight=0"

species = {}

with urllib.request.urlopen(url.format('EN')) as response:
    html = response.read().decode('utf-8')
    pattern = re.compile(r'<td>.+<i>.+<\/i>')
    for line in re.findall(pattern,html):
        sp = re.search(r"<td>(?P<en>.+)<\/td>.+<i>(?P<lat>.+)<\/i>", line)
        species[sp.group('lat')] = {'EN':sp.group('en')}

for l in langs:
    with urllib.request.urlopen(url.format(l)) as response:
        html = response.read().decode('utf-8')
        pattern = re.compile(r'<i>.+<\/i></a><\/td><td>.+<\/tr>')
        for line in re.findall(pattern,html):
            # print(line)
            sp = re.search(r"<i>(?P<lat>.+)<\/i></a><\/td><td>(?P<lan>.*)<\/td>.+<\/tr>", line)
            species[sp.group('lat')][l] = sp.group('lan').replace("\t",'')
            
        
out="LAT"

for lan in langs:
    out+="\t"+lan
out+="\tEN\n"

langs.append('EN')

for lat in species:
    out+=lat
    for l in langs:
        if(lat=='Bucephala albeola'):
            print(species[lat][l])
        out+="\t"+species[lat][l]
    out+="\n"
f=open("birbs.csv","w")
f.write(out)
f.close()