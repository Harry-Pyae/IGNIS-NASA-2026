# IGNIS — Round 8: combined fix & upgrade prompt (snapshot 968fa0d)

Paste to the agent. Combines the GPT audit (items G1–G15, adopted in full), the
team lead's six observations, and Claude's independent inspection findings
(C1–C6). Work split: **Coder A** (server/engine/contracts), **Coder B**
(public UX), **Coder C** (isolated verticals — each with a fallback if C is
absent). R1's data queue is at the end and runs in parallel; it is the real
fix for "presets without data" — **no dummy/synthetic rows ever reach the
public map, retrieval, export, Brief, counts, or screenshots presented as
evidence** (disposable tests and clearly-labeled design previews only).

Baseline: audit against snapshot commit `968fa0d`; compare with the current
branch before changing anything — several items may already be partly done
(the snapshot already has field hints, a control rail, mobile condition bar,
share/compare/print). Record each item as: already passing / newly fixed /
awaiting human review. Standing rules unchanged: no prediction, catalog-
bounded copy, static Brief/UNTESTED, publication = named human, CI green
before merge, event freeze rules apply.

---

## CODER A — server, engine, contracts (do 1–2 first; they are security)

**A1. Protect the catalog (G1 + C-finding).**
The production curator credential matched the documented local default.
(a) Owner rotates the secret privately and redeploys — PAUSE and tell the
team lead to do this first; never print values. (b) In the shared curator
check (`src/server/http.ts`), reject the known local default in deployed
environments (including debug/provider-override headers); keep local dev
working; test with injected environments. (c) **Add rate limiting to the
curator-secret endpoints** (`curate-write`, `curate-cards`, `extract`) —
they are currently unthrottled, so the secret can be brute-forced; reuse the
existing Postgres limiter, stricter per-IP budget, fail-open semantics
unchanged. (d) Review available write logs; reconcile published cards with
R1.

**A2. Concurrent-edit safety in curation (G2).**
`api/curate-write.ts` matches only card ID: a stale tab can overwrite and
even unpublish a newer correction. Carry the last-read version through
reopen/save/publish; compare-and-set atomically; on conflict return a
reload/reconcile response that preserves the losing edit for comparison.
Fix the Curate.tsx success-path trap: a successful insert followed by a
failed list refresh must remember the saved ID, report the refresh failure
separately, and retry the list without re-submitting.

**A3. Zero vs unknown (G3).**
`Console.tsx` can report "no eligible records" while the catalog is still
loading (`views?.top_k.length ?? 0`). Make every section consume one
settled catalog state + revision: loading shows loading; failure keeps
input and offers Retry; only a successful read can assert a count or a gap.
Provide the contract; B wires the surfaces. Tests: loading → unavailable →
retry → matches, and a genuine zero-match.

**A4. Unify map accounting (G12).**
`src/engine/views.ts` counts rows with O₂+airflow as "plotted" while the
SVG uses `mapCoordinates(...).visible` — an off-axis row can be "plotted"
in the summary yet invisible. Derive all labelled counts from the same
partitions (visible / off-axis / missing-axis). Test the four-row case
including shared coordinates.

**A5. Stale parse responses (G13).**
`parseDescription` applies its response unconditionally — a slow parse can
overwrite a newer preset/edit. Add an edit/request generation with
cancellation; apply the same staleness check to error and pending states;
preserve the Brief revision checks.

**A6. Mission gate binds to content (G15).**
`MISSION_CASE` gate checks ID + top-5 membership only, so a corrected card
with unchanged ID/rank leaves stale reviewed captions active. Bind the
signed walkthrough to the reviewed content (content hash or version) of its
selected cards; a correction invalidates the mission until re-review. Test
a selected-card correction and an unrelated catalog addition.

**A7. Preset availability from the real catalog (G7 engine side).**
Compute per-preset availability via the existing resolver + gates + map
helpers: eligible runs, exact vs class-only, visible points, missing
coordinates, off-axis. Never promise "three outputs"; expose the data; B
renders labels and the "Explore a documented case" entry.

**A8. Reproducible handoff data (G11 server side).**
Persist enough revision information that a reopened share link can say:
same result / records added or dropped / a cited card was updated / exact
reconstruction unavailable. Evidence-only handoff stays usable when
narration fails; public shares exclude drafts, notes, raw free text
(already stripped — keep the test).

## CODER B — public experience

