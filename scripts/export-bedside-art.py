"""Export generated PNG masters as runtime WebP without repainting/regeneration."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
for source in sorted((root / 'art/bedside/masters').glob('*.png')):
    name = 'bedside-room' if source.stem == 'room-master' else source.stem
    target = root / 'public/game/bedside' / f'{name}.webp'
    target.parent.mkdir(parents=True, exist_ok=True)
    Image.open(source).save(target, quality=88, method=6)
    print(target.relative_to(root))
