# IGNIS — state handoff (2026-11-10, console merged · preparation phase)

> **2026-11-15 13:05: DATA RESTORE in progress — 19 of 31 cards public.** 12 published cards had O₂/flow (and II-5
> class/form) edited off their sources to spread the map. All 21 fields are back to source values as **drafts**
> (revision `a0363adf…` → `1db4eaa3…`); the team lead re-verifies and republishes them from
> [SIGNING-SESSION-RESTORE.md](SIGNING-SESSION-RESTORE.md) (batches R1–R3). Guard: `tests/fixtures/source-values.json` +
> `tests/source-values.test.ts`; `npm run verify:live` fails on any off-source or unlisted published card (passes 19/19).
> Map crowding solved honestly in the UI (`51d5faf`): stack run switcher + clickable hover list, continuous soft-masked
> hatch. Video: every clip/PNG/walkthrough recorded at `a0363adf` is invalid; the re-capture is staged to start when all
> 31 cards are source-true again, and the render gates block `--final` until then. Final submission cut = The Demo
> (casual VO, 8 lines, planned 29.97 s, `vo-demo-01…08`). **The Story stays watermarked** until R1 signs the Apollo 1
> and Mir heritage entries (FACT-CHECK-QUEUE.md). Open: Moon-base preset signature (R1), green-flash quote (R1) + frame
> (R2: `GREEN_FLASH` still null at 12:30), 3-stranger test (R3).

> **2026-11-15 10:45: catalog work complete.** Live = `main` (`36f43e9`). **31 verified cards, 8 NASA campaigns, 5 source
> reports, 0 drafts**, revision `a0363adf…`: BASS, BASS-II, Saffire-I, -II, -IV, -V, -VI and USML-1 WIF. Outcomes: 15 sustained,
> 7 extinguished, 9 did not ignite. Verified evidence spans 16.4–31 % O₂ (27 runs report it) and 54.1–101.3 kPa (21 report it);
> source papers 1994–2024. All signing sessions are signed: SIGNING-SESSION (11), the no_ignition addendum (9), USML-1 (3),
> Saffire VI addendum #2 (4 + Saffire II-7). Shipped today: guided tour, outcome `no_ignition` (migration 0006), form
> `insulated_wire` (USML-1), presets Cable insulation (polyethylene) and Silicone sheet (Cargo packaging moved to a Gap Radar
> line), map O₂ axis to 32 %, co-located-run stacks, laptop breakpoint 1200 px. Open: the Moon-base preset (34 % / 8.2 psia)
> waits for R1's signature; green-flash Beat 1 waits for R2's frame; screen-recording session after "catalog final".

> **2026-11-14 evening: current state.** Live = GitHub `main` `96262b4` (`Harry-Pyae/IGNIS-NASA-2026`, public);
> the live page serves the same asset hashes as a local build of that tree. On top of the frozen prep: Round 8
> (`IGNIS_FIX_ROUND8.md`: Coder B's console fixes, Coder C's error boundaries / Specimen Explorer / evidence handoff,
> light theme), the 60-second case (`/case`, `POST /api/check-claim`) and Round 9 (`docs/IGNIS_REVIEW_ROUND9.md`:
> case rebuild, `/help`, shell diet, P0 fixes). Sweep: typecheck · lint · 280 tests (22 skipped) · build. Catalog:
> 3 verified, 11 drafts queued for R1 (`R1-QUEUE.md`). Open: runbook steps b, e, g, h (`EXECUTION-STATUS.md`).

> **2026-11-14 04:17 UTC: the catalog is no longer zero.** R1's reviewers published 3 verified cards (BASS GMT96-T7,
> BASS GMT96-T8, BASS-II GMT45-T4; NTRS 20150008962), revision `becd7b54435772eaf9f7499a69267ad5`. The real-data
> sequence passed on production the same day: step c (Groq), the warmed cache, and the forced-Gemini synthesize proof.
> Details are in `QA-LOG.md`, "Real-data production checks".

> **2026-11-13: prep complete, frozen for the event. Only data and the Day 1/2 runbook items remain.**
> Live = `main` `b7602ba` (unified-spec prep `82c63d2` + mission gate `45568e3` + map axes from GRID `b7602ba`),
> pushed on the team lead's instruction. Sweep: typecheck · lint · 219 tests · build · disposable DB 16/16 · CI green.
> Live verified (1280 + 390 px): empty map, 0/0/0 counts, mission availability line, context omitted, no errors,
> export `count 0`, health-llm (once) Groq + Gemini lite 200. Catalog: 0 verified, 3 drafts. Migration 0004 not yet
> applied to production (runbook step 0). **[EXECUTION-STATUS.md](EXECUTION-STATUS.md) is the single Day 1 runbook**:
> order, owner, "visible when" and rollback per step. Code changes during the event: bug fixes and runbook items only.
> The older snapshot below is historical.

