# IGNIS — Round 9 review (snapshot 06e3262) · Claude's plan for your inspection

Nothing modified. This is my read of the project + Codex's review, what I'd
change, in what order, with ~21 hours to the Nov 15 18:00 freeze. Codex's
nine findings were spot-checked against the code and are accurate — adopt
them all; this file re-prioritizes them, adds my own findings, and answers
your three open questions (Help page, 60-second case, languages).

---

## 1. The three decisions

### A. "How to use this" → Help page: YES, with one line drawn
Adopt Codex's migration exactly, with this split:
- **Keep beside the task**: the micro-facts a person needs at the moment of
  use — units, "Not specified" meaning, what a hatched cell is, why a claim
  was withheld, error-recovery actions. These stay as field hints/inline
  lines. Removing them would re-break the non-technical experience you just
  fixed.
- **Move to /help**: everything currently labeled "How to use this" (six
  identical disclosures on one route is navigation noise), general
  orientation, the task walkthroughs. Stable anchors per task
  (/help#read-the-map, /help#trace-a-source, /help#find-and-compare), open
  from the app, obvious way back that preserves entered values. Task-named
  links in the app ("How to read this map"), never six same-named buttons.
  Remove the 404 tutorial. Keep one maintained glossary (Methods) and link
  it rather than duplicating definitions.
- **Video**: optional, text-first. The chapterized walkthrough (open a
  documented experiment → inspect its source row → read an accepted/
  withheld value → return to your scenario) goes in Help with poster,
  captions, transcript, manual play — but ONLY if R2 has slack after the
  pitch video. The Help page must be complete without it. Do not let this
  compete with the submission video for R2's time.

### B. The 60-second case: adopt Codex's rebuild — BASS-first, correctness first
The current page is honest scaffolding with four real defects (race, wrong
proof on success, dead-end exit, outage looks like missing science). Fix
order:
1. **Correctness (P0, before any new content)**: tie each check response to
  the submitted run+field+value (abort/generation — same pattern as the
  parse fix A5); invalidate on edit; show the checked value in the verdict;
  full state set (loading / unavailable+Retry / settled-missing / invalid /
  rate-limited / done); verdict only after a successful check.
2. **The proof must match the question (P0)**: the check is about airflow,
  so BOTH verdicts show the field-specific appendix row (T7 → 10 cm/s,
  p.9) with unit and the PDF one click away. Keep the general observation
  quote under its own label. Reword the banner to "Does this number match
  the experiment record?" — precise and still impressive.
3. **Rebuild as the two-run question (P1)**: "These two fabric tests used
  different airflow — which one used 10 cm/s?" using verified GMT96-T7/T8
  (both already public). Inspect the source rows → try a value → see
  withheld/accepted → exit with context. This is stronger than the single
  tamper check because the judge makes a real evidence decision first.
4. **Exit keeps the context (P1)**: end with "Locate GMT96-T7 on the map"
  and "Compare the two fabric runs" — resolved against the live catalog,
  not a bare /#evidence-map that dumps the judge on the default preset.
5. **Green flash becomes the visual opener (P2, content-gated)**: only when
  R1 signs the caption against the NASA Glenn article and R2 ledgers the
  still. Until then the case opens on the BASS question with its own title
  — no page that promises an image it doesn't have. Tighten the gate while
  at it: reject protocol-relative `//` still paths, verify the asset
  exists and its ledger row matches at build time. Also reconcile the
  test that currently pins the production constant to null — signing the
  content must not fail CI.
6. **One limitation line at the close** (Codex's): "two rows alone cannot
  establish airflow as the cause" — that sentence in a demo is pure
  judge-credibility.

### C. Languages (RU/FR/ES/JA): NO — and here's the argument to have with the team
- **Your own standing rule already decides this**: a language ships
  complete and natively reviewed, or it doesn't ship. You have native
  review capacity for exactly one language besides English — Burmese. You
  cannot review Russian, French, Spanish or Japanese tonight; shipping
  machine translations of *fire-safety scientific content* unreviewed is
  precisely the class of plausible-but-unverified output this project
  exists to refuse. One mistranslated unit or outcome in front of a
  bilingual judge and the integrity story — your whole moat — dies.
- **It doesn't score**: Global judging is conducted in English. Four
  unreviewed toggles add zero judging value; a half-right one subtracts.
- **It's regression risk at the worst hour**: touching every string on
  every surface during the freeze window invalidates the QA your team
  just finished.
- **Do instead (cheaper, better story)**:
  1. Finish **Burmese** — the draft exists (my.draft.ts), the native
     speakers are on the team, R3 reviews, and it ships as a *reviewed*
     second language. "Built in Myanmar, fully bilingual, every string
     reviewed" is a real differentiator; five unreviewed toggles is a
     gimmick.
  2. Say the architecture out loud: one line on Methods + the roadmap
     slide — "every string lives in a reviewed i18n layer; adding a
     language is a translation task, not an engineering task — community
     translations invited." That claims the extensibility credit honestly
     without shipping fake translations.

---

## 2. Codex's nine findings — adopt, with priority order

P0 (correctness/safety): **1** verdict race · **2** wrong proof on success
· **3** content gates (incl. `//` path and the null-pinning test) ·
**4** outage ≠ missing science · **8** `/#%` crash (wrap the
`decodeURIComponent` in consoleLoader; invalid fragment → intact homepage)
· **9** curate draft restore shown before credential validation (gate
recovery metadata on authorization; clear on access change).

P1 (first-visit experience): **5** exit keeps the experiment · **6** shell
diet on mobile — header measured at 164px of a phone screen and 413px
document width at 390 (find the 23px overflow at its element); move Export
into Sources/dataset area, theme into a labeled utility menu on small
screens; keep first action + catalog status + Help visible · **7** the
Help migration (§1A).

## 3. My additional findings (beyond Codex)

C-1. **The light theme has never been QA'd as a theme.** The whole design
language was built and reviewed dark-first; a light theme + toggle now
exists (tokens, crossfade, meta theme-color). Before freeze it needs its
own pass: contrast of amber/orange text on light panels, map dot/hatch
legibility, verdict panel tints, focus rings, screenshots in both themes
at 390/1440. If it can't be QA'd in time, defaulting to dark with the
toggle still present is acceptable; shipping an unreviewed theme as
default is not.
C-2. **/api/check-claim is correctly rate-limited (30/min) — good** — but
add it to the live verification suite and the DEPLOY-RUNBOOK endpoint
list so it doesn't become the one unmonitored route.
C-3. **Case discoverability**: the case must be reachable from the
homepage hero (primary action per Codex's table), the header, and the
submission text. Verify the /case route has og/canonical set like the
rest (title exists; check og).
C-4. **i18n drift risk**: new strings landed this round (case, help,
theme) — confirm they're all keyed, and update docs/MY-REVIEW.md with the
delta so the Burmese review (§1C) covers them.
C-5. **Map at 390px inside the new compact layout**: re-screenshot after
the shell diet; the sticky condition bar + smaller header changes the
available height; confirm no double-sticky overlap with keyboard focus
(Codex's finding 6 acceptance covers this — keep it).
C-6. **QA-LOG's three participant rows read "Not run."** The three-person
one-minute test is the acceptance for the case AND the submission's
usability claim. It needs to actually run tomorrow morning, after P0/P1
land — results recorded, including failures.

## 4. Owner split and order (≈21h to freeze)

- **Coder A**: case P0 fixes (race/states/field-proof data), check-claim
  in runbook+suite, consoleLoader hash guard, curate restore auth gate,
  content-gate tightening + test reconciliation. Then support B.
- **Coder B**: shell diet (6) → case rebuild UI (two-run question, exit
  links) → /help migration (7, §1A) → light-theme QA pass (C-1) with R3.
- **Coder C** (fallbacks as usual): Help page assembly if B is loaded ·
  the walkthrough video embed shell (text-first) · any Round-8 C items
  still open (error boundaries done?) — confirm C1 status first.
- **R1**: keep signing the queue (6 drafts + 3 candidates — the catalog
  number is still the top lever); then the green-flash caption; then the
  two judgment calls (Blow-off qualifier, Saffire V-3/V-4 fan-off).
- **R2**: pitch video first; green-flash still + ledger row second; Help
  walkthrough only if slack.
- **R3**: Burmese review of the full current key set (§1C) · light-theme
  + mobile screenshots · the three-person case test (C-6) · QA-LOG.
- **Cut order if time runs out**: Help video → green-flash opener →
  light-theme-as-default (keep dark default) → two-run rebuild (the fixed
  single-check case still works) → /help migration (keep disclosures one
  more day). Never cut: the P0 correctness fixes, R1's signing, the
  three-person test.

## 5. What NOT to do tonight
No new feature categories, no languages beyond MY, no schema changes, no
redesigns beyond the shell diet, no unreviewed theme default, no dummy
data anywhere public. The project stops "lacking" the moment the catalog
count and the case work — richness now comes from data density and polish,
not surface area.