**B1. Compact 01+02 (G5 + lead's #2).**
Prototype in a real browser first. Compact scenario row (material ·
essential conditions · main action); text parsing, rare fields and long
explanations open on demand; map scope stated once with a concise legend +
text-list access; after retrieval the first ranked experiment and its
source are within easy reach. Acceptance: 1366×768 shows material,
retrieval action and evidence area together on entry; 390×844 reaches a
result in one action after retrieval; 360px at 200% zoom keeps keyboard
focus and chart controls reachable; re-measure lazy placeholders and
deep-link offsets; before/after screenshots + scroll-distance comparison.

**B2. Section 03's action says what it does (G6 + lead's #4).**
One shared retrieval action with state-dependent labels: **Find matching
experiments** (inputs ready) / **Choose a material** (resolution needed —
opens the editor and focuses the picker) / **View ranked experiments**
(settled — revisits results, no new synthesis). Lives in 01, reused from
03. Focus + announce result count or connection state. Guided-mission
entry stays separate. Test desktop/mobile/keyboard × one result / none /
outage / unresolved.

**B3. "How to use this" disclosures (G8 + lead's #5).**
One short, keyboard-operable disclosure beside each section/page heading,
closed by default, reusing field hints: 01 material + unspecified inputs ·
02 inspecting points + runs without coordinates · 03 exact/class matches +
opening a source · 04 following an evidence ID + withheld/evidence-only
Brief · 05 catalog-bounded gaps · Home first action · Methods validation
example · Sources links/export · Library search/reset · detail citations/
units · Compare selection + changing conditions · Curate save/reopen/review
· Kit internal note · 404 return path. Copy through copy.ts, i18n-keyed.
Validate with a first-time reader.

**B4. Preset availability labels (G7 render + lead's #3).**
Render A7's data: live availability line per preset, "Explore a documented
case" where eligible evidence exists, honest "what's missing" + Library
pointer where it doesn't. The availability label is separate from the
mission's named-review gate.

**B5. Navigation dead ends (G14).**
Bare `/compare` renders selectors seeded from the verified catalog; handle
0/1/duplicate/missing/2-valid IDs; never silently replace a shared pair's
unavailable side; keep URL in sync. Library: group typing into one history
step (fix `pushState` per keystroke at Library.tsx:43); preserve committed
filters on Back from a detail page. Test Back/Forward with query, pair,
withdrawn card.

**B6. Restore unfinished input — console side (G4 + lead's #1).**
Versioned, validated per-tab session draft of the console form
(description, preset, material, conditions, explicit zeros and nulls).
Restore as editable with Discard; no provider call on restore; an incoming
share link wins for that visit with a route back to the draft; handle
blocked/corrupted storage without losing the live form. (Curate-side
recovery is A's, scoped to the curator session, excluding secrets,
signatures, verification flags and generated claims.) Test two tabs,
route-away/back, refresh, shared link, remotely corrected card.

**B7. i18n + a11y retrofit on the new pages (C-finding).**
Compare, Methods, NotFound have zero `t()` calls and Library is partial —
they would ship English-only inside a Burmese release and break the
complete-set rule. Move their strings to the i18n layer. Add the missing
aria labels/roles to Library and Compare (currently zero `aria-`
attributes): labelled search, listbox/table semantics, focus-visible on
row links. Keyboard pass both pages.

## CODER C — isolated verticals (fallbacks in brackets if C is absent)

**C1. Error boundaries (C-finding — currently NONE in the app).**
App-shell boundary + one per console section and per route: a render error
shows an honest token-styled "This section failed — Retry / the rest of
IGNIS still works" panel, never a white screen, never fake content. Wire
Retry to remount. Test by throwing in one section. [Fallback: Coder A,
app-shell + console sections only.]

**C2. "Why did this run appear / Why no matches" (G9).**
Compact inspectable view from existing gate reasons + scored/unscored
fields: requested vs reported material/form, one decisive comparison, form
exclusions named (PMMA rod vs sheet), class-only candidates name both
materials, unspecified/unreported parameters listed, link to card +
source. Must agree with `gateExperiment`/`matchScenario` exactly — no
freelance explanation text. [Fallback: B after B1–B5.]

**C3. Specimen Explorer lite (G10).**
As a Library extension, one R1-reviewed sample set: selecting a specimen
highlights its card, conditions, quotation, locator; selection carries to
the map and back; overlapping points both reachable by touch/keyboard;
GMT45-T4 shows its flow change via the structured qualifier; schematic
labeled as schematic; images only with an R2 ledger row; list-only view if
art is unavailable. [Fallback: cut — record in decisions.]

**C4. Printable evidence handoff (G11 client).**
From one investigation: printable brief with scenario, catalog revision,
ordered run IDs, source locators, changed conditions, withheld/fallback
state, one catalog-bounded limitation. Works when narration fails. Test
corrected card, unpublished card, offline, print preview. [Fallback: B,
after B-list.]

## R1 — official data queue (parallel; this replaces any dummy-data idea)

Worksheet per candidate (campaign/run ID, material+geometry, outcome +
quotation, locator, conditions + original units, changing conditions, URL,
dataset version/file/row, disposition); publish only through named review;
one physical run counts once; missing stays null.
1. **Cabin wall (PMMA): Saffire IV-2, V-3, V-4** — as-executed matrix
   (NTRS 20210021181, slide 7) cross-checked with the flight-results paper
   (NTRS 20210011521, Table 1 + §D). Record geometry/configuration per
   run; leading-edge regression vs appreciable spread distinction matters;
   park anything the outcome enum can't faithfully hold.
2. **Crew clothing**: recheck the three fabric records against
   NTRS 20150008962; preserve GMT45-T4's flow change. Saffire-II slide 9
   adds silicone 2-1…2-4, composite 2-7, PMMA 2-8/2-9 (outcomes live in a
   further publication — find it before carding outcomes).
3. **Cable insulation**: USML-1 wire experiment (NTRS 20030075805) is real
   but out of MVP scope (campaign + missing wire form) — keep as sourced
   future expansion unless the team explicitly approves the extension; the
   preset keeps its honest picker.
4. **Cargo packaging**: no qualifying run established; record searched
   sources; keep the missing evidence visible rather than faking a link.

## Order, verification, reporting

Priority: A1 → A2 → (A3+B1+B2 in parallel) → B3/B4/B5/B6/B7 + A4–A8 →
C-list. Verification per the audit: disposable DB + stubbed providers;
typecheck/lint/unit/build/DB suite; real browser at 360/390/768/desktop
with keyboard + reduced motion; slow catalog, blocked storage, lost
connectivity, changed revision, provider failure; before/after evidence
for B1/B2/B3/B5/B6; public verification read-only. Then R3's three-user
walkthrough (retrieve a real run → find the passage → explain one limit →
Library → return), recording completion/time/first wrong click — report
the actual result, not the hoped one. Report by item number with changed
paths, verified behavior, and remaining human dependencies. No padded
estimates.
