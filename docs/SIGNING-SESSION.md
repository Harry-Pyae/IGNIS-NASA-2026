# Signing session — R1 drafts, easiest first

Generated 2026-11-15 02:39 UTC from the live production drafts (read-only) by Coder A's agent. **Nothing here is verified until you
check each line against the PDF page linked and publish under your own full name in /curate.** Every link opens the
NASA PDF at the cited page. Values in **bold** are what the draft holds now; fix any that are wrong before publishing.

**Pre-check already done (mechanical, not a sign-off):** for the six BASS-II rows, the test ID, sample width, flow and
O₂ columns of the p.9 appendix were matched position by position in the NTRS text layer, and the twelve comment
cells line up in row order (T13, T14, T18, T20, T22 = “Quenched”; T21 = “Blow-off”). Saffire quotes were matched
word for word against the NTRS text (✓ below). Page numbers are as recorded in the drafts; the link is your check.

After each batch, tell Coder A's agent “batch N done”: it re-reads the live count and revision, re-warms the
*Crew clothing* briefing cache and checks the preset labels.

## Batch 1 — five BASS-II rows, one table, one judgment (≈ 3 min each)

All five: same paper and page as the published GMT45-T4, cotton-fiberglass 0.32 mm, 1 atm, outcome “Quenched” →
`extinguished`. The only judgment is the flow change: whether the final flow was held (see condition_changes).

### 1. BASS-II GMT100-T13

`c8041cbe-0743-437b-87d8-89023964e773` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20150008962](https://ntrs.nasa.gov/citations/20150008962)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Appendix title, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): “flat SIBAL fabrics” (75 % cotton / 25 % fiberglass, as on the published cards) |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | **0.32** | [p.2](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=2): “The thickness of the sample is about 0.32 mm” |
| ☐ | `o2_pct` | **17.5** | Appendix row, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): `GMT100-T13 2.2 4→2.2 17.5 Quenched` |
| ☐ | `flow_cm_s` | **2.2** | Same row (final value of the change) |
| ☐ | `pressure_kpa` | **101.325** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “Ambient pressure was 1 atm” (entered as 101.325 kPa, as on GMT45-T4) |
| ☐ | `ignition_method` | **Kanthal hot wire at fuel sample leading edge (concurrent flow)** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” |
| ☐ | `outcome` | **extinguished** | Same row: comment “Quenched” |
| ☐ | `source_page` | **9** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) |
| ☐ | `source_table` | **Appendix: Test summary of flat SIBAL fabrics in concurrent flow in BASS and BASS II** |  |
| ☐ | `source_figure` | *null — stays null unless the source states it* |  |
| ☐ | `psi_investigation_id` | **PSI-25** | docs/sources.md (PSI-25), as on GMT45-T4 |
| ☐ | `dataset_doi` | **10.60555/4qc4-de67** | docs/sources.md, as on GMT45-T4 |
| ☐ | `dataset_version` | **Version 4** | docs/sources.md, as on GMT45-T4 |
| ☐ | `condition_changes` | flow_cm_s 4 → 2.2, stored **final** | Row reads the flow change; the paper does not say the final flow was held. If the run log / PSI file shows it was held, set **stored = final_held** (as on GMT45-T4); otherwise leave **final**. |
| ☐ | `key_observation_quote` | “GMT100-T13 2.2 4→2.2 17.5 Quenched” | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) (the row itself) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “The thickness of the sample is about 0.32 mm” (NTRS 20150008962)
- ✓ “Ambient pressure was 1 atm” (NTRS 20150008962)
- ✓ “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” (NTRS 20150008962)

☐ Publish in /curate under your own full name.

### 2. BASS-II GMT178-T14

