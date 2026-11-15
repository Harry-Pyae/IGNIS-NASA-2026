# Signing addendum #2 — Saffire VI (2022 Cygnus flight)

Generated 2026-11-15 by Coder A's agent. Evidence source #1: [NTRS 20240002981](https://ntrs.nasa.gov/citations/20240002981), *Preliminary Results from the Saffire VI Experiment* (ICES-2024-365). Corroboration only: #3 [NTRS 20250002675](https://ntrs.nasa.gov/citations/20250002675) (ICES-2025-156, a SIMULATION paper: its model outputs are never carded). Context only, no cards: #2 [NTRS 20180004258](https://ntrs.nasa.gov/citations/20180004258) (FISO deck). The attached #1 and #2 PDFs are byte-identical to the NTRS files. Every quote below was matched against the NTRS text layer; page = PDF page.

**Where these drafts differ from the brief (source-led, please confirm):**
- **VI-2:** no flow-change qualifier. #1 states no flow reduction or termination for VI-2; the 20 → 5 cm/s change and the 1420 s termination are stated for VI-3 only (Figs 4–6). Recorded: sustained, burn duration 112 s.
- **VI-3:** the qualifier says the flow was reduced to 5 cm/s at 1120 s and terminated at 1420 s, and that the paper does not state when the flame went out. It does not say "extinguished when ventilation stopped", because #1 doesn't.
- **VI-4:** #1 says the flow "was reduced" but gives no value or time for VI-4, so there is no condition_changes entry (it needs a stated final value). The reduction is in the summary; R1 decides.
- **VI-1 (Nomex):** flow stays **null**. The Fig. 3 caption's "20 cm/s in all cases" covers the three photographed tests (2–4), not the Nomex test 1. #3 does give a per-sample figure for the Nomex attempt, "4 Nomex Burn: 31.9% O2. Did not Ignite" ([#3 p.4](https://ntrs.nasa.gov/api/citations/20250002675/downloads/Vehicle%20Modeling_FINAL.pdf#page=4)); it is in the notes, not promoted, per your rule.

### S1. Saffire VI-2

