# import sys
# sys.path.append('/home/plaf2000/webspec/webspec')
import labels
from labels.models import Species

Species.objects.all().delete()

# if __name__=="__main__":
with open("birdslist.csv","r") as f:
    species = f.read()
    for s in species.split("\n")[1:]:
        names = s.split("\t")
        latin = names[0]
        genus_sp = names[0].split(" ")
        code = genus_sp[0][0:3]
        try:
            code+=genus_sp[1][0:3]
            code += genus_sp[2][0:3]
        except:
            pass

        code = code.upper()
        newsp = Species(
                code = code,
                lat = latin,
                it = names[1],
                de = names[2],
                fr = names[3],
                es = names[4],
                pt = names[5],
                en = names[6]
        )
        newsp.save()