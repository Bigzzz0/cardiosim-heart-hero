# Bedside image generation prompt set

Built-in image_gen, one request for each asset below; no retries or regenerated variants. This is the production prompt specification used for the set. Exact generated source filenames are recorded in cardiosim-bedside-generation.json. Actual dimensions, alpha and master hashes are recorded in cardiosim-bedside-art.json.

Common art direction: original white-and-sky-blue illustrated hospital browser game; fine blue-grey outlines, softly painted dimensional shading, upper-left illumination, readable silhouettes. No text, numbers, medical values, logos or UI baked into imagery. All cutouts request a genuinely transparent background, full object in frame and no background/glow/shadow plane. Room is the only opaque background.

| Asset | Asset-specific prompt specification / reference |
|---|---|
| bedside-room | Landscape hospital background; empty centered reclined bed, near-frontal camera with slight side angle, elevated head end, blue pillow, low near rail, soft window light, cabinet on right, space on left for code-rendered monitor. No person or labels. Master visual direction. |
| patient-01 | Room used as style/perspective reference. Thai adult woman around 39, brown medium-length hair, blue gown, mildly breathless/concerned expression, front-facing semi-reclining pose; exposed upper arms, separate forearms and hands beside hips; blue blanket below waist to feet. No bed/pillow in cutout. |
| patient-02 | Patient 01 used as pose/silhouette/style reference. Older Thai woman around 65, short silver-grey hair and facial age lines. Same gown, blanket, hand positions, framing and lighting. |
| stethoscope | One isolated blue-tubed stethoscope, silver chestpiece lower left, earpieces at top, loosely curved tubing, readable toolbar silhouette. Room used as illustration-style reference. |
| cuff | One blue blood pressure cuff curved into a short open cylinder as if wrapped around an upper arm, no arm inside, velcro edge and short descending tube; no gauge, labels or numbers. |
| sensor | One white/blue fingertip oximeter clip, slightly open jaws, fingertip opening left, three-quarter view, blank dark display; no finger or hand. |
| assessment-hand | One blue nitrile-gloved right hand with index and middle fingers together extended lower left, other fingers naturally bent, short wrist entering upper right; five-finger anatomy, no patient. |
| syringe-body | Horizontal orthographic syringe barrel and needle only; needle points left, open barrel right, pale blue hub, clear barrel, finger flange. No plunger, ticks, liquid or numbers; these are separate runtime layers. |
| syringe-plunger | Horizontal orthographic plunger only; rubber piston seal left, pale-blue rod to right, oval vertical thumb-rest at far right. No barrel, needle or scale. |
| ampoule | Upright glass ampoule with blue highlights, sealed narrow neck and rounded tip, blank paper label; no drug names, writing or liquid-level marking. |
| bedside-clipboard | Top-down muted blue clipboard with metal clip and one ivory blank paper sheet, contact shading on the board; no writing, charts or lines. |
| ecg-body | Neutral adult front torso schematic, base of neck to waist with shoulders and upper arms, subtle collarbone/rib contours. No electrodes, dots, text or placement guidance. Illustration only; targets remain configuration data. |
| electrode | One round white adhesive ECG pad with metal snap and short blue connector stub, viewed from above, readable at 30px. No skin, labels or extended wire. |

Runtime processing only exports PNG masters to WebP. No regeneration or image-model edits were used to repair outputs. Patient distress/recovery uses the same aligned patient images with state-driven tint, breathing and scene lighting. AI torso art does not certify the configured lead positions.