`c9e44b71-9956-43f5-b510-0f79eb1180d7` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20150008962](https://ntrs.nasa.gov/citations/20150008962)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Appendix title, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): “flat SIBAL fabrics” (75 % cotton / 25 % fiberglass, as on the published cards) |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | **0.32** | [p.2](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=2): “The thickness of the sample is about 0.32 mm” |
| ☐ | `o2_pct` | **16.9** | Appendix row, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): `GMT178-T14 2.2 4→2.8 16.9 Quenched` |
| ☐ | `flow_cm_s` | **2.8** | Same row (final value of the change) |
| ☐ | `pressure_kpa` | **101.325** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “Ambient pressure was 1 atm” (entered as 101.325 kPa, as on GMT45-T4) |
| ☐ | `ignition_method` | **Kanthal hot wire at fuel sample leading edge (concurrent flow)** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” |
| ☐ | `outcome` | **extinguished** | Same row: comment “Quenched” |
| ☐ | `source_page` | **9** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) |
| ☐ | `source_table` | **Appendix: Test summary of flat SIBAL fabrics in concurrent flow in BASS and BASS II** |  |
| ☐ | `source_figure` | *null — stays null unless the source states it* |  |
| ☐ | `psi_investigation_id` | **PSI-25** | docs/sources.md (PSI-25), as on GMT45-T4 |
| ☐ | `dataset_doi` | **10.60555/4qc4-de67** | docs/sources.md, as on GMT45-T4 |
| ☐ | `dataset_version` | **Version 4** | docs/sources.md, as on GMT45-T4 |
| ☐ | `condition_changes` | flow_cm_s 4 → 2.8, stored **final** | Row reads the flow change; the paper does not say the final flow was held. If the run log / PSI file shows it was held, set **stored = final_held** (as on GMT45-T4); otherwise leave **final**. |
| ☐ | `key_observation_quote` | “GMT178-T14 2.2 4→2.8 16.9 Quenched” | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) (the row itself) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “The thickness of the sample is about 0.32 mm” (NTRS 20150008962)
- ✓ “Ambient pressure was 1 atm” (NTRS 20150008962)
- ✓ “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” (NTRS 20150008962)

☐ Publish in /curate under your own full name.

### 3. BASS-II GMT175-T18

`5039c650-178f-42e2-ad7f-686dac09e259` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20150008962](https://ntrs.nasa.gov/citations/20150008962)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Appendix title, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): “flat SIBAL fabrics” (75 % cotton / 25 % fiberglass, as on the published cards) |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | **0.32** | [p.2](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=2): “The thickness of the sample is about 0.32 mm” |
| ☐ | `o2_pct` | **17.4** | Appendix row, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): `GMT175-T18 2.2 5→2.6 17.4 Quenched` |
| ☐ | `flow_cm_s` | **2.6** | Same row (final value of the change) |
| ☐ | `pressure_kpa` | **101.325** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “Ambient pressure was 1 atm” (entered as 101.325 kPa, as on GMT45-T4) |
| ☐ | `ignition_method` | **Kanthal hot wire at fuel sample leading edge (concurrent flow)** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” |
| ☐ | `outcome` | **extinguished** | Same row: comment “Quenched” |
| ☐ | `source_page` | **9** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) |
| ☐ | `source_table` | **Appendix: Test summary of flat SIBAL fabrics in concurrent flow in BASS and BASS II** |  |
| ☐ | `source_figure` | *null — stays null unless the source states it* |  |
| ☐ | `psi_investigation_id` | **PSI-25** | docs/sources.md (PSI-25), as on GMT45-T4 |
| ☐ | `dataset_doi` | **10.60555/4qc4-de67** | docs/sources.md, as on GMT45-T4 |
| ☐ | `dataset_version` | **Version 4** | docs/sources.md, as on GMT45-T4 |
| ☐ | `condition_changes` | flow_cm_s 5 → 2.6, stored **final** | Row reads the flow change; the paper does not say the final flow was held. If the run log / PSI file shows it was held, set **stored = final_held** (as on GMT45-T4); otherwise leave **final**. |
| ☐ | `key_observation_quote` | “GMT175-T18 2.2 5→2.6 17.4 Quenched” | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) (the row itself) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “The thickness of the sample is about 0.32 mm” (NTRS 20150008962)
- ✓ “Ambient pressure was 1 atm” (NTRS 20150008962)
- ✓ “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” (NTRS 20150008962)

