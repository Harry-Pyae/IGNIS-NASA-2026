# Who does what (Nov 14–15)

## Round 3 split (Nov 14, afternoon): real data, plain language, consistent pages

**The catalog is no longer zero.** As of 2026-11-14 04:17 UTC there are 3 verified cards (revision `becd7b54…`):
BASS GMT96-T7, BASS GMT96-T8 and BASS-II GMT45-T4. All three are cotton-fiberglass fabric, 0.32 mm, at 101.325 kPa.
The two branches waiting for merge now have their fixes: `library` shows photos with the "Campaign context" label, and
`share-and-compare` restores links unconfirmed.

Same rules as before. All new wording lives in `src/lib/copy.ts` (Coder A owns the approved copy), keyed for i18n,
under ~25 words per hint. Hints are static: no `anim-*` classes, and they never move inside the Brief or UNTESTED
blocks. Absence stays bounded to "the current IGNIS catalog". CI must be green before every PR.

### What the 3 cards show (from the engine, for R3's demo pick)

- **Strongest match:** the *Crew clothing* preset at 21 % O₂ and 10 cm/s matches **BASS GMT96-T7** on oxygen and
  airflow (sustained). Next comes GMT96-T8 (airflow differs: 5 cm/s), then GMT45-T4 (oxygen and airflow differ,
  conditions changed during the run).
- **Clean gap:** one region with no verified card, **18–22 % O₂ × 2–12 cm/s** (17 empty cells around the three
  runs). One bounded line describes it: no verified card sits between the 18.7 % run that went out and the 21 % runs
  that kept burning.
- **Outside range, a different state from a gap:** Moon-base oxygen (30 %) is outside the catalog's oxygen range on
  every card. Airflow below 2.2 cm/s is outside its airflow range.
- **Mission case candidate:** *Crew clothing* at cabin air puts all 3 IDs in its top 5, which meets the gate.
  R1 and R3 confirm it in `catalog-coverage.md`, then Coder A fills `MISSION_CASE`.
- **The limit to say out loud:** one material, one thickness, one pressure. Only oxygen and airflow vary, so every match
  compares on at most 2 of 4 parameters. R1's next cards should widen material and pressure.

### Layout and consistency problems found (all three coders fix their part)

| Before | After | Why |
| --- | --- | --- |
| `/curate`: save/publish errors show in a status panel at the **top** of the page (`Curate.tsx` ~233), while Save/Publish sit at the **bottom** of a ~35-field form (~365) | Error summary right beside the buttons, each bad field marked inline (`aria-invalid` + message via `aria-describedby`), focus moves to the first bad field | The person clicking Publish never sees why it failed. This is how R1's first publish attempt could fail silently |
| Console: inputs in section 01, results (matches, Brief, gaps) far below the map; clicking Confirm gives no sign anything happened below | After Confirm, focus and scroll move to a short results summary ("Closest match … · Brief below"), and a compact confirmed-scenario bar with "Edit inputs" jumps back | Cause and effect are a screen apart. The visitor can't see what their click did |
| Confirm is disabled while the material is unresolved, with no reason shown | The reason, in one line, next to the disabled button | A disabled button with no explanation looks broken |
| Page widths differ: Sources `max-w-4xl`, Methods/Library/Compare `5xl`, Console/Kit `6xl`, Curate `7xl`, 404 `3xl` | One `PageHeader` and page container primitive: content pages `max-w-5xl`, console and curate stay wide | Moving between pages shifts the layout, so the app reads as separate sites |
| H1 styles differ: `display text-4xl my-4` (Methods, Sources, Compare), `mb-6` (Library), `text-2xl font-semibold` (Curate), `text-3xl font-semibold` (Kit) | One heading style, with the same eyebrow label (`console-label`) and intro paragraph slot | Inconsistent type hierarchy reads as unfinished |
| Vertical padding differs: `py-10`, `py-12`, `py-20`, Console `pb-24` | One rhythm from the container primitive | Same reason |

### Coder A (`main`): real data, contracts, copy, the shared shell

