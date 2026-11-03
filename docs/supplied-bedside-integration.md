# Supplied monitor and tool tray

> Superseded by the [supplied-only art pass](supplied-only-art.md): generated BP/SpO₂/hand imagery and third-party props are removed. Missing equipment illustrations now use plain controls.

The patient monitor uses `ASSETS.handover.monitorWithArm`, exported from the supplied `03_รับข้อมูลผู้ป่วย_แก้.ai`. Its screen is registered against the 777 × 801 illustration. ECG canvas and vital signs remain HTML/canvas driven by the case engine. Case 2 keeps its missing-data message and em dashes; artwork adds no clinical values. The housing does not intercept patient input.

`scripts/export-bedside-ui.py` exports the separate stethoscope image and the MC7 equipment tray from that same AI source. The empty left tray portion is reflected to remove baked chat/+ symbols, so each actual control remains separately labelled and operable. Run with Python, Pillow, pypdf and pypdfium2. The new stethoscope contact anchor follows the round chest piece in the supplied image. The chart button uses the supplied record folder. BP cuff, SpO₂, assessment and hint retain existing visuals where no matching separate illustration was identified.

Verification: `npm run build`, `npm run test:game`, and `CARDIOSIM_BROWSER_CHANNEL=msedge npm run test:game:patient` (set the environment variable using the syntax for your shell). The patient browser check covers mouse and real touch examination, unobstructed targets, resume, missing Case 2 vitals, Case 1 ECG/readings, and reading bounds inside the monitor at 1440, 1024 and 390 pixels.
