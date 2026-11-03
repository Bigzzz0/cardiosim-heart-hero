"""Record reviewed public image provenance. Unknown groups fail closed."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'art/medical-illustration/raw'


def source_for(path):
    name = path.name
    relative = path.relative_to(ROOT / 'public').as_posix()
    if relative == 'favicon.ico' or relative.startswith('icons/'):
        return ROOT / 'art/branding/cardiosim-icon.webp', 'user-supplied-branding'
    if relative.startswith('assets/clinical-handover/'):
        source = '03_รับข้อมูลผู้ป่วย_แก้.ai'
    elif relative.startswith('assets/ecg/'):
        source = '04_EKG_แก้.ai'
    elif relative == 'assets/environments/patient-room.webp' or relative == 'assets/props/nurse-character.webp' or relative == 'assets/patients/patient-character.webp':
        source = '03_รับข้อมูลผู้ป่วย_แก้.ai'
    elif relative == 'assets/environments/case-selection-bg.webp':
        source = '02_Case_แก้.ai'
    elif relative.startswith('assets/patients/patient-case-02'):
        source = 'Patient_แยกเลเยอร์คนไข้.psd'
    elif relative.startswith(('assets/ui/', 'game/medical-illustration/')):
        if name.startswith('patient-case-02'):
            source = 'Patient_แยกเลเยอร์คนไข้.psd'
        elif name == 'patient-room.webp':
            source = '03_รับข้อมูลผู้ป่วย_แก้.ai'
        elif name == 'login.webp':
            source = '01_Login_แก้.ai'
        elif name.startswith(('case-', 'case-board')):
            source = '02_Case_แก้.ai'
        elif name == 'certificate-frame.webp':
            return ROOT / 'เนื้อหาsimulation/เกียรติบัตรCardiosim heart hero simulation .pdf', 'user-supplied-branding'
        else:
            assert name.startswith(('cover', 'start-', 'btn-', 'logo')), f'Unreviewed UI image: {relative}'
            source = '01_ปกเกม_แก้.ai'
    else:
        raise ValueError(f'Unreviewed public image: {relative}')
    return RAW / source, 'medical-illustration'


def main():
    records = []
    hashes = {}
    for path in sorted((ROOT / 'public').rglob('*')):
        if path.suffix.lower() not in {'.webp', '.png', '.jpg', '.jpeg', '.svg', '.ico'}:
            continue
        source, provider = source_for(path)
        if source not in hashes:
            hashes[source] = hashlib.sha256(source.read_bytes()).hexdigest()
        records.append({'file': '/' + path.relative_to(ROOT / 'public').as_posix(), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'source': source.relative_to(ROOT).as_posix(), 'sourceSha256': hashes[source], 'provider': provider})
    (ROOT / 'docs/supplied-runtime-assets.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Recorded {len(records)} public images; no generated or third-party pack assets')


if __name__ == '__main__':
    main()
