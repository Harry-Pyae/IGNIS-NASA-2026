# IGNIS pitch video — reuse guide

A Remotion project, separate from the app (own `package.json`; root lint ignores `video/`; nothing here is in the
app build or CI). Two compositions share every scene: **IgnisFilm** (~2:01, 1920×1080, 30 fps) and **TrailerCut** (~44 s).

**The contract:** one data file and one media folder drive everything.

| What | Where |
|---|---|
| Every word, number, path, timing, caption, credit | `src/data/video.data.ts` (typed by `src/types.ts`) |
| Every real clip and still | `public/real/` (see its README for the exact file list) |
| Art pack + fonts | copied from the app's `public/art` and `public/fonts` on every run (never edit copies) |

Scenes (`src/scenes/*`) take props from the data file only. A scene that needs new content gets a new field in
`types.ts`, never a hardcoded string.

## The 5-step swap (dummy → real)

1. **Data:** fill `src/data/video.data.ts`. Every `TODO(...)` is a required field (list below); replace each with the
   real value. Science comes only from verified, published cards (copy values exactly, units as written; `null` = not
   reported). Approved copy is imported from `src/lib/copy.ts`, so leave those lines alone. Script lines (beats, labels,
   captions) come from `SCRIPT-DRAFT.md` once R3 has signed it off.
2. **Media:** put the recordings and stills in `public/real/` with the names the data file uses
   (`public/real/README.md`). Stills and footage need an Approved row in `docs/media-ledger.md`.
3. **Check:** `npm run check:no-dummy`. It fails on `isDummy: true`, any `placeholder/` path, any TODO left, any missing
   media file, an empty map, captions outside the timeline, or product UI under 50% of either cut. Fix until it says `OK`.
4. **Render:** `npm run render` writes `out/ignis-film.mp4` and `out/ignis-trailer.mp4`. It runs the check first and
   refuses to render if it fails. The render itself also re-checks and stops on any missing file (never a fallback).
5. **Verify:** watch both files end to end against the checklist below.

Use `npm run studio` to preview the real data while you fill it (the Studio shows the same error list until it passes).

### Verify checklist

- [ ] No watermark anywhere (it appears only when `isDummy` is true).
- [ ] Every card value matches its published card in `/curate` / `/api/export`: ID, material, O₂, airflow, pressure, outcome, reviewer.
- [ ] The quote is verbatim, its locator and source ID match the card, and the URL opens the reviewed source.
- [ ] Map: tested cells, gap and scenario marker match the live app for the mission case (`limit.map.source`).
- [ ] Nothing says "predict", "will burn" or "would burn"; absence is always bounded to the current IGNIS catalog.
- [ ] The limit scene is completely still once the UNTESTED block appears.
- [ ] Every art-pack image is captioned "Illustration — not NASA experiment imagery." where it is shown; no NASA insignia anywhere.
- [ ] Credits list every NASA source and footage item shown on screen; licence line is right.
- [ ] Burmese subtitles (`my`) only on captions R3 reviewed in `docs/MY-REVIEW.md`.
- [ ] Captions are readable over the footage and never collide with on-screen text.
- [ ] Product UI ≥ 50% of the film (the check prints the share).

## Fields the real version needs (51 checks left today)

Run `npm run check:no-dummy` for the live list. As of this build:

| Field | What goes in it | From |
|---|---|---|
| `problem.beats[0..1]`, `problem.question` | The problem lines and the question | Pitch script (R3, A approves) |
| `product.clips[0..3].label`, `product.trailerClips[0..2].label` | One label per recording (what the viewer sees) | Demo script (R3) |
| `product.*Clips[].durationSec / trimStartSec` | Cut lengths and in-points (prefilled 15 s / 7–8 s) | The recordings |
| `evidence.heading` | Heading over the three cards | Pitch script |
| `evidence.stats[0..1].value` | Verified card count, campaign count | `/api/export` at render time |
| `evidence.scenario[0..2].value` | Mission-case material, O₂, airflow (units as entered, or `null`) | The confirmed scenario in the app |
| `evidence.cards[0..2]` `id`, `material`, `rows[].value`, `outcome`, `outcomeLabel`, `verifiedBy` | Three verified cards (`outcome` is prefilled `sustained`: set it) | Published cards (R1) |
| `evidence.cards[].still` | Optional approved still per card (`null` = text card) | Media ledger (R2 + R1) |
| `evidence.quote.text / locator / sourceId / url` | One verbatim quote from one of the three cards | That card's source fields |
| `limit.map.tested / gap / scenario / source` | The mission case's map cells (15 × 16 grid = app GRID) and where they came from | Live app, mission case |
| `coldOpen.exteriorFootage` | Optional NASA exterior clip + credit (`null` draws the captioned illustration) | Media ledger (R2) |
| `end.credits[]` | One line per NASA source / footage item shown | Cards + media ledger |
| `captions.film[]`, `captions.trailer[]` | EN lines with times (s); `my` only when R3-reviewed | VO script (R3) |
| `timeline.film / trailer` durations | Prefilled; retime to the VO | Editor |
| media files | `public/real/product-01…04-*.mp4`, `public/real/mission-guided.mp4` | Screen recordings of the live app |