☐ Publish in /curate under your own full name.

### 4. BASS-II GMT190-T20

`0d093ec8-1f30-49b8-b290-aa4b96587828` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20150008962](https://ntrs.nasa.gov/citations/20150008962)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Appendix title, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): “flat SIBAL fabrics” (75 % cotton / 25 % fiberglass, as on the published cards) |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | **0.32** | [p.2](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=2): “The thickness of the sample is about 0.32 mm” |
| ☐ | `o2_pct` | **17.2** | Appendix row, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): `GMT190-T20 1.2 11→3 17.2 Quenched` |
| ☐ | `flow_cm_s` | **3** | Same row (final value of the change) |
| ☐ | `pressure_kpa` | **101.325** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “Ambient pressure was 1 atm” (entered as 101.325 kPa, as on GMT45-T4) |
| ☐ | `ignition_method` | **Kanthal hot wire at fuel sample leading edge (concurrent flow)** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” |
| ☐ | `outcome` | **extinguished** | Same row: comment “Quenched” |
| ☐ | `source_page` | **9** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) |
| ☐ | `source_table` | **Appendix: Test summary of flat SIBAL fabrics in concurrent flow in BASS and BASS II** |  |
| ☐ | `source_figure` | *null — stays null unless the source states it* |  |
| ☐ | `psi_investigation_id` | **PSI-25** | docs/sources.md (PSI-25), as on GMT45-T4 |
| ☐ | `dataset_doi` | **10.60555/4qc4-de67** | docs/sources.md, as on GMT45-T4 |
| ☐ | `dataset_version` | **Version 4** | docs/sources.md, as on GMT45-T4 |
| ☐ | `condition_changes` | flow_cm_s 11 → 3, stored **final** | Row reads the flow change; the paper does not say the final flow was held. If the run log / PSI file shows it was held, set **stored = final_held** (as on GMT45-T4); otherwise leave **final**. |
| ☐ | `key_observation_quote` | “GMT190-T20 1.2 11→3 17.2 Quenched” | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) (the row itself) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “The thickness of the sample is about 0.32 mm” (NTRS 20150008962)
- ✓ “Ambient pressure was 1 atm” (NTRS 20150008962)
- ✓ “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” (NTRS 20150008962)

**Decide before publishing:** Sample width is 1.2 cm (the 2.2 cm runs are the rest); it lives in the summary only, which is fine.

☐ Publish in /curate under your own full name.

### 5. BASS-II GMT190-T22

`fe0f41a8-a578-46e6-b07f-83e43481ca4b` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20150008962](https://ntrs.nasa.gov/citations/20150008962)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Appendix title, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): “flat SIBAL fabrics” (75 % cotton / 25 % fiberglass, as on the published cards) |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | **0.32** | [p.2](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=2): “The thickness of the sample is about 0.32 mm” |
| ☐ | `o2_pct` | **17.1** | Appendix row, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): `GMT190-T22 1.2 10.5→5 17.1 Quenched` |
| ☐ | `flow_cm_s` | **5** | Same row (final value of the change) |
| ☐ | `pressure_kpa` | **101.325** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “Ambient pressure was 1 atm” (entered as 101.325 kPa, as on GMT45-T4) |
| ☐ | `ignition_method` | **Kanthal hot wire at fuel sample leading edge (concurrent flow)** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” |
| ☐ | `outcome` | **extinguished** | Same row: comment “Quenched” |
| ☐ | `source_page` | **9** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) |
| ☐ | `source_table` | **Appendix: Test summary of flat SIBAL fabrics in concurrent flow in BASS and BASS II** |  |
| ☐ | `source_figure` | *null — stays null unless the source states it* |  |
| ☐ | `psi_investigation_id` | **PSI-25** | docs/sources.md (PSI-25), as on GMT45-T4 |
| ☐ | `dataset_doi` | **10.60555/4qc4-de67** | docs/sources.md, as on GMT45-T4 |
| ☐ | `dataset_version` | **Version 4** | docs/sources.md, as on GMT45-T4 |
| ☐ | `condition_changes` | flow_cm_s 10.5 → 5, stored **final** | Row reads the flow change; the paper does not say the final flow was held. If the run log / PSI file shows it was held, set **stored = final_held** (as on GMT45-T4); otherwise leave **final**. |
| ☐ | `key_observation_quote` | “GMT190-T22 1.2 10.5→5 17.1 Quenched” | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) (the row itself) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “The thickness of the sample is about 0.32 mm” (NTRS 20150008962)
- ✓ “Ambient pressure was 1 atm” (NTRS 20150008962)
- ✓ “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” (NTRS 20150008962)

