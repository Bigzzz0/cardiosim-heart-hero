# CardioSim care UI delivery — 17 October 2026

Built on `eca1c21` using `game-ui-frontend` and `design-ui-ux-game`. Human usability testing is still pending; automated checks cannot substitute for it.

## Delivered behavior

- Result uses a readable paper/enamel surface, clear demo/practice status, time and expandable statistics/findings. Case 2 has no clinical score. Previously conflicting Result rules were removed from the legacy stylesheets.
- One local action advances or confirms the active activity. The duplicate HUD arrow was removed. Thai labels identify the action; the mission presentation and action policy share a typed adapter.
- Decision cards show their assigned destination, remain reusable where the configured rules permit it, and can be removed without scoring a mistake. Placement stays separate from confirmed validation.
- Portrait workbenches reserve space for the patient's face. The camera focus comes from room presentation configuration. Source objects and targets remain together during dragging; document reading may scroll separately.
- Medication uses seven configured mechanical steps: order/allergy review; ampoule inspection; equipment collection and an explicit aseptic acknowledgement; direct syringe plunger; order recheck and label placement; wristband/file review; monitor/MAR record. No injection technique, infusion timing or new medical answer was added.
- Missing label information and patient identifiers are explicitly marked as missing. The identity activity records review of incomplete data, not successful clinical identification. Case 2 retains its missing-order acknowledgement and has no medication preparation props.
- Briefing no longer autosaves over an existing resumable checkpoint; a delayed-Resume browser test waits beyond the five-second autosave interval.
- Workbench inspection/placement actions are drafts until step confirmation. They do not score merely because an object was moved. Checkpoints preserve completed steps and valid current object state; old current-step formats restart only the current action.
- ECG phone callouts use neutral position identifiers A–F; V1–V6 remain on the leads. Hint leader lines are contextual. Unconfirmed placement remains blue/neutral and validated placement has a distinct state. Existing clinical coordinates, six leads, retry and Confirm rules remain configuration-driven.
- Chart, Pause and briefing use the shared materials. Chart and Pause trap keyboard focus and restore it when dismissed. Opening either pauses the engine. Tool pickup/contact, card placement and workbench object actions retain mute and reduced-motion support.

## Validation commands

Run after the related milestone and again for the final integrated version:

```text
npm run typecheck
npm run build
npm run test:game
npm run test:game:browser
npm run test:game:polish
npm run test:game:objects
npm run test:game:ui
npm run test:game:layout
npm run test:game:ecg
npm run test:game:workbench
npm run test:game:resume
npm run test:game:case2
```

The polish suite measures rendered primary Result text contrast (at least 4.5:1), unscored Case 2, details expansion, private Chart, and modal keyboard focus. Object tests exercise the seven preparation steps at 1440×900, 1280×720, 1024×768 and 390×844 with mouse/touch, source/target visibility, retry and keyboard plunger input. Full browser flow covers both cases through Post-test return. Screenshots are under `screenshots/polish-*`, `screenshots/bedside-*` and `screenshots/game-*`.

## Five-player usability protocol — pending

Use five new participants. Give only: “Start the case, examine the patient, then complete the first decision.” Do not explain dragging, answer slots or Confirm before the participant tries. Use existing demo data; do not evaluate clinical competence.

| Participant | Device | First drag without coaching | First decision without coaching | Hesitation / misunderstanding | Input error | Needed help |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

Record time to first successful drag and whether the player finds the next action. Aim for at least four independent completions out of five. If two people encounter the same obstacle, fix it and repeat that part with new participants. Until this is done, report “system and visual tests passed; human usability test pending.”

## Content limitations

Clinical values and answer keys retain the existing demo status. Conflicting source details have not been resolved by inventing clinical data. The original teaching/test pages and canceled stash were not changed. No new raster assets were generated.

## Verification record — 17 October 2026

- Latest typecheck and production build passed. Build retains the existing large Phaser-chunk advisory.
- All nine engine tests passed, including object drafts, Confirm gating, decision removal and checkpoint migration.
- Result/Chart/Pause checks passed for both cases at all four target viewports; measured primary Result text contrast meets 4.5:1.
- Delayed Resume and touch-cancel regression tests passed for both cases.
- Object, assessment, layout, syringe and ECG browser suites passed during implementation. Actual canvas/overlay screenshots were inspected, including portrait syringe, portrait decision board and desktop Result.
- Human five-player usability testing has not been performed. The protocol above is ready for the team.
- Final integrated headless browser run passed: desktop drag/retry, Chart privacy, Case 1 worksheets/medication/treatment, emergency/ABC, six ECG leads, portrait touch/procedure layouts, and complete Case 2 from original web selection through typed Post-test return.