Already filled (real): title, tagline, art paths, illustration caption, labels, map axes/ticks/grid, UNTESTED label,
honesty line (`COPY.gapNote`), mission heading and the five step names (`docs/demo-script.md`), team name, live URL,
patch ribbons, licence line.

## Dummy preview (local only, never committed)

`video/dummy/` is gitignored: dummy data, placeholder media, preview renders and QA tools stay on the machine that made
them. If it's missing, the real path still works; the dummy is only a preview.

- `npm run render:dummy` → `dummy/out/ignis-film-PREVIEW-dummy.mp4` + `ignis-trailer-PREVIEW-dummy.mp4`.
  1440p: append `-- --scale=1.3333333333333333 --crf=18` (works for `npm run render` too)
  (watermarked "PREVIEW — PLACEHOLDER DATA" in two corners + a diagonal band on every frame).
- `npm run studio:dummy` to preview; `node scripts/run.mjs stress studio` for the 2×-length text variant.
- `node dummy/make-placeholders.mjs` regenerates the placeholder slates; `dummy/recorder/` (README inside) re-records the
  app on the throwaway local DB with DEMO cards at 2560×1440. Never point it at production.
- Removing it: delete `video/dummy/`. Nothing in `src/` imports it (the data file is picked by `IGNIS_VIDEO_DATA` in
  `remotion.config.ts`, default `real`).

## Notes

- **Browser:** Remotion downloads its own headless Chrome. If that's blocked, point it at an installed Chromium:
  `REMOTION_BROWSER="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" npm run render`.
- **Audio:** none, on purpose. VO and music go on in an editor, timed to `timeline` + `captions`.
- **Transitions:** see "Transitions and backdrop" below.
- **Overflow:** text blocks sit in `<Fit>`, which shrinks content (never grows it) to fit its box; tested with every string doubled.
- Node 24 (`.nvmrc`); `npm ci` inside `video/`.

## Transitions and backdrop (presentation only)

The film lives in one continuous space: `src/components/SpaceBackdrop.tsx` (3 parallax star layers + faint nebula)
sits behind every scene, and each scene's mood (`MOOD` in `src/transitions/journey.ts`) sets its drift and light.
The gap scene has the lights down and almost no drift.

Every scene is entered by its own transition, picked and retimed in **`src/transitions/journey.ts`** (scene code never
changes). Each one keeps the data file's `transitionSec` gap, so the timeline and caption times don't move; its
`preSec` / `postSec` handles overlap the neighbouring scenes instead. A transition owns three things
(`src/transitions/types.ts`): how the outgoing scene leaves, the overlay, and how the incoming scene arrives. The gap
scene only ever gets opacity (`SceneFrame` drops any transform there).

| Into | Type | Impl | 2.5D ms/frame | 3D ms/frame | Plain cut | 3D over baseline |
|---|---|---|---|---|---|---|
| problem | warp jump | 2.5D | 91 | n/a | 97 | n/a |
| product | airlock dock | **3D** | 232 | 156 | 131 | +25 |
| evidence | corridor dolly | **3D** | 164 | 174 | 146 | +28 |
| limit | power-down drift | 2.5D | 83 | n/a | 120 | n/a |
| mission | orbital swing | **3D** | 154 | 133 | 137 | ≈0 |
| end | dimension fold | 2.5D | 168 | n/a | 131 | n/a |

Measured 2026-11-13 on the dev laptop: 1080p, one tab, JPEG frames, Edge + ANGLE, single run (noise ≈ ±20 ms;
see the negative "warp" / "power-down" deltas). **Fallback rule:** a 3D entry switches to `impl: '2.5d'` if its cost
over the plain cut exceeds 33 ms/frame (the 30 fps frame budget) or if WebGL fails to draw. None did.
Re-measure with `node dummy/transitions-qa.mjs bench` (local tool). The `transitions/T-*` compositions in the Studio
show each transition alone, per implementation, plus `-none` (the plain-cut baseline).

3D deps (`@remotion/three`, `@react-three/fiber` 8 for React 18, `three`) render with `--gl=angle`
(`remotion.config.ts`).
