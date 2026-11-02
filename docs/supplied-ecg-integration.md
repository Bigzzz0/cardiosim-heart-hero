# Supplied ECG art in the lead placement game

Both cases now use the supplied medical illustration in the existing six chest-lead
placement stage. The game continues to use the original case grading rules: Case 1
is demo-graded on Confirm, while Case 2 is ungraded practice.

## Source and registration

`scripts/export-ecg-play-assets.py` exports from `art/medical-illustration/raw/04_EKG_แก้.ai`
using Pillow, pypdf and pypdfium2. It preserves the original image placement transforms.

- Artboard 1, optional-content group `MC4`: torso **and** rib overlay, without the
  baked answer labels or colored landmark markers. The previous torso-only extraction
  omitted the separate rib image.
- Small source marker images `Im63, Im61, Im59, Im57, Im55, Im53`: normalized target
  coordinates for V1 through V6, mapped through the same torso crop.
- Artboard 2: each cable is exported separately, with a separate electrode-head
  crop for the playable tokens. This artboard has a different size and transform;
  source image pixels must not be treated as page-render pixels.

The source SHA256, crop `(985,267,2368,1440)`, output dimensions and marker IDs are
recorded in `src/game/suppliedECGArt.json`. Exports live in `public/assets/ecg/play/`.
Run the export script from any directory using the repository's Python environment.

`suppliedECGLayout.ts` applies the actual 1383:1173 image aspect ratio and maps the
source markers into world coordinates. Snap radii are limited by the distance to
the nearest neighbor so close source landmarks do not compete for a drop. No
clinical positions were added or corrected; these remain the supplied source's
demo positions pending clinical review.

## Runtime behavior

- Desktop Phaser board: supplied torso, six colored electrode heads, live cable
  paths, and the supplied preparation-item illustrations. The small token bodies
  can be moved; the existing side-panel controls remain available.
- Phone: the same torso and normalized map, 44px position buttons A-F, illustrated
  lead tray, image-following drag feedback and colored connection paths. Keyboard
  selection and returning a lead to the tray are retained.
- Fixed heading line metrics prevent a late-loading Thai web font from moving
  the map underneath a touch gesture.
- Wires are drawn dynamically between the current electrode and tray coordinates;
  the full source cable exports are retained for reuse. This avoids stretching a
  fixed raster cable between moving endpoints.
- Reloading restores tentative placements and their wires. Confirm rejects only
  the wrong Case 1 leads, retains correct ones, and allows retry before continuing.
- Preparation icons are visual references, not new clinical procedure steps. The
  gel and first-aid image files and their extraction definitions were corrected
  because they had been named in reverse. Limb clamps are not substituted for
  chest electrodes; no limb-lead activity has been added in this change.

## Validation

```powershell
npm run build
npm run test:game
$env:CARDIOSIM_BROWSER_CHANNEL='msedge' # optional installed Edge; default is Chromium
npm run test:game:ecg
npm run test:game:case2
```

The ECG browser test covers 1440x900, 1280x720, 1024x768 and 390x844, including real
touch dragging on the phone, swapped leads, correction, Confirm, reload/resume,
keyboard placement/removal on mobile, and transition to ECG interpretation.
Screenshots are in `screenshots/bedside-ecg-*` (Git ignored). Game unit tests also
check distinct source target drop regions and restored lead identity. The full
Case 2 test checks the ungraded flow through the web post-test return.
