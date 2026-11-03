import sys
sys.path.append('.')
from PIL import Image
from PyPDF2 import PdfReader
from scripts.extract_clean_assets import decode_xobject_image
import os

reader = PdfReader('เนื้อหาsimulation/เกียรติบัตรCardiosim heart hero simulation .pdf')
p0 = reader.pages[0]
xobjs = p0['/Resources']['/XObject'].get_object()
form = xobjs['/X13'].get_object()
fx = form['/Resources']['/XObject'].get_object()

bg_img = decode_xobject_image(fx['/X4'].get_object())
seal_img = decode_xobject_image(fx['/X8'].get_object())

# Save clean webp assets
os.makedirs('public/assets/ui', exist_ok=True)
bg_img.save('public/assets/ui/certificate-bg.webp', 'WEBP', quality=95)
seal_img.save('public/assets/ui/certificate-seal.webp', 'WEBP', quality=95)

# Also create a composite frame (bg + seal placed at top right)
# Scale seal appropriately
composite = bg_img.copy()
# seal position from PDF: around x = 2710 / 3510 * 1349 = ~1041, y = 78 / 2482 * 945 = ~30
# seal size: 609 / 3510 * 1349 = ~234
target_seal_w = int(1349 * (609.6 / 3510.7))
target_seal_h = target_seal_w
seal_resized = seal_img.resize((target_seal_w, target_seal_h), Image.Resampling.LANCZOS)
seal_x = int(1349 * (2710.5 / 3510.7))
seal_y = int(945 * (78.35 / 2482.2))

composite.paste(seal_resized, (seal_x, seal_y), seal_resized)
composite.save('public/assets/ui/certificate-frame.webp', 'WEBP', quality=95)

print('Saved certificate-bg.webp, certificate-seal.webp, certificate-frame.webp!')