**Decide before publishing:** Sample width is 1.2 cm (the 2.2 cm runs are the rest); it lives in the summary only, which is fine.

☐ Publish in /curate under your own full name.

## Batch 2 — four Saffire SIBAL runs (≈ 5 min each)

Same material as the BASS cards (SIBAL = cotton_fiberglass), large samples in the Cygnus vehicle, constant flow.
Shared judgment: p.7 says “opposed” for runs Table 1 lists as concurrent; the outcome (steady spread = `sustained`)
does not depend on that word. Shared gap: PSI investigation / dataset DOI are not in the paper; add them or leave null.

### 6. Saffire IV-1

`4786c0c7-715a-436f-a7a9-e061d76f17bd` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20210011521](https://ntrs.nasa.gov/citations/20210011521)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Table 1 “SIBAL Cloth”; [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3)–4: “SIBAL” fabric (75% cotton and 25% fiberglass) |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | *null — stays null unless the source states it* | Not stated in this paper: leave null |
| ☐ | `o2_pct` | **22** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3): “Oxygen Concentration (mol %) … 22.0” (mol % entered as vol %) |
| ☐ | `flow_cm_s` | **20** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) / Table 2, [p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8) (column IV-1) |
| ☐ | `pressure_kpa` | **100** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) / Table 2, [p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8) |
| ☐ | `ignition_method` | *null — stays null unless the source states it* |  |
| ☐ | `outcome` | **sustained** | [p.7](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=7): “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size …” |
| ☐ | `source_page` | **7** | [p.7](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=7) |
| ☐ | `source_table` | **Table 1 (p.3); Table 2 (p.8)** |  |
| ☐ | `source_figure` | **Figure 9** |  |
| ☐ | `psi_investigation_id` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_doi` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_version` | *null — stays null unless the source states it* |  |
| ☐ | `key_observation_quote` | “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size as identified in Figure 9 and Table 2.” | [p.7](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=7) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size as identified in Figure 9 and Table 2.” (NTRS 20210011521)
- ⚠ not found verbatim in the NTRS text layer: check the PDF ““SIBAL” fabric (75% cotton and 25% fiberglass)”

☐ Publish in /curate under your own full name.

### 7. Saffire II-5

`7989747b-e895-4d18-b54a-64c40aa21685` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20210011521](https://ntrs.nasa.gov/citations/20210011521)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Table 1 “SIBAL Cloth”; [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3)–4: “SIBAL” fabric (75% cotton and 25% fiberglass) |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | *null — stays null unless the source states it* | Not stated in this paper: leave null |
| ☐ | `o2_pct` | **21** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) (column II-5) and Table 2, [p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8) |
| ☐ | `flow_cm_s` | **20** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) / Table 2, [p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8) (column II-5) |
| ☐ | `pressure_kpa` | **100** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) / Table 2, [p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8) |
| ☐ | `ignition_method` | *null — stays null unless the source states it* |  |
| ☐ | `outcome` | **sustained** | [p.7](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=7): “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size …” |
| ☐ | `source_page` | **7** | [p.7](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=7) |
| ☐ | `source_table` | **Table 2 (p.8)** |  |
| ☐ | `source_figure` | **Figure 9** |  |
| ☐ | `psi_investigation_id` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_doi` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_version` | *null — stays null unless the source states it* |  |
| ☐ | `key_observation_quote` | “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size as identified in Figure 9 and Table 2.” | [p.7](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=7) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size as identified in Figure 9 and Table 2.” (NTRS 20210011521)
- ✓ “Initial oxygen concentration 22.1% (ISS reading)” (NTRS 20170008805)
- ✓ “20 cm/s flow for all tests except for Sample 2-6 (25 cm/s)” (NTRS 20170008805)
- ✓ “All upward burns except Sample 2-4 was downward” (NTRS 20170008805)
- ✓ “Samples 2-5 and 2-6 were cotton-fiberglass fabric identical to that used in Saffire-1.” (NTRS 20170008805)
- ✓ “5-cm-wide concurrent-flow tests: flame ignited across the bottom of the fuel” (NTRS 20170008805)

