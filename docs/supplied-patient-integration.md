# Supplied patient artwork: Case 2

> Updated by the [supplied-only art pass](supplied-only-art.md): both cases now use the supplied layered patient and source room.

The older patient supplied by the medical illustration team is now used for the
65-year-old Case 2. Case 1 retains its existing patient and room. The source is
`Patient_แยกเลเยอร์คนไข้.psd` (3840 x 2160) and the empty room embedded in artboard 1
of `03_รับข้อมูลผู้ป่วย_แก้.ai`. The age-to-art mapping is an implementation choice
based on the case summaries, and can be changed after the team confirms identity.

## Exported layers

| Source | Export | Behavior |
| --- | --- | --- |
| PSD `Layer 6` | `patient-case-02-bed.webp` | Fixed bed |
| PSD `Layer 23` | `patient-case-02-pillow.webp` | Fixed pillow |
| PSD `Layer 10` | `patient-case-02.webp` | Patient, clothing and blanket together; existing breathing/response animation |
| AI page 1, image `Im1` | `patient-room.webp` | Empty room background |

The hidden PSD `Background` is a white rectangle and is not exported. The patient
layer includes part of the pillow and the blanket; these are not independently
editable animation parts in this source. No new face or critical-state image was
invented. The existing critical tint/transition still operates on the patient
layer, while the support layers stay still. Reduced-motion and pause behavior
continue to use the existing animation controls.

All three PSD layers use the same source crop `(765, 354, 3162, 2160)` and output
canvas of 1600 x 1206. Do not trim these layers separately. The runtime presents
the registered scene at 800 world units wide. `src/game/suppliedPatientPresentation.ts`
maps original source pixels to the game world for head, chest, upper arm, wrist and
fingertip targets. Radii are separated so a fingertip action cannot resolve to the
wrist or an upper-arm action to the chest. Browser hit targets remain at least 44px.

The export script checks the source dimensions and crop to catch replacement files
whose geometry needs review. `supplied-patient-exports.json` records the source SHA256,
layer/image identifiers and output dimensions. Original AI/PSD files stay outside Git.

## Re-export

With `psd-tools`, `Pillow`, and `pypdf` installed in the Python environment:

```powershell
python scripts/export-supplied-patient.py --source-dir 'path/to/source-files'
```

## Review and checks

Run the app and open `/game.html?case=case-02`; choose Start or resume an existing
checkpoint. Existing Case 2 checkpoint versions are preserved because gameplay
and saved answers have not changed; body coordinates are read from current config.

```powershell
npm run build
npm run test:game
$env:CARDIOSIM_BROWSER_CHANNEL='msedge' # optional; otherwise Playwright Chromium
npm run test:game:patient
npm run test:game:case2
```

The patient browser test checks 1440x900, 1024x768 and 390x844, including real touch
drags on the phone viewport, history, three assessment actions, ordered ABC,
unobstructed targets, blank unavailable vitals, and checkpoint resume. Screenshots
are saved under `screenshots/supplied-patient/` (Git ignored). The existing full
Case 2 browser flow uses the runtime body targets and covers the result handoff to
the web post-test. Its launch selector is updated for the illustrated case menu.

Case 2 remains an ungraded practice case with no invented vital values, lung
findings, ECG strip, treatment answers, or drug orders. ECG artwork, supplied
monitor housing, equipment icons, document templates and new critical patient
poses remain subsequent artwork tasks.

The following chest-lead artwork integration is documented in
[`supplied-ecg-integration.md`](supplied-ecg-integration.md).
