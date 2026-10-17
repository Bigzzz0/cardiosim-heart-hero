# CardioSim UI/UX review — 17 October 2026

## Basis and limits

Reviewed the current committed game, `eca1c21`, using `game-ui-frontend` and `design-ui-ux-game`. Evidence: the latest four-viewport layout screenshots, medication touch screenshot, ECG phone screenshot, result screenshot, and the corresponding React components/styles. This is a visual and code review, not a new browser playtest or a five-person usability study. No clinical content or game behavior was changed.

The first skill supplies visual hierarchy, thematic materials, playfield protection and contextual disclosure. The second supplies action feedback, consistent state, interactive onboarding and accessible input. Both favor showing the information needed for the current action.

## Direction

Retain the illustrated white/blue hospital and Phaser/React boundary. Give each surface a role: a restrained HUD, enamel equipment, a physical instrument tray, and paper for discovered evidence. Use one clearly emphasized action at a time. More borders, repeated labels and constant animation would add noise.

## Prioritized findings

### P0 — Result readability

Evidence: `screenshots/game-result.png`; `MissionResultCard.tsx`, `storybook.css` and legacy result rules. The dark outer result surface, pale metric blocks and light metric text do not form a coherent theme. The title and several values are visibly difficult to read. Exact contrast ratios have not yet been measured.

Change: use one paper/enamel result treatment, dark readable text, a clear completion heading, a compact set of primary statistics, and expandable details. Keep demo/practice status adjacent to the score and keep the correct Post-test action when the game was launched from the teaching site. Do not imply clinical validation.

Acceptance: measure contrast against the actual rendered backgrounds; target 4.5:1 for normal text and 3:1 for large text. Score/practice status, time and next action must be readable on all four viewports. Show the patient before the summary opens, without changing configured recovery effects.

### P1 — Mobile workbench preserves patient context

Evidence: medication and diagnosis phone screenshots. A tall sheet covers almost the whole patient; the medication view is scrolled into a stack of order, overview, step, instruction, workbench and readout.

Change: reserve a compact visible patient/status area. In medication, show one short current-step instruction, the instrument and relevant order fragment. Open the full order/step overview on demand. Keep the full clinical source text accessible; only its presentation changes. Freeze workbench layout while a pointer is held, so a new prompt cannot move the drop target.

Acceptance: the patient face/status, current action, required tool, target and Confirm fit at 390×844 without scrolling during the gesture. Full order remains available. Existing tap, keyboard, cancel and checkpoint behavior is preserved.

### P1 — ECG visual hierarchy and state meaning

Evidence: `screenshots/game-ecg-390x844.png`; `ECGMobileProcedure.tsx`. The torso contains target rings, labeled callout buttons and leader lines, while a second row repeats V1–V6. Green styling is prominent before any placement has been confirmed.

Change: make the torso the dominant work area and the bottom tray the clear source of leads. Use neutral snap anchors by default and contextual callouts for the selected lead or requested hint. Distinguish unplaced, selected, placed-unconfirmed and validated states with shape/text as well as color. Keep target coordinates and clinical limitations in configuration.

Acceptance: all six leads can be moved/removed and submitted without labels obscuring each other; unconfirmed placement must not look clinically approved. Confirm still evaluates the set and returns only incorrect leads. Preserve accessible target selection and the demo label.

### P1 — Physical medication interaction

Evidence: medication screenshot and `SyringeWithdrawalMinigame.tsx`. The plunger is directly draggable, but the ampoule is tiny and visually separate from the needle. Several non-syringe preparation steps still complete through a clickable step/equipment token in `MedicationStation.tsx`.

Change: enlarge the instrument working area and align needle/ampoule contact anchors. Make the plunger grip visually part of the instrument, with a brief directional demonstration on first use. For other preparation steps, use the actual existing order, label or equipment object as the interaction target rather than dragging equipment onto a paragraph. Do not introduce procedures absent from the case.

Acceptance: pickup, contact, use and completion are visually distinct. Liquid and plunger remain synchronized; amount is judged only on Confirm. Missing-order cases must not display or administer fabricated medication. Preserve alternative +/- and keyboard input.

### P2 — Decision cards behave like inventory items

Evidence: `DecisionBoard.tsx`. Assigned options remain visually identical in the source tray. A player must read the slots to determine which source cards have been used.

Change: give assigned source cards a visible “วางแล้ว” state and their destination, without implying correctness. Animate or show a brief transfer from source to slot. Make the selected replacement slot obvious and offer a clear remove/replace action. Do not hide source cards in a way that prevents reuse allowed by the configuration.

Acceptance: before Confirm, players can identify assigned cards, pending slots and how to change an answer. Only confirmed validation uses success styling. Wrong answers remain editable; grading rules stay in the engine.

### P2 — One primary action and consistent language

Evidence: `GameHud.tsx` always renders the top advance arrow; workbenches also provide Confirm/Next. HUD mission titles truncate on narrow screens; Thai and English action labels vary.

Change: use one contextual primary action per interaction mode. During a workbench, prioritize its local Confirm and suppress the redundant top advance affordance. Use short Thai action labels; retain necessary clinical abbreviations. Keep the full mission title available through details. Separate settings from the gameplay hierarchy.

Acceptance: no two prominent buttons compete to advance the same state; disabled actions explain what is still required. Existing keyboard/accessibility paths and source clinical terms remain available.

### P2 — Cohesive materials and typography

Evidence: `styles.css`, `layout.css`, `gameplay.css`, `storybook.css`, `bedside.css`, `instrument-ui.css`. Several generations of theme overrides coexist, and a local UI fix can leave other surfaces in an older palette.

Change: establish tokens for ink, paper, enamel, accent, emergency, selection, success, borders, shadow, type sizes and spacing. Migrate one component family at a time, removing the rules it replaces. Give paper, equipment and controls distinct treatments under the same art direction. Keep normal play centered on the patient.

Acceptance: intro, assessment, workbench, ECG, emergency, Chart, pause and result share the same text/state rules. Main instructions are at least 14 CSS px; important touch controls are at least 44×44 CSS px. No target is covered by HUD or prompt.

## Delivery order

1. Fix Result readability and define the small shared token set; verify all result states, including unscored Case 2.
2. Refine Assessment and Diagnosis as the two reference surfaces: patient context, primary action, inventory state and brief feedback.
3. Apply the same hierarchy to the medication workbench and ECG procedure. Change layout/visual anchors without editing clinical values or correct answers.
4. Bring I/O, remaining decision surfaces, Chart and pause into the same component system; remove superseded CSS rules as each surface migrates.
5. Run typecheck/build/engine tests and relevant headless browser flows after each group. Inspect actual screenshots at 1440×900, 1280×720, 1024×768 and 390×844.
6. Ask five new players to attempt the first drag and first decision without coaching. Record where they hesitate, drag incorrectly or fail to find Confirm. Aim for at least four independent completions; repeated confusion from two players requires another iteration. Automated tests cannot establish this result.

## Scope safeguards

Keep Phaser 3, the shared room, configuration-driven case rules and existing raster assets. No additional image generation is required to fix the findings above. Do not expose undiscovered Chart data or mark missing clinical data as graded. Do not restore canceled work or change the original learning/test pages. Keep browser tests headless.
