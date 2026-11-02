"""Export registered ECG art and source-drawn target coordinates from supplied AI.

Requires Pillow, pypdf and pypdfium2. No clinical positions are invented here.
"""
import hashlib
import io
import json
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'art/medical-illustration/raw/04_EKG_แก้.ai'
OUTPUT = ROOT / 'public/assets/ecg/play'


def render_page(page_number, *, layer=None, images=None, width=2560):
    reader = PdfReader(SOURCE)
    writer = PdfWriter()
    writer.add_page(reader.pages[page_number])
    page = writer.pages[0]
    stream = ContentStream(page.get_contents(), writer)
    operations = []
    keep = [True]
    for operands, operator in stream.operations:
        if operator in (b'BDC', b'BMC'):
            selected = keep[-1] and (layer is None or not operands or operands[0] != '/OC' or str(operands[1]) == layer)
            keep.append(selected)
            if selected:
                operations.append((operands, operator))
        elif operator == b'EMC':
            if keep.pop():
                operations.append((operands, operator))
        elif keep[-1] and not (operator == b'Do' and images is not None and str(operands[0]) not in images):
            operations.append((operands, operator))
    stream.operations = operations
    page.replace_contents(stream)
    buffer = io.BytesIO()
    writer.write(buffer)
    pdf = pdfium.PdfDocument(buffer.getvalue())
    bitmap = pdf[0].render(scale=width / pdf[0].get_width(), fill_color=(0, 0, 0, 0))
    rendered = bitmap.to_pil().copy()
    bitmap.close()
    pdf.close()
    return rendered


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    torso = render_page(0, layer='/MC4')
    crop = torso.getbbox()
    torso = torso.crop(crop)
    torso.save(OUTPUT / 'torso-with-ribs.webp', 'WEBP', quality=94, method=6)
    reader = PdfReader(SOURCE)
    markers = [63, 61, 59, 57, 55, 53]
    colors = ['#ed3028', '#e7b720', '#47a633', '#209ab5', '#e58b39', '#8d45c1']
    leads = []
    for index, marker in enumerate(markers):
        identifier = f'V{index + 1}'
        box = reader.pages[0].images[f'/Im{marker}'].image.getbbox()
        x = ((box[0] + box[2]) / 2 - crop[0]) / (crop[2] - crop[0])
        y = ((box[1] + box[3]) / 2 - crop[1]) / (crop[3] - crop[1])
        assert 0 < x < 1 and 0 < y < 1, 'Source marker is outside torso crop'
        cable = render_page(1, images={f'/Im{index * 3 + offset}' for offset in range(3)}, width=800)
        # Page 2 is a different artboard. Apply its image placement matrix before
        # cropping; raw XObject pixels are not page-render pixels.
        head = reader.pages[1].images[f'/Im{index * 3}'].image.getbbox()
        page = reader.pages[1]
        operations = ContentStream(page.get_contents(), reader).operations
        operation_index = next(i for i, (args, op) in enumerate(operations) if op == b'Do' and str(args[0]) == f'/Im{index * 3}')
        matrix = next(args for args, op in reversed(operations[:operation_index]) if op == b'cm')
        a, _, _, d, tx, ty = map(float, matrix)
        render_scale = 800 / float(page.mediabox.width)
        def convert(x, y):
            return ((tx + x / 2560 * a) * render_scale, (float(page.mediabox.height) - ty - d + y / 1440 * d) * render_scale)
        x0, y0 = convert(head[0], head[1])
        x1, y1 = convert(head[2], head[3])
        electrode = cable.crop((round(x0 - 8), round(y0 - 8), round(x1 + 8), round(y1 + 16)))
        assert electrode.getbbox(), 'Electrode export is empty'
        electrode.save(OUTPUT / f'electrode-{identifier.lower()}.webp', 'WEBP', quality=94, method=6)
        cable.crop(cable.getbbox()).save(OUTPUT / f'cable-{identifier.lower()}.webp', 'WEBP', quality=94, method=6)
        leads.append({'id': identifier, 'x': x, 'y': y, 'color': colors[index], 'sourceMarker': f'Im{marker}',
                      'electrode': f'/assets/ecg/play/electrode-{identifier.lower()}.webp',
                      'cable': f'/assets/ecg/play/cable-{identifier.lower()}.webp'})
    manifest = {'source': SOURCE.name, 'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
                'sourceRender': [2560, 1440], 'crop': list(crop), 'size': list(torso.size), 'leads': leads}
    (ROOT / 'src/game/suppliedECGArt.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps({'crop': crop, 'size': torso.size, 'targets': leads}, indent=2))


if __name__ == '__main__':
    main()