1. **Standing order, now:**
   - Step c on production: scenario → match → synthesize → validated Brief, clicking each citation through to its card
     and source.
   - The forced-Gemini proof (runbook §3, once).
   - Fill `MISSION_CASE` once R1 and R3 confirm.
   - Warm the cache twice; the second response reads `provider: cache`.
   - Log everything in `QA-LOG.md`. Mark the moment in MILESTONES and STATE.
2. **Check migration 0004** in the SQL editor:
   `select indexname from pg_indexes where indexname = 'experiments_campaign_test_identity';`
   One row means it's applied.
3. **Migration 0005, in this order:**
   1. Run 0005 in the SQL editor.
   2. Fast-forward `main` to `provenance` and deploy.
   3. Check the dataset fields in `/api/export`, and on a card once B's line ships.

   Never deploy the code before the migration (every `/curate` save would fail).
4. **Merge** `library` and `share-and-compare` (squash; both histories carry duplicate commits from the rebase).
   Register `/library` and `/library/*`, then check live at desktop and 390 px.
5. **Plain-language copy in `copy.ts`:**
   - The input hints (b).
   - The result legends: chips, outcomes, Brief labels, map legend, "Compared on N of M" (c).
   - The glossary entries (d).
   - The first-visit line (e).

   Every anchored fact goes through R1 first (see "Copy checks" below). Hand the keys to B and C as soon as they land.
6. **`PageHeader` and page container primitive** in `src/components/ui/`, shown on `/kit`. Convert Methods, Curate,
   Kit and the 404 page.

### Coder B (`console`, `library`): the console's input side, the library, sources

1. **Input-to-result distance** (`Console.tsx`):
   - After Confirm: focus and scroll to a results summary.
   - A compact confirmed-scenario bar with "Edit inputs".
   - The disabled-Confirm reason, shown beside the button.

   Keep the narrative order (no redesign). Respect `prefers-reduced-motion`, so the scroll jumps instead of animating.
2. **Input explainers (b):** an `InfoHint` (Coder C builds it) next to each Scenario Builder label: material/form, O₂,
   airflow, thickness, pressure. The wording comes from A's `copy.ts` keys.
3. **First-visit line (e)** above the Scenario Builder, dismissible. Store the dismissal in `localStorage`, wrapped in
   try/catch. It shows the honest availability state: the mission start when `MISSION_CASE` is set, otherwise the
   existing availability line.
4. **Provenance line:** "Dataset: …" from `datasetCitation()` on the console card source block and the detail page,
   once 0005 is on `main`.
5. **`/sources` rework:**
   - Group by campaign.
   - For each campaign, list the NTRS paper and the PSI investigation DOI, linking to canonical DOIs in a new tab.
   - Add an "Official challenge resources" group (needs the challenge text in `docs/`).

   Then convert Library and Sources to `PageHeader`.

### Coder C (`features`): hints, the results side, the curate form

1. **`InfoHint`** in `src/features/hint/`, built from the existing primitives:
   - A small "?" button. Click, tap or focus opens a short panel. Escape and blur close it.
   - `aria-expanded` on the button, `aria-describedby` from the label to the panel.
   - 44 px touch target, works at 390 px.
   - Static: no animation anywhere.

   Tests: it renders, the aria wiring is correct, and there are no `anim-*` classes inside `.mission-brief` or
   `.motion-still`.
2. **Result explainers (c)** on the console's results side (Match Panel, map legend, Brief labels, gap radar), using
   A's keys:
   - The chips legend.
   - One sentence per outcome.
   - What OBSERVED, SUPPORTED and UNTESTED mean.
   - Gap vs. outside-range on the map.
   - "Compared on N of M".

   Edit only those sections of `Console.tsx`; B is in the input section. Agree on hunks before starting.
3. **Glossary (d):** a "Plain words" section on `/methods` built from A's glossary keys, plus a link to it from the
   footer.
4. **`/curate` form errors** (an A-owned file, A reviews):
   - An error summary beside Save/Publish.
   - Inline field errors mapped from the API's `issues[].path`.
   - Focus the first bad field.

   Keep the top status panel for success messages only. Then convert Compare to `PageHeader`.

### Copy checks before anything ships (Coder A, with R1)

