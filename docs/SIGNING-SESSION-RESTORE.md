# Data restore — re-verify and republish (2026-11-15)

Twelve published cards had values edited away from their sources (to spread the map). Each one below has been
**saved back as a draft with its source-true values** (production, `save_draft`, nothing else changed) and is off the
public catalog until you re-verify it against the linked page and publish it in [/curate](https://ignis-nasa-2026.vercel.app/curate)
under your own full name. The catalog revision bumped (`a0363adf…` → `1db4eaa3…`); cached briefings no longer match.

**How the drift was found:** every field of every live card was diffed against the signing checklists
(`docs/SIGNING-SESSION*.md`), the seed, and the NASA PDF text. Each card’s own quote and `condition_changes` still held
the true value (e.g. T14’s quote reads “4→2.8” while its flow said 7). **Guard added:** `tests/fixtures/source-values.json`
(31 cards, source locators) · `tests/source-values.test.ts` (CI) · `npm run verify:live` now fails on any published
card that differs from its source or has no fixture entry.

**Not changed (your call):** Saffire II-7 `ignition_method` reads longer than its checklist draft (“Pilot flame from a
burning 0.8 mm PMMA lead sheet … about two minutes …”). It agrees with the p.25 quote, so it was left as published.

After each batch, tell Coder A’s agent “restore batch N done”: it re-runs `npm run verify:live` (must stay all-PASS) and
re-warms the briefing cache.

## Batch R1 — BASS-II appendix rows (one table, NTRS 20150008962 p.9)

### BASS-II GMT178-T14

`c9e44b71-9956-43f5-b510-0f79eb1180d7` · Drafts list in /curate · was published by “Travis”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `flow_cm_s` | ~~7~~ | **2.8** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT178-T14 2.2 4→2.8 16.9 Quenched` |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

### BASS-II GMT175-T18

`5039c650-178f-42e2-ad7f-686dac09e259` · Drafts list in /curate · was published by “Olivia”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `o2_pct` | ~~20~~ | **17.4** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT175-T18 2.2 5→2.6 17.4 Quenched` |
| ☐ | `flow_cm_s` | ~~3.5~~ | **2.6** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT175-T18 2.2 5→2.6 17.4 Quenched` |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

### BASS-II GMT190-T20

`0d093ec8-1f30-49b8-b290-aa4b96587828` · Drafts list in /curate · was published by “Garret”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `o2_pct` | ~~20~~ | **17.2** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT190-T20 1.2 11→3 17.2 Quenched` |
| ☐ | `flow_cm_s` | ~~5~~ | **3** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT190-T20 1.2 11→3 17.2 Quenched` |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

### BASS-II GMT190-T22

`fe0f41a8-a578-46e6-b07f-83e43481ca4b` · Drafts list in /curate · was published by “Hanna”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `o2_pct` | ~~25~~ | **17.1** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT190-T22 1.2 10.5→5 17.1 Quenched` |
| ☐ | `flow_cm_s` | ~~7~~ | **5** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT190-T22 1.2 10.5→5 17.1 Quenched` |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

### BASS-II GMT178-T12

`739183b6-1f9b-4d4b-b86e-de1e7d5aaf85` · Drafts list in /curate · was published by “Dean”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `o2_pct` | ~~19~~ | **16.8** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT178-T12 2.2 5 16.8 No ignition` |
| ☐ | `flow_cm_s` | ~~7~~ | **5** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT178-T12 2.2 5 16.8 No ignition` |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

### BASS-II GMT45-T4

`3b5c52ed-bdbb-44b2-8ba2-a8976daa9188` · Drafts list in /curate · was published by “Dean”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `flow_cm_s` | ~~4~~ | **2.2** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) row: `GMT45-T4 2.2 10→2.2 18.7 Quenched` · held value: [p.5](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=5) “held there for the remainder of the test” |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

## Batch R2 — Saffire IV/V (NTRS 20210011521, Table 1 p.3 · Table 2 p.8)

### Saffire IV-1

`4786c0c7-715a-436f-a7a9-e061d76f17bd` · Drafts list in /curate · was published by “Nick”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `flow_cm_s` | ~~22~~ | **20** | [Table 1, p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3): IV-1 · Air Flow Rate 20 cm/s · Oxygen 22 mol % |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

### Saffire II-5

`7989747b-e895-4d18-b54a-64c40aa21685` · Drafts list in /curate · was published by “phyo”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `material_class` | ~~insulation~~ | **fabric** | [Table 2, p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8): II-5 · Air flow 20 cm/s · O₂ 21 % · Material **SIBAL** (cotton-fiberglass fabric, 5 cm wide) |
| ☐ | `fuel_form` | ~~rod~~ | **fabric** | [Table 2, p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8): II-5 · Air flow 20 cm/s · O₂ 21 % · Material **SIBAL** (cotton-fiberglass fabric, 5 cm wide) |
| ☐ | `flow_cm_s` | ~~18~~ | **20** | [Table 2, p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8): II-5 · Air flow 20 cm/s · O₂ 21 % · Material **SIBAL** (cotton-fiberglass fabric, 5 cm wide) |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

### Saffire V-2

`e3b0b9bc-f2c3-4968-b467-6bf1e6ba02b0` · Drafts list in /curate · was published by “Dean”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `o2_pct` | ~~24~~ | **26.2** | [Table 1, p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3): V-2 · Air Flow Rate 20 cm/s · Oxygen 26.2 mol % |
| ☐ | `flow_cm_s` | ~~15~~ | **20** | [Table 1, p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3): V-2 · Air Flow Rate 20 cm/s · Oxygen 26.2 mol % |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

### Saffire V-3

`2d48fc4c-a661-4819-9b29-f0064bc2c236` · Drafts list in /curate · was published by “Tom”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `o2_pct` | ~~20~~ | **25.4** | [Table 1, p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3): V-3 · Air Flow Rate 20 cm/s · Oxygen 25.4 mol % |
| ☐ | `flow_cm_s` | ~~13~~ | **20** | [Table 1, p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3): V-3 · Air Flow Rate 20 cm/s · Oxygen 25.4 mol % |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

## Batch R3 — Saffire I/II (NTRS 20170008805)

### Saffire I-1

`da69e3d6-bf01-4836-88e4-b09a45d61f12` · Drafts list in /curate · was published by “phyo”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `flow_cm_s` | ~~15~~ | **20** | [p.14](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf#page=14): “Flow speed of 20 cm/s” |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

### Saffire II-4

`2a3c3f96-170e-4ab7-a8e7-e78ec5f83d15` · Drafts list in /curate · was published by “Graham”

| ✓ | Field | Was (published) | Restored to | Check it against |
|---|---|---|---|---|
| ☐ | `o2_pct` | ~~23~~ | **22.1** | [p.9](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf#page=9): “20 cm/s flow for all tests except for Sample 2-6 (25 cm/s)” · “Initial oxygen concentration 22.1% (ISS reading)” |
| ☐ | `flow_cm_s` | ~~22~~ | **20** | [p.9](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf#page=9): “20 cm/s flow for all tests except for Sample 2-6 (25 cm/s)” · “Initial oxygen concentration 22.1% (ISS reading)” |

☐ Every other field unchanged from the published card · ☐ Publish under your own full name.

