# QA and evidence of user value

Updated 2026-11-13. Forms below are pending unless an execution result is explicitly recorded. No participant data
or real-card acceptance results have been fabricated. Historical checks remain in STATE/MILESTONES.

## Real-data production checks (2026-11-14, Coder A)

Live `https://ignis-nasa-2026.vercel.app`. Catalog: 3 verified, 0 in review, revision `becd7b54435772eaf9f7499a69267ad5`.
Real cards only, no production writes except the briefing cache the public path writes. Gemini: one call per step.

| Step | Request | Observed result |
|---|---|---|
| Export | `GET /api/export` | `count: 3`, revision `becd7b54…`; GMT96-T7 (21 %, 10 cm/s, sustained), GMT96-T8 (21 %, 5 cm/s, sustained), GMT45-T4 (18.7 %, 2.2 cm/s held after 10, extinguished; condition change recorded) |
| c · parse | unforced, "Crew clothing made of cotton fiberglass fabric in cabin air at 21% oxygen with 10 cm/s airflow" | 200 in 2.5 s, `provider: groq`; material raw "cotton fiberglass fabric", form fabric, O₂ 21, airflow 10; pressure and thickness `null` (not stated, not guessed) |
| c · synthesize | *Crew clothing* preset body exactly as the console builds it (21 % O₂, airflow not specified, 101.325 kPa), 3 IDs | 200 in 7.2 s, `provider: groq`, status ok, 0 withheld. 3 OBSERVED (one per card; T4 carries its airflow change and p. 5 locator) + 1 SUPPORTED (T7 and T8 both sustained at 21 % with different airflow). All cited values equal their cards; all IDs in the catalog |
| c · citations | each cited card's `source_url` | NTRS 20150008962 page 200; PDF 206 `application/pdf` |
| f · cache warm | same body again | 200 in 3.4 s, `provider: cache`, identical claims |
| d1 · forced Gemini parse | `x-ignis-provider: gemini` + curator secret | 200 in 3.5 s, `provider: gemini`, fields filled |
| d2 · forced Gemini synthesize | same preset body | 200 in 5.1 s, `provider: gemini`, status ok, 3 OBSERVED, 0 withheld |
| d3 · unforced parse | no headers | `provider: groq` (normal order back) |
| Cache after forced run | preset body, unforced | `provider: cache` (forced run neither read nor wrote it) |

Not yet run: step e (`MISSION_CASE` needs R1 and R3 to name the reviewed case and reviewer), browser click-through of
citations at 1280 and 390 px (R3), migration 0004 confirmation (SQL editor).

## Local implementation checks

Baseline `25f3681` plus current working-tree patch. Final commands/results are recorded here after execution.
Production catalog/cache writes: none. Provider diagnostic/generation calls: none.

| Check (2026-11-13, Node 24.11.0) | Observed result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm test` | 218 passed, 19 skipped; 27 test files passed, 4 skipped |
| `npm run build` | Passed; landing index 58.43 KB gzip, console 16.23 KB gzip |
| `git diff --check` | Passed; platform line-ending notices only |
| Source/map/card render regression tests | Passed using React server rendering; not a visual/browser interaction test |
| `npm run test:db` | Passed: 16 tests across 2 files against a fresh disposable database, migrations and seed applied; containers removed by the test runner |
| Browser preview | Built-in browser reached `http://127.0.0.1:4173/` after host-access launch. Inspected landing and console at the default 1265 × 712 viewport; verified unavailable → retry/loading → unavailable and retained cleared oxygen input. No live catalog was configured for this preview. |
| Real-catalog retrieval benchmark | Explicitly skipped until R1 supplies reviewed case and export files |

Default-suite skips include 16 database integration tests (passed separately above), 2 live-provider smoke checks,
and the optional reviewed benchmark. Docker Desktop and the local preview required host access; the initial sandbox
connection failures were resolved. Migration 0004 passed the disposable RLS/lifecycle suite, including normalized
duplicate identities and concurrent duplicate rejection. No production schema or data was changed.

