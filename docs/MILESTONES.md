# IGNIS — Milestones

**NASA Space Apps 2026 · "Flame in Freefall" · Team AstroFlare**
This is one self-contained file for checking progress without the repo. Coder A updates it after every patch.

**2026-11-15 13:05 — data restore:** 12 cards were found edited off their sources (O₂/flow, II-5 class/form) and are
back to source values as drafts; **19 of 31 public** until the team lead republishes them (SIGNING-SESSION-RESTORE.md).
A source-value guard now runs in CI and in `verify:live`. Map crowding fixed in the UI (stack switcher, soft hatch). The
deck stats line below was read at the falsified revision: its ranges come from untouched cards (16.4 % and 31 % O₂,
54.1–101.3 kPa), but **re-read it from `/api/export` after the republish** before it ships. Re-capture and the final
Demo render follow the republish; The Story waits on R1's heritage signatures.

**2026-11-15 10:45:** catalog complete: **31 verified cards · 8 NASA campaigns · 5 source reports · 0 drafts** (revision
`a0363adf…`), every signing session signed. Range for the deck and video: verified evidence from 16.4 % to 31 % O₂, 54–101 kPa.
Remaining: Moon-base preset (R1 signature), green-flash Beat 1 (R2 frame by 12:30), recording session, VO.

> **Deck stats line (final, live revision `a0363adf…`, read 2026-11-15):** **31 verified runs · 8 NASA campaigns ·
> 16.4–31 % O₂ · 54–101 kPa · outcomes 15 sustained / 7 extinguished / 9 did not ignite · source reports 1994–2024.**
> Do not state flight years (e.g. "1992–2022") unless R1 confirms them from the mission records.

**2026-11-14 evening:** live = `main` `96262b4`, CI green. 3 verified cards; runbook steps 0, a, c, d done, f warm;
b, e, g, h open (progress table in [EXECUTION-STATUS.md](EXECUTION-STATUS.md)).

### Event Day 1 (2026-11-14), Coder A

- **Production moved:** the repo was recreated today as `Harry-Pyae/IGNIS-NASA-2026`; the old
  `ignisprototype01.vercel.app` returns `DEPLOYMENT_NOT_FOUND`. Live is now <https://ignis-nasa-2026.vercel.app>.
  Read-only check at `08d4ace`: all routes 200, `/api/export` count 0 / revision `empty`, `health-llm` (once) Groq
  `openai/gpt-oss-120b` + Gemini `gemini-3.5-flash-lite` reachable. Canonical/OG URLs and the video's live URL moved
  to the new domain.
- **Catalog (read-only `catalog_stats`, anon key):** 0 verified, 3 in review, revision `empty`. Steps c–f wait on R1's
  step a.
- **Step 0 (migration 0004)** has not been confirmed applied on production. Run it in the SQL editor before R1's first
  publish.
- **2026-11-14 04:17 UTC: the catalog is no longer zero.** R1's reviewers published 3 verified cards (BASS GMT96-T7,
  BASS GMT96-T8, BASS-II GMT45-T4; NTRS 20150008962), revision `becd7b54435772eaf9f7499a69267ad5`. The real-data
  sequence passed on production the same day: step c (Groq), the warmed cache, and the forced-Gemini synthesize proof.
  Details are in `QA-LOG.md`, "Real-data production checks".
- **UI consistency pass + investigation workbench** (Coder A, decisions in `DECISIONS-ROUND6.md`). Headless-Edge
  acceptance on the dev server against the live catalog:
  - 1440×900: O₂ 21 → 17 with no page scroll; after Confirm the plot (y 125–439) and the matches heading (y 742) share
    one screen, with both sliders visible in the rail.
  - 390 px: Confirm shows the condition bar; one tap puts the plot at y 247–473.
  - 1024 px: the bar appears once the controls are off screen.
  - Keyboard order is rail, then evidence; every focusable element has a ring; reduced motion jumps instantly; there is
    no sideways scroll at any width.

  R3 re-runs the non-technical-person test on this layout.
- **Migrations 0004 and 0005 applied in production** (team lead, SQL editor, 2026-11-14). Columns confirmed by an anon
  read; revision unchanged. Dataset provenance code merged to `main` right after.
- **Midday:** R1's publish never reached the database. Same project (`zvzofutgfwzptlbfibpz`); all 3 seed rows still have
  `verified_by` null and the 2026-11-07 seed `updated_at`. Round 2 split in `docs/WHO-DOES-WHAT.md`. Coder A's
  dataset provenance (0005 + types + `/curate` + export + tests) is on branch `provenance`. It reaches `main` only after
  0005 runs in production.
- Tier 1 split: `docs/WHO-DOES-WHAT.md`. Coder A shipped: `'/name/*'` route matching and a Methods link beside the
  match order note.
