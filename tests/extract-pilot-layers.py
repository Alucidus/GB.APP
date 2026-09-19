"""Export original fitted PSD layers without changing their artwork.

Requires psd-tools. Supply the source directory as the first argument.
Eye/brow masks and palette shading live in public/pilot.js, not these exports.
"""
import json
import shutil
import sys
from pathlib import Path
from psd_tools import PSDImage

source = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / 'public/img/pilots'
out.mkdir(parents=True, exist_ok=True)
files = {
    'female': 'girls all in one fitment psd.psd',
    'male-light': 'male-uniform full layers and fitment (1).psd',
    'male-east': 'asian male full layer and fitment (1).psd',
    'male-south': 'southasian male full layer and fitment (1).psd',
    'male-dark': 'dark male full layer and fitment.psd',
}
manifest = {}
for key, name in files.items():
    psd = PSDImage.open(source / name)
    assert psd.size == (1254, 1254), f'Review new fitment: {name}'
    manifest[key] = []
    for i, layer in enumerate(psd):
        layer.visible = True  # Include options hidden in the saved PSD.
        image = layer.composite(force=True)
        if image is None:
            raise ValueError(f'No pixels: {name}, layer {i}')
        filename = f'{key}-{i}.png'
        image.save(out / filename)
        manifest[key].append({'name': layer.name, 'src': 'img/pilots/' + filename, 'box': list(layer.bbox)})
(out / 'layers.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
shutil.copy2(source / 'Hangar.png', out / 'hangar.png')
