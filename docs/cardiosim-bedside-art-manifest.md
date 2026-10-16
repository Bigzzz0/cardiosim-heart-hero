# Bedside art pass — 16 October 2026

White/sky-blue illustrated hospital, soft painted volume, consistent dark blue-grey linework. One generation per new asset; no retries of the same asset. Original source packs and cancelled stash are not inputs. Clinical labels and values remain code/configuration.

| Key / runtime filename | Role / requested artboard | Pivot and contact | Generation |
|---|---|---|---|
| bedside-room.webp | 1536×1024 empty hospital room and reclined bed, near-frontal view | centered bed, mattress behind patient; depth 0 | generated once; integrated |
| patient-01.png | 1024×1536 transparent adult woman in blue gown, reclining, arms beside torso, blanket below waist | center; mapped to current head/chest/arm/wrist/finger anchors; depth 3 | generated once; integrated |
| patient-02.png | 1024×1536 transparent older woman, matching pose and view | same as patient 01 | generated once; integrated |
| stethoscope.png | 1024 square transparent illustrated stethoscope | center; chestpiece contact separate metadata | generated once; integrated |
| cuff.png | 1024 square transparent blue cuff, curved to wrap arm | center; arm contact | generated once; integrated |
| sensor.png | 1024 square transparent fingertip clip sensor, open jaws | center; finger contact | generated once; integrated |
| assessment-hand.png | 1024 square transparent gloved examining hand | finger pads; assessment contact | generated once; integrated |
| syringe-body.png | 1536×1024 transparent horizontal barrel and needle, no plunger, no labels | axis horizontal | generated once; integrated |
| syringe-plunger.png | 1536×1024 transparent horizontal plunger, seal at left, thumbrest right | seal left, shared instrument axis | generated once; integrated |
| ampoule.png | 1024 square transparent ampoule, blank label | bottom center | generated once; integrated |
| bedside-clipboard.png | 1024 square transparent clipboard with blank sheet | center; code places readable content | generated once; integrated |
| ecg-body.png | 1024 square transparent neutral front torso schematic without marks/text | center; lead coordinates remain configuration only | generated once; integrated |
| electrode.png | 1024 square transparent single adhesive chest electrode | center | generated once; integrated |

Patient distress/recovery uses the same aligned artwork with code-controlled tint, expression accents, lighting and breathing from patient state. Separate critical assets are optional only if existing art cannot represent state; no clinical findings are created by illustration.

Bed/blanket occlusion uses an authored foreground shape matched to the image and the patient's own blanket, rather than independently generated misaligned bed layers. The runtime presentation configuration owns every placement. Transparent PNG masters stay under public/game/bedside; room runtime WebP is exported without repainting.

Prompts and generated source paths are recorded alongside this manifest as generation finishes. All requests use the built-in image generation tool. No images from Cozy UI are used or supplied as generation inputs.

PNG masters: `art/bedside/masters`. All runtime paths use matching WebP filenames under `public/game/bedside`. See `cardiosim-bedside-art.json` for hashes and `cardiosim-bedside-generation.json` for built-in generation paths. No asset was regenerated. Critical/recovering states reuse aligned patient art with config-driven tint/breathing, not separate generated poses.