- **"Planned Moon base 30 %+":** in the fact-check queue this figure is still unsourced. Cite it from the official
  challenge text (blocker: not yet in `docs/`). Cut "which makes materials easier to ignite" unless that text says so.
- **"Microgravity flames need moving air":** this is general science. R1 confirms it from a source before it renders.
- **"101 kPa = Earth sea level and ISS cabin":** the ISS-baseline row in the fact-check queue is still unsigned.
- **Thickness anchor:** use "about 0.32 mm, like the BASS cotton-fiberglass fabric" (verified card, source wording
  "about").
- **Bounded absence:** write "⇥ outside the range of the current IGNIS catalog", not "outside what NASA tested". Write
  "UNTESTED: no experiment in the current IGNIS catalog covers this". Both follow the bounded-absence rule.

### R3: acceptance for the plain-language pass

One non-technical person, cold, on the production site. Can they say what the O₂ slider does, what a hatched cell
means, and how OBSERVED differs from SUPPORTED? Log where they hesitate in `QA-LOG.md`. B and C fix those first.

---

## Round 2 split (Nov 14, midday)

Four batches of work are now on the table: the merge fixes from the Tier 1 review, dataset provenance, the
official challenge resources, and the accounts release. They're split below across the same three coders. Tier 0 still
comes first. Coder A's standing order outranks everything else: the moment verified cards appear, A runs step c, the
forced-Gemini proof and the mission-cache warm, then reports.

**Where things stand:** the hosted site and `/curate` use the same Supabase project (`zvzofutgfwzptlbfibpz`).
All 3 seed rows still have `verified_by = null` and `updated_at = 2026-11-07` (the seed time), so R1's publish never
reached this database. R1 should republish on <https://ignis-nasa-2026.vercel.app/curate>. Migration 0004 still needs
to run in the SQL editor first.

### Blockers (the team lead resolves these first)

1. **The official challenge text isn't in `docs/`.** The challenge-resources batch (R-1 to R-4) cites it, so add it before
   anyone writes those citations.
2. **The accounts plan ("Implementation prompt for IGNIS accounts and research roles") isn't in the repo.** Add it as
   `docs/ACCOUNTS-PLAN.md`. X-1 to X-3 are built "as written" and can't start without it.
3. **"Export supports predictive modeling" conflicts with the banned-word rule** (no "predict" in UI copy or the pitch).
   The pitch can quote the challenge text with attribution, but IGNIS's own sentence needs other wording, e.g.
   "export gives modelers traceable, cited inputs".
4. **Migration numbers:** dataset provenance is `0005`. Accounts take `0006` onward.

| Who | Batch | Branch (cut from `main`) |
|---|---|---|
| **Coder A** | merge + integration, provenance schema/types/curate/export, docs and decisions, context sources, accounts review and cutover | `main`, `provenance` |
| **Coder B** | Library media fix, provenance display (console card + detail page), `/sources` rework, 390 px checks | `library` (continue), `sources-and-provenance-ui` |
| **Coder C** | share-link fix, accounts release (event-gated), Ask IGNIS backlog entry | `share-and-compare` (continue), `accounts` |

### Coder A

- **Merge** the `library` and `share-and-compare` branches after B's and C's fixes below. Register `/library` and
  `/library/*` in `src/main.tsx` (3 lines). Review C's `Console.tsx` diff and record the shared-file sign-off in the
  decisions log. Tell B her file changed and why. After the merge, check on the live site at desktop and 390 px: `/library`,
  a detail page, an unknown-ID page, a share-link round trip, and `/compare`. The landing page stays around 57 KB gzip.
- **Provenance P-1 (schema side):** migration `0005` adds optional fields: `psi_investigation_id`, `dataset_doi`,
  `dataset_version`, `dataset_file`, `dataset_row_or_time`. Add them to the types and to the `/curate` fields. Hand the
  field names to B as soon as the types land.
- **P-5:** export includes the new fields when present. Tests cover the migration (disposable DB) and the export shape.
- **P-2:** add the seed corrections to the fact-check queue for R1. The two BASS seeds cite PSI-26, not PSI-25.
  GMT45-T4 cites PSI-25.
