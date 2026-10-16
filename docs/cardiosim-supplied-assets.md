# Selected assets from supplied archives — 16 October 2026

## Used in this game

| Source | Selected files | Gameplay presentation |
|---|---|---|
| [AR] Hospital Assets - FREE.zip / Atomic Realm | machine_2.glb | Monitor equipment token and ECG console icon |
| Same pack | tray_1.glb | Medication preparation equipment token |

Runtime paths are in `public/game/supplied`. The GLB models are converted to transparent 512px sprites by `scripts/bake_hospital_props.py`; Phaser remains the only game renderer. Original UV colors are preserved, with simple lighting. These images are preparation props, not diagnostic instruments or treatment guidance.

The complete source packs, extra previews and unused original models are not copied into the shipped game. `docs/cardiosim-supplied-assets.json` records file provenance and source hashes. To repeat the model bake, run the Python script against the user's original ZIP; it requires NumPy and Pillow.

## Evaluated, not used

- FREE Healthcare Character.zip contains one faceless nurse illustration (plus macOS metadata duplicates). It is not a finished expression/animation set. No separate license is included in that ZIP. It is not used as a patient or in-room nurse.
- Hospital pack lab machines, operating light, alternative beds/walls: not needed for the current UI pass. They are not substituted into patient anatomy or clinical tasks.
- Cozy UI demo pack: reference only at the user’s request. All eight previously imported PNGs have been removed from public assets. Buttons, arrows, instruction paper and state markers now use CardioSim CSS and the existing Lucide icon system. Original source directories remain untouched.

## Provider notices


Hospital archive includes `2. License.png` and `1. Read Me.txt`: project use/editing is permitted; repackaging/resale/redistribution of the assets is restricted. Credit: Atomic Realm Assets, https://atomicrealm.itch.io . Preserve these restrictions; do not publish the source ZIPs/models as a reusable asset library.

This change applies the selected assets inside CardioSim. It does not create new permission to distribute source packs independently.