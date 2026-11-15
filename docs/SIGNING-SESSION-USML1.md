# Signing session — USML-1 Wire Insulation Flammability (WIF) runs

Decision 2026-11-15 (team lead): the USML-1 WIF experiment enters scope as a deliberate campaign + geometry extension,
with its own form `insulated_wire` (only the polyethylene insulation is the fuel; the core and igniter wire are
apparatus). Source: [NTRS 20030075805](https://ntrs.nasa.gov/citations/20030075805), *Wire Insulation Flammability
Experiment: USML-1 One Year Post Mission Summary* (Greenberg, Sacksteder, Kashiwagi; 1993 science review, published
1994). **USML-1 flew on Space Shuttle STS-50 in 1992 — decades older than BASS and Saffire.** The paper names STS-50;
the year comes from NASA's mission record: confirm it with a NASA link when you sign.

**What the paper states per run:** four modules (WIF-A, B, C, D), one 110 mm polyethylene-insulated nichrome wire
each; WIF-A and WIF-C concurrent flow, WIF-B and WIF-D opposed flow; air flowing at about 10 cm/s. O₂ and pressure
are not stated (“air”); the per-module heater power is only in Figure 4. Three runs have a quotable, per-run outcome;
WIF-C does not fit an outcome category and stays parked (below). Every quote below was matched against the NTRS text
layer (letters and digits; the scan has OCR typos such as “aimow” for “airflow”).

### W1. USML-1 WIF-A — concurrent flow

`DRAFT-ID` · reopen it from **Drafts to verify** in [/curate](https://ignis-nasa-2026.vercel.app/curate)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **polyethylene** | [p.3](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=3) (proceedings p.633): “The sample consisted of polyethylene insulation extruded onto a 0.75 mm nichrome wire core.” |
| ☐ | `material_class` | **insulation** |  |
| ☐ | `fuel_form` | **insulated_wire** | [p.3](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=3) (proceedings p.633): “A single insulated wire sample, 1.5 mm diameter, 110 mm long, was mounted axially in the duct, parallel to the airflow direction.” (new form `insulated_wire`) |
| ☐ | `thickness_mm` | *null — stays null* | Not stated as a thickness (1.5 mm OD, 0.75 mm core): null unless you decide to record it |
| ☐ | `o2_pct` | *null — stays null* | Not stated (“air” only): stays null — the run is retrievable but not plotted on the map |
| ☐ | `flow_cm_s` | **10** | [p.1](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=1) (proceedings p.631): “burning in air flowing at approximately 10 cm/sec” |
| ☐ | `pressure_kpa` | *null — stays null* | Not stated: stays null |
| ☐ | `ignition_method` | **Kanthal igniter wire wound around the insulation at one end (apparatus; only the polyethylene insulation is the fuel)** | [p.3](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=3) (proceedings p.633): “At one end of the sample, a kanthol igniter wire was wound around the insulation.” |
| ☐ | `outcome` | **sustained** | [p.5](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=5) (proceedings p.635): “The first burning test, WIF-A, configured for concurrent-flow conditions, did not ignite on the first attempt. On the second attempt, the igniter was activated for a longer time and the sample ignited.” · [p.9](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=9) (proceedings p.639): “In concurrent flow, WIF-A, the visible downstream tip of the flame spread at 0.16 cm/sec; while the base of the flame (where the flame is stabilized and the fuel burnout occurs) spread at 0.12 cm/sec.” |
| ☐ | `spread_rate_mm_s` | *null — stays null* | Two rates in the source (tip 0.16, base 0.12 cm/s): left null — choose one or keep null |
| ☐ | `source_page` | **9** | [p.9](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=9) (proceedings p.639) |
| ☐ | `key_observation_quote` | “In concurrent flow, WIF-A, the visible downstream tip of the flame spread at 0.16 cm/sec; while the base of the flame (where the flame is stabilized and the fuel burnout occurs) spread at 0.12 cm/sec.” | [p.9](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=9) (proceedings p.639): “In concurrent flow, WIF-A, the visible downstream tip of the flame spread at 0.16 cm/sec; while the base of the flame (where the flame is stabilized and the fuel burnout occurs) spread at 0.12 cm/sec.” |

**Decide before publishing:** it ignited only on the second attempt (longer igniter time); `sustained` describes the burn that followed.

☐ Publish in /curate under your own full name.

### W2. USML-1 WIF-B — opposed flow

`DRAFT-ID` · reopen it from **Drafts to verify** in [/curate](https://ignis-nasa-2026.vercel.app/curate)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **polyethylene** | [p.3](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=3) (proceedings p.633): “The sample consisted of polyethylene insulation extruded onto a 0.75 mm nichrome wire core.” |
| ☐ | `material_class` | **insulation** |  |
| ☐ | `fuel_form` | **insulated_wire** | [p.3](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=3) (proceedings p.633): “A single insulated wire sample, 1.5 mm diameter, 110 mm long, was mounted axially in the duct, parallel to the airflow direction.” (new form `insulated_wire`) |
| ☐ | `thickness_mm` | *null — stays null* | Not stated as a thickness (1.5 mm OD, 0.75 mm core): null unless you decide to record it |
| ☐ | `o2_pct` | *null — stays null* | Not stated (“air” only): stays null — the run is retrievable but not plotted on the map |
| ☐ | `flow_cm_s` | **10** | [p.1](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=1) (proceedings p.631): “burning in air flowing at approximately 10 cm/sec” |
| ☐ | `pressure_kpa` | *null — stays null* | Not stated: stays null |
| ☐ | `ignition_method` | **Kanthal igniter wire wound around the insulation at one end (apparatus; only the polyethylene insulation is the fuel)** | [p.3](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=3) (proceedings p.633): “At one end of the sample, a kanthol igniter wire was wound around the insulation.” |
| ☐ | `outcome` | **sustained** | [p.8](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=8) (proceedings p.638): “This process continued until the spherical mass of fuel was completely consumed.” |
| ☐ | `spread_rate_mm_s` | **0.7** | [p.9](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=9) (proceedings p.639): “The measured spread rates for the two opposed-flow cases differ by only 6%, having values of 0.070 and 0.066 cm/sec for WIF-B and WIF-D respectively.” |
| ☐ | `source_page` | **9** | [p.9](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=9) (proceedings p.639) |
| ☐ | `key_observation_quote` | “The measured spread rates for the two opposed-flow cases differ by only 6%, having values of 0.070 and 0.066 cm/sec for WIF-B and WIF-D respectively.” | [p.8](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=8) (proceedings p.638): “This process continued until the spherical mass of fuel was completely consumed.” |

☐ Publish in /curate under your own full name.

### W3. USML-1 WIF-D — opposed flow

`DRAFT-ID` · reopen it from **Drafts to verify** in [/curate](https://ignis-nasa-2026.vercel.app/curate)

| ✓ | Field | Draft value | Check it against |
|---|---|---|---|
| ☐ | `fuel_material` | **polyethylene** | [p.3](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=3) (proceedings p.633): “The sample consisted of polyethylene insulation extruded onto a 0.75 mm nichrome wire core.” |
| ☐ | `material_class` | **insulation** |  |
| ☐ | `fuel_form` | **insulated_wire** | [p.3](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=3) (proceedings p.633): “A single insulated wire sample, 1.5 mm diameter, 110 mm long, was mounted axially in the duct, parallel to the airflow direction.” (new form `insulated_wire`) |
| ☐ | `thickness_mm` | *null — stays null* | Not stated as a thickness (1.5 mm OD, 0.75 mm core): null unless you decide to record it |
| ☐ | `o2_pct` | *null — stays null* | Not stated (“air” only): stays null — the run is retrievable but not plotted on the map |
| ☐ | `flow_cm_s` | **10** | [p.1](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=1) (proceedings p.631): “burning in air flowing at approximately 10 cm/sec” |
| ☐ | `pressure_kpa` | *null — stays null* | Not stated: stays null |
| ☐ | `ignition_method` | **Kanthal igniter wire wound around the insulation at one end (apparatus; only the polyethylene insulation is the fuel)** | [p.3](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=3) (proceedings p.633): “At one end of the sample, a kanthol igniter wire was wound around the insulation.” |
| ☐ | `outcome` | **sustained** | [p.8](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=8) (proceedings p.638): “When the WIF-D flame had spread nearly to the end of the sample, the air-flow was switched off. The visible flame quenched rapidly, receding downstream from the former stabilization region.” |
| ☐ | `spread_rate_mm_s` | **0.66** | [p.9](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=9) (proceedings p.639): “The measured spread rates for the two opposed-flow cases differ by only 6%, having values of 0.070 and 0.066 cm/sec for WIF-B and WIF-D respectively.” |
| ☐ | `source_page` | **8** | [p.8](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=8) (proceedings p.638) |
| ☐ | `condition_changes` | flow 10 → 0, stored **initial**; “Burned at the test flow …; extinguished when ventilation stopped” | [p.8](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=8) (proceedings p.638) |
| ☐ | `key_observation_quote` | “When the WIF-D flame had spread nearly to the end of the sample, the air-flow was switched off. The visible flame quenched rapidly, receding downstream from the former stabilization region.” | [p.8](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=8) (proceedings p.638): “When the WIF-D flame had spread nearly to the end of the sample, the air-flow was switched off. The visible flame quenched rapidly, receding downstream from the former stabilization region.” |

**Check before publishing:** the flow-off quench is recorded as a condition change with the approved wording, never as “extinguished at 10 cm/s”.

☐ Publish in /curate under your own full name.

## Parked: USML-1 WIF-C

Ignited in still air, then the flow was turned on. [p.6](https://ntrs.nasa.gov/api/citations/20030075805/downloads/20030075805.pdf#page=6) (proceedings p.636)–7: “In the third test, WIF-C, the air-flow was not activated prior to ignition (nor during the heating phase.)” · “A flame around the igniter became immediately discernible but did not spread beyond the blackened surface downstream.” · “The flame continued burning until the insulation material near the igniter coil was consumed, approximately 38 seconds after ignition.” The flame stayed at the (still energized) igniter and never spread: like Saffire IV-2, no outcome category fits without interpretation, and the igniter-is-apparatus rule makes a flame held by the igniter weaker evidence still.