- **P-4:** record the decision, don't build it. The two failed ignitions at 16.4 % O₂ have no outcome category. They stay
  in the research queue, and a `no_ignition` outcome is a post-event contract change. Never force them into an
  existing outcome.
- **R-1 and R-2** (needs blocker 1 resolved): in `FACT-CHECK-QUEUE`, mark the environment-preset facts (Moon base
  ≥30 % O₂ / ≤10.2 psi; spacesuit 100 % O₂ / 4.3 psi + pre-breathe) as source-available, citing the challenge text.
  Attach the official URLs as `source_url` candidates in `src/lib/context-content.ts`. Everything still renders only on
  R1's signature.
- **R-4:** a pitch/README copy note for R3. "Hard to find, harder to compare, harder yet to interpret" → IGNIS finds,
  compares and interprets with citations. Detection/suppression investigations appear as context only. See blocker 3
  for the export sentence.
- **Accounts:** review every migration and RLS policy on C's branch, write the cutover deploy/rollback steps, and own the
  team-lead items: email provider, first-admin bootstrap, role grants.

### Coder B

- **Library media fix** (`library`): your ledger lookup couldn't work. The ledger has 6 columns ("Approved?" is
  column 6, index 5, not 7), and it compares the card's image URL against the ledger's filename column. Removing photos
  overshot the decision, though. Mirror the console instead: show `media_url` with the "Campaign context" label, and a
  clean text card when it's absent. Add a test for both cases.
