# Who does what (Nov 14–15)

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
