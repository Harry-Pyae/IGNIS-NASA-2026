# Round 6 decisions (Coder A, 2026-11-10)

Recorded by Coder A (team lead) after the review "IGNIS feature and design upgrade review 2026-11-10" (kept unedited
outside the repository, like its predecessors). The review is adopted in full; these rulings fix ownership and order.
Round 2–5 decisions stand.

**Preparation-window rules hold:** no card extraction or verification before 2026-11-14; production holds real data
only (briefing cache included); no fixture points on the public site; the Mission Brief and UNTESTED blocks stay
completely still; choreography and telemetry stay cut.

**Direction:** one experience with three visibly separate layers: **your scenario** (editable inputs, origin clear),
**observed evidence** (verified experiments, conditions, quotations, sources), **research context** (separately
reviewed, outside the matching evidence). Success is a visitor following an observation back to NASA and correctly
explaining a catalog limitation, not more modules.

## Adopted

| # | Decision | Owner |
|---|---|---|
| 1 | **Guided mission as a first-class way in.** The landing gets two weighted choices: primary *"Start the guided mission"* (only once a reviewed case exists), secondary *"Explore the evidence"* (the console, no tour). Before readiness, show the availability line and keep exploration usable. Five steps with a short task each, a text label ("Step 3 of 5"), Back / Next / Explore freely; progress dots only as extra navigation with accessible names; captions beside the relevant section, not a covering modal. Leaving the guide keeps confirmed inputs. Presenter-led preset stays the fallback. | B; A gate + copy; R1/R3 content in the event window |
| 2 | **Current-investigation summary.** *Your scenario* (material · form, Edit), *Conditions* (O₂ · flow, or "not specified"), *Evidence* (eligible · plotted · missing plot coordinates; top matches labelled separately). No confidence percentage or safety score. Desktop: directly above the map. 390px: a compact wrapped block, not another sticky bar. Reuses the revision-binding contract. | B; A copy |
| 3 | **Environment presets say exactly what they change.** Once R1 signs one: its source, *"Sets oxygen and pressure only."*, the editable values with original units, and optionally *"Oxygen updated · Pressure updated · Other inputs unchanged"*. A Moon-related context applies atmosphere inputs to retrieval only. It never implies lunar-gravity modeling. Proposed atmospheres carry a source-specific label (the exploration preset is now *"Proposed exploration atmosphere (Moon base)"*). | A + R1; B rendering |
| 4 | **The selected experiment anchors the page.** Dot, card and citation reveal the same experiment (existing stable IDs and citation mapping); quote and source location in one consistent disclosure area with a route back. Real ledgered stills on the mission's cards first, a stable image area, a clean text card when absent, *"Campaign context"* when the exact-test association is unproven. Never decorative art in an evidence image slot. | B; R2/R1 media |
| 5 | **Reviewed context after the mission.** A small *"Understand the research"* section labelled *"Research context — not matched evidence."*, grouped by visitor questions (where it happened, what it studied, why it matters), signed entries only, each with its source. Omitted entirely if nothing is signed. Droplet, smoke and gaseous topics never enter the solid picker, match counts, map, Brief or comparisons. | B; A contract; R1 review |
| A–E | **Design sections A–E enter as review criteria** for Coder B's self-review and R3's QA, **not** a mandated rearrangement (tables below). The map stays the main evidence surface; no wide sidebar, module destinations or marketing sections before the task. | B, R3 |

## Deferred

| # | Item | Cut rule |
|---|---|---|
| 6 | **Metadata browsing** (filter loaded verified records by material, campaign, test ID; context in its own list; no new service, embeddings or LLM; labelled as browsing, never a change to matching; Burmese aliases only after the MY gate). | Only after the mission, media and QA. If the small catalog is already easy to navigate, don't add it in the event. It's the **first new idea to drop**. |

**Stays cut (no new names):** generated telemetry, safety scores, 3D chamber, chat bot, audit certification,
comparison animation, plus everything Round 4 #4 and the Round 5 rejected list name.

## Coder A: this patch

- **Copy** (`src/lib/copy.ts`): `landingCta`, `missionAvailability`, `summary` (scenario / conditions / evidence;
  eligible, plotted, missing plot coordinates and top matches as distinct counts), `environmentExplanation`,
  `environmentApplied`, `contextBanner`, `campaignContext`.
- **Contracts:** `evidenceViews()` already exposes every count the strip needs (`eligible`, `plotted`, `not_plotted`,
  `top_k`), so no contract change. The revision binding moved into named helpers, `briefingKey()` and
  `currentBriefing()` in `src/engine/views.ts`, which the console now uses (no behavior change).