`DRAFT-ID` · reopen it from **Drafts to verify** in [/curate](https://ignis-nasa-2026.vercel.app/curate)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **cotton_fiberglass** | Table 1, [#1 p.3](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=3): “SIBAL Cloth” |
| ☐ | `material_class` | **fabric** |  |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | *null — stays null* | Not stated: stays null |
| ☐ | `o2_pct` | **31** | Table 1, [#1 p.3](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=3): 31.0 mol % |
| ☐ | `flow_cm_s` | **20** | Table 1: 20 cm/s, Concurrent |
| ☐ | `pressure_kpa` | **54.1** | Table 1: 54.1 kPa |
| ☐ | `outcome` | **sustained** | [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4): “The SIBAL sample (left image) achieved a steady size and spread rate quite rapidly” · burn duration 112 s, Table 2 [#1 p.6](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=6) |
| ☐ | `source_page` | **4** |  |
| ☐ | `key_observation_quote` | “The SIBAL sample (left image) achieved a steady size and spread rate quite rapidly” | [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4) |

☐ Publish in /curate under your own full name.

### S2. Saffire VI-3

`DRAFT-ID` · reopen it from **Drafts to verify** in [/curate](https://ignis-nasa-2026.vercel.app/curate)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **PMMA** | Table 1, [#1 p.3](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=3): “Two-Sided PMMA” |
| ☐ | `material_class` | **thermoplastic** |  |
| ☐ | `fuel_form` | **thick_slab** |  |
| ☐ | `thickness_mm` | **10** | [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4): “or flat, cast, polymethyl methacrylate (PMMA) (either one-sided 5 mm thick or two-sided (10 mm thick).” |
| ☐ | `o2_pct` | **30.3** | Table 1: 30.3 mol % |
| ☐ | `flow_cm_s` | **20** | Table 1: 20 cm/s, Concurrent (stored: initial) |
| ☐ | `pressure_kpa` | **54.6** | Table 1: 54.6 kPa |
| ☐ | `outcome` | **sustained** | [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4): “the two PMMA samples grew continuously until the flow speed was reduced.” · Fig. 5 [#1 p.5](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=5): “The flow was changed from 20 cm/s to 5 cm/s at 1120 s and terminated at 1420 s.” · burn 780 s, Table 2 |
| ☐ | `source_page` | **4** |  |
| ☐ | `condition_changes` | flow 20 → 0, stored **initial**; “Burned at the test flow … reduced to 5 cm/s at 1120 s … terminated at 1420 s … The paper does not state when the flame went out.” | Fig. 5 [#1 p.5](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=5), Fig. 4 [#1 p.5](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=5) |
| ☐ | `key_observation_quote` | “The two PMMA samples grew continuously until the flow speed was reduced.” | [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4) |

☐ Publish in /curate under your own full name.

### S3. Saffire VI-4

`DRAFT-ID` · reopen it from **Drafts to verify** in [/curate](https://ignis-nasa-2026.vercel.app/curate)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **PMMA** | Table 1, [#1 p.3](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=3): “One-Sided PMMA” |
| ☐ | `material_class` | **thermoplastic** |  |
| ☐ | `fuel_form` | **thick_slab** |  |
| ☐ | `thickness_mm` | **5** | [#1 p.2](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=2): “1-sided spread over 0.5 cm thick (18 cm long)” |
| ☐ | `o2_pct` | **28.8** | Table 1: 28.8 mol % |
| ☐ | `flow_cm_s` | **20** | Table 1: 20 cm/s, Concurrent |
| ☐ | `pressure_kpa` | **55.2** | Table 1: 55.2 kPa |
| ☐ | `outcome` | **sustained** | [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4): “the two PMMA samples grew continuously until the flow speed was reduced.” · burn 1200 s, Table 2 [#1 p.6](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=6) |
| ☐ | `source_page` | **4** |  |
| ☐ | `key_observation_quote` | “The two PMMA samples grew continuously until the flow speed was reduced.” | [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4) |

☐ Publish in /curate under your own full name.

### S4. Saffire VI-1

`DRAFT-ID` · reopen it from **Drafts to verify** in [/curate](https://ignis-nasa-2026.vercel.app/curate)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **nomex_fabric** | [#1 p.2](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=2): “… and Nomex fabric (7 cm long).” (new material `nomex_fabric`) |
| ☐ | `material_class` | **aramid_fabric** | aramid_fabric (Nomex is a meta-aramid) |
| ☐ | `fuel_form` | **fabric** |  |
| ☐ | `thickness_mm` | *null — stays null* |  |
| ☐ | `o2_pct` | *null — stays null* | NULL — not in #1. #3 (simulation) Table 1 [#3 p.4](https://ntrs.nasa.gov/api/citations/20250002675/downloads/Vehicle%20Modeling_FINAL.pdf#page=4): “4 Nomex Burn: 31.9% O2. Did not Ignite” (per-sample figure: your call) |
| ☐ | `flow_cm_s` | *null — stays null* | NULL — the Fig. 3 caption [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4) “20 cm/s in all cases” covers tests 2–4 only |
| ☐ | `pressure_kpa` | *null — stays null* | NULL — not stated for this attempt; #3 [#3 p.3](https://ntrs.nasa.gov/api/citations/20250002675/downloads/Vehicle%20Modeling_FINAL.pdf#page=3): campaign start 54.1 kPa / 31.0 % |
| ☐ | `outcome` | **no_ignition** | [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4): “The Nomex sample did not ignite and so it will not be included in this paper.” · Fig. 2 [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4): “The Nomex sample did not ignite.” |
| ☐ | `source_page` | **4** |  |
| ☐ | `key_observation_quote` | “The Nomex sample did not ignite and so it will not be included in this paper.” | [#1 p.4](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf#page=4) |

☐ Publish in /curate under your own full name.

## Context entries from #2 (R1 signs; nothing from #2 becomes a card)

Drafted as context (not evidence) in `docs/FACT-CHECK-QUEUE.md`: NASA-STD-6001 Test 1 (the 15 cm criterion) and the exploration atmosphere bound (34 % O₂ / 8.2 psia). Each needs R1's sign-off with its slide locator before it renders.
