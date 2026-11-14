# R1 queue: drafts to verify and sign

Generated 2026-11-14 by the Round 8 extraction run (Coder A). Every draft below is already in production
`/curate` as a **draft** (`verified_by` empty, invisible to the public). Reopen it there, check it against the PDF, correct
anything, and publish under your own name. Nothing here is verified until you sign it.

**What each draft already carries:** the verbatim source row as the key quote, the p.9 table locator, original units, a
`condition_changes` entry for every changed flow, PSI-25 provenance, and, in **notes**, a verbatim quote and locator for
every populated field. Nulls stay null.

Source PDF: [NTRS 20150008962](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf), appendix p.9.

## 1. Ready in /curate: easiest first

### 1. BASS-II GMT100-T13  ·  `c8041cbe-0743-437b-87d8-89023964e773`

Flow reduced 4→2.2 cm/s, 2.2 cm sample, "Quenched": same pattern as R1's published GMT45-T4.

- [ ] **Row:** p.9 reads `GMT100-T13 2.2 4→2.2 17.5 Quenched`: O₂ 17.5 %, flow 4.0→2.2 cm/s (stored: final), outcome `extinguished`.
- [ ] **Change:** confirm in the run log or PSI files whether the final flow was held; if it was, set `stored` to `final_held` (as on GMT45-T4).
- [ ] **Provenance:** PSI-25 / DOI 10.60555/4qc4-de67 / Version 4 (from `docs/sources.md`), 0.32 mm (p.2), 1 atm → 101.325 kPa (p.3). Then publish under your name.

### 2. BASS-II GMT178-T14  ·  `c9e44b71-9956-43f5-b510-0f79eb1180d7`

Flow reduced 4→2.8 cm/s, 2.2 cm sample, "Quenched".

- [ ] **Row:** p.9 reads `GMT178-T14 2.2 4→2.8 16.9 Quenched`: O₂ 16.9 %, flow 4.0→2.8 cm/s (stored: final), outcome `extinguished`.
- [ ] **Change:** confirm in the run log or PSI files whether the final flow was held; if it was, set `stored` to `final_held` (as on GMT45-T4).
- [ ] **Provenance:** PSI-25 / DOI 10.60555/4qc4-de67 / Version 4 (from `docs/sources.md`), 0.32 mm (p.2), 1 atm → 101.325 kPa (p.3). Then publish under your name.

### 3. BASS-II GMT175-T18  ·  `5039c650-178f-42e2-ad7f-686dac09e259`

Flow reduced 5→2.6 cm/s, 2.2 cm sample, "Quenched".

- [ ] **Row:** p.9 reads `GMT175-T18 2.2 5→2.6 17.4 Quenched`: O₂ 17.4 %, flow 5.0→2.6 cm/s (stored: final), outcome `extinguished`.
- [ ] **Change:** confirm in the run log or PSI files whether the final flow was held; if it was, set `stored` to `final_held` (as on GMT45-T4).
- [ ] **Provenance:** PSI-25 / DOI 10.60555/4qc4-de67 / Version 4 (from `docs/sources.md`), 0.32 mm (p.2), 1 atm → 101.325 kPa (p.3). Then publish under your name.

### 4. BASS-II GMT190-T20  ·  `0d093ec8-1f30-49b8-b290-aa4b96587828`

Flow reduced 11→3 cm/s, **1.2 cm** sample (width is in the summary only), "Quenched".

- [ ] **Row:** p.9 reads `GMT190-T20 1.2 11→3 17.2 Quenched`: O₂ 17.2 %, flow 11.0→3.0 cm/s (stored: final), outcome `extinguished`.
- [ ] **Change:** confirm in the run log or PSI files whether the final flow was held; if it was, set `stored` to `final_held` (as on GMT45-T4).
- [ ] **Provenance:** PSI-25 / DOI 10.60555/4qc4-de67 / Version 4 (from `docs/sources.md`), 0.32 mm (p.2), 1 atm → 101.325 kPa (p.3). Then publish under your name.

### 5. BASS-II GMT190-T22  ·  `fe0f41a8-a578-46e6-b07f-83e43481ca4b`

Flow reduced 10.5→5 cm/s, **1.2 cm** sample, "Quenched".

