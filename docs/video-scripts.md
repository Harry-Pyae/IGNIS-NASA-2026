# Video scripts — recording sheet, voice-fit spec and shot list

Generated from `video/src/cuts/cuts.data.ts` by `npm run cuts:doc` in `video/`. Edit the data file, then regenerate.
Four cuts: **The Demo** (≤30.0 s, submission candidate A), **The Story** (≤30.0 s, candidate B), the **Team pitch** (3:00–4:00) and the **In-app walkthrough** (60–90 s, 1080p, no music: the app’s “Watch the walkthrough” button). The walkthrough reaches the app only from a final render (`npm run cuts:render -- --final --only=walkthrough`), which writes `public/media/walkthrough.mp4` + poster and switches the button on in `src/lib/walkthrough.ts`.
Both 30-second cuts end on the same end card, frame for frame, so swapping the submission is a file swap.

**How to read a line:** say it plainly at a normal pace. *Italic* words carry the stress. `[Name A]` = say your own name.
“IGNIS” is said **IG-niss**. “Saffire” is said like “sapphire”. Numbers are never read from the screen: the VO avoids catalog counts on purpose.

## The Demo (product-first, ≤30 s)

File prefix `vo-demo-` · 8 lines · **63 words** · planned 30.0 s · music: `Orbit_Flame_30sec.mp3`

| # | File | Line (read this) | Words | Target s | Shown while it plays |
|---|---|---|---|---|---|
| 01 | `vo-demo-01.wav` | This is *IGNIS*, from Team AstroFlare. | 6 | 3 | Title card |
| 02 | `vo-demo-02.wav` | In orbit, fire behaves *differently*. NASA’s evidence is buried in reports. | 11 | 5 | “Fire behaves differently in orbit.” |
| 03 | `vo-demo-03.wav` | Describe the cabin scenario. *Confirm* the inputs. | 7 | 3 | Product: preset → confirm |
| 04 | `vo-demo-04.wav` | IGNIS finds the closest *verified* NASA experiments. | 7 | 3 | Product: map → match |
| 05 | `vo-demo-05.wav` | Every claim cites its *NASA* source. | 6 | 3 | Product: citation → nasaPage |
| 06 | `vo-demo-06.wav` | Move a condition, and the evidence *updates*. Gaps stay *visible*. | 10 | 4 | Product: slider → gap |
| 07 | `vo-demo-07.wav` | A claim that doesn’t match the record? *Withheld*. | 8 | 3.5 | Product: caseWithheld |
| 08 | `vo-demo-08.wav` | IGNIS never predicts. It shows what *NASA saw*. | 8 | 5.5 | Shared end card |

Shorter wordings, used only if the voice-fit report says that line is over budget:

- `demo-02`: Fire acts *differently* in orbit. The evidence is buried.
- `demo-03`: Describe it. *Confirm* it.
- `demo-04`: The closest *verified* NASA runs.
- `demo-06`: Move a slider. Gaps stay *visible*.
- `demo-07`: A wrong claim? *Withheld*.

## The Story (stakes-first, ≤30 s)

File prefix `vo-story-` · 7 lines · **57 words** · planned 29.0 s · music: `Sleeping_Giants_Breath_30sec.mp3`

| # | File | Line (read this) | Words | Target s | Shown while it plays |
|---|---|---|---|---|---|
| 01 | `vo-story-01.wav` | *1967*. Apollo 1. Fire in a pure-oxygen cabin.<br><sub>⚠ R1: sign the heritage entry (docs/FACT-CHECK-QUEUE.md) before this line ships</sub> | 8 | 3 | 1967 · Apollo 1 |
| 02 | `vo-story-02.wav` | *1997*. Mir. Fire in orbit.<br><sub>⚠ R1: add and sign a heritage-mir entry (date, what burned, source)</sub> | 5 | 3 | 1997 · Mir |
| 03 | `vo-story-03.wav` | The evidence exists, scattered across *decades* of NASA papers. | 9 | 4 | “The evidence exists.” |
| 04 | `vo-story-04.wav` | IGNIS turns a cabin scenario into the closest *verified* NASA experiments. | 11 | 4.5 | Product: preset → map |
| 05 | `vo-story-05.wav` | Every value traces to its source. Every *gap* stays visible. | 10 | 4.5 | Product: citation → gap |
| 06 | `vo-story-06.wav` | Claims that don’t match the record are *withheld*. | 8 | 4 | Product: caseWithheld |
| 07 | `vo-story-07.wav` | What NASA saw. *Nothing it didn’t.* | 6 | 6 | Shared end card |