- **Round 8** (`IGNIS_FIX_ROUND8.md`): Coder A curation concurrency (`409 edit_conflict`), stale-parse guard, mission
  gate bound to reviewed versions, preset availability, versioned share links; Coder B compact scenario row, retrieval
  action, page help, console draft; Coder C error boundaries, why-this-run / why-no-matches, Specimen Explorer,
  evidence handoff; persistent light theme. R1 queue: 11 drafts loaded to `/curate` (`docs/R1-QUEUE.md`).
- **60-second case:** `/case` (alias `/case/green-flash`). Beat 2 runs live on `POST /api/check-claim` (the production
  validator on one claim vs one verified card, no LLM); Beat 1 waits on `GREEN_FLASH` (R1 quote + R2 still).
- **Round 9** (`docs/IGNIS_REVIEW_ROUND9.md`): case verdict race and proof fixes, `/help` with stable anchors replacing
  six "How to use this" disclosures, phone header 164 → 117 px, light-theme contrast, `npm run verify:live`,
  per-route canonical/OG tags, 378 i18n keys. Headless Edge: 30 page variants clean at 1440 + 390.
### Showcase round — in `main` and live (visual acceptance on a populated catalog still open)

| Surface | Behavior and limits |
|---|---|
| Methods | `/methods` explains the five principles, deterministic retrieval, claim checks and their limits, with a labelled SVG pipeline. It needs no catalog or provider. |
| Sources | `/sources` groups verified cards by recorded publication metadata and lists campaigns, counts, original URLs, optional NTRS/DOI links and dataset export. Loading, connection failure and a verified-empty snapshot are distinct. The visible page checks for a newer catalog revision once a minute and on returning to the tab. |
| Research context | The existing signed-only section already met the requirement. It stays absent until there is reviewed content. |
| Comparison | A collapsed, static two-card table is available only with two distinct verified solid matches; it keeps source locators, missing values and changing-condition notes beside the comparison. No verdict or explanation of cause. |
| Metadata browser | Skipped under the Round 6 cut rule: the last recorded public snapshot has zero verified cards. No separate search or filtering service. |
| Console motion | Populated maps use the existing timing tokens for stagger, hatching, rings, lines, sustained-match flicker and marker glide. A verified-ID ticker replaces any need for sample telemetry. Slider changes crossfade the cards where scoped transitions are supported; otherwise updates are immediate. Reduced motion stays static; the Brief and gap blocks never animate. |
| Polish | Unknown client routes show a recovery page (the existing SPA rewrite still serves the shell); printable Brief includes source IDs and locations, and lazy routes announce loading. Built favicon: 16/32/48 px; app icon: 192 px; OG image: 1200 × 630. |

Local checks: typecheck, lint, 225 tests passed (19 default-suite skips), production build, and 16/16 separate disposable DB tests. The landing entry is 57.70 KB gzip; Methods and Sources are separate on-demand chunks.
The new rendering tests cover static Methods/404, empty/loading/unavailable/populated Sources, linked identifiers, private-card exclusion and comparison qualifiers.
No production writes, provider calls, engine/schema changes or Day 1 runbook changes. No hosted CI or deployment claimed.
The browser preview host was unavailable: actual print pagination, mobile layout and motion on a populated catalog still need visual acceptance.

| | |
|---|---|
| **As of** | 2026-11-14 evening (Day 1 of 2) |
| **main** | `96262b4` (GitHub, recreated history): Round 6 console + unified-spec prep + Round 8 + 60-second case + Round 9 |
| **Live** | <https://ignis-nasa-2026.vercel.app>, serving `main` (same asset hashes as a local build of `96262b4`) |
| **CI** | green on `96262b4`: typecheck · lint · 280 tests passed, 22 skipped (DB tests, live-LLM smoke and the optional benchmark run in their own jobs) · build · disposable-DB job |
| **Public catalog** | **3 verified cards** (revision `becd7b54…`), 11 drafts queued for R1 |
| **Overall** | Engine, API, console, library, case and help pages are live on real data. Open: more cards, the mission case, stills, usability tests and the submission. |