- [ ] **Row:** p.9 reads `GMT190-T22 1.2 10.5→5 17.1 Quenched`: O₂ 17.1 %, flow 10.5→5.0 cm/s (stored: final), outcome `extinguished`.
- [ ] **Change:** confirm in the run log or PSI files whether the final flow was held; if it was, set `stored` to `final_held` (as on GMT45-T4).
- [ ] **Provenance:** PSI-25 / DOI 10.60555/4qc4-de67 / Version 4 (from `docs/sources.md`), 0.32 mm (p.2), 1 atm → 101.325 kPa (p.3). Then publish under your name.

### 6. BASS-II GMT190-T21  ·  `e6a7a06a-b193-4e6a-ad41-9516dff13b5a`

Flow **increased** 11→47 cm/s, 1.2 cm sample, "Blow-off". Needs one judgment: Blow-off → `extinguished`.

- [ ] **Row:** p.9 reads `GMT190-T21 1.2 11→47 17.2 Blow-off`: O₂ 17.2 %, flow 11.0→47.0 cm/s (stored: final), outcome `extinguished`.
- [ ] **Change:** confirm in the run log or PSI files whether the final flow was held; if it was, set `stored` to `final_held` (as on GMT45-T4).
- [ ] **Provenance:** PSI-25 / DOI 10.60555/4qc4-de67 / Version 4 (from `docs/sources.md`), 0.32 mm (p.2), 1 atm → 101.325 kPa (p.3). Then publish under your name.

## 2. Extracted but NOT loaded: an outcome decision is needed first

Their fields were extracted and checked against the source tables, so nothing needs retyping. They weren't saved
because the card's outcome category couldn't be filled faithfully. Decide, then create the card in `/curate`.

### Saffire V-3  ·  [NTRS 20210011521](https://ntrs.nasa.gov/citations/20210011521)

The flame **kept burning** at 20 cm/s and at 5 cm/s, and went out only when the fan was turned off ("the sample extinguished immediately", p.5). The extractor chose `extinguished`, which would read as extinguished *at 20 cm/s*. Decide the outcome at the stored flow (likely `sustained`) or park it; same open question as GMT45-T4.

- Extracted: fuel `PMMA`, form `thick_slab`, thickness 5 mm, O₂ 25.4, flow 20 cm/s, pressure None.
- Table 1 (p.3) says: 1-sided PMMA, 18 cm, 20 cm/s concurrent, 71.3 kPa, 25.4 mol % O₂ (one-sided = 5 mm, p.4).
- Key quote: "In Saffire V-3, the one-sided PMMA sample flame (in 25.4% oxygen) grew to 11 cm after 450 seconds."

### Saffire V-4  ·  [NTRS 20210011521](https://ntrs.nasa.gov/citations/20210011521)

Same pattern as V-3 (Fig. 6, p.6: "rapid extinction after 300 seconds of cooling at low air flow (5 cm/s) before the flow was stopped completely"). Also **opposed** flow and a **ribbed, structured** 10 mm slab: the extractor's `flat_sheet` form is wrong.

- Extracted: fuel `PMMA`, form `flat_sheet`, thickness None mm, O₂ None, flow 20 cm/s, pressure None.
- Table 1 (p.3) says: Structured PMMA, 20 cm, 20 cm/s **opposed**, 72.6 kPa, 25.7 mol % O₂ (10 mm, p.10).
- Key quote: "Evident is the rapid extinction after 300 seconds of cooling at low air flow (5 cm/s) before the flow was stopped completely."

### Saffire IV-2

Extractor found no stated outcome. Source (NTRS 20210011521): the 2-sided PMMA flame "grew to 9.5 cm after 400 seconds" (p.9), survived "the 15 second interval of no flow" (p.5) and grew until soot reduced the air flow. Leading-edge regression only, "did not spread appreciably" (p.8). Table 1 (p.3): 18 cm, 20 cm/s concurrent, 100.0 kPa, 22.0 mol % O₂, 10 mm (p.4).

### Saffire II-6

Cotton-fiberglass, 5 cm wide, **25 cm/s** (NTRS 20170008805 p.9). No per-sample outcome in that deck. The 2021 paper's Table 2 (NTRS 20210011521 p.8) gives II-6: 25 cm/s, 21 % O₂, 100 kPa, steady flame size 5 cm, so `sustained` is likely but inferred. **O₂ conflict:** 22.1 % (2017 deck, "ISS reading") vs 21 % (2021 table).