Shorter wordings, used only if the voice-fit report says that line is over budget:

- `story-01`: *1967*. Apollo 1.
- `story-03`: The evidence exists. It’s *scattered*.
- `story-04`: IGNIS finds the closest *verified* NASA runs.
- `story-05`: Every value is sourced. Every *gap* shows.
- `story-06`: Wrong claims are *withheld*.

## Team pitch (3:00–4:00)

File prefix `vo-pitch-` · 25 lines · **449 words** · planned 233.0 s · music: `the_sleeping_giant_s_breath.mp3`

| # | File | Line (read this) | Words | Target s | Shown while it plays |
|---|---|---|---|---|---|
| 01 | `vo-pitch-01.wav` | Hi, we’re *Team AstroFlare*, and this is IGNIS, our answer to NASA’s Flame in Freefall challenge.<br><sub>**01 · Team**</sub> | 16 | 7 | Title card |
| 02 | `vo-pitch-02.wav` | [Name A] led the engine and integration. [Name B] built the mission console, and [Name C] the evidence features.<br><sub>**01 · Team**</sub> | 19 | 8 | Team names + roles |
| 03 | `vo-pitch-03.wav` | [Name R1] verified every card against NASA’s reports, [Name R2] researched the media, and [Name R3] *tested* it with real people.<br><sub>**01 · Team**</sub> | 21 | 9 | Team names + roles |
| 04 | `vo-pitch-04.wav` | On Earth, a flame heats the air around it. Hot air *rises*, fresh air flows in, and the flame stands tall.<br><sub>**02 · Why fire is different in orbit**<br>⚠ R1: confirm this plain-language description of buoyancy in microgravity</sub> | 21 | 8 | Earth vs orbit flame (illustration) |
| 05 | `vo-pitch-05.wav` | In orbit, there is no *up* for hot air to rise to. A flame depends on the air that moves around it, like a cabin’s ventilation.<br><sub>**02 · Why fire is different in orbit**<br>⚠ R1: confirm this plain-language description of buoyancy in microgravity</sub> | 26 | 10 | Earth vs orbit flame (illustration) |
| 06 | `vo-pitch-06.wav` | NASA has tested this in orbit for years, in campaigns like BASS and Saffire. But the results sit in technical reports, tables and figures.<br><sub>**02 · Why fire is different in orbit**</sub> | 24 | 9 | “The evidence exists.” |
| 07 | `vo-pitch-07.wav` | Finding what was *actually observed*, for one material and one airflow, takes careful reading. IGNIS puts it one question away.<br><sub>**02 · Why fire is different in orbit**</sub> | 20 | 8 | “What was actually observed?” |
| 08 | `vo-pitch-08.wav` | Here is IGNIS, live. I start from a preset, *crew clothing*, or describe a scenario in plain words.<br><sub>**03 · The product**</sub> | 18 | 10 | Product: landing → preset |
| 09 | `vo-pitch-09.wav` | IGNIS shows what it understood, and nothing runs until I *confirm* the inputs.<br><sub>**03 · The product**</sub> | 13 | 8 | Product: confirm |
| 10 | `vo-pitch-10.wav` | The evidence map plots every verified experiment by oxygen and airflow. Each *shape* is an observed outcome.<br><sub>**03 · The product**</sub> | 17 | 10 | Product: map |
| 11 | `vo-pitch-11.wav` | I tap a point, and its record opens right here: the conditions, a *verbatim* quote, and the page it came from.<br><sub>**03 · The product**</sub> | 21 | 10 | Product: dotTap |
| 12 | `vo-pitch-12.wav` | The match panel ranks the closest runs by similarity of reported conditions, *not* by material safety. Each chip says why it matched.<br><sub>**03 · The product**</sub> | 22 | 11 | Product: match |
| 13 | `vo-pitch-13.wav` | The mission brief narrates only what was retrieved. Every citation opens its card, and every card opens the *NASA report*.<br><sub>**03 · The product**</sub> | 20 | 12 | Product: brief → citation → nasaPage |
| 14 | `vo-pitch-14.wav` | When I move the airflow slider, retrieval updates *instantly*.<br><sub>**03 · The product**</sub> | 9 | 8 | Product: slider |
| 15 | `vo-pitch-15.wav` | Hatched cells mean *no matching verified evidence* in the current IGNIS catalog. The gap radar ranks the largest regions.<br><sub>**03 · The product**</sub> | 19 | 10 | Product: gap |
| 16 | `vo-pitch-16.wav` | The library lets anyone browse, compare and cite every verified run.<br><sub>**03 · The product**</sub> | 11 | 9 | Product: library → compare |
| 17 | `vo-pitch-17.wav` | How do we keep it honest? First, a *validator*. I claim this run used ten centimetres per second.<br><sub>**04 · Keeping it honest**<br>⚠ Check at render: GMT96-T8’s verified airflow is still 5 cm/s (the line says the card says five)</sub> | 18 | 8 | Product: caseWithheld |
| 18 | `vo-pitch-18.wav` | The card says five. *Withheld*, and IGNIS shows the source row.<br><sub>**04 · Keeping it honest**</sub> | 11 | 6 | Product: caseWithheld |
| 19 | `vo-pitch-19.wav` | Second, every card is published by a *named* human reviewer, after checking it against its source.<br><sub>**04 · Keeping it honest**</sub> | 16 | 8 | Product: verifiedBy |
| 20 | `vo-pitch-20.wav` | Third, we never claim more than the catalog holds. Two of our presets have no verified flight test yet, and IGNIS *says so* instead of guessing.<br><sub>**04 · Keeping it honest**</sub> | 26 | 8 | “No matching verified evidence in the current IGNIS catalog.” |
| 21 | `vo-pitch-21.wav` | Every verified run traces to its report, page and quote, and the whole dataset is *open* to download.<br><sub>**05 · Data and what’s next**</sub> | 18 | 10 | Live catalog numbers |
| 22 | `vo-pitch-22.wav` | Flame research in microgravity matters on Earth, too: [R1: one sourced example, one sentence].<br><sub>**05 · Data and what’s next**<br>⚠ R1: supply one sourced Earth-benefit sentence and its NASA source</sub> | 10 | 9 | “It matters on Earth, too.” |
| 23 | `vo-pitch-23.wav` | Next: more campaigns, and *partial gravity*, with lunar flammability data from programs like FM2 and LUCI, so the same questions work for the Moon.<br><sub>**05 · Data and what’s next**<br>⚠ R1: confirm FM2 and LUCI are the right partial-gravity programs and describe them correctly</sub> | 24 | 11 | What’s next |
| 24 | `vo-pitch-24.wav` | Thank you. Try IGNIS at the link on screen. The code and the data are *open*.<br><sub>**06 · Thank you**</sub> | 16 | 12 | URL + QR, credits, AI use, not affiliated |
| 25 | `vo-pitch-25.wav` | IGNIS never predicts. It shows what NASA saw, and *where the evidence stops*.<br><sub>**06 · Thank you**</sub> | 13 | 14 | URL + QR, credits, AI use, not affiliated |

