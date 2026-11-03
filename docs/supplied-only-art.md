# Current artwork policy: supplied medical illustrations only

This replaces the earlier mixed bedside-art integration. Game illustrations must come from the user's supplied Illustrator/PSD files under `art/medical-illustration/raw`. Do not restore generated bedside assets or Atomic Realm props as fallbacks.

| Area | Current source |
| --- | --- |
| Cover, login, case cards/buttons | Supplied 01/02 Illustrator files |
| Room, both patients, bed and pillow | Supplied 03 room and layered patient PSD |
| Monitor, stethoscope, syringe, magnifier, toolbar, stationery, emergency | Supplied 03 Illustrator file |
| ECG torso, electrodes, prep equipment | Supplied 04 Illustrator file |
| BP / SpO₂ illustrations | Absent from the supplied pack; plain labelled controls and drag labels |
| Ampoule, separate needle/pad/wristband/label illustrations | No matching separate illustrations; plain labelled controls |
| App/browser icon | The image separately supplied and explicitly selected by the user; retained |

Both cases reuse the only registered layered patient illustration supplied. Case text, identity, age, vital signs and grading are unchanged; no second patient is invented or generated. A distinct Case 1 character requires a new supplied illustration.

The syringe uses the complete supplied image. Since no separate plunger layer was supplied, volume adjustment is an HTML slider/drag control beneath it. Engine validation, keyboard/drag adjustment, cancel rollback and Confirm behavior remain intact. Generic interface icons, text, input controls, graph traces and connection lines remain functional UI.

Retired generated and third-party runtime images were moved from `public` into `art/retired-runtime` for history. They are not copied into the production site. Earlier generation documents are historical.

`docs/supplied-runtime-assets.json` records the manually reviewed source and SHA-256 hashes for every shipped image (including duplicate supplied exports). `scripts/export-supplied-runtime-manifest.py` records this mapping and refuses unknown image groups. `suppliedAssets.test.ts` checks all public images, source hashes, exported hashes and registry/case references. These checks prevent accidental changes; provenance assignments are based on source-file inspection and export scripts.

Validation: build, game unit/provenance checks, patient drag/resume checks and full-flow browser checks. Production `dist` images are also compared against the manifest so archived generated images cannot remain in the published bundle.
