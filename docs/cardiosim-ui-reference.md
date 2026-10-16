# CardioSim — bedside UI reference implementation

Reference: user-supplied sketch, 16 October 2026. This change starts from `95a6ca1`; the cancelled October art/content overhaul remains in Git stash. Existing case values, answers, assets and mission flow are retained.

## Presentation

- Full-room Phaser canvas. No surrounding website dashboard.
- White/cream enamel surfaces, sky-blue inset borders, dark illustrated outlines and short offset shadows.
- Top-left capsule contains current mission, phase and step count. Top-right clock and arrow use the same frame. The arrow invokes the same engine action as the mission button and is disabled until that action is allowed.
- Six sockets in a broad lower tray: currently usable tools, decorative empty sockets, Chart and Hint. Empty sockets are not buttons. Tools retain real hold-drag-release and the tap/keyboard alternative.
- Magnifier markers indicate unfinished patient hotspots. Valid targets change emphasis using `InteractionResolver` preview. Phaser draws tool contact and action progress; the DOM marker is positioned by the existing world mapping.
- Mission details remain collapsible. The brief inspection prompt is light and compact; longer decision/activity screens use the same paper/enamel palette.
- Portrait keeps six sockets with short localized labels at 14px, while full tool names remain accessible. Key controls remain at least 44px. No new art is generated in this pass: the source sketch’s illustrated characters/nurse are not reproduced by UI styling.

Implementation: `src/game/storybook.css`, scoped to `.storybook-game`; HUD, tray and marker components remain separate. Clinical configuration and the Case Engine are not modified.

## Testing without opening Chrome

`vite.config.ts` uses `server.open: false`. All Playwright launch calls are headless. Test servers run Vite directly rather than launching npm through a shell; each test owns and stops its own server. Do not open or navigate the user's Chrome for routine tests.

- `npm run typecheck`
- `npm run build`
- `npm run test:game`
- `npm run test:game:browser` — full existing two-case regression
- `npm run test:game:ui` — four viewport screenshots, first action with real mouse/touch, tray bounds/touch sizes, top-arrow navigation

Screenshot evidence: `screenshots/storybook-{intro,room,assessment}-{1440x900,1280x720,1024x768,390x844}.png`.

Local game entry: `http://127.0.0.1:5173/game.html`. Root `/` is the existing teaching website.


Cozy UI is a visual reference only; no pack images are shipped or loaded. CardioSim uses CSS enamel controls and existing Lucide icons. Selected hospital props remain from Atomic Realm; see `docs/cardiosim-supplied-assets.md` for the exact mapping and provider notices. Source pack directories stay local/ignored. Imported images are not used as input to generative image tools. Patient and room illustrations remain the existing ones.