## In-app walkthrough (60–90 s, 1080p)

File prefix `vo-walkthrough-` · 10 lines · **124 words** · planned 69.0 s · music: none (VO only)

| # | File | Line (read this) | Words | Target s | Shown while it plays |
|---|---|---|---|---|---|
| 01 | `vo-walkthrough-01.wav` | Here is how IGNIS answers a question, using only *verified NASA* experiments. | 12 | 5 | “How IGNIS answers a question” |
| 02 | `vo-walkthrough-02.wav` | Pick a preset, or describe a scenario. Nothing runs until you *confirm* it. | 13 | 7 | Product: preset → confirm |
| 03 | `vo-walkthrough-03.wav` | Each dot on the evidence map is a *real NASA test*, placed by oxygen and airflow. | 16 | 7 | Product: map |
| 04 | `vo-walkthrough-04.wav` | Open a *documented experiment* from the library. | 7 | 6 | Product: library |
| 05 | `vo-walkthrough-05.wav` | Its source row: the verbatim quote, the page it is on, and the person who *verified* it. | 17 | 8 | Product: verifiedBy |
| 06 | `vo-walkthrough-06.wav` | One click opens the *NASA report* it came from. | 9 | 7 | Product: citation → nasaPage |
| 07 | `vo-walkthrough-07.wav` | Now a claim that misstates the record. IGNIS checks the source row and *withholds* it.<br><sub>⚠ Check at render: GMT96-T8’s verified airflow is still 5 cm/s (the case claims 10)</sub> | 15 | 9 | Product: caseWithheld |
| 08 | `vo-walkthrough-08.wav` | A value that matches its card is *accepted*, with the same source row. | 13 | 6 | Product: caseAccepted |
| 09 | `vo-walkthrough-09.wav` | Hatched cells have no verified card yet. The gap radar shows where the *evidence runs out*. | 16 | 9 | Product: gap |
| 10 | `vo-walkthrough-10.wav` | What NASA saw. *Nothing it didn’t.* | 6 | 5 | Shared end card |