**Card verification happens only in the event window (from Sat 2026-11-14).** The guide is [§12](#12-how-to-verify-a-card-r1-curate).

Legend: ✅ done · 🟡 partly done · ❌ not started · ⛔ blocked (named dependency) · ❓ not visible in the repo (ask the owner)

---

## 1. What IGNIS is

Describe a spacecraft fire scenario in mission terms. IGNIS retrieves NASA's closest real microgravity combustion
experiments, shows what was actually observed, and makes the absence of evidence visible. **The one idea:** IGNIS
refuses to guess.

**The five Core Principles** (they win every conflict):
1. **No prediction, ever.** It only reports what NASA observed; "predict" is banned from copy, code and pitch.
2. **Every AI claim is a validated evidence object.** The server checks every claim, and claims that fail are withheld visibly.
3. **Deterministic before generative.** Retrieval, matching, ranking, coverage, gaps and alias resolution are pure code; the LLM only parses and narrates.
4. **Scientific domain purity.** Solid flammability only (BASS, BASS-II, Saffire, SoFIE/MIST); SAME is `smoke_detection`; FLEX is never carded.
5. **Honesty beats impressiveness.** Missing data stays null and visible; "untested" and "outside catalog range" are distinct states.

**Stack:** Vite + React 18 + TypeScript (strict) + Tailwind v4 · Supabase (Postgres + RLS) · Vercel serverless functions
(US East `iad1`) · Groq `openai/gpt-oss-120b` primary, Gemini `gemini-3.5-flash-lite` backup · Zod on every LLM response · Vitest.

## 2. Team and ownership

| Role | Owns | Status |
|---|---|---|
| **Coder A** (team lead) | `main`, engine, API, deploy, merges, shared contracts/copy | Live `96262b4`; runbook 0, c, d done, f warm; e (mission case) waits on R1 + R3 |
| **Coder B** | Mission console (`console` branch) | Console v1 live 2026-11-10; Round 8 fixes merged 2026-11-14 |
| **Coder C** (optional) | Features (`features` branch) | Round 8 merged 2026-11-14: error boundaries, why-this-run / why-no-matches, Specimen Explorer, evidence handoff |
| **R1** | Data and science research: the catalog | 🟡 3 cards published 2026-11-14; 11 drafts queued (`R1-QUEUE.md`) |
| **R2** | NASA media, media ledger, pitch video | Media ledger prepared; asset verification and video pending |
| **R3** | QA, demo, captions, Burmese review, submission | QA/demo/submission protocols prepared; human execution and review pending |

Rules: only Coder A merges to `main`; CI green before every PR; production holds real data only; publication is a named
human (`verified_by` is the reviewer's own name).

## 3. Development history before the official timer

| Date | Milestone | Key commits |
|---|---|---|
| 2026-11-07 | **Foundation round 1:** scaffold, schema + RLS, design tokens/primitives/icons, shared Zod contracts, Groq/Gemini adapter, claim-validation pipeline, `/curate` form + LLM extract, app shell + landing, art pack, CI, Vercel config | `cf24fa5` → `7adea6a` |
| 2026-11-07 | **Foundation round 2:** contracts frozen; publication = a named human (drafts, placeholder names rejected in API + DB); claims validated against the cited card; server-side eligibility gates + deterministic coverage; clean-draft extraction; motion guard (Brief/UNTESTED static); disposable local DB + RLS/lifecycle tests; Node 24; Decisions round 2 | `ef93bba` → `2867ff0` |
| 2026-11-07 | **Team Plan v2** replaces the six-part plan (Coder A/B/C + R1–R3) | `5434323`, `06cd3f8` |
| 2026-11-08 | **Engine patch 2:** briefing cache, export endpoint, worked BASS extraction example, LLM observability, `/api/health-llm` | `3c50a80` (#2) |
| 2026-11-09 | **Matching engine:** alias resolver, gates → weighted similarity → chips, gap grid + Gap Radar | `2ecd266` (#4) |
| 2026-11-09 | OG/canonical URLs (#5); health probe with real generation (llm-models); **rate limit** with a shared Postgres counter that fails open (#6, migration 0003) | `68af561`, `dcb304a`, `2d07075` |
| 2026-11-09 | **Round 3:** verified-catalog loader, one consistent catalog snapshot (synthesize/export/browser), curation race fix, export wiring, Decisions round 3 | `e3267a0` (#8) |
| 2026-11-09 | Production-data rule; Gemini probe rule (lite-only, one call); **curator-only provider switch** for failover rehearsal; parse failover proven on production | `55589a8`, `c2ea33b`, `de36ffd` (#12), `e4e0cba` |
| 2026-11-09 | **Canonical airflow rule:** "still air" → 0, no mention → null, one prompt for both providers | `3e9efff` (#14) |
| 2026-11-10 | **Mission console merged** (Coder B): scenario builder, Evidence Map, Match Panel, Mission Brief, Gap Radar, `t()` i18n. Two review rounds sent back 7 issues; all fixed. | `298c802` |
| 2026-11-10 | **Match summary names every uncounted parameter** (decision 10) | `c7703e7` |
| 2026-11-10 | **Lite is the permanent Gemini backup** (code default); functions pinned to `iad1`; local-dev Groq note; decisions 9–11 | `a053e14` |
| 2026-11-10 | STATE handoff; console verified live | `e12c4e6` |
| 2026-11-10 | MILESTONES.md published; card-verification guide (§12); PageSpeed re-run after the console | `12c3b43`, `3d257b0` |
| 2026-11-10 | **Timeline re-baselined** to the official start; FAQ conflict found; timeline documented; Decisions Round 4 (upgrade proposal), build items on hold | `5085371` |
| 2026-11-10 | Build work resumed | this patch |
| 2026-11-10 | **Round 5** (teammate's Pyroverse practice build: content and UX only, no code, no data values): environment presets (hidden until R1 signs), Burmese draft set behind R3 review with a CI no-ship guard, context content (renders only when R1 signs), R1/R2/R3/Coder B handoffs | `round5` merge |
| 2026-11-10 | **Round 6** (feature and design upgrade review adopted in full): approved copy for the two landing CTAs, the mission availability line, the current-investigation summary, the environment explanation and the context banner; mission-entry gate (`missionEntry()`, no case until R1/R3 review one in the event window); context section omitted until an entry is signed; revision binding as named helpers; Coder B's ordered queue + design review criteria; metadata browsing deferred | `round6` merge |
| 2026-11-11 | **Round 6 console** (Coder B): guided mission (five steps, controls inside each step's caption, Back / Next / Explore freely; opens only for a reviewed case, so hidden until the event), current-investigation summary, stills with a visible "Campaign context" label, aligned Match Panel fields, signed-only context section. Coder A fixes: the summary never labels whole-catalog counts with an unconfirmed scenario; the Round 5 environment caption restored; map selection stays on the map with "Open its match card"; Explore is the primary button until a mission case exists | `round6-a` merge |
| 2026-11-13 | **Unified specification prep:** source links used as recorded (no guessed PDF names), map populations (on-axes / outside / missing) and non-colour outcome shapes, persistent selection, interpretation limits (`prompts-v5`), catalog-unavailable retry, duplicate-run identity (migration 0004 + `409`), R1/R2/R3 working records | `82c63d2` |
| 2026-11-13 | **Mission gate:** preset must have a set material; every bound ID among the preset's current top-5 matches | `45568e3` |
| 2026-11-13 | **Map axes from the shared GRID** + bounds test; full sweep green; pushed and verified live; **prep frozen** | `b7602ba` |
| 2026-11-10 | **Console code-split:** landing JS 95.6 → 57.2 KB gzip, Zod off the landing path, console prefetched at idle and mounted near the viewport, console deep links fixed; recharts removed | `21bb12c` |

## 4. Scope checklist (Build Plan §11 tiers, as amended by the Team Plan)

### MUST HAVE (the demo dies without these)

| Item | Status | Notes |
|---|---|---|
| 15+ verified cards | 🟡 **3** | R1. The 3 seeds are published (NTRS 20150008962); 11 drafts wait in `/curate` (`R1-QUEUE.md`) |
| Scenario Builder with presets + editable fields | ✅ | 4 presets; 2 (Cable insulation, Cargo packaging) open the material picker until R1 cards those materials |
| parse-scenario with user confirmation | ✅ | Values are editable; nothing is retrieved before Confirm |
| Deterministic alias resolution + visible "Resolved" line | ✅ | Unknown or ambiguous phrases open a picker of verified materials only |
| Matching: gates + chips + "why this matched" | ✅ | Summary: "Compared on N of 4 parameters · reasons" |
| Evidence Map: outcome dots, scenario marker, match lines | ✅ | Plus hatched untested cells, dashed outside-range cells, clipping to the axes |
| Mission Brief from validated claims + Evidence Chain | ✅ | Citation chip → card → quote → page/figure/table → NASA PDF |
| UNTESTED and outside-range as distinct states | ✅ | In chips, map, legend and Brief |
| Provenance on every card | ✅ | Page · figure · table · NTRS link |
| Export Dataset | ✅ | Header + footer; an honest README-only file while the catalog is empty |
| RLS + server-side secrets | ✅ | Anon sees verified rows only; only the two public Supabase values reach the browser |
| Deployed public URL | ✅ | |

### SHOULD HAVE

| Item | Status | Notes |
|---|---|---|
| Live sliders with re-retrieval | ✅ | O₂ and airflow, each with a "Not specified" state |
| Gap-grid shading on the map | ✅ | |
| Gap Radar panel | ✅ | Largest untested regions + materials with < 3 records |
| Media thumbnails on cards | 🟡 | Renderer shipped in Round 6; approved R2 assets and R1 associations pending |
| 30 cards | ⛔ | R1 |
| Briefing cache | ✅ | Keyed by scenario + `catalog_revision` + prompt/validator version |
| Guided Demo (Judge Mode) | 🟡 | Five-step wiring shipped; ≥3 distinct verified solid records now exist; reviewed case/captions (`MISSION_CASE`) pending |

### WOW (if time allows)

| Item | Status |
|---|---|
| Auto-play Guided Demo captions | Cut; approved mission uses manual navigation |
| Telemetry sparklines/modal | Cut; schema field is not a requirement to implement it |
| Comparison animation | Rejected by current decisions and unified specification |
| Flammability boundary polyline | ⛔ deferred (decision R2-6: needs a certified comparable measured series) |
| Burmese UI | 🟡 `t()` plumbing + EN set done (378 keys after Round 9); Round 5 MY draft staged (`src/i18n/my.draft.ts`, 3 keys + glossary) behind R3 review (`docs/MY-REVIEW.md`); ships only complete and reviewed |
| Map choreography (dot stagger, marker glide, crossfade) | Present in local showcase; see scope and browser acceptance above |

### DO NOT BUILD (unchanged)
Prediction/simulator · free chat · user PDF upload · droplet domain · 3D flames · accounts · offline/PWA claims ·
real-time PSI integration · LLM-generated match explanations.

## 5. Event-window plan

**Official timer and submission-repository upload window: Saturday 14 November to Sunday 15 November 2026 (14-11 to 15-11).**
Earlier work is recorded in the development history above. Follow the local submission deadline.

| When | Work | Owner | Status |
|---|---|---|---|
| **Day 1** | After the timer opens, upload the new submission repository with its credits and license. | Coder A | uploaded (`Harry-Pyae/IGNIS-NASA-2026`, public); link check in the submission checklist |
| **Day 1 (Sat 11-14)** | **R1 card-verification sprint:** re-verify the 3 seeds from the source, then 15+ cards (§12) | R1 (+ team lead session) | 🟡 3 seeds published; 11 drafts queued |
| Day 1 | **Integration checkpoint on real cards:** warm the demo cache, parse → confirm → retrieve → synthesize → cite on the deployed URL; the **forced-Gemini synthesize proof** (once, on a real card) | Coder A | ✅ API level (`QA-LOG.md`); browser click-through open |
| Day 1 | Mission case chosen from the real catalog (≥3 strong matches + one clean gap); captions written | R1 + R3 | pending (3 cards now exist) |
| Day 1 | Stills association checked for the mission's cards; footage pull | R2 → R1 | pending |
| **Day 2 (Sun 11-15)** | Mission content wired (or the presenter-led fallback); aligned Match Panel; static comparison only if time allows | Coder B | pending |
| Day 2 | Three-person usability test (DECISIONS-ROUND4, five questions); fix the hesitation step | R3 | pending |
| Day 2 | QA sweep at 390/1024/1440 + reduced motion; acceptance run; two timed rehearsals; final video | R3, Coder A, R2 | pending |
| Day 2 | **Submission** with credits, licenses and the AI-use description | R3 + Coder A | pending |

**Cut order inside the window** (first cut first): static comparison view → stills beyond the mission's cards →
Burmese (ships EN-only) → mission wiring (falls back to the presenter-led preset). Telemetry and the comparison animation stay cut.
For the local showcase, drop polish first, then console motion, metadata browsing, static comparison, context, Sources and Methods if necessary to protect Day 1.
**Never cut:** matching + chips, Evidence Map, claim validation, UNTESTED/outside-range, the evidence-only fallback,
real verified cards, the video.

## 6. "Done when" per role

| Role | Done when (Team Plan) | Status |
|---|---|---|
| Coder A | Every §5–§7 behavior has a passing test; the demo scenario returns ≥3 strong matches + one clean gap from the live DB; `main` never has a red day | 🟡 Tests ✅, main green ✅; *Crew clothing* returns the 3 verified cards; the reviewed case and gap wait on R1 + R3 |
| Coder B | Live app matches the mockup boards at 1440/1024/390; drag → glide → re-match → Brief runs clean on the deployed URL | 🟡 Console v1 live; choreography, thumbnails and Guided Demo open |
| Coder C | Its list or its fallback subset | 🟡 Round 8 subset merged (error boundaries, explanations, Specimen Explorer, evidence handoff) |
| R1 | Any sampled card survives a line-by-line challenge against its source | 🟡 3 cards published |
| R2 | 30+ cards carry stills; ledger justifies every asset; the video can win alone | ❓ |
| R3 | A judge gets the full story from video + URL + README; QA log has every check dated and passing | ❓ |

## 7. Verification scoreboard

| Check | Result |
|---|---|
| Console against the production catalog | ✅ 2026-11-13 on `b7602ba`, 1280 px + 390 px: map "no records to plot", `0 eligible · 0 with plot coordinates · 0 missing`, mission availability line (no start button), context section omitted, no `/api` calls, no errors, no sideways scroll. Earlier ✅ 2026-11-10, 1280 px + 390 px: honest empty states everywhere before and after Confirm, no fixture dots, no `/api` calls, no errors, no sideways scroll |
| Console click-through (disposable DB, Edge) | ✅ 2026-11-10: presets, free text, material picker, both "Not specified" sliders, Set/Clear, keyboard, three map states, clipping, still Brief, reduced motion, 390 px |
| Synthesize round trip | ✅ round 3 via Groq (0 withheld, revision bound, cache hit) |
| Synthesize on Gemini lite | ✅ locally (2 validated Briefs); ✅ 2026-11-14 production, forced, real cards: status ok, 3 OBSERVED, 0 withheld |
| Synthesize on real cards (step c) | ✅ 2026-11-14 production, *Crew clothing*: Groq status ok, 3 OBSERVED + 1 SUPPORTED, 0 withheld; second call `provider: cache` |
| Forced-Gemini parse on production | ✅ 2026-11-09 |
| health-llm | ✅ 2026-11-13 (one call, production `b7602ba`): Groq 200, Gemini lite 200. Earlier ✅ 2026-11-10: Groq 200, Gemini 200. Flash checks have ended (lite is final) |
| RLS + curation lifecycle | ✅ 16/16 on the disposable DB (incl. duplicate-identity `409`), locally and in CI on `b7602ba` |
| Rate limit | ✅ 20 allowed, then 429 with `retry-after`; fails open |
| Export | ✅ 2026-11-14: `count 3`, revision `becd7b54…`. Earlier ✅ 2026-11-13: `count 0`, revision `empty`, with the 33-field README |
| PageSpeed mobile | ✅ 2026-11-10 after the console code-split (`21bb12c`), Lighthouse 12.2 mobile with devtools throttling from the dev machine (the Google API's keyless quota was exhausted both times): **Performance 83** (79 before the split) · Accessibility / Best Practices / SEO 100 · FCP/LCP **3.5 s** (4.0) · TBT 40 ms · CLS 0.001 · unused JS at first load **0** (42 KiB). Landing JS **57.2 KB gzip** (95.6 before the split, 55.3 before the console), and Zod is off the landing path again. The absolute times are network-bound on this path (200 ms RTT, 560 ms for the HTML), so they aren't comparable with the old Google-server run (FCP 0.8 s). Re-run from Google's servers when the quota resets. |
| Favicon tab screenshot | ❓ R3 |

## 8. Decisions log (summary)

**Round 2 (2026-11-07):** (1) the Team Plan supersedes Build Plan §9/11/12/14 · (2) the Brief and UNTESTED blocks are always still · (3) one slider caption ·
(4) absence copy: "No matching verified evidence in the current IGNIS catalog." · (5) ownership table · (6) boundary polyline deferred · (7) Node 24.

**Round 3 (2026-11-09 → 11-10):** (1) catalog-bounded copy everywhere · (2) the pitch line "IGNIS never predicts" is kept · (3) review wireframes are input for Coder B ·
(4) estimates are planning aids · (5) R1's source order: seeds → BASS-II → Saffire I/II/IV → MIST · (6) a correctly associated still beats thumbnail count ·
(7) async Brief + revision-binding contract · (8) canonical airflow parsing (still air = 0, unmentioned = null) ·
(9) shared-primitive changes need Coder A sign-off · (10) match summary names every uncounted parameter ·
(11) Gemini lite is the permanent backup; Groq blocks the team's network, so local dev always runs on Gemini; production runs in `iad1`.

**Round 6 (2026-11-10, feature and design upgrade review, adopted in full):** three visible layers (your scenario · observed evidence · research context) · (1) guided mission as the primary way in once a reviewed case exists, "Explore the evidence" secondary · (2) current-investigation summary with distinct counts · (3) environment presets say "Sets oxygen and pressure only."; no gravity modeling · (4) the selected experiment anchors the page; stills with "Campaign context" · (5) reviewed context after the mission, omitted when unsigned · design A–E as review criteria · (6) metadata browsing deferred (first new idea to drop). Nothing rejected reenters.

**Round 5 (2026-11-10, Pyroverse content):** adopted: environment presets as honest gap demos (R1-gated) · Burmese draft set behind R3 review · verified-only context content · demo-guide UX pattern · SVS imagery via the ledger. Rejected: safety scores / 0–100 ratings · cost-per-kg and cost/safety optimization · planetary combustion profiles or derived burn formulas · 3D flame chamber · NASA-STD-6001B audit/compliance framing · chat bot · carding droplet/gaseous domains · "Approved/Qualified/Prohibited" language.

**Round 4 (2026-11-10, upgrade proposal):** (1) Guided Demo → five-step evidence-investigation mission; content only from R1's verified cards · (2) ledgered stills on cards; the map stays a pure plot · (3) align Match Panel fields first, static comparison only if time allows · (4) rejected: trainers, survival guides, games, health tools, boundary fits, danger heatmaps, safety rankings, new report formats, new artwork · (5) lazy-loading before any mission code · (6) schedule re-baselined to 2026-11-14 = Day 1 · (7) the proposal stays uncommitted.

## 9. Open risks and blockers

| Risk | Impact | Next step |
|---|---|---|
| **Thin catalog** (3 verified) | The mission case is possible on the 3 seeds (*Crew clothing*), but coverage and the gap story stay narrow | R1: the 11 drafts in `R1-QUEUE.md`, then the coverage snapshot |
| **No mission case** | `MISSION_CASE = null`: no mission start button; the video's `mission-guided.mp4` can't be recorded | R1 + R3 name case + reviewer → Coder A (runbook step e) |
| R2/R3 execution evidence pending | Ledger, QA log and demo structure now exist; they do not establish completed reviews or a video | R2/R3: append actual asset reviews, sessions and rehearsal results |
| Two presets lack materials | Cable insulation and Cargo packaging always open the picker | R1: card a real insulation and a packaging material, send the `fuel_material` names |

## 10. Next actions

| Owner | Action |
|---|---|
| Coder A | Runbook ([EXECUTION-STATUS.md](EXECUTION-STATUS.md)): 0, c, d done. Now e (fill `MISSION_CASE` once R1 + R3 name it), f (re-warm the cache after the last publish), cable/cargo preset materials when R1 sends them |
| R1 | Seeds published. Now: the 11 drafts in `docs/R1-QUEUE.md` (easiest first), the GMT45-T4 decision line and coverage snapshot in `catalog-coverage.md` (R3 picks the mission case from it); then `docs/FACT-CHECK-QUEUE.md` if time allows |
| R2 | Now: trace the 4 practice-build SVS images to their NASA SVS pages and ledger them (DECISIONS-ROUND5 handoff). Day 1: stills with a rights ledger for the mission's cards; video by Day 2 |
| R3 | Day 1–2: mission case with R1, captions, usability test ×3, browser click-through of citations at 1280 + 390 px, QA, rehearsals, submission. Burmese (`docs/MY-REVIEW.md`, 378 keys after Round 9) is first in the cut order |
| Coder B | Fast-forward `console` to `main` (`git pull --ff-only origin main`; her two commits are unchanged, with Coder A's fixes on top), then queue #6: self-review with R3 against the DECISIONS-ROUND6 criteria at 1440/1024/390. Static comparison only after that |

## 11. Codebase at a glance

| Area | Where | Size |
|---|---|---|
| API routes (Vercel functions) | `api/`: parse-scenario, synthesize, check-claim, extract, curate-write, curate-cards, export, health-llm | 8 routes |
| Server logic | `src/server/`: LLM adapter, prompts, claim validation, synthesis, briefing cache, rate limit, export | |
| Engine (pure, no LLM) | `src/engine/`: aliases, match, gaps, views · `src/lib/gates.ts`, `coverage.ts` | |
| Contracts | `src/lib/types.ts` (Zod), `copy.ts` (approved copy), `fixtures.ts` · Round 5: `src/engine/environments.ts`, `src/lib/context-content.ts`, `src/i18n/my.draft.ts` (unshippable draft) · Round 6: `src/engine/mission.ts` (mission-entry gate) | |
| UI | `src/pages/`: `Home.tsx` (landing), `Console.tsx` (lazy console) + `consoleLoader.ts`, `Library`, `Case`, `Compare`, `Sources`, `Methods`, `Help`, `Curate`, `Kit`, `NotFound` · `src/features/*` (Coder C) · `src/components/ui/*` · `src/i18n/` | |
| Database | `supabase/migrations/` 0001–0005 · `supabase/seed.sql` (the 3 seeds, as drafts; published in production) | |
| Tests | `tests/`: 43 files (incl. `tests/db/` RLS + lifecycle on a throwaway DB) | 280 passing, 22 skipped |
| Docs | `IGNIS_BUILD_PLAN.md`, `IGNIS_TEAM_PLAN.md`, `AGENTS.md`, `docs/STATE.md`, `DECISIONS-ROUND2/3/4/5/6.md`, `CREDITS.md`, `FACT-CHECK-QUEUE.md`, `MY-REVIEW.md`, `DEPLOY-RUNBOOK.md` | |

Total tracked source + API + tests + DB + scripts: ~14,900 lines (2026-11-14).

## 12. How to verify a card (R1, `/curate`)

One page for the Day 1 verification sprint. **Card extraction and verification happen only inside the event window
(2026-11-14 → 11-15).** The rules come from Build Plan §4/§9, Team Plan R1, DECISIONS-ROUND2 and the
`/curate` form itself. Publishing on production is allowed **only** for real cards checked against their source,
under the reviewer's own name.

**Before you start**
- Open `https://ignis-nasa-2026.vercel.app/curate` and enter the curator secret. Coder A shares it privately; never
  paste it into chat, docs or screenshots.
- Have the source PDF open. The three seeds come from NTRS 20150008962 (Zhao, T'ien, Ferkul, Olson, 2015, "Concurrent
  flame growth, spread and extinction over composite fabric samples…").
- Timebox: **20 minutes per card**. If a card can't be defended in that time, leave it as a draft with a note.

**Steps**
1. **Open the card.** For a seed: **Cards · drafts and published** → *Reopen*. For a new card: *New card*, or paste an
   excerpt and press *Extract into a new draft*. The extractor is only a helper: the server discards any value without
   a supporting quote that appears in the excerpt (listed under "Discarded by the server").
2. **Check every non-null field against the source**, line by line. The fields marked `*` are required: domain, campaign,
   test_id, fuel_material, material_class, fuel_form, outcome, key_observation_quote, source_title, source_url.
3. **Apply the field rules:**

| Field | Rule |
|---|---|
| Any value | Only what the source **explicitly states**. Ambiguous → leave it empty (null) and explain in `notes`. Never estimate, never fill provenance from memory. |
| `domain` | `solid_flammability`. SAME experiments are `smoke_detection`. FLEX (droplets) is never carded. |
| `fuel_material` / `material_class` | Normalized name (e.g. `PMMA`, `cotton_fiberglass`, `nomex`); class is one of thermoplastic · fabric · aramid_fabric · insulation · other. |
| `fuel_form` | flat_sheet · rod · fabric · thick_slab |
| Numbers | Normalized units: `thickness_mm`, `o2_pct` (volume %), `flow_cm_s`, `pressure_kpa` (1 atm = 101.325 kPa), `spread_rate_mm_s`. The original units stay in the verbatim quote. A value that is only plotted (e.g. read off a figure) is not "stated": leave it null. |
| `outcome` | sustained · extinguished · transition · partial. Never force a non-ignition row into these to raise the card count. |
| `key_observation_quote` | Verbatim from the source, with original units. |
| Changing conditions | Use `condition_changes`, e.g. `[{"parameter":"flow_cm_s","from":10,"to":2.2,"stored":"final_held","note":"… (p.5)"}]`. Never store a changing condition as if it were constant. |
| Provenance | `source_page`, `source_figure`, `source_table`, `source_section`, `ntrs_id`. The quote's page and the figure's page often differ; record each where it really is. |
| `media_url` | Only a still from R2's media ledger. Leave empty otherwise. |

4. **Publish.** Type your **own full name** in *Verified by (your full name)* and press *Verify & publish*. Publishing
   means you checked every non-null field against the source yourself. Role names ("R1", "Coder A") and placeholder
   words (test, example, TBD, unknown…) are rejected by both the server and the database.
5. **Never publish for someone else.** If you can't verify it yourself, press *Save draft* and hand it over.
6. **Corrections.** Reopen a published card, fix it and save. Saving un-publishes it until someone re-verifies it. The
   catalog revision changes, so cached briefings for the old version are dropped automatically.
7. **Check it went public.** The live console header count goes up, and the card appears on the Evidence Map / in the
   Match Panel for a matching scenario.

**Before Day 1 (allowed now):** the Round 5 fact-check queue, `docs/FACT-CHECK-QUEUE.md`: environment presets and context entries (not catalog cards).

**Verification sprint agenda (Day 1, Sat 2026-11-14)**
- [ ] Re-verify and publish the 3 seed cards (BASS GMT96-T7, BASS GMT96-T8, BASS-II GMT45-T4).
- [ ] Decide GMT45-T4: card it with the held flow (2.2 cm/s) plus its `condition_changes` qualifier (current choice), or keep it out of constant-flow comparisons (DECISIONS-ROUND2).
- [ ] Next sources in order: complete BASS-II runs → Saffire I/II/IV → obtainable MIST papers (DECISIONS-ROUND3 #5).
- [ ] When a real wire/cable insulation card or cargo packaging card is published, send Coder A its exact `fuel_material` (this activates two presets).
- [ ] Tell Coder A when the seeds are live: that starts the integration checkpoint (demo cache, full flow on real cards, forced-Gemini proof, acceptance run).
- [ ] With R3: pick the mission case from the published cards (≥3 strong matches + one clean gap), never scripted.

"Done when" for every card: it survives a line-by-line challenge against its source by the person whose name is on it.

## 13. Changelog of this file

| Date | main | Change |
|---|---|---|
| 2026-11-10 | `e12c4e6` | First version, after the console merge |
| 2026-11-10 | `12c3b43` + patch | Day count confirmed; §12 card-verification guide; PageSpeed re-run + bundle regression |
| 2026-11-10 | `3d257b0` + patch | Re-baselined to the official start (Sat 11-14 = Day 1); §5 event-window plan; FAQ conflict and development timeline; Round 4 decisions; §12 agenda moved to Day 1 |
| 2026-11-10 | `21bb12c` + patch | Console code-split shipped; PageSpeed row updated; §5 prep rows unblocked |
| 2026-11-10 | `round5` | Round 5 (Pyroverse content): timeline, WOW Burmese row, §5 prep rows, Round 5 decisions summary, next actions, codebase, §12 pre-Day-1 fact-check pointer |
| 2026-11-10 | `round6` | Round 6 (upgrade review adopted): timeline, §5 build row, Round 6 decisions summary, next actions (Coder B queue, R1 smallest set, R3 questions), codebase, test count |
| 2026-11-11 | `round6-a` | Round 6 console merged: timeline, §5 build row, Burmese key count, Coder B next action, test count |
| 2026-11-13 | `b7602ba` + docs | Prep frozen: header, snapshot, timeline (3 rows), §5 frozen row, scoreboard (live empty states, health, DB 16/16, export), risk (0004), Coder A next action → Day 1 runbook |