**Decide before publishing:** O₂ 21 % from Table 2 (team-lead decision 2026-11-14); the 2017 deck reads 22.1 % (ISS reading), recorded in notes.

☐ Publish in /curate under your own full name.

### 8. Saffire II-6

`e794bff6-32c6-497f-8c82-17683b34cdc2` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20210011521](https://ntrs.nasa.gov/citations/20210011521)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Table 1 “SIBAL Cloth”; [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3)–4: “SIBAL” fabric (75% cotton and 25% fiberglass) |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | *null — stays null unless the source states it* | Not stated in this paper: leave null |
| ☐ | `o2_pct` | **21** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) (column II-6) and Table 2, [p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8) |
| ☐ | `flow_cm_s` | **25** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) / Table 2, [p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8) (column II-6) |
| ☐ | `pressure_kpa` | **100** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) / Table 2, [p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8) |
| ☐ | `ignition_method` | *null — stays null unless the source states it* |  |
| ☐ | `outcome` | **sustained** | [p.7](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=7): “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size …” |
| ☐ | `source_page` | **7** | [p.7](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=7) |
| ☐ | `source_table` | **Table 2 (p.8)** |  |
| ☐ | `source_figure` | **Figure 9** |  |
| ☐ | `psi_investigation_id` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_doi` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_version` | *null — stays null unless the source states it* |  |
| ☐ | `key_observation_quote` | “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size as identified in Figure 9 and Table 2.” | [p.7](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=7) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size as identified in Figure 9 and Table 2.” (NTRS 20210011521)
- ✓ “Initial oxygen concentration 22.1% (ISS reading)” (NTRS 20170008805)
- ✓ “20 cm/s flow for all tests except for Sample 2-6 (25 cm/s)” (NTRS 20170008805)
- ✓ “All upward burns except Sample 2-4 was downward” (NTRS 20170008805)
- ✓ “Samples 2-5 and 2-6 were cotton-fiberglass fabric identical to that used in Saffire-1.” (NTRS 20170008805)
- ✓ “5-cm-wide concurrent-flow tests: flame ignited across the bottom of the fuel” (NTRS 20170008805)

**Decide before publishing:** O₂ 21 % from Table 2 (team-lead decision 2026-11-14); the 2017 deck reads 22.1 % (ISS reading), recorded in notes.

☐ Publish in /curate under your own full name.

### 9. Saffire I-1