### Saffire II-5

The extractor proposed `sustained`, but from a general sentence ("spread rate is steady for most of the tests"), not one about this sample, so it wasn't loaded. Same evidence as II-6: the 2021 Table 2 (p.8) gives II-5: 20 cm/s, 21 % O₂, 100 kPa, steady flame size 4 cm. Same O₂ conflict (22.1 % vs 21 %). Extracted: cotton_fiberglass, fabric, 20 cm/s, O₂ 22.1 (2017 deck).

## 3. Not draftable from these sources (reason stated)

### Saffire-II (NTRS 20170008805)

- **2-1 to 2-4 (silicone 0.27, 0.61, 1.03, 0.37 mm)**: "none of the silicone samples burned"; a tiny flame "did not spread and quickly extinguished" (p.12). That's non-ignition, which has no outcome category; it's never forced into the enum.
- **2-7 (0.8 mm PMMA lead + Nomex HT90-40)**: the PMMA burned for about 2 min, but "the fabric was not ignited" (p.25). Two materials with two outcomes don't fit one card; decide whether to split it.
- **2-8 (grooved) / 2-9 (flat) PMMA slabs, 1 cm**: "Results from these samples are described in another paper at this conference" (p.9). The 2021 paper (p.8) gives flame lengths of 8.0 / 9.5 cm. Find the companion paper before carding outcomes.

### BASS / BASS-II appendix rows (NTRS 20150008962 p.9)

- **the table states no outcome for this run** (9): `GMT45-T1 2.2 10 18.5*`; `GMT45-T2 2.2 10→5 18.5*`; `GMT100-T5 2.2 10→2.4 18.8`; `GMT100-T6 2.2 4.5→2.6 18.8`; `GMT100-T16 2.2 4→3 17.6`; `GMT178-T11 2.2 4 17.1`; `GMT190-T19 1.2 11 17.2`; `GMT131-T10 1.2 11 21 BASS`; `GMT222-T11 1.2 19 21 BASS`
- **table comment "Reused, ignited" does not map to an outcome category without interpretation** (4): `GMT216-T25 2.2 5→2.5 20.8 Reused, ignited`; `GMT216-T26 2.2 5→2.5 20.8 Reused, ignited`; `GMT216-T27 1.2 5→2 20.7 Reused, ignited`; `GMT216-T29 1.2 5→2 20.7 Reused, ignited`
- **"No ignition": non-ignition has no outcome category (decision: never forced into the enum)** (3): `GMT175-T9 2.2 10 16.4 No ignition`; `GMT175-T10 2.2 5 16.4 No ignition`; `GMT178-T12 2.2 5 16.8 No ignition`
- **"Reused, did not ignite": non-ignition has no outcome category (decision: never forced into the enum)** (3): `GMT190-T23 2.2 10 17.2 Reused, did not ignite`; `GMT216-T28a 1.2 5 20.7 Reused, did not ignite`; `GMT216-T28b 1.2 5 20.7 Reused, did not ignite`
- **table comment "No Blow-off" does not map to an outcome category without interpretation** (2): `GMT45-T15 2.2 10→29 18.7 No Blow-off`; `GMT178-T17 2.2 6→53 16.9 No Blow-off`
- **table comment "Reused, one sided flame" does not map to an outcome category without interpretation** (1): `GMT190-T24 2.2 10 18.2 Reused, one sided flame`

## 4. Next candidates (outside this pass, outcomes stated in the sources)

- **Saffire V-2** (cotton jersey, 50 cm, 20 cm/s, 70.7 kPa, 26.2 mol %): "burned steadily for the initial 300 seconds… continued to burn for another 150 seconds until the material was consumed" (NTRS 20210011521 p.4).
- **Saffire IV-1** (SIBAL, 50 cm, 20 cm/s, 100.0 kPa, 22.0 mol %): Table 2 (p.8) gives a steady size of 8.5 cm.
- **Saffire-I** (SIBAL 40.6 × 94 cm, 20 cm/s concurrent, 21.7 % O₂): "The flame burned the entire allotted test time of about 7 min." (NTRS 20170008805 p.16).
- **PMMA rods** (NTRS 20150008961) and the **PSI-25 archive**, per `docs/sources.md`.
