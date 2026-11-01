# Medical illustration assets: entry flow

## Delivered

The supplied medical illustration artwork now appears in the existing web entry
flow at `/`: cover / Start, learner registration, and case selection. After the
pretest and learning hub, either case launches the existing Phaser module at
`/game.html?case=case-01&from=web` or `case-02` with the learner profile preserved.
Direct `/game.html` links continue to open the existing patient-room game.

- Cover: supplied illustration with a keyboard-accessible HTML Start target over
  the button already drawn in the artwork. Hover and press feedback changes the
  visible button without drawing a second copy.
- Registration: supplied reception artwork alongside labeled HTML inputs. Required
  fields reject empty or whitespace-only values; profile values are trimmed before
  submission. Returning to the cover preserves the draft and restores focus.
- Case selection: supplied frame and three-state buttons, with live text and
  functioning launch actions. Case 2 retains its ungraded exploration status.
- Mobile: stacked registration and case cards, 48px Start hit area, readable inputs,
  and stage transitions reset scroll to avoid entering halfway down the next screen.

## Source and export

Sources are `01_ปกเกม_แก้.ai`, `01_Login_แก้.ai`, and `02_Case_แก้.ai` from the supplied
ZIP. Only WebP exports are committed under `public/game/medical-illustration/`.
Original AI/PSD files remain outside Git. All ten exports total approximately 476 KiB.
`medical-illustration-exports.json` records source hashes, one-based artboard numbers,
dimensions, and output filenames. The Start state exports are also available for
future standalone buttons; the cover uses its embedded original button artwork.

Re-export using a Python environment with `pypdfium2` and `Pillow` installed:

```powershell
python scripts/export-medical-illustration.py --source-dir 'path/to/source-files'
```

## Review and validation

```powershell
npm ci
npm run dev
# Open http://localhost:3000/ for the new entry flow.
npm run build
npm run test:game
npm run test:entry
```

The entry browser test needs Playwright Chromium. To use installed Edge on Windows:

```powershell
$env:CARDIOSIM_BROWSER_CHANNEL='msedge'
npm run test:entry
```

The test covers empty/whitespace validation, keyboard Start, focus restoration,
draft preservation, the full pretest-to-hub transition, both case launch URLs,
trimmed profile handoff, asset failures, runtime errors and horizontal overflow.
Screenshots are saved locally under `screenshots/illustrated-entry/` (Git ignored).
Viewports: 1440, 1024, 768 and 390 CSS pixels.

## Remaining artwork integration

Patient PSD layers, bedside scene, monitor housing, equipment icons, ECG artwork,
emergency visuals and document templates are outside this entry-flow change.
The existing patient-room visuals and ECG interactions remain in use. Before
replacing them, inspect layer registration and remap their interaction coordinates.
The supplied older-looking patient should be mapped to an appropriate case after
confirming its intended identity; this change does not alter clinical case data.
No standalone `05` knowledge-template source file was present in the supplied ZIP.