`da69e3d6-bf01-4836-88e4-b09a45d61f12` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20170008805](https://ntrs.nasa.gov/citations/20170008805)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | [p.15](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf#page=15): “75% cotton, 25% fiberglass blend” |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | *null — stays null unless the source states it* | Not stated: leave null |
| ☐ | `o2_pct` | **21.7** | [p.14](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf#page=14): “Initial oxygen concentration 21.7% (ISS reading)” |
| ☐ | `flow_cm_s` | **20** | [p.14](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf#page=14): “Flow speed of 20 cm/s” |
| ☐ | `pressure_kpa` | *null — stays null unless the source states it* | Not in this deck. The 2021 paper's Table 2 ([p.8](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=8)) gives 100 kPa: cite it, or leave null |
| ☐ | `ignition_method` | *null — stays null unless the source states it* |  |
| ☐ | `outcome` | **sustained** | [p.16](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf#page=16): “The flame burned the entire allotted test time of about 7 min. …” |
| ☐ | `source_page` | **16** | [p.16](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf#page=16) |
| ☐ | `source_table` | *null — stays null unless the source states it* |  |
| ☐ | `source_figure` | *null — stays null unless the source states it* |  |
| ☐ | `psi_investigation_id` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_doi` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_version` | *null — stays null unless the source states it* |  |
| ☐ | `key_observation_quote` | “The flame burned the entire allotted test time of about 7 min. at which point the air flow was shut off and the flame immediately extinguished” | [p.16](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf#page=16) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “The flame burned the entire allotted test time of about 7 min. at which point the air flow was shut off and the flame immediately extinguished” (NTRS 20170008805)
- ✓ “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size as identified in Figure 9 and Table 2.” (NTRS 20210011521)
- ✓ “Flow speed of 20 cm/s” (NTRS 20170008805)
- ✓ “Initial oxygen concentration 21.7% (ISS reading)” (NTRS 20170008805)
- ✓ “Fuel characteristics (“SIBAL” fabric) 75% cotton, 25% fiberglass blend” (NTRS 20170008805)
- ✓ “Large sample (40.6 cm x 94 cm)” (NTRS 20170008805)
- ✓ “About 90% of the fuel burned in the first test” (NTRS 20170008805)

**Decide before publishing:** O₂ 21.7 % (deck) or 21 % (2021 Table 2): pick one and say why in notes. The flame went out only when the flow was shut off at the end of the test; `sustained` describes the 20 cm/s test.

☐ Publish in /curate under your own full name.

## Batch 3 — two runs with one judgment each

### 10. BASS-II GMT190-T21

`e6a7a06a-b193-4e6a-ad41-9516dff13b5a` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20150008962](https://ntrs.nasa.gov/citations/20150008962)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Appendix title, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): “flat SIBAL fabrics” (75 % cotton / 25 % fiberglass, as on the published cards) |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | **0.32** | [p.2](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=2): “The thickness of the sample is about 0.32 mm” |
| ☐ | `o2_pct` | **17.2** | Appendix row, [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9): `GMT190-T21 1.2 11→47 17.2 Blow-off` |
| ☐ | `flow_cm_s` | **47** | Same row (final value of the change) |
| ☐ | `pressure_kpa` | **101.325** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “Ambient pressure was 1 atm” (entered as 101.325 kPa, as on GMT45-T4) |
| ☐ | `ignition_method` | **Kanthal hot wire at fuel sample leading edge (concurrent flow)** | [p.3](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=3): “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” |
| ☐ | `outcome` | **extinguished** | Same row: comment “Blow-off” |
| ☐ | `source_page` | **9** | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) |
| ☐ | `source_table` | **Appendix: Test summary of flat SIBAL fabrics in concurrent flow in BASS and BASS II** |  |
| ☐ | `source_figure` | *null — stays null unless the source states it* |  |
| ☐ | `psi_investigation_id` | **PSI-25** | docs/sources.md (PSI-25), as on GMT45-T4 |
| ☐ | `dataset_doi` | **10.60555/4qc4-de67** | docs/sources.md, as on GMT45-T4 |
| ☐ | `dataset_version` | **Version 4** | docs/sources.md, as on GMT45-T4 |
| ☐ | `condition_changes` | flow_cm_s 11 → 47, stored **final** | Row reads the flow change; the paper does not say the final flow was held. If the run log / PSI file shows it was held, set **stored = final_held** (as on GMT45-T4); otherwise leave **final**. |
| ☐ | `key_observation_quote` | “GMT190-T21 1.2 11→47 17.2 Blow-off” | [p.9](https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9) (the row itself) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “The thickness of the sample is about 0.32 mm” (NTRS 20150008962)
- ✓ “Ambient pressure was 1 atm” (NTRS 20150008962)
- ✓ “A Kanthal™, 1 hot wire was used to ignite the fuel sample leading edge” (NTRS 20150008962)

**Decide before publishing:** The flow was **raised** 11 → 47 cm/s and the comment is “Blow-off”. `extinguished` is right only with the change visible: keep condition_changes (11 → 47, stored final) so the card reads as blown off at the raised flow, never as extinguished at 11 cm/s. Park it if that is not clear enough.

☐ Publish in /curate under your own full name.

### 11. Saffire V-2

`e3b0b9bc-f2c3-4968-b467-6bf1e6ba02b0` · reopen it from the **Drafts** list in [/curate](https://ignis-nasa-2026.vercel.app/curate) · source [NTRS 20210011521](https://ntrs.nasa.gov/citations/20210011521)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_jersey** | [p.4](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=4): “cotton jersey material with an area density of 18.1 mg/cm2” — a NEW catalog material `cotton_jersey` |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | *null — stays null unless the source states it* | Not stated: leave null |
| ☐ | `o2_pct` | **26.2** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) (V-2): 26.2 mol % |
| ☐ | `flow_cm_s` | **20** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3): 20 cm/s, Concurrent (initial flow) |
| ☐ | `pressure_kpa` | **70.7** | Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3): 70.7 kPa |
| ☐ | `ignition_method` | *null — stays null unless the source states it* |  |
| ☐ | `outcome` | **sustained** | [p.4](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=4): “… continued to burn for another 150 seconds until the material was consumed.” |
| ☐ | `source_page` | **4** | [p.4](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=4) |
| ☐ | `source_table` | **Table 1 (p.3); Table 2 (p.8)** |  |
| ☐ | `source_figure` | **Figure 3** |  |
| ☐ | `psi_investigation_id` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_doi` | *null — stays null unless the source states it* |  |
| ☐ | `dataset_version` | *null — stays null unless the source states it* |  |
| ☐ | `condition_changes` | flow_cm_s 20 → 0, stored **initial** | [p.4](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=4): fan off ~70 s mid-run, then on again |
| ☐ | `key_observation_quote` | “The sample burned steadily for the initial 300 seconds while the fan was on. At approximately 280 seconds, the fan was turned off and remained off for 70 seconds. Despite this long interval, the flame grew back when the flow was turned on again and continued to burn for another 150 seconds until the material was consumed.” | [p.4](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=4) |

Quotes in this draft, matched against the NTRS full text:
- ✓ “The sample burned steadily for the initial 300 seconds while the fan was on. At approximately 280 seconds, the fan was turned off and remained off for 70 seconds. Despite this long interval, the flame grew back when the flow was turned on again and continued to burn for another 150 seconds until the material was consumed.” (NTRS 20210011521)
- ✓ “In all of these tests on Saffire I-V, the Cotton and SIBAL fuel samples established a steady opposed spread rate and flame size as identified in Figure 9 and Table 2.” (NTRS 20210011521)
- ✓ “burned steadily for the initial 300 seconds” (NTRS 20210011521)
- ✓ “At approximately 280 seconds, the fan was turned off” (NTRS 20210011521)
- ✓ “cotton jersey material with an area density of 18.1 mg/cm2” (NTRS 20210011521)

**Decide before publishing:** Confirm `cotton_jersey` stays distinct from cotton_fiberglass (it will not join the Crew clothing preset). The source says both “initial 300 seconds” and “approximately 280 seconds” for the fan-off moment: note which you trust.

☐ Publish in /curate under your own full name.

## Not in this session

- **Saffire V-3, V-4 (PMMA):** decision package in `docs/PMMA-DECISION.md`. Not drafted until a human approves the outcome wording.
- **Saffire IV-2:** parked. The flame survived 15 s of no flow and grew until soot reduced the airflow; leading edge regressed but “did not spread appreciably”. No outcome category fits without interpretation.
- **BASS rows with no outcome, “No ignition”, “Reused …”, “No Blow-off”:** not carded (docs/R1-QUEUE.md §3). Non-ignition is never forced into the outcome enum.
