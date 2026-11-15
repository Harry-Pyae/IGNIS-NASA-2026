# public/real — the real media folder

Starts empty. Every file the data file (`src/data/video.data.ts`) references goes here, at exactly that path.
A missing file stops the render with `missing media file: …`. Nothing ever falls back to a placeholder.
Media files are gitignored (size); share them through the team drive and record each one in `docs/media-ledger.md`.

| File | What it is | Who | Rules |
|---|---|---|---|
| `product-01-scenario.mp4` | Screen recording, live app (`ignis-nasa-2026.vercel.app`): describe the scenario → parse → confirm inputs | Coder A / R3 | 1920×1080, 30 fps, ≥15 s, real verified catalog only, no dev tools or cursor clutter |
| `product-02-matches.mp4` | Matched NASA experiments: cards, match explanations, evidence map | Coder A / R3 | same |
| `product-03-source.mp4` | Open one card → quote → locator → the NASA source URL | Coder A / R3 | same |
| `product-04-brief.mp4` | The Mission Brief: OBSERVED / SUPPORTED claims, the UNTESTED block | Coder A / R3 | same; keep the Brief still in the recording |
| `mission-guided.mp4` | The guided mission (needs `MISSION_CASE` live), all five steps | Coder A / R3 | same, ≥10 s |
| *(optional)* `exterior-*.mp4` | NASA station-exterior footage | R2 | ledger row = Approved; set `coldOpen.exteriorFootage` with its credit line |
| *(optional)* `still-*.jpg` | Card stills (campaign context) | R2 + R1 | ledger row = Approved, same image as the card's `media_url` |

Trailer clips reuse these files with their own trims (`product.trailerClips`), so they need no extra files.
Art and fonts are NOT here: `scripts/run.mjs` copies them from the app's `public/art` and `public/fonts` on every run.
Never put art-pack images in an evidence slot, and never NASA insignia anywhere.
