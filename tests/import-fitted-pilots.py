"""Import the user's exact PSD placement; ignore hidden original-hair backups."""
from pathlib import Path
import sys,json,re
import numpy as np
from PIL import Image,ImageDraw,ImageFilter
APP=Path(__file__).resolve().parents[1];ROOT=APP.parents[1]
sys.path.insert(0,str(ROOT/'.asset-tools'))
from psd_tools import PSDImage
SRC=ROOT/'creator-work/edge-cleanup/NEWHAIRFITMENT_CLEANED/PSDs'
OUT=APP/'public/img/pilots';THUMB=OUT/'thumbs';THUMB.mkdir(exist_ok=True)
files={'female':'girls all in one fitment psd.psd','male-light':'male-uniform full layers and fitment (1).psd','male-east':'asian male full layer and fitment (1).psd','male-south':'southasian male full layer and fitment (1).psd','male-dark':'dark male full layer and fitment (1).psd'}
names={'female':['Bob','Curls','Pixie','Buzz cut','Undercut','Waves','Long fringe','Ponytail','Dreadlocks'],'male':['Spiky','Side part','Curls','Crew cut','Swept back','Curtains','Long waves','Ponytail','Dreadlocks','Afro fade','Undercut','Dread undercut']}
manifest={};groups={}
def despeckle(im):
    a=np.array(im);mask=Image.fromarray(np.where(a[:,:,3]>8,255,0).astype('uint8')).copy();keep=np.zeros(a.shape[:2],dtype='uint8')
    for _ in range(8):
        b=np.array(mask);counts=(b>0).sum(1)
        if not counts.any():break
        y=int(counts.argmax());xs=np.flatnonzero(b[y]);x=int(xs[len(xs)//4]);ImageDraw.floodfill(mask,(x,y),128)
        b=np.array(mask);part=b==128
        if part.sum()>500:keep[part]=255
        b[part]=0;mask=Image.fromarray(b).copy()
    a[:,:,3]=np.where(np.array(Image.fromarray(keep).filter(ImageFilter.MaxFilter(3)))>0,a[:,:,3],0)
    return Image.fromarray(a)
for key,file in files.items():
    psd=PSDImage.open(SRC/file);layers=[l for l in psd if l.kind!='group'];assert psd.size==(1254,1500)
    exported=[];images=[]
    for i,l in enumerate(layers):
        im=l.topil().convert('RGBA');name=f'{key}-{i}.png';im.save(OUT/name)
        exported.append({'name':l.name,'src':'img/pilots/'+name,'box':list(l.bbox),'preserveDetails':bool(re.match(r'^[MFB]\d-',l.name) or l.name=='male-ponytail')})
        images.append(im if exported[-1]['preserveDetails'] else despeckle(im))
    manifest[key]=exported
    def find(name):return next(i for i,l in enumerate(layers) if l.name==name)
    female=key=='female';prefix='female' if female else 'male'
    faces=[0,2,3,1] if female else [0]
    uniforms=[find(prefix+'-uniform-'+s) for s in ['neutral-black','green-gold-red' if female else 'space-green','space-green','space-light','tan-red-yellow']]
    if not female:uniforms[1]=[i for i,l in enumerate(layers) if l.name=='Spacenoid uniform'][-1]
    hairs=[find(prefix+'-hair-'+s) for s in (['bob','curls','pixie'] if female else ['spiky','sidepart','curls'])]
    if female:hairs += [next(i for i,l in enumerate(layers) if l.name.startswith(f'F{n}-')) for n in range(1,7)]
    else:
        for n in [1,2,3,4,5,6,7,8,9]:hairs.append(find('male-ponytail') if n==5 else next(i for i,l in enumerate(layers) if l.name.startswith(f'M{n}-')))
    beards=[] if female else [next(i for i,l in enumerate(layers) if l.name.startswith(f'B{n}-')) for n in range(1,6)]
    eyes=[] if female else [i for i,l in enumerate(layers) if re.search('eye|brow',l.name,re.I)]
    def portrait(face,hair=None,beard=None,beard_view=False):
        c=Image.new('RGBA',psd.size)
        for i in [face,*eyes,uniforms[0],*([beard] if beard is not None else []),*([hair] if hair is not None else [])]:c.alpha_composite(images[i],tuple(layers[i].bbox[:2]))
        bg=Image.new('RGBA',psd.size,'#25394a');bg.alpha_composite(c)
        return bg.crop((280,720,980,1450) if beard_view else (190,120,1070,1250)).resize((176,226),Image.Resampling.LANCZOS).convert('RGB')
    face_thumbs=[];hair_thumbs=[];beard_thumbs=[]
    for n,i in enumerate(faces):
        name=f'{key}-face-{n}.jpg';portrait(i,hairs[0]).save(THUMB/name,quality=85);face_thumbs.append('img/pilots/thumbs/'+name)
    for n,i in enumerate(hairs):
        name=f'{key}-hair-{n}.jpg';portrait(faces[0],i).save(THUMB/name,quality=85);hair_thumbs.append('img/pilots/thumbs/'+name)
    for n,i in enumerate([None,*beards]):
        name=f'{key}-beard-{n}.jpg';portrait(faces[0],hairs[3],i,True).save(THUMB/name,quality=85);beard_thumbs.append('img/pilots/thumbs/'+name)
    groups[key]={'faces':faces,'uniforms':uniforms,'hairs':hairs,'beards':beards,'faceThumbs':face_thumbs,'hairThumbs':hair_thumbs,'beardThumbs':beard_thumbs}
manifest['_creator']={'width':1254,'height':1500,'groups':groups,'hairNames':names,'beardNames':['Clean shaven','Stubble','Moustache','Goatee','Short beard','Full beard'],'drawOrder':['face','eyes/brows','uniform','facial hair','hairstyle']}
(OUT/'layers.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('Imported exact fitted layers and portrait thumbnails for five PSDs.')
