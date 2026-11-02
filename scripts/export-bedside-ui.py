"""Export supplied bedside illustrations without repainting or baked vital signs."""
import io
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream
import pypdfium2 as pdfium
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = next((ROOT / 'art/medical-illustration/raw').glob('03*.ai'))
OUTPUT = ROOT / 'public/assets/clinical-handover/play'


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(SOURCE)
    # The stethoscope is a separate, transparent image in the supplied AI file.
    image = reader.pages[0].images['/Im11'].image.convert('RGBA')
    image = image.crop(image.getbbox())
    image.thumbnail((480, 480))
    image.save(OUTPUT / 'stethoscope.webp', quality=94, method=6)
    # MC7 contains the source toolbar. Exclude all placed images (equipment)
    # so that real, individually accessible buttons can sit above the empty tray.
    writer = PdfWriter()
    writer.add_page(reader.pages[0])
    page = writer.pages[0]
    stream = ContentStream(page.get_contents(), writer)
    operations, keep = [], [True]
    for operands, operator in stream.operations:
        if operator in (b'BDC', b'BMC'):
            selected = keep[-1] and (not operands or operands[0] != '/OC' or str(operands[1]) == '/MC7')
            keep.append(selected)
            if selected:
                operations.append((operands, operator))
        elif operator == b'EMC':
            if keep.pop():
                operations.append((operands, operator))
        elif keep[-1] and operator != b'Do':
            operations.append((operands, operator))
    stream.operations = operations
    page.replace_contents(stream)
    buffer = io.BytesIO()
    writer.write(buffer)
    pdf = pdfium.PdfDocument(buffer.getvalue())
    bitmap = pdf[0].render(scale=2560 / pdf[0].get_width(), fill_color=(0, 0, 0, 0))
    tray = bitmap.to_pil().copy()
    assert tray.getbbox(), 'Source toolbar layer missing'
    tray = tray.crop(tray.getbbox())
    # Remove baked chat/+ controls using the blank left portion of the tray.
    half = tray.crop((0, 0, 800, tray.height))
    tray = Image.new('RGBA', (1600, tray.height))
    tray.paste(half, (0, 0))
    tray.paste(ImageOps.mirror(half), (800, 0))
    tray.save(OUTPUT / 'equipment-tray.webp', quality=94, method=6)
    bitmap.close()
    pdf.close()


if __name__ == '__main__':
    main()