## Recording spec

- **One file per numbered line**, named exactly as in the tables: `vo-demo-03.wav`, `vo-story-01.m4a`, `vo-pitch-17.wav`. `.wav`, `.m4a`, `.mp3`, `.aac` or `.ogg` all work.
- **Drop folder:** `video/assets/vo/`. Re-record any single line by replacing its file; nothing else changes.
- Quiet room, soft furnishings, no fan or music. A phone is fine: hold it 20–30 cm away, slightly to the side of your mouth.
- Leave **about half a second of silence** before and after each line. Don’t trim it: the prep step trims it.
- Same voice, same room, same distance for every line in one cut. Three takes of a line is fine; keep the best and delete the rest.
- **Never speed up a line to fit.** If a 30-second cut runs long, the report names the line and a shorter wording to re-record.

### What happens to the files (voice-fit)

`npm run cuts:prep` in `video/`:

1. Trims leading/trailing silence (`silencedetect`, keeping 80 ms of air), then normalises each clip to −16 LUFS with two-pass `loudnorm` (linear: no compression, no speed or pitch change).
2. Measures each clip. Each beat lasts **lead 0.15 s + the clip + tail 0.35 s**, clamped to the line’s min/max so visuals never flash or drag; a voice is never cut, so a line longer than its max grows its beat and is reported.
3. Captions come from these exact lines, split into short phone-readable chunks timed across the clip.
4. 30-second cuts: if the total passes 30.0 s, `out/cuts-report.txt` lists each line over its target, by how much, with the shorter wording above. Re-record those lines; nothing is compressed.
5. Lines not yet recorded are planned from their word count (2.6 words/s) and the render stays a watermarked placeholder.

## Music

Drop folder: `video/assets/music/`. Each track is normalised to −16 LUFS, then sits at −8 dB with no voice and **dips to −18 dB under the voice** (150 ms attack, 450 ms release), fades in over 0.5 s and fades out across the end card. A track shorter than its cut loops with a 2 s crossfade.

