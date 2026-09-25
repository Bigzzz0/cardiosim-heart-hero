# CardioSim game coverage by storyboard

The game entry point is `game.html`. It keeps Normal and Emergency Stage in the same `PatientRoomScene`; the learning pages, pre-test, post-test and survey remain in the existing web app.

| Storyboard | Game flow | Implementation |
|---|---|---|
| Page 3 · patient handover and assessment | Case briefing, patient history, hidden-until-found Patient Chart, stethoscope, BP cuff and SpO₂ interactions | `CASE_INTRO`, `PATIENT_INFORMATION`, `ASSESSMENT`; Case data is in `src/game/cases/` |
| Page 4 · prioritization and care | Drag or tap answer cards into the diagnosis and nursing-care board; confirm and retry | `DIAGNOSIS`, `NURSING_INTERVENTION`; Case 1 demo keys and Case 2 ungraded practice are configuration-driven |
| Page 5 · medication, I/O and deterioration | Order worksheet, I/O worksheet, then in-room Emergency transition with changing patient state, monitor alarm and vitals | `MEDICATION`, `IO_BALANCE`, `EMERGENCY_TRANSITION`; missing Case 2 order and numbers remain blank |
| Page 6 · emergency assessment and ECG | Ordered A → B → C assessment and V1–V6 drag-and-snap ECG board | `ABC_ASSESSMENT`, `ECG_PLACEMENT`; lead positions are stored in each case configuration |
| Page 7 · response and result | ECG note/interpretation, response choice, gradual stabilization and mission result | `ECG_INTERPRETATION`, `EMERGENCY_TREATMENT`, `PATIENT_STABILIZED`, `CASE_SUMMARY` |

Case 1 clinical values, worksheet answers and response sequence are marked as demo-derived from the existing project content and still need clinician review. Case 2 uses only the existing scenario summary; absent vitals, ECG results, orders, treatment details and answer keys are not displayed or clinically graded. Finishing a game launched from scenario selection returns the player to the existing Post-test with a typed `GameResult` in session storage.

The browser and game test entry points are `npm run test:game` and `npm run test:game:browser`. Visual QA screenshots are saved under `screenshots/`.