- **Provenance display** (after A's types land): add a second citation line, "Dataset: PSI-25 v4, DOI …", to the
  console card's source block and the detail page, shown only when present. Test rendering with and without it.
- **`/sources`** (P-3 + R-3): group by campaign. Each campaign lists its NTRS paper and its PSI investigation DOI, and
  links go to the canonical DOI URLs and open in a new tab. Add an "Official challenge resources" group of NASA links
  (needs blocker 1).
- Run the 390 px and desktop checks of the library, detail and compare pages with A after the merge.

### Coder C

- **Share-link fix** (`share-and-compare`): opening a link re-runs **deterministic retrieval only**. Don't call
  `setConfirmed` on restore. The Brief generates only when the visitor clicks Confirm, so ten opens of one link must
  not mean ten LLM generations. Add a test that restoring leaves the scenario unconfirmed.
- **Accounts release** (`accounts`, needs blocker 2): build the plan as written. Its steps:
  1. auth and sessions
  2. saved investigations
  3. named curation and review with atomic, attributable publication

  Additive migrations start at `0006`. Every private table gets RLS, with negative tests. Validate against the
  disposable DB only (`npm run test:db`), never production. Existing cards keep their `verified_by` text, with no
  invented account IDs. The legacy curator secret keeps working until the cutover deploy.
- **Event gate for accounts:** it merges to production only if all three hold:
  1. Tier 0 is green (cards, checkpoint, mission, video capture).
  2. Every negative RLS/authorization test passes.
  3. It's before Nov 15 18:00.

  Otherwise the branch stays open and ships after the event as 2.0. The public judge journey must be identical without it.
- **Ask IGNIS backlog entry** (not built in this release): add it to the 2.0 backlog with the agreed spec. It may only:
  1. fill Scenario Builder fields from conversational text, with explicit user confirmation and no guessed values
  2. explain already-retrieved evidence with citations, through the validated-claims pipeline
  3. open existing views

  It never ranks, never predicts and never answers beyond retrieved evidence. Free-form chat stays rejected.

### Research handoffs (not coders)

- **R1:** republish the 3 seeds on the live `/curate`, sign the corrected PSI IDs (P-2), and sign the preset and context
  sources once A queues them.
- **R3:** use the copy note (R-4) in the pitch and README. Retest the merged library, detail, share and compare routes.

---

## Round 1: Tier 1 split

Three coders, five verticals. **Tier 0 (the submission) comes first.** If Tier 0 needs someone, they stop Tier 1 work.
Hard freeze **Nov 15 18:00**. A vertical that isn't clean by then gets deleted, not hidden half-built.

The rules don't change: no prediction, no risk/safety scores, no "safest" sort, no winner or cause language, verified cards
only, missing values stay visible, and the Brief/UNTESTED blocks stay still. No new dependencies. CI must be green before every PR:
`npm run typecheck && npm run lint && npm test && npm run build`.

| Who | Builds | Branch (cut from `main`) | Size |
|---|---|---|---|
| **Coder B** | V1 Evidence Library + V2 Experiment Detail | `library` | biggest: one data source, two routes |
| **Coder C** | V3 Share Links + V4 Compare route | `share-and-compare` | medium: both reuse what's already there |
| **Coder A** | V5 Methods/Sources check + routes + merges | `main` | small: A also runs Tier 0 integration |

---

## Coder B: V1 Library + V2 Detail (`library`)

**V1: `/library`**
- Client-side search and filters over the verified catalog already loaded by `src/lib/catalogData.ts`. No new endpoint.
- Filters: material, campaign, form, outcome, O₂ range, flow range. Thickness and pressure are optional.
- Filter state lives in the URL query string, so reload and back keep it.
- Show the result count. Show **"not reported"** where a value is null, distinct from untested.
- Sort by publication date or citation completeness only. Never "safest".
- Browsing never changes matching: library filters don't touch the engine or the console scenario.
- From the first commit: loading, unavailable/retry, and an honest empty state for a small catalog,
  e.g. "N verified cards so far."

**V2: `/library/<id>`**
- Full conditions table with original and normalized units, condition-change qualifiers, the verbatim quote,
  the provenance locator (page/figure/table), the NASA source link, and NTRS/DOI if recorded.
- Media still only if it has a media-ledger row, labeled "Campaign context".
- `verified_by` and the date, plus a "Cite this" copy button.
- If the ID isn't in the current verified catalog (draft, unpublished, typo): show
  "Not in the current IGNIS catalog" and none of the draft data.
- Buttons: "Compare" (to C's route) and "Back to library".
- Skip revision history (there's no versions table).

Reuse `src/components/ui/*` and the Match Panel's card fields. Don't fork the primitives.

## Coder C: V3 Share Links + V4 Compare (`share-and-compare`)

**V3: share link**
- Code lives in `src/features/share/`: encode/decode plus a banner component.
- Encode the **confirmed normalized scenario only** (never the user's free text), plus `catalog_revision`, the engine
  version and the ranked IDs.
- Decode with the existing `ResolvedScenarioSchema` (`src/lib/types.ts`). A bad or old link shows a clear "Can't read
  this link" state, never a half-filled scenario.
- Opening a link restores the scenario and **re-runs deterministic retrieval**. The banner says one of:
  "current with catalog", or "catalog updated since this link was made". In the second case, list the IDs added or
  dropped.
- Wiring it into `Console.tsx` is one hook call. Send that line to Coder B and A; don't edit the console yourself.

**V4: `/compare?ids=a,b`**
- Wrap the existing `src/components/CardComparison.tsx` in a route. Don't rewrite it.
- Fields aligned, differences highlighted, missing values visible, qualifiers and source locators kept.
  No winner and no cause.
- Fewer than two valid verified IDs → say which ID is missing.
- Optional if time allows: CSV of the compared rows.

## Coder A: V5 + routes + merges (`main`)

- **Routes:** add `/library`, `/library/<id>` and `/compare` to the pathname switch in `src/main.tsx` with a prefix
  match, lazy-loaded so the landing bundle stays light. No React Router.
- **V5:** `/methods` and `/sources` already exist. Check both on the live URL. Add a short "How matching works · what
  this does not tell you" line next to the results, linking to `/methods` (approved copy from `src/lib/copy.ts`).
- Write the decision lines for the Library (it reverses the Round 6 "metadata browser" cut) and for V6 if Tier 2 opens.
- Review/merge windows: **Day 1 evening, Day 2 noon, freeze.** Update `docs/MILESTONES.md` at each one.

## Merge windows: report per vertical

What shipped, what was cut, test count, live URL checked (yes/no).

## Freeze demo order

library → detail → scenario → evidence chain → gap → share link. Real verified data only.
Check the official submission format first (a 30-second video may not fit six beats).