- **Gates:** `missionEntry()` / `MISSION_CASE` in `src/engine/mission.ts` (unavailable until a case reviewed by a named
  person and built from currently verified cards exists); `contextSection()` in `src/lib/context-content.ts` (null when
  nothing is signed).
- **Tests:** `tests/round6.test.ts`.

## Coder B queue (ordered; rebase on `main` first)

1. **Mission wiring.** Entry from `missionEntry(catalog)`: while `unavailable`, render `message` visibly (not a tooltip)
   and keep *"Explore the evidence"* working; *"Start the guided mission"* is primary only when `available`. Five steps,
   "Step 3 of 5" text labels, Back / Next / Explore freely, captions beside the relevant console section (not a modal
   over the map). Leaving the guide keeps the confirmed inputs. Demo-guide pattern from Round 5 applies.
2. **Current-investigation summary.** `COPY.summary` labels over `evidenceViews()` counts; desktop above the map, a
   compact wrapped block at 390px. Show the Brief only through `currentBriefing()`, never a stale one.
3. **Stills on mission cards.** Ledgered assets only; a fixed-ratio image area (no layout jump); a clean text card when
   there's no image; `COPY.campaignContext` when the association with that exact test is unproven.
4. **Match Panel field alignment.** Material/form, oxygen, airflow, thickness, pressure, outcome in the same positions
   on every card; units beside values; tabular numerals; long IDs wrap; changing-condition qualifiers (GMT45-T4)
   beside the affected value. No winners or "best material" badges.
5. **Context section.** Render `contextSection()`: nothing when it returns null; otherwise `banner` and the entries,
   each with its source link, in a quieter style that never reuses `[E1]` citation styling.
6. **Self-review with R3** against the tables below at desktop and 390px.

