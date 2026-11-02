"""Package the supplied square icon for browser tabs and home screens (Pillow)."""
import argparse
from pathlib import Path
from shutil import copyfile
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / 'art/branding/cardiosim-icon.webp'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=MASTER)
    args = parser.parse_args()
    with Image.open(args.source) as original:
        if original.width != original.height or original.width < 512:
            raise ValueError('Use a square original at least 512 pixels wide')
        icon = original.convert('RGBA')
    MASTER.parent.mkdir(parents=True, exist_ok=True)
    if args.source.resolve() != MASTER.resolve():
        copyfile(args.source, MASTER)
    output = ROOT / 'public/icons'
    output.mkdir(parents=True, exist_ok=True)
    for size, filename in [(32, 'favicon-32.png'), (180, 'apple-touch-icon.png'), (192, 'icon-192.png'), (512, 'icon-512.png')]:
        icon.resize((size, size), Image.Resampling.LANCZOS).save(output / filename, optimize=True)
    icon.resize((256, 256), Image.Resampling.LANCZOS).save(ROOT / 'public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    print('Exported favicon ICO/PNG, Apple touch icon and 192/512px app icons')


if __name__ == '__main__':
    main()
