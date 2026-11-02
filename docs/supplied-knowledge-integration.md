# Knowledge sheets

The supplied ZIP and committed raw artwork contain sets 01–04 and the patient PSD. The separately listed `05_Templateใบความรู้` is absent. Until that source arrives, the knowledge hub adapts the existing supplied clipboard/pen illustration with a responsive paper frame; it does not claim to reproduce template 05.

All six topic titles, descriptions and review points come from `learningVideosData.ts`. This change adds no clinical lesson text, drug information, video URL or answer key. The former timer-driven simulated video is replaced by readable topic summaries and explicit review buttons. Progress counts distinct topics marked by the learner; selecting, reviewing and undoing review are separate operations. Completion remains optional before case selection, as in the previous hub. Review state lasts for the current visit and is not represented as video viewing or saved research telemetry.

On mobile, choosing a topic moves to its sheet heading with space below the sticky app header. Topic buttons, review buttons and previous/next controls support keyboard interaction. The progress element and pressed states expose the same state to assistive technology.

Validation: `npm run build`, `npm run test:game`, and `CARDIOSIM_BROWSER_CHANNEL=msedge npm run test:entry` (use your shell's environment syntax). Entry checks exercise all six sheets, review/undo counts and both case launches at 1440, 1024, 768 and 390 pixels. Screenshots are under `screenshots/illustrated-entry/*-knowledge-*.png`.

The full `test:game:browser` check also passed using Edge: Case 1 assessment, chart privacy, decisions, medication workbench, I/O, emergency/ABC, ECG and result; mobile touch/ECG checks; and the complete Case 2 flow through its unscored result and typed Post-test return. This script now accepts the same optional `CARDIOSIM_BROWSER_CHANNEL` override as the focused checks.