Only after all six: the static two-card comparison view (Round 4 #3). Also: when a signed environment preset is
applied, show `COPY.environmentExplanation` and optionally `COPY.environmentApplied` in the Environments row.

### Review criteria B: separate inputs, observations and interpretation

| Information | Treatment | Avoid |
|---|---|---|
| User inputs | Neutral controls; explicit "Your scenario" label; white scenario marker | Making an input look like a NASA measurement |
| Observed outcomes | Existing outcome colors plus text/symbols | Green/red safe–unsafe coding |
| Selected experiment | Selection outline that keeps its outcome color | Recoloring the observation to show selection |
| Missing measurements | "Not reported" or "Not specified", as appropriate | Zero, invented values or a universal "unknown" badge |
| Catalog gaps / outside range | Existing distinct pattern/symbol and bounded explanation | Hazard gradients or a claim about all NASA research |
| Supported interpretation | Its own labelled static block | Presenting interpretation as direct observation |
| Reviewed context | A separate quieter section with its own sources | Reusing `[E1]` citation styling as if it were matched evidence |

Color always has a text or shape counterpart.

### Review criteria A, C, D, E

- **A, hierarchy** (compare with the approved design; not a mandate): header (catalog status · sources · export) →
  hero with one explanation and the two CTAs → 01 Scenario (material presets, signed environment presets, editable
  conditions, confirm) → 02 Observations (summary, full-width map + legends, selected test details) → 03 Compare and
  inspect (aligned cards, stills, quotes, exact source locations) → 04 Mission Brief (completely still) → 05 Catalog
  gaps (static) → Understand the research (reviewed context only).
- **C, alignment:** the Round 4 field order; a shared field table only if uneven card heights break comparison; no
  causal explanations of differences.
- **D, typography and space:** body size for quotations and limitations, small uppercase mono only for short labels;
  group with spacing and borders before nesting another panel; solid backgrounds behind evidence; at 390px cards
  stack, chips wrap, quotes never scroll sideways; generous touch targets and visible focus on guide and citation
  controls.
- **E, motion:** no spring effects imported; Brief and UNTESTED still for everyone; other motion behind the existing
  preference guard; static selection outlines and reliable focus changes instead of animation.

## Handoffs (unchanged, referenced)

- **R1:** `docs/FACT-CHECK-QUEUE.md`. Start with the **smallest defensible set**, not all 17 context entries: the
  presets the mission needs and the few context entries that answer the section's three questions.
- **R2:** `docs/media-ledger.md` before any still ships (including the 4 practice-build SVS images, Round 5).
- **R3:** the `docs/MY-REVIEW.md` gate (MY ships complete and reviewed, or EN-only). Add these to the test script
  for the three-person usability test (they extend Round 4's list). Can unfamiliar users:
  1. explain the purpose from the opening screen?
  2. complete the investigation without a presenter pointing at every control?
  3. open the original source for a real observation?
  4. distinguish a scenario input, an observed result and an interpretation?
  5. explain a catalog limitation without calling it a safety verdict?
  6. And ask: *"What did IGNIS let you discover that a page of papers didn't?"* (a good answer names retrieval,
     comparison, traceability or visible gaps, not an attractive dashboard).

  Record the step where they hesitate; that's fixed first.

## Event addendum (2026-11-14, team lead)

- **Tier 1 build during the event is authorized** by the team lead, scoped in `docs/WHO-DOES-WHAT.md`. It overrides the
  prep-freeze "bug fixes + runbook only" rule for those verticals only. Tier 0 (the submission) still comes first.
- **Evidence Library reopens the Round 6 "metadata browser" cut.** That cut was made for a 0-card catalog. The library
  ships with an honest small-catalog empty state, and its filters never touch matching.
- **Accounts (Tier 2, V6) stay unbuilt** unless Tiers 0–1 are green by Day 2 10:00. If they open, this line is
  replaced by a named override of the Build Plan's "no accounts" rule.
- **Routing stays a pathname switch.** `'/name/*'` keys match one extra segment (`src/main.tsx`). No React Router.
- **Dataset provenance (0005)** adds optional `psi_investigation_id`, `dataset_doi`, `dataset_version`, `dataset_file`
  and `dataset_row_or_time`. They're curator-entered (never extracted by the LLM), null when not recorded, and shown as
  a second citation line only when present. `datasetCitation()` in `src/lib/evidenceSource.ts` is the one formatter
  used for the console card, the detail page and "Cite this". 0005 goes to production **before** the code that writes it.
- **No `no_ignition` outcome during the event.** The paper's two failed ignitions at 16.4 % O₂ fit none of the four
  outcomes. They stay in R1's research queue. Adding an outcome is a post-event contract change, because it touches
  the map legend, chips and copy. They're never forced into an existing outcome.
- **Shared-file sign-off: Coder C's `Console.tsx` diff** (`share-and-compare`, `6f3d0ae`). Reviewed by Coder A. The
  banner, copy button and comparison link are accepted. One condition: restoring a share link must **not** call
  `setConfirmed`. A link re-runs deterministic retrieval only, and the Brief generates only when the visitor confirms
  (spec plus quota: ten opens of one link must not mean ten generations). Coder B is told her file changed.
- **Copy note for R3 (pitch, README).** Echo the challenge's own words: data that is "hard to find, harder to compare,
  harder yet to interpret". IGNIS finds, compares and interprets it, with citations. Present detection and suppression
  investigations as context only, per the challenge's scope note. For export, write "export gives modelers traceable,
  cited inputs". IGNIS's own copy never uses "predict"; quote the challenge text with attribution if you need its wording.
- **UI consistency pass (2026-11-14).** Buttons come in three tiers, defined once in `buttonStyles.ts` and shown with
  do/don't in `/kit`: primary (filled), secondary (outlined) and tertiary (text link). `ghost` stays for the curation
  tool only. Every button has a ≥44 px hit area and the token focus ring; no input suppresses its outline. There is one
  "Edit scenario" control. Cite this and Compare share one row. A single ID on `/compare` opens a comparison instead of
  a dead end. External links open in a new tab. The console re-checks the catalog revision, like `/sources`.
- **Investigation workbench (2026-11-14), Coder A on Coder B's surface.** At ≥1280 px, section 01 is a sticky control
  rail (Confirm pinned at its bottom) and 02–05 form the evidence column, so a slider change shows on the map with no
  scrolling. Confirm lands on 03 with the plot still on screen. Below 1280 px a condensed condition bar (fixed, so no
  layout shift) offers "Jump to map" / "View evidence"; there's no auto-scroll after Confirm there. Before Confirm,
  03/04 are slim one-row steps; 05 labels its scope in both modes. Deviations from the request, with reasons:
  1. The preset chips moved out of the collapsible editor, which now starts closed. With the editor open, the sliders
     sat below the rail's fold at 900 px.
  2. The closest-match chips sit below the sliders in the rail, for the same reason. The match cards repeat them.
  3. The investigation summary is no longer sticky on desktop. It covered the top of the plot, and the rail carries the
     context there.
  4. The region-card line is worded about the region's *cells*. A region's range can contain tested runs: the current
     18–22 % × 2–12 cm/s outline contains all 3 verified runs.
- **Round 8, Coder A (2026-11-14).** Each item: verified behaviour, plus anything still waiting on a person.
  - **A1:** the secret was rotated by the team lead, and production now refuses the old value (401). The documented
    local secret is refused on any deployment, including for the debug/provider headers. The three curator routes
    share a 30/min per-IP limit, checked before the secret. Read-only audit: 3 verified cards, 0 drafts, no card
    edited after R1's publish, revision unchanged. Still to do (team lead): check the Vercel logs for `/api/curate-*`
    traffic between 04:17 UTC and the rotation.
  - **A2:** curate writes are compare-and-set on `(id, updated_at)`. A stale tab gets a 409 with the current version,
    and `/curate` keeps the curator's edit, shows a field diff and offers an explicit choice. A failed list refresh
    after a save is reported and retried on its own; it never re-submits. The curate form also keeps a per-tab draft
    (form fields only, never the secret or the signature), offered for restore and never applied automatically.
  - **A3:** `retrievalState()`: only a settled catalog read can state a count. B wires the remaining surfaces.
  - **A4:** "on the map", "outside the map's axes" and "missing coordinates" all come from the map's own partition.
  - **A5:** a parse in flight is cancelled by any edit; its result, error and pending state are ignored.
  - **A6:** `MISSION_CASE` now needs `reviewed_versions`: each selected card's `updated_at` at review time. Copy
    them from `/api/export` when signing the mission.
  - **A7:** `presetAvailability()`, the data for B4.
  - **A8:** share links carry the ranked cards' versions, so a reopened link reports a cited card updated since,
    and never claims an exact rebuild.
  - **C1 (error boundaries)** was not done as Coder A's fallback, because Coder C is active.

## Submission-day rulings (2026-11-15, team lead)

1. **Outcome `no_ignition` added** ("ignition attempted; the sample did not ignite"). Migration 0006 (applied to
   production by the team lead), types, map marker, legend, badge, library filter, export, claim validator. An
   observation like any other outcome: retrievable, no special ranking, and its grid cell counts as tested.
2. **Saffire V-3 / V-4 (PMMA) approved** as in `docs/PMMA-DECISION.md`: outcome `sustained` with the flow change
   20 → 5 (held 300 s) → 0 recorded, and the wording "Burned at the test flows; extinguished when ventilation
   stopped." Never "extinguished at 20 cm/s". V-4 is a ribbed / structured 10 mm `thick_slab` in **opposed** flow
   (Table 1), not a flat sheet.
3. **Silicone sheets 2-1…2-4: `no_ignition` approved.** NASA's own summary is "none of the silicone samples
   burned"; each card carries the full tiny-flame quote verbatim so the nuance stays visible. Confirmed per card at
   signing.
4. **Silicone `material_class` stays `other`.** The Cable insulation preset is not filled with sheet samples, by
   the same logic as the Round 8 ruling: a rod can't stand in for a cable jacket, and neither can a sheet. The preset
   keeps its empty-state copy ("No verified flight test of this material class in the current IGNIS catalog. Pick a
   material to explore."), and the pitch says so: "we had a way to fill this preset and declined — the geometry
   didn't match."
5. **Still parked:** rows with no stated outcome; "Reused" samples (a prior burn alters the sample); "No Blow-off"
   (a reading is proposed in `docs/R1-QUEUE.md`, not published); Saffire IV-2 (`partial` only once it has an
   approved definition).
6. **USML-1 Wire Insulation Flammability (WIF) enters scope** as a deliberate campaign + geometry extension: new form
   `insulated_wire` (Zod + form gate; the DB has no form constraint, so no migration). Only the insulation is the fuel;
   the wire core and the igniter wire are apparatus. A rod or a sheet never stands in for it. The Cable insulation
   preset maps to polyethylene `insulated_wire` and says plainly that the evidence is from USML-1, a 1992 Space Shuttle
   glovebox experiment, decades older than BASS and Saffire. Source NTRS 20030075805: three runs drafted (WIF-A, -B, -D,
   `docs/SIGNING-SESSION-USML1.md`); WIF-C parked (flame held at the igniter, never spread). O₂ and pressure are not
   stated in the source and stay null, so these runs are retrievable but not plotted.
7. **Cargo packaging → Silicone sheet.** A source hunt found no in-scope flight run of a packaging-class material
   (searched list in `docs/R1-QUEUE.md` §3). The tile is replaced by "Silicone sheet" (the four Saffire-II silicone
   `no_ignition` runs; neutral name, class `other`, no insulation claim). The honest statement moved, it didn't
   disappear: a line under the Gap Radar reads "Cargo packaging: no verified flight test of a packaging material in the
   current IGNIS catalog. A candidate area for further study.", and the pitch roadmap lists it.
