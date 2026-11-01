"""Export supplied PDF-compatible AI artboards. Requires pypdfium2 and Pillow."""
import argparse
import hashlib
import json
from pathlib import Path
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parents[1]
EXPORTS = {
    '01_ปกเกม_แก้.ai': [(0, 'cover', 1920), (1, 'start-idle', 640), (2, 'start-hover', 640), (3, 'start-pressed', 640), (4, 'logo', 640)],
    '01_Login_แก้.ai': [(0, 'login', 1920)],
    '02_Case_แก้.ai': [(0, 'case-board', 1920), (4, 'case-button-idle', 640), (5, 'case-button-hover', 640), (6, 'case-button-pressed', 640)],
}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, required=True)
    args = parser.parse_args()
    output = ROOT / 'public/game/medical-illustration'
    output.mkdir(parents=True, exist_ok=True)
    records = []
    for filename, pages in EXPORTS.items():
        source = args.source_dir / filename
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        pdf = pdfium.PdfDocument(source)
        for index, name, width in pages:
            page = pdf[index]
            bitmap = page.render(scale=width / page.get_width(), fill_color=(0, 0, 0, 0))
            image = bitmap.to_pil().copy()
            # Preserve a common registration box across each three-state button.
            if name.startswith('start-'):
                image = image.crop((57, 0, 598, 142))
            elif name.startswith('case-button-'):
                image = image.crop((13, 21, 629, 178))
            image.save(output / f'{name}.webp', 'WEBP', quality=92, method=6)
            records.append({'source': filename, 'sourceSha256': digest, 'artboard': index + 1, 'file': f'{name}.webp', 'size': list(image.size)})
            bitmap.close()
            page.close()
        pdf.close()
    (ROOT / 'docs/medical-illustration-exports.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Exported {len(records)} assets')

if __name__ == '__main__':
    main()
