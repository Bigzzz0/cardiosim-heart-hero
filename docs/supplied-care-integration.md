# Supplied documents and emergency artwork

Pre-test and post-test reuse the supplied blank clipboard/pen illustration, with a responsive paper frame. Questions, answers, navigation, scoring and submission remain the existing HTML/React controls. Selected answers now expose `aria-pressed` for assistive technology.

The medication station's expandable Doctor Order uses the supplied record-folder image and a readable HTML document. Inspection objects and missing-data documents use the same stationery. Case 2 still offers only acknowledgement of unavailable order information; no drug, dose, allergy status or answer key is added.

Emergency transition and HUD use the supplied `crisis-alert-scene.webp`. The transition illustration disappears upon entering ABC. The small HUD indicator remains while the existing alarm is active. Artwork intercepts no pointer input and introduces no new flashing animation. Existing pause, transition, timer and recovery behavior are unchanged.

Assets are referenced through `ASSETS.handover` and were previously exported from `03_รับข้อมูลผู้ป่วย_แก้.ai`. These are adaptations of the blank source stationery to responsive HTML, rather than text flattened into a full-screen image.

Validation: `npm run build`, `npm run test:game`, `npm run test:game:care`. The browser test uses installed Edge by default (override `CARDIOSIM_BROWSER_CHANNEL`), and covers both complete quizzes, keyboard answer selection and navigation persistence, order inspection, missing-order acknowledgement, emergency transition/pause and unobstructed ABC targets at 1440, 1024 and 390 pixels. Screenshots are saved under `screenshots/supplied-care`.