| Cut | Track | Why |
|---|---|---|
| The Demo | `Orbit_Flame_30sec.mp3` | Most driving (assigned by title: the tracks are not auditioned by the build) |
| The Story | `Sleeping_Giants_Breath_30sec.mp3` | The 30-second edit of the slower piece |
| Team pitch | `the_sleeping_giant_s_breath.mp3` | Calmest, and the only full-length track (121.7 s, looped to length) |

To swap, change `music` on the cut in `cuts.data.ts`. **No final render until each track has an Approved row in `docs/media-ledger.md`** (Audio section): team-made says so; a downloaded track names its source and licence. A track that can’t be cleared is swapped, or that cut ships VO-only (`music: null`).

## Re-capture shot list (one session, in this order)

Run `node scripts/capture.mjs` in `video/` once the catalog has grown and the latest `main` is deployed. It records the **live production app** at a **1440×810 viewport at 2× (2880×1620)**, never upscaled, as one continuous take with a visible pointer, and marks where each shot begins. Every cut picks its moments from this one take.

| # | Shot id | What must be on screen | Used by |
|---|---|---|---|
| 1 | `landing` | Landing page: hero, IGNIS title, the two entry buttons | pitch |
| 2 | `preset` | Console: pick the "Crew clothing (cotton blend)" preset in the scenario rail | demo, story, pitch, walkthrough |
| 3 | `confirm` | Press "Find matching experiments": the inputs are confirmed, the page settles on the results | demo, story, pitch, walkthrough |
| 4 | `map` | Evidence map with the matched runs, outcome shapes and the scenario marker | demo, story, pitch, walkthrough |
| 5 | `dotTap` | Tap a map point: ring + its record panel right under the plot | pitch |
| 6 | `match` | Match panel: ranked cards, "why it matched" chips | demo, story, pitch |
| 7 | `brief` | Mission brief: OBSERVED / SUPPORTED claims with citation chips | pitch |
| 8 | `citation` | Click a citation chip [E1]: the cited card opens, its quote and locator in view | demo, story, pitch, walkthrough |
| 9 | `slider` | Drag the airflow slider: retrieval and the map update live | demo, pitch |
| 10 | `gap` | Gap radar: tap region 1, its untested cells highlight on the map | demo, story, pitch, walkthrough |
| 11 | `nasaPage` | Click the card's NASA source: the NASA report opens | demo, story, pitch, walkthrough |
| 12 | `library` | Library: filter the verified runs, open one | pitch, walkthrough |
| 13 | `verifiedBy` | Experiment detail: "Verified by <reviewer> · <date>", the quote, NTRS/DOI, Cite this | pitch, walkthrough |
| 14 | `compare` | Compare two runs side by side | pitch |
| 15 | `caseWithheld` | 60-second case: claim GMT96-T8 used 10 cm/s → WITHHELD with the source row | demo, story, pitch, walkthrough |
| 16 | `caseAccepted` | 60-second case, same run: claim 5 cm/s (the card's value) → ACCEPTED with the same source row | walkthrough |
| 17 | `export` | Sources page / Export dataset: the open verified dataset | pitch |

Before the session: catalog grown and published; `MISSION_CASE` set if the guided mission should appear; the *Crew clothing* briefing warmed (one unforced run) so the Brief comes from the cache. The script allows one synthesize call and blocks the rest, so no extra generations run while recording. GMT96-T8 must still read 5 cm/s for the WITHHELD shot (`pitch-17/18` say “ten” and “five”).

## Standing rules

- Real product UI and ledgered NASA footage only. The AI art pack is branding and background; wherever the flame artwork appears it carries “Illustration — not NASA experiment imagery.” No NASA insignia.
- “Predict” appears only in the approved spoken line “IGNIS never predicts” (DECISIONS-ROUND3 #2), never in captions-only text or on screen elsewhere.
- On-screen numbers come from `/api/export` at prep time; the VO never reads a count.
- Burned-in English captions on every frame with speech; every cut works with the sound off.
- A render is watermarked **PREVIEW — PLACEHOLDER** while anything is pending; `npm run cuts:render -- --final` refuses to render until nothing is.
