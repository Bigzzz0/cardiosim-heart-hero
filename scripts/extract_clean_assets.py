import os
import sys
import io
import math
from collections import deque
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
        _, base, hival, lookup = (v.get_object() for v in cs)
        img = Image.frombytes('P', (w, h), data)
        palette_bytes = lookup if isinstance(lookup, bytes) else lookup.get_data()
        img.putpalette(palette_bytes)
        img = img.convert('RGB')
    else:
        try:
            img = Image.frombytes('RGB', (w, h), data)
        except Exception:
            try:
                img = Image.frombytes('L', (w, h), data).convert('RGB')
            except Exception:
                img = Image.open(io.BytesIO(data)).convert('RGB')
    
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


def extract_outer_background(img_crop, tolerance=25):
    """
    Connected exterior flood fill background removal.
    Guarantees that interior white pixels (e.g. cotton wool) are completely preserved.
    """
    w, h = img_crop.size
    pixels = list(img_crop.getdata())
    
    def get_pixel(x, y):
        return pixels[y * w + x]
    
    corners = [get_pixel(0, 0), get_pixel(w-1, 0), get_pixel(0, h-1), get_pixel(w-1, h-1)]
    bg_r = sum(c[0] for c in corners) / 4.0
    bg_g = sum(c[1] for c in corners) / 4.0
    bg_b = sum(c[2] for c in corners) / 4.0
    
    visited = bytearray(w * h)
    is_bg = bytearray(w * h)
    
    def color_dist(c):
        return math.sqrt((c[0] - bg_r)**2 + (c[1] - bg_g)**2 + (c[2] - bg_b)**2)
    
    def is_background_color(c):
        r, g, b, a = c
        dist = color_dist(c)
        spread = max(r, g, b) - min(r, g, b)
        mean = (r + g + b) / 3.0
        return (dist < tolerance) or (mean > 210 and spread < 20 and min(r, g, b) > 180)
    
    queue = deque()
    for x in range(w):
        for y in [0, h - 1]:
            idx = y * w + x
            if not visited[idx] and is_background_color(get_pixel(x, y)):
                visited[idx] = 1
                is_bg[idx] = 1
                queue.append((x, y))
    for y in range(h):
        for x in [0, w - 1]:
            idx = y * w + x
            if not visited[idx] and is_background_color(get_pixel(x, y)):
                visited[idx] = 1
                is_bg[idx] = 1
                queue.append((x, y))
                
    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h:
                nidx = ny * w + nx
                if not visited[nidx]:
                    visited[nidx] = 1
                    c = get_pixel(nx, ny)
                    if is_background_color(c):
                        is_bg[nidx] = 1
                        queue.append((nx, ny))
                        
    new_pixels = []
    for idx, p in enumerate(pixels):
        if is_bg[idx]:
            new_pixels.append((p[0], p[1], p[2], 0))
        else:
            new_pixels.append(p)
            
    out_img = Image.new('RGBA', (w, h))
    out_img.putdata(new_pixels)
    bbox = out_img.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
    return out_img


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

    # 1. Extract from 03_รับข้อมูลผู้ป่วย_แก้.ai
    f_03 = 'art/medical-illustration/raw/03_รับข้อมูลผู้ป่วย_แก้.ai'
    if os.path.exists(f_03):
        print('\nProcessing 03_รับข้อมูลผู้ป่วย_แก้.ai...')
        save_webp(render_pdf_page(f_03, 2, scale=3), 'public/assets/clinical-handover/exam-magnifier.webp')
        save_webp(render_pdf_page(f_03, 3, scale=3), 'public/assets/clinical-handover/progress-track.webp')
        save_webp(render_pdf_page(f_03, 4, scale=3), 'public/assets/clinical-handover/progress-fill.webp')
        save_webp(render_pdf_page(f_03, 5, scale=3), 'public/assets/clinical-handover/action-toolbar.webp')
        save_webp(render_pdf_page(f_03, 6, scale=3), 'public/assets/clinical-handover/patient-dialog.webp')
        save_webp(render_pdf_page(f_03, 7, scale=3), 'public/assets/clinical-handover/bedside-monitor.webp')
        save_webp(render_pdf_page(f_03, 8, scale=3), 'public/assets/clinical-handover/order-sheet.webp')

        r03 = PdfReader(f_03)
        x03 = r03.pages[0]['/Resources']['/XObject'].get_object()
        if '/Im2' in x03:
            patient_img = decode_xobject_image(x03['/Im2'].get_object())
            save_webp(patient_img, 'public/assets/patients/patient-character.webp')
        if '/Im5' in x03:
            nurse_img = decode_xobject_image(x03['/Im5'].get_object())
            save_webp(nurse_img, 'public/assets/props/nurse-character.webp')

    # 2. Extract from 01_ปกเกม_แก้.ai
    f_01_cover = 'art/medical-illustration/raw/01_ปกเกม_แก้.ai'
    if os.path.exists(f_01_cover):
        print('\nProcessing 01_ปกเกม_แก้.ai...')
        save_webp(render_pdf_page(f_01_cover, 0, scale=3), 'public/assets/ui/cover.webp', crop_bbox=False)
        save_webp(render_pdf_page(f_01_cover, 1, scale=3), 'public/assets/ui/btn-action-1.webp')
        save_webp(render_pdf_page(f_01_cover, 2, scale=3), 'public/assets/ui/btn-action-2.webp')
        save_webp(render_pdf_page(f_01_cover, 3, scale=3), 'public/assets/ui/btn-action-3.webp')
        save_webp(render_pdf_page(f_01_cover, 4, scale=3), 'public/assets/ui/btn-start.webp')

    # 3. Extract from 02_Case_แก้.ai
    f_02 = 'art/medical-illustration/raw/02_Case_แก้.ai'
    if os.path.exists(f_02):
        print('\nProcessing 02_Case_แก้.ai...')
        save_webp(render_pdf_page(f_02, 0, scale=1.5), 'public/assets/environments/case-selection-bg.webp', crop_bbox=False)
        for i in range(1, 7):
            save_webp(render_pdf_page(f_02, i, scale=2), f'public/assets/ui/case-cards/case-card-{i}.webp')
        for i in range(7, 13):
            badge_num = i - 6
            save_webp(render_pdf_page(f_02, i, scale=2), f'public/assets/ui/case-cards/case-badge-{badge_num}.webp')

    # 4. Extract from 04_EKG_แก้.ai
    f_04 = 'art/medical-illustration/raw/04_EKG_แก้.ai'
    if os.path.exists(f_04):
        print('\nProcessing 04_EKG_แก้.ai...')
        save_webp(render_pdf_page(f_04, 0, scale=2), 'public/assets/ecg/ecg-minigame-board.webp', crop_bbox=False)
        save_webp(render_pdf_page(f_04, 1, scale=2), 'public/assets/ecg/ecg-leads-6cables.webp')
        
        r04 = PdfReader(f_04)
        p0_pdf = r04.pages[0]
        x04 = p0_pdf['/Resources']['/XObject'].get_object()
        if '/Im50' in x04:
            torso = decode_xobject_image(x04['/Im50'].get_object())
            save_webp(torso, 'public/assets/ecg/torso-ribcage.webp')
        if '/Im72' in x04:
            leads_overlay = decode_xobject_image(x04['/Im72'].get_object())
            save_webp(leads_overlay, 'public/assets/ecg/chest-leads-overlay.webp')
        if '/Im42' in x04:
            tray = decode_xobject_image(x04['/Im42'].get_object())
            save_webp(tray, 'public/assets/ecg/equipment-tray.webp')

        # Render 2560x1440 for tray item isolation
        pdf_doc = pdfium.PdfDocument(f_04)
        p0_doc = pdf_doc[0]
        scale_2560 = 2560.0 / p0_doc.get_width()
        bm_2560 = p0_doc.render(scale=scale_2560, fill_color=(0, 0, 0, 0), rev_byteorder=True)
        img_2560 = bm_2560.to_pil()

        items = {
            'public/assets/ecg/items/clamp-purple.webp': (196, 743, 284, 874),
            'public/assets/ecg/items/clamp-orange.webp': (288, 743, 376, 875),
            'public/assets/ecg/items/clamp-blue.webp': (378, 743, 467, 875),
            'public/assets/ecg/items/clamp-green.webp': (468, 744, 557, 876),
            'public/assets/ecg/items/clamp-yellow.webp': (559, 745, 647, 877),
            'public/assets/ecg/items/clamp-red.webp': (649, 745, 738, 877),
            'public/assets/ecg/items/cotton-jar.webp': (248, 139, 415, 340),
            'public/assets/ecg/items/alcohol-cleanser.webp': (561, 139, 637, 335),
            'public/assets/ecg/items/first-aid-box.webp': (189, 442, 428, 620),
            'public/assets/ecg/items/electrode-gel.webp': (490, 443, 708, 627),
        }

        os.makedirs('public/assets/ecg/items', exist_ok=True)
        for path, bbox in items.items():
            crop = img_2560.crop(bbox)
            clean = extract_outer_background(crop)
            clean.save(path, 'WEBP', quality=95)
            print(f'Extracted & saved {path}: size={clean.size}')

    print('\nAll high-fidelity extractions completed successfully!')

if __name__ == '__main__':
    run()
