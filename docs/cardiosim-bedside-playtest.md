# Bedside game pass — verification and moderated playtest

Baseline: 8a1e812. The cancelled October stash is untouched. Existing case values, correct answers, ABC sequence, clinical statuses and Post-test bridge are retained. ECG has six leads and now checks a submitted set on Confirm. Case 2 remains ungraded and does not fabricate an order, vitals or ECG interpretation.

## Implementation

- RoomPresentation owns background, patient and camera framing. The generated patients share the frontal reclining pose; their own blanket and the bed image supply occlusion. Distress uses aligned tint and state-driven breathing, without generating new clinical findings.
- Actual mouse/touch dragging is primary; a click/tap selects a tool without attaching a ghost to the cursor. Enter and keyboard shortcuts use the same resolver. The chart records only when the configured examination completes.
- A visual route demonstrates the first real history interaction. It disappears on selection/drag/completion; reduced motion hides its moving dot.
- Syringe barrel, piston and fluid are independent layers. The piston grip has role=slider, pointer capture, cancel rollback, arrow/Home/End controls and +/- alternatives. Correctness is deferred until Confirm.
- ECG placements and validated leads are separate checkpoint fields. Placement never scores. Confirm retains correct leads and returns wrong ones. Old active ECG saves restart placement while retaining discovered chart entries and prior mission completions.
- Backgrounds remain in PatientRoomScene; input maps through shared presentationCoordinates. UI hit areas cancel patient-tool drops. No case ID condition is added to the scene.

## Automated commands

- npm run typecheck
- npm run build
- npm run test:game
- npm run test:game:ui — four viewports, first mouse/touch drag, contact feedback and chart timing
- npx tsx scripts/test-game-bedside.ts — physical syringe mouse/touch, keyboard, retry and Confirm at four sizes
- npx tsx scripts/test-game-ecg.ts — swapped tentative leads, Confirm, retry and advancement at four sizes
- npm run test:game:layout — unobstructed wrist, visible patient face and touch/keyboard decision retry at four sizes
- npm run test:game:browser — two-case regression including chart, medication, I/O, ABC, ECG, recovery, result and typed Post-test return

All browser launches are headless and Vite open=false. Captures are under screenshots/ and are not source assets. Generated PNG masters are in art/bedside/masters; public/game/bedside contains ~1.5 MB of runtime WebP artwork. Re-export with scripts/export-bedside-art.py (Pillow). Image manifest and generation provenance are in the sibling art documents.

## Five-player test — not yet conducted

Recruit five people who have not seen the game. Do not tell them the drag gesture or the first target. Read only: “เริ่มเคส ตรวจผู้ป่วย แล้วไปต่อจนจบ ช่วงใดไม่แน่ใจให้พูดสิ่งที่กำลังคิดออกมา”. Observe without coaching; record requests for help.

| Participant | First drag without help | Next mission without help | Medication difficulty | ECG difficulty | Repeated misunderstanding / time |
|---|---|---|---|---|---|
| P1 | pending | pending | pending | pending | pending |
| P2 | pending | pending | pending | pending | pending |
| P3 | pending | pending | pending | pending | pending |
| P4 | pending | pending | pending | pending | pending |
| P5 | pending | pending | pending | pending | pending |

Accept the first interaction when at least four of five independently drag and advance. Fix any obstruction or misunderstanding observed in at least two participants and repeat that task with fresh participants. Automated passing results do not establish this usability criterion or clinical certification.

## Verification outcome

Typecheck, production build and six engine tests passed. The full two-case browser flow passed through typed Post-test return. Final four-size layout, workbench and room interaction suites passed after the last layout corrections. ECG swap/Confirm/retry passed at all four sizes. Captures were inspected for room, tool contact, medication, decision board and ECG. Five-player usability testing remains pending; no participant results are claimed.

Audio follows configuration: auscultation cue starts during the configured examination, placement uses a contact cue and ECG success is only sounded after Confirm. Missing Case 2 respiratory data does not inherit the Case 1 auscultation cue.


## Illustrated monitor and decision workspace — 2026-10-16

- Replaced the CSS monitor shell/pole/oval foot with a bespoke SVG enamel housing, alarm lamp, controls and wheeled stand. Readings remain live HTML/canvas, outside the illustration.
- Combined repeated mission headings/instructions into one clipboard header; longer guidance opens under “วิธีเล่น”. Discovered evidence remains expandable and is never filled from undiscovered findings.
- Cards use a two-by-two source tray on desktop and a single column on phones. Answer slots are numbered; grading/locking still happens only after Confirm.
- Hint/Chart and Confirm share the fixed bottom rail. Routine selection/resume messages no longer duplicate the visible task; hints, errors, confirmed results and missing-data confirmation remain available.
- Extended layout checks to require every answer card and slot to fit inside the paper at all four viewports, plus the SVG shell and no horizontal page overflow. Mouse/touch/keyboard behavior uses the existing engine.

Validation for this UI revision: typecheck, production build, six engine tests, four-viewport layout/real-touch/keyboard checks, and the full two-case browser flow all passed headlessly. Human usability testing remains pending.
