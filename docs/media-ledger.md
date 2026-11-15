# Media ledger — R2 with R1 association review

Status: no newly approved assets. A source lead is not a publication authorization.

| Asset / local filename | Original NASA page | Credit / rights | Exact-run or campaign association + evidence | Retrieved / reviewed by | Approved? |
|---|---|---|---|---|---|
| Pyroverse `svs-flame-s4.jpg` | Untraced | Pending | Unproven | Pending | No |
| Pyroverse `svs-iss-orbit.jpg` | Untraced | Pending | Unproven | Pending | No |
| Pyroverse `svs-spherical-flame.jpg` | Untraced | Pending | Unproven | Pending | No |
| Pyroverse `svs-starmap-4k.jpg` | Untraced | Pending | Unproven | Pending | No |

## Audio (video cuts)

Music and voice for the video cuts (the in-app walkthrough has no music) (`docs/video-scripts.md`). A track renders only when its row here says
**Yes**: `npm run cuts:render -- --final` reads this table and refuses an uncleared track. Team-made: say so and name
the maker. Downloaded: name the source page and its licence (and any attribution it requires).

| Asset / local filename | Used in | Origin / source | Licence / attribution line | Recorded or supplied by | Approved? |
|---|---|---|---|---|---|
| `Orbit_Flame_30sec.mp3` (30.0 s) | The Demo | AI-generated music: Google Gemini, generated for IGNIS | Full permission to use, confirmed by the team lead 2026-11-15. Credited as AI-generated music in the team pitch close | Team (via the team lead) | Yes |
| `Sleeping_Giants_Breath_30sec.mp3` (30.0 s) | The Story | AI-generated music: Google Gemini, generated for IGNIS | Full permission to use, confirmed by the team lead 2026-11-15. Credited as AI-generated music in the team pitch close | Team (via the team lead) | Yes |
| `the_sleeping_giant_s_breath.mp3` (121.7 s) | Team pitch (looped) | AI-generated music: Google Gemini, generated for IGNIS | Full permission to use, confirmed by the team lead 2026-11-15. Credited as AI-generated music in the team pitch close | Team (via the team lead) | Yes |
| `vo-<cut>-<nn>` voice lines | All three cuts | Team members’ own voices, recorded for this video | Team-made; no third-party rights | Each speaker (names in `video/src/cuts/cuts.data.ts` `TEAM`) | Pending recording |

## Videos (shipped)

| Video / file | Where | Content | Audio | Approved? |
|---|---|---|---|---|
| `video/out/ignis-demo.mp4` (29.973 s) | Submission video, <https://youtu.be/SA0A5cdz4hE>; 1080p copy in the deck | Screen recordings of the live product (post-restore capture, revision `75f01fc1`), captions | Team lead's narration + `Orbit_Flame_30sec.mp3` (AI-generated, disclosed) | Yes (frozen) |
| `public/media/walkthrough.mp4` (104.0 s, 1080p, 10.8 MB) + `walkthrough-poster.jpg` | Help → "Watch the walkthrough" (and the console hero button) | Screen recordings of the live product at revision `75f01fc1` (captured 2026-11-15 15:48–16:05, today's UI); 15 burned-in caption lines, identical to the Help transcript | **None: captions only** (Stage 1). No music, no voice | Yes (team lead, 2026-11-15) |

Candidate sources: [NASA SVS 31394](https://svs.gsfc.nasa.gov/31394/),
[NASA Glenn Saffire overview](https://www.nasa.gov/centers-and-facilities/glenn/flame-burns-out-on-nasas-long-running-spacecraft-fire-experiment/),
and the actual PSI experiment files. These have not been established as origins of the four practice-build images.
Trace each or discard it from the proposed asset set; do not delete another project's files.

Record the actual asset/download, frame time if extracted, original caption, credit, source-specific restrictions,
and association evidence. Review [NASA media guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/).
R2 records provenance; R1 confirms scientific association. Campaign images retain “Campaign context.”
No artwork in experimental evidence slots. A missing image leaves a working text card. Prioritize mission assets
over thumbnail count. Branding in `public/art` is ChatGPT-generated with Claude assistance per the team lead's
2026-11-13 clarification; it remains illustration, not NASA media.
