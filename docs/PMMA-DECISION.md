# PMMA decision package: Saffire V-3 and V-4

Prepared 2026-11-15 by Coder A's agent from NTRS 20210011521, *Fire Safety Implications of Preliminary Results from
Saffire IV and V Experiments on Large Scale Spacecraft Fires* ([PDF](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf)).
Every sentence below was matched word for word against the NTRS text layer. Page numbers are as recorded in
`docs/R1-QUEUE.md`; confirm each on the PDF. **Nothing is drafted in production until a named human approves the
outcome wording here.** Approve or park each run separately.

Why it matters: these would be the catalog's first PMMA cards. The *Cabin wall panel (PMMA)* preset accepts thick
slabs as compatible with its flat-sheet form (`src/lib/gates.ts`), so either card would turn that preset from “No
compatible runs” into a documented case.

## What the source says (both runs)

| Locator | Verbatim |
|---|---|
| Table 1, [p.3](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=3) | Material/configuration: V-3 “1 sided PMMA”, V-4 “Structured PMMA”. Length (cm) 18 / 20. Air Flow Rate (cm/s) 20 / 20. Flow Direction “Concurrent” / “Opposed”. Ambient Pressure (kPa) 71.3 / 72.6. Oxygen Concentration (mol %) 25.4 / 25.7. |
| [p.5](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=5) | “the air flow for Saffire V samples 3 and 4 was reduced from the starting condition of 20 cm/s to 5 cm/s and held at 5 cm/s for 300 seconds.” |
| [p.5](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=5) | “Consequently, when the fan was turned off in Saffire V-3 and V-4, the sample extinguished immediately (Figures 5 and 6).” |
| Figure 5 caption, [p.6](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=6) | “Flow speed and radiant flux for Saffire V-3. After an extended (300 second) interval at reduced air flow (5 cm/s), the flame extinguished quickly when the flow was turned off.” |
| Figure 6 caption, [p.6](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf#page=6) | “Radiant flux and flow speed for Saffire V-4 Evident is the rapid extinction after 300 seconds of cooling at low air flow (5 cm/s) before the flow was stopped completely.” |

The sequence for both: **20 cm/s → reduced to 5 cm/s and held 300 s → fan off → flame out immediately.** The
flame burned at both test flows; it went out only when ventilation stopped.

## Saffire V-3 (one-sided PMMA, concurrent)

| Field | Proposed | Source |
|---|---|---|
| fuel_material / form | `PMMA` / `thick_slab` | Table 1 “1 sided PMMA”; 0.5 cm thick (Figure 3 legend “1-sided PMMA (0.5 cm thick.)”, p.4) |
| thickness_mm | 5 | same |
| o2_pct | 25.4 (mol % entered as vol %) | Table 1, p.3 |
| flow_cm_s | 20, stored **initial** | Table 1, p.3 |
| pressure_kpa | 71.3 | Table 1, p.3 |
| condition_changes | flow_cm_s 20 → 0, stored `initial`, note: **“Burned at the test flows (20 cm/s, then reduced to 5 cm/s and held 300 s); extinguished when ventilation stopped (p.5).”** | p.5 sentences above |
| outcome | **`sustained`** (at the stored 20 cm/s, and at 5 cm/s) | p.5; growth, p.9: “In Saffire V-3, the one-sided PMMA sample flame (in 25.4% oxygen) grew to 11 cm after 450 seconds.” |
| key_observation_quote | “Consequently, when the fan was turned off in Saffire V-3 and V-4, the sample extinguished immediately (Figures 5 and 6).” | p.5 |

## Saffire V-4 (structured / ribbed PMMA, opposed)

| Field | Proposed | Source |
|---|---|---|
| fuel_material / form | `PMMA` / `thick_slab` (the Round 8 extractor's `flat_sheet` is wrong: ribbed slab) | Table 1 “Structured PMMA”; Figure 3 legend “Structured PMMA (1 cm thick.)”; Figure 11 “Opposed flame spread on ribbed PMMA … Ribs are 3 mm high” |
| thickness_mm | 10 | same |
| o2_pct | 25.7 (mol % entered as vol %) | Table 1, p.3 |
| flow_cm_s | 20, stored **initial**, **opposed** flow | Table 1, p.3 |
| pressure_kpa | 72.6 | Table 1, p.3 |
| condition_changes | same wording as V-3 | p.5, Figure 6 |
| outcome | **`sustained`** (at the stored 20 cm/s, and at 5 cm/s) | p.5, Figure 6 |
| key_observation_quote | “Evident is the rapid extinction after 300 seconds of cooling at low air flow (5 cm/s) before the flow was stopped completely.” | Figure 6 caption, p.6 |
| also note | “Two Saffire samples (IV-2 and V-4) exhibited intense ignition processes of deflagration because of a stratified mixture” | Ignition section |

## The rule if approved

- Outcome **`sustained`** with the condition change stored, so every surface (map panel, match card, brief) shows
  “Conditions changed during this run: Burned at the test flows …; extinguished when ventilation stopped.” The
  app already renders `condition_changes` notes prominently and never narrates such a run as constant-condition.
- **Never** `extinguished` at 20 cm/s: the flame did not go out at either test flow.
- If the approver reads the run differently (for example, that the stored scalar should be the 5 cm/s held flow,
  `final_held`), say so here before drafting; the card must still carry the same wording.

## Decision

| Run | Approve as above / Park | Name | Date |
|---|---|---|---|
| Saffire V-3 | | | |
| Saffire V-4 | | | |

## Parked: Saffire IV-2

“grew to 9.5 cm after 400 seconds” (p.9), survived “the 15 second interval of no flow” (p.5) and grew until soot
reduced the air flow; leading-edge regression only, it “did not spread appreciably” (p.8). Burning without
appreciable spread fits none of `sustained`, `extinguished`, `transition`, `partial` without interpretation, so it
stays out of the catalog.