> **Official timer:** Saturday 14 November to Sunday 15 November 2026 (14-11 to 15-11).
> For the project timeline and event tasks, see the [milestones](MILESTONES.md) and [submission checklist](submission-checklist.md).
> Schedule: `docs/MILESTONES.md` §5.

Snapshot written by Coder A after the console merge. Overwrite on the next handoff.

## Main and the live site

- **Round 6 console (2026-11-11):** Coder B's `3720163` + `dcf5fd3` with Coder A's review fixes (`round6-a`): guided mission (controls inside each step's caption; opens only for a reviewed case, so hidden until the event), current-investigation summary (whole-catalog counts flagged until the scenario is confirmed), stills with a visible "Campaign context" label, aligned Match Panel fields, signed-only context section, map selection that stays on the map. Click-through on the disposable DB, with the gates temporarily signed and then reverted: all five mission steps, Explore freely keeps inputs, stills label at 1280/390, no page scroll at 390, no errors. 207 tests; MY-REVIEW at 144 keys.
- **Round 6 (2026-11-10):** the feature and design upgrade review is **adopted** (`docs/DECISIONS-ROUND6.md`; the review file stays uncommitted in `reports/`). Coder A shipped the approved copy (`COPY.landingCta`, `missionAvailability`, `summary`, `environmentExplanation`, `environmentApplied`, `contextBanner`, `campaignContext`), the mission-entry gate `src/engine/mission.ts` (`MISSION_CASE = null` until a reviewed case exists), `contextSection()` (null until an entry is signed) and the revision-binding helpers `briefingKey()` / `currentBriefing()`. No visible change on the live site: Coder B renders all of it. 205 tests.
- **Round 5 (2026-11-10):** `src/engine/environments.ts` (Environments row in the console, hidden until R1 signs a preset), `src/lib/context-content.ts` (renders only signed entries; no importer yet), `src/i18n/my.draft.ts` (UNREVIEWED, CI guard: nothing may import it). R1 queue `docs/FACT-CHECK-QUEUE.md`, R3 sheet `docs/MY-REVIEW.md`. 197 tests.
- **main:** the `round6` merge, on top of Round 5, the Apache-2.0 license, the console code-split (`21bb12c`), the console merge, the match-summary wording and the lite/region change.
- **Live:** <https://ignis-nasa-2026.vercel.app>, serving Round 6. Vercel Production deploys from `main`; CI (check + disposable-DB) is green on every `main` commit. Vercel builds one at a time, so a merge can wait ~15 min behind branch previews. Functions are pinned to `iad1` (`vercel.json`).
- **Deployed:** the landing page, **the mission console** (scenario builder, Evidence Map, Match Panel, Mission Brief, Gap Radar), `/curate`, `/kit`, plus the API routes:
  - `parse-scenario` (LLM)
  - `synthesize` (validated claims + briefing cache keyed by `catalog_revision`)
  - `extract` (curator only; worked BASS example in the prompt)
  - `curate-write` / `curate-cards` (curator only)
  - `export` (verified cards + schema README; wired to the header and footer buttons)
  - `health-llm` (curator only)
  - Failover rehearsal: `x-ignis-provider: groq|gemini` + curator secret forces one provider on parse-scenario and synthesize; forced synthesize bypasses the briefing cache. Steps: DEPLOY-RUNBOOK §3 (R3's demo-day checklist).
- **Console (Coder B, merged 2026-11-10):** built on `useVerifiedCatalog()` + `evidenceViews()` + the engine, never on fixtures. Unstated O₂ and airflow stay `null` and show "Not specified"; "Set to 21% (cabin air)" / "Set airflow to 0 cm/s" set explicit values. The map draws tested points, hatched untested cells and dashed outside-range cells as three states, clips points to the axes and counts the records it can't plot. English strings live in `src/i18n/` (Burmese only after R3's reviewed set).
- **Match summary (DECISIONS-ROUND3 #10):** "Compared on N of 4 parameters · …" names why every uncounted parameter is uncounted (`MatchResult.unscored`).
- **One snapshot:** synthesize, export and the browser loader read rows + `catalog_revision` together (`src/lib/snapshot.ts`). Header and body share one catalog summary store, and counts and rows reconcile to one revision.
- **LLM (final, DECISIONS-ROUND3 #11):** Groq `openai/gpt-oss-120b` first, then Gemini **`gemini-3.5-flash-lite`**, now the code default as well as the Vercel `GEMINI_MODEL` value. Lite is the permanent backup and **flash checks have ended**. `GROQ_MODEL` / `GEMINI_MODEL` still override.
- **Local dev:** Groq answers `403 Access denied` from the team's network, so every local parse and Brief fails over to Gemini (lite by default). That's expected: don't "fix" the key (README, `.env.example`).
- **Database:** Supabase project `zvzofutgfwzptlbfibpz`, migrations 0001–0003 applied. Catalog: **0 verified, 3 drafts** (live header, 2026-11-10).
- **History** was rewritten on 2026-11-09 (all branches). If your clone predates that, stash your work, then run `git fetch origin && git reset --hard origin/<branch>`.
- **Decisions:** `docs/DECISIONS-ROUND2.md`, `docs/DECISIONS-ROUND3.md` (#9 shared-primitive sign-off, #10 match summary, #11 lite permanent), `docs/DECISIONS-ROUND4.md` (evidence-investigation mission, ledgered stills, staged comparison, rejected list), `docs/DECISIONS-ROUND5.md` (Pyroverse content: environment presets, Burmese draft, context content, handoffs, rejected list), then `docs/DECISIONS-ROUND6.md` (upgrade review: mission entry, summary strip, preset explanation, anchored selection, context section, design review criteria, Coder B's ordered queue).

## Pull requests

**No PRs are open.** `console` was merged locally (no PR was opened for it). Earlier: #8, #12, #14 merged (and #2, #4, #5, #6, #7); #1 and #3 were closed by a branch rename and continued as #4 and #5. Fully merged branches that can be deleted: `cache-and-export`, `live-urls`, `llm-models`, `matching-engine`, `rate-limit`, `state-doc`, `round3`, `state-round3`, `prod-data-rule`, `gemini-quota-rule`, `provider-switch`, `failover-docs`, `still-air-rule`. Keep `console` and `features` for Coder B/C.

## Live-check scoreboard

| Check | Result |
|---|---|
| **Console against the production catalog** | ✅ `a053e14`, 1280 px and 390 px: every section shows its honest empty state before and after Confirm (no map SVG, so no fixture dots). No `/api/*` requests, no page errors, no horizontal scroll. Header "Catalog in verification — 3 cards in review". |
| **Console click-through (disposable DB)** | ✅ 2026-11-10, Edge: presets, free text (still air → 0, O₂ unstated → null), unresolved-material picker, both "Not specified" sliders, Set/Clear, keyboard; the three map states and legend; points clipped with an outside-axes count; Brief still for every user (`.motion-still`, 0 animations); reduced motion stops all page animation; 390 px no page scroll. The DB held the 3 seed drafts, published under the lifecycle-test reviewer name, plus 2 `QA-` rows (throwaway, deleted with the DB). |
| Synthesize round trip | ✅ round 3: status ok via Groq, 0 withheld; `catalog_revision` matches the catalog; `E1` maps to the card's UUID; second call served from cache. ⚠️ Used a temporary test card in production. **Not to be repeated:** the next production run uses R1's real cards. |
| Synthesize on Gemini lite | ✅ locally against the disposable DB (Groq 403 → Gemini lite): 2 validated Briefs, then cache hits. Production proof still waits for R1's first card (failover row below). |
| Verified-catalog loader against production (anon) | ✅ round 3: `empty`, revision `empty`, 0 invalid; not-configured and error paths distinct; radar `no_plottable_evidence` |
| Export (header + footer, live) | ✅ round 3: `ignis-catalog-empty.json`, `count: 0`, 33-field README, no fixtures |
| health-llm | ✅ 2026-11-10 on `3e9efff`: groq 200, gemini `gemini-3.5-flash` 200 (the final flash check; the quota had recovered). No key material in responses |
| Failover rehearsal: forced Gemini parse-scenario | ✅ 200, `provider: "gemini"`, schema-valid, resolves via the deterministic resolver. Header without the secret is ignored (`provider: "groq"`, no mention of the switch) |
| Failover rehearsal: forced Gemini synthesize | ✅ 2026-11-14, production, real cards: 200, `provider: gemini`, status ok, 3 OBSERVED claims, 0 withheld. The public cache still answered `cache` afterwards; the next unforced parse was `groq` |
| **Synthesize on real cards (step c)** | ✅ 2026-11-14, production: *Crew clothing* preset, 3 cards retrieved. Groq generated status ok, 3 OBSERVED + 1 SUPPORTED, 0 withheld, every cited value equal to its card, NTRS source and PDF open. Second call `provider: cache` (warmed) |
| Disposable-DB CI job (RLS + lifecycle, migrations 0001–0003) | ✅ green on `a053e14` |
| Provider smoke test + parse-scenario round trip | ✅ 200 via Groq |
| RLS + `/curate` lifecycle | ✅ 15/15 on the disposable DB in CI (every push). Earlier live-project runs wrote test rows, so they are **not to be repeated**; production gets read-only checks only. |
| Rate-limit 429 (0003 applied) | ✅ 20 allowed, then 429 with `retry-after`. Fails open if the counter is unreachable. |
| og:image / canonical / og:url | ✅ absolute `https://ignis-nasa-2026.vercel.app` URLs |
| PageSpeed mobile | ✅ 2026-11-10 after the console code-split (`21bb12c`), Lighthouse 12.2 mobile with devtools throttling from the dev machine (the Google API's keyless quota was exhausted both times): **Performance 83** (79 before the split) · Accessibility / Best Practices / SEO 100 · FCP/LCP **3.5 s** (4.0) · TBT 40 ms · CLS 0.001 · unused JS at first load **0** (42 KiB). Landing JS **57.2 KB gzip** (95.6 before the split, 55.3 before the console), and Zod is off the landing path again. The absolute times are network-bound on this path (200 ms RTT, 560 ms for the HTML), so they aren't comparable with the old Google-server run (FCP 0.8 s). Re-run from Google's servers when the quota resets. |
| Favicon tab screenshot | ⏳ R3, in the QA checklist |

**Measurement rule:** PageSpeed or Lighthouse with `--throttling-method=devtools` is the reference. Never use simulated Lighthouse from a VPN-routed dev machine.

**Production-data rule (2026-11-09, AGENTS.md guardrail):** never create, publish, edit or delete records in the production catalog or its briefing cache for testing, labeled or temporary. Round trips without verified data run on the disposable DB or wait for R1's signed cards.

## Open risks

| Risk | Impact | Owner / next step |
|---|---|---|
| ~~Forced-Gemini synthesize unproven on production.~~ | **Resolved 2026-11-14:** forced Gemini synthesize on real cards returned status ok, 3 OBSERVED, 0 withheld (`QA-LOG.md`). | — |
| **No mission case.** | `MISSION_CASE = null`: the landing shows the availability line, and the video's `mission-guided.mp4` can't be recorded. | R1 + R3 name the case and reviewer → Coder A fills it (runbook step e). |
| **Thin catalog.** | 3 verified of the 15+ target; 11 drafts wait in `/curate`. | R1: `R1-QUEUE.md`, easiest first. |

## Next actions

| Owner | Action |
|---|---|
| **R1** | ~~Re-verify and publish the 3 seed cards~~ (done 2026-11-14). Now: the 11 drafts in `docs/R1-QUEUE.md`, the coverage snapshot and the GMT45-T4 decision line in `docs/catalog-coverage.md`. Source order after that: remaining BASS-II runs → Saffire I/II/IV → obtainable MIST papers (DECISIONS-ROUND3 #5). |
| **R1** | Card a real wire/cable insulation material and a real cargo packaging material, then send Coder A each card's `fuel_material`. This activates two presets (AGENTS.md → Open handoffs). |
| **R2** | A few correctly associated, ledgered stills before thumbnail count (DECISIONS-ROUND3 #6). |
| **Coder B** | Fast-forward `console` to `main` (`git pull --ff-only origin main`), then Round 6 queue #6: self-review with R3 (`docs/DECISIONS-ROUND6.md`). Shared primitives (`src/components/ui/*`) and `copy.ts` change only with Coder A sign-off (DECISIONS-ROUND3 #9). |
| **R3** | Add the Round 6 usability questions to the test script. QA the live console (390/1024/1440, reduced motion, export, empty/error/retry states); favicon tab screenshot; pick the demo scenario from R1's coverage note once cards exist. |
| **Team lead: environment setup** | Done. Optional: the Vercel `GEMINI_MODEL=gemini-3.5-flash-lite` value now equals the code default and can stay or go. |
| **Coder A** | Integration checkpoint, cache warm and forced-Gemini proof done (2026-11-14). Now: fill `MISSION_CASE` once R1 + R3 name the case (step e), re-warm the cache after the last publication (step f), set the cable/cargo preset materials when R1 sends them, then the final acceptance run (Build Plan §12). Bug fixes only otherwise. Low priority: PageSpeed "render-blocking ~150 ms" and "cache lifetimes 7 KiB" (`/art/(.*)` rule in `vercel.json`). |

## Deliberate deferrals left in code (no TODO or stub markers)

- `src/engine/aliases.ts:36`: "cable jacket" stays a class hint until R1 cards an insulation material.
- `src/engine/aliases.ts:102`: the Cargo packaging preset has no material until R1 names one.
- `src/main.tsx:19`: pathname switch instead of a router; add react-router only if Coder B needs nested routes.
