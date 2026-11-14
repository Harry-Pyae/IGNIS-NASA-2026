# Who does what: Tier 1 split (Nov 14–15)

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
