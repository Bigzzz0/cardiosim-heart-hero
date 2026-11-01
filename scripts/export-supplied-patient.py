"""Export registered source layers without repainting them.

python scripts/export-supplied-patient.py --source-dir PATH
Requires psd-tools, Pillow and pypdf. Source AI/PSD files stay outside Git.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image
from psd_tools import PSDImage
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
LAYERS = [('Layer 6', 'patient-case-02-bed'), ('Layer 23', 'patient-case-02-pillow'), ('Layer 10', 'patient-case-02')]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, required=True)
    args = parser.parse_args()
    output = ROOT / 'public/game/medical-illustration'
    output.mkdir(parents=True, exist_ok=True)
    source = args.source_dir / 'Patient_แยกเลเยอร์คนไข้.psd'
    psd = PSDImage.open(source)
    if psd.size != (3840, 2160):
        raise ValueError('Source canvas changed; review presentation coordinates before exporting')
    images = []
    for name, filename in LAYERS:
        layer = next(layer for layer in psd if layer.name == name)
        if layer.bbox != (0, 0, *psd.size) or not layer.visible:
            raise ValueError(f'Layer registration changed: {name}')
        images.append((name, filename, layer.topil().convert('RGBA')))
    boxes = [image.getbbox() for _, _, image in images]
    crop = (min(box[0] for box in boxes), min(box[1] for box in boxes), max(box[2] for box in boxes), max(box[3] for box in boxes))
    if crop != (765, 354, 3162, 2160):
        raise ValueError('Visible crop changed; review suppliedPatientPresentation.ts')
    size = (1600, round((crop[3] - crop[1]) / (crop[2] - crop[0]) * 1600))
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    records = []
    for name, filename, image in images:
        image = image.crop(crop).resize(size, Image.Resampling.LANCZOS)
        image.save(output / f'{filename}.webp', 'WEBP', quality=94, method=6)
        records.append({'source': source.name, 'sourceSha256': digest, 'layer': name, 'crop': list(crop), 'size': list(size), 'file': f'{filename}.webp'})
    room_source = args.source_dir / '03_รับข้อมูลผู้ป่วย_แก้.ai'
    reader = PdfReader(room_source)
    room = next(image.image.copy() for image in reader.pages[0].images if image.name == 'Im1.png')
    if room.size != (2560, 1440):
        raise ValueError('Room image changed; inspect source art before exporting')
    room.resize((1920, 1080), Image.Resampling.LANCZOS).save(output / 'patient-room.webp', 'WEBP', quality=94, method=6)
    records.append({'source': room_source.name, 'sourceSha256': hashlib.sha256(room_source.read_bytes()).hexdigest(), 'artboard': 1, 'embeddedImage': 'Im1', 'size': [1920, 1080], 'file': 'patient-room.webp'})
    (ROOT / 'docs/supplied-patient-exports.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Exported {len(records)} registered assets')


if __name__ == '__main__':
    main()