Browser inspection found and resolved a misleading perpetual loading summary and developer configuration copy in
the public console. The summary now distinguishes catalog failure from loading, offers retry, and explains that
unavailable coverage establishes no gaps. Source titles and all recorded locators, including section-only references,
are covered by rendering regression tests. Populated-catalog interaction, the viewport matrix below, keyboard,
reduced-motion and real-data acceptance remain pending; this limited preview does not establish those results.

## Real-card acceptance — A / R3 after R1 publication

| Record | Value |
|---|---|
| Operator / date / URL | Pending |
| App commit / catalog revision | Pending |
| Scenario inputs / preset / selected UUIDs and test IDs | Pending |
| Confirm → retrieval → map → cards | Not run |
| Brief observed facts / interpretation / withholding | Not reviewed |
| Citation → quote → original source and locator | Not run |
| Honest gap / outside-range distinction | Not run |
| Same request cache hit / changed-input binding | Not run |
| Revision change and correction/unpublish lifecycle | Disposable DB only; record separate result |
| Forced Gemini lite synthesis, one-shot per runbook | Waiting for legitimate signed cards |
| Evidence-only fallback / retry / inputs retained | Pending |

Follow DEPLOY-RUNBOOK; no synthetic production records, cache fixtures, repeated provider probes, or production
unpublish tests. Provider rehearsal is not a polling job.

## Console inspection matrix

Record browser, URL, commit, catalog revision and screenshots. At each viewport test keyboard and touch where available.

| Check | 390 px | 1024 px | 1440 px |
|---|---|---|---|
| Purpose and primary CTA clear | Pending | Pending | Pending |
| Source quotes/long IDs/locators wrap; no page overflow | Pending | Pending | Pending |
| Point/card/citation selection consistent; return focus | Pending | Pending | Pending |
| Shape + text identify outcomes without color | Pending | Pending | Pending |
| Coordinate/missing/outside-axes/outside-catalog distinctions | Pending | Pending | Pending |
| Empty/loading/error/retry/stale-input/fallback states | Pending | Pending | Pending |
| Brief and gap blocks still; reduced motion; visible focus | Pending | Pending | Pending |
| Export matches revision/count and contains verified records only | Pending | Pending | Pending |

## Three unfamiliar participants — R3

Use anonymous participant labels P1–P3. Do not coach during the task. Introduce only the task: complete the reviewed
investigation, open its original source, and explain an observation and limitation. Record where help was requested;
assisted completion is not unassisted success.

Ask afterward: What does IGNIS do? Which values were yours versus NASA's? Is the interpretation a direct observation?
What does a populated map cell establish? What does a gap mean? Does first-ranked mean safest? Name one shared
condition and one uncontrolled difference between the selected experiments. Finish with narration unavailable.

| Participant | Completed uncoached? | Seconds | Original source opened? | Confusions / hesitation / assistance |
|---|---|---|---|---|
| P1 | Not run | — | — | — |
| P2 | Not run | — | — | — |
| P3 | Not run | — | — | — |

Top observed obstacle: pending. Fix/owner/commit: pending. Verification task and actual result: pending.

## Paired paper-versus-IGNIS tasks

R1 prepares two equivalent source-supported tasks: locate an observation, state oxygen/flow/thickness (including
not reported), find the source passage, and explain a limitation. Use different equivalent runs to reduce memorization.
P1/P3 start with papers; P2 starts with IGNIS. Record task identities and order; n=3 remains a convenience sample.

| Participant / order / task IDs | Paper seconds / correct facts / assistance | IGNIS seconds / correct facts / assistance | Limitations / failures |
|---|---|---|---|
| P1 / paper first / pending | Not run | Not run | — |
| P2 / IGNIS first / pending | Not run | Not run | — |
| P3 / paper first / pending | Not run | Not run | — |

Report the actual range/individual results, failures, and sample size. Do not claim hours saved, general accuracy,
statistical significance, or NASA operational adoption from this study.

## Mission Brief scientific review

R1 records every displayed claim, classification, cited run/field, qualifier, and decision. Verify that observations
derive from checked fields, gaps from supplied gap IDs, and interpretation stays within the cited runs. Reject causal
explanations unsupported by the sources. Correct references alone do not prove interpretation correctness.
