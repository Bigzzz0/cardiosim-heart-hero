import os
import sys
import io
import shutil
sys.stdout.reconfigure(encoding='utf-8')

from PIL import Image
import pypdfium2 as pdfium
from PyPDF2 import PdfReader
from PyPDF2.generic import ArrayObject

def decode_xobject_image(obj):
    """Robustly decode a PDF Image XObject with SMask into a PIL RGBA Image."""
    w, h = obj['/Width'], obj['/Height']
    data = obj.get_data()
    cs = obj.get('/ColorSpace')
    if cs:
        cs = cs.get_object()
    
    img = None
    if isinstance(cs, ArrayObject) and cs[0] == '/Indexed':
        # Indexed palette
        _, base, hival, lookup = (v.get_object() for v in cs)
        img = Image.frombytes('P', (w, h), data)
        palette_bytes = lookup if isinstance(lookup, bytes) else lookup.get_data()
        img.putpalette(palette_bytes)
        img = img.convert('RGB')
    else:
        # Direct RGB or Grayscale
        try:
            img = Image.frombytes('RGB', (w, h), data)
        except Exception:
            try:
                img = Image.frombytes('L', (w, h), data).convert('RGB')
            except Exception:
                img = Image.open(io.BytesIO(data)).convert('RGB')
    
    # Apply SMask if present
    if '/SMask' in obj:
        smask_obj = obj['/SMask'].get_object()
        smask_data = smask_obj.get_data()
        alpha = Image.frombytes('L', (w, h), smask_data)
        rgba = img.convert('RGBA')
        rgba.putalpha(alpha)
        return rgba
    return img.convert('RGBA')


def render_pdf_page(doc_path, page_idx, scale=2):
    """Render a PDF/AI page to PIL RGBA image with native vector transparency."""
    pdf = pdfium.PdfDocument(doc_path)
    page = pdf[page_idx]
    bm = page.render(scale=scale, fill_color=(0, 0, 0, 0), rev_byteorder=True)
    return bm.to_pil()


def save_webp(img, path, crop_bbox=True, quality=92):
    """Save an RGBA image as WebP, optionally trimming empty transparent borders."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    target = img
    if crop_bbox:
        bbox = img.getbbox()
        if bbox:
            target = img.crop(bbox)
    target.save(path, 'WEBP', quality=quality)
    print(f'Saved: {path} (size: {target.size})')
    return target


def run():
    print('Starting high-fidelity asset extraction...')

    # 1. Clean up corrupted/imperfect items in public/assets/ecg/items/
    ecg_items_dir = 'public/assets/ecg/items'
    if os.path.exists(ecg_items_dir):
        print(f'Removing corrupted items folder: {ecg_items_dir}')
        shutil.rmtree(ecg_items_dir)

    # 2. Extract from 03_รับข้อมูลผู้ป่วย_แก้.ai
    f_03 = 'art/medical-illustration/raw/03_รับข้อมูลผู้ป่วย_แก้.ai'
    if os.path.exists(f_03):
        print('\nProcessing 03_รับข้อมูลผู้ป่วย_แก้.ai...')
        # Page artboards
        save_webp(render_pdf_page(f_03, 2, scale=3), 'public/assets/clinical-handover/exam-magnifier.webp')
        save_webp(render_pdf_page(f_03, 3, scale=3), 'public/assets/clinical-handover/progress-track.webp')
        save_webp(render_pdf_page(f_03, 4, scale=3), 'public/assets/clinical-handover/progress-fill.webp')
        save_webp(render_pdf_page(f_03, 5, scale=3), 'public/assets/clinical-handover/action-toolbar.webp')
        save_webp(render_pdf_page(f_03, 6, scale=3), 'public/assets/clinical-handover/patient-dialog.webp')
        save_webp(render_pdf_page(f_03, 7, scale=3), 'public/assets/clinical-handover/bedside-monitor.webp')
        save_webp(render_pdf_page(f_03, 8, scale=3), 'public/assets/clinical-handover/order-sheet.webp')

        # Characters via XObject SMask
        r03 = PdfReader(f_03)
        x03 = r03.pages[0]['/Resources']['/XObject'].get_object()
        if '/Im2' in x03:
            patient_img = decode_xobject_image(x03['/Im2'].get_object())
            save_webp(patient_img, 'public/assets/patients/patient-character.webp')
        if '/Im5' in x03:
            nurse_img = decode_xobject_image(x03['/Im5'].get_object())
            save_webp(nurse_img, 'public/assets/props/nurse-character.webp')

    # 3. Extract from 01_ปกเกม_แก้.ai
    f_01_cover = 'art/medical-illustration/raw/01_ปกเกม_แก้.ai'
    if os.path.exists(f_01_cover):
        print('\nProcessing 01_ปกเกม_แก้.ai...')
        save_webp(render_pdf_page(f_01_cover, 0, scale=3), 'public/assets/ui/cover.webp', crop_bbox=False)
        save_webp(render_pdf_page(f_01_cover, 1, scale=3), 'public/assets/ui/btn-action-1.webp')
        save_webp(render_pdf_page(f_01_cover, 2, scale=3), 'public/assets/ui/btn-action-2.webp')
        save_webp(render_pdf_page(f_01_cover, 3, scale=3), 'public/assets/ui/btn-action-3.webp')
        save_webp(render_pdf_page(f_01_cover, 4, scale=3), 'public/assets/ui/btn-start.webp')

    # 4. Extract from 02_Case_แก้.ai
    f_02 = 'art/medical-illustration/raw/02_Case_แก้.ai'
    if os.path.exists(f_02):
        print('\nProcessing 02_Case_แก้.ai...')
        save_webp(render_pdf_page(f_02, 0, scale=1.5), 'public/assets/environments/case-selection-bg.webp', crop_bbox=False)
        for i in range(1, 7):
            save_webp(render_pdf_page(f_02, i, scale=2), f'public/assets/ui/case-cards/case-card-{i}.webp')
        for i in range(7, 13):
            badge_num = i - 6
            save_webp(render_pdf_page(f_02, i, scale=2), f'public/assets/ui/case-cards/case-badge-{badge_num}.webp')

    # 5. Extract from 04_EKG_แก้.ai
    f_04 = 'art/medical-illustration/raw/04_EKG_แก้.ai'
    if os.path.exists(f_04):
        print('\nProcessing 04_EKG_แก้.ai...')
        save_webp(render_pdf_page(f_04, 0, scale=2), 'public/assets/ecg/ecg-minigame-board.webp', crop_bbox=False)
        save_webp(render_pdf_page(f_04, 1, scale=2), 'public/assets/ecg/ecg-leads-6cables.webp')
        
        r04 = PdfReader(f_04)
        x04 = r04.pages[0]['/Resources']['/XObject'].get_object()
        if '/Im50' in x04:
            torso = decode_xobject_image(x04['/Im50'].get_object())
            save_webp(torso, 'public/assets/ecg/torso-ribcage.webp')
        if '/Im72' in x04:
            leads_overlay = decode_xobject_image(x04['/Im72'].get_object())
            save_webp(leads_overlay, 'public/assets/ecg/chest-leads-overlay.webp')
        if '/Im42' in x04:
            tray = decode_xobject_image(x04['/Im42'].get_object())
            save_webp(tray, 'public/assets/ecg/equipment-tray.webp')

    print('\nAll high-fidelity extractions completed successfully!')

if __name__ == '__main__':
    run()
