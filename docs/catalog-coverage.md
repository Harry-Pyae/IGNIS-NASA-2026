# Catalog coverage and mission review — R1

Status: awaiting R1's event-window review. The production read below is factual only; it is not a scientific
sign-off, and the "Snapshot" table stays R1's to complete and sign.

## Production read for R3's demo-scenario pick (2026-11-15 08:49, Coder A agent, read-only `/api/export`)

Catalog revision `becd7b54…`: **3 verified cards, 2 campaigns, 1 source document** (NTRS 20150008962). None of the
drafts in `docs/R1-QUEUE.md` is published yet.

| Test ID | Campaign | Material / thickness | O₂ | Airflow | Pressure | Outcome | Verified by |
|---|---|---|---|---|---|---|---|
| GMT96-T7 | BASS | cotton_fiberglass, 0.32 mm | 21 % | 10 cm/s | 101.325 kPa | sustained | L-san |
| GMT96-T8 | BASS | cotton_fiberglass, 0.32 mm | 21 % | 5 cm/s | 101.325 kPa | sustained | Q-san |
| GMT45-T4 | BASS-II | cotton_fiberglass, 0.32 mm | 18.7 % | 10→2.2 cm/s (final held) | 101.325 kPa | extinguished | P-san |

What each preset shows on this catalog (the app computes these labels live from the catalog, so they update by
themselves on every publish):

| Preset | Today | What would change it |
|---|---|---|
| Crew clothing (cotton blend) | **The only preset with runs: all 3 cards.** The current demo scenario. | The six BASS-II drafts (all cotton_fiberglass, 16.9–17.5 % O₂, low final flow) would take it to 9 runs and fill the low-oxygen corner of the map. The Saffire SIBAL drafts join it only if R1 records SIBAL as cotton_fiberglass. |
| Cabin wall panel (PMMA) | No compatible runs | A published PMMA card (Saffire IV-2, V-3 or V-4 after R1's outcome decision). |
| Cable insulation (polyethylene) | Mapped to the new form `insulated_wire` (decision 2026-11-15); runs only once the USML-1 WIF drafts are published | USML-1 WIF-A, -B, -D (1992 Shuttle glovebox; O₂ and pressure not stated, so not plotted) |
| Silicone sheet (replaced Cargo packaging) | Four Saffire-II silicone `no_ignition` drafts | Their publication. Cargo packaging moved to a Gap Radar line: no packaging flight test was found |

**Recommendation for R3 (to confirm with R1):** keep *Crew clothing* as the demo scenario. It is the only one with
evidence today, and every BASS-II draft R1 signs strengthens it without changing the script. Re-read this table after
the last publication: the counts in the video scripts and slides come from the same export.

## Snapshot to complete after publication

| Field | Value |
|---|---|
| Reviewed by / review date | Pending |
| App commit / catalog revision | Pending |
| Distinct verified runs / distinct source documents | Pending |
| Materials and forms represented | Pending |
| Records with both oxygen and airflow / missing either | Pending |
| Records outside displayed axes | Pending |
| Conditions missing by parameter | Pending |
| Duplicate identities checked and reconciled | Pending |

## Mission decision

Record preset ID and exact confirmed inputs, at least three selected verified UUIDs and test IDs, source URLs,
and the reviewed gap wording. List shared conditions and uncontrolled differences: form/thickness, pressure,
flow direction/history, apparatus scale, ignition and external heating. Explain why the comparison is useful without
claiming equivalent behavior or causation. Record the GMT45-T4 constant-flow-comparison decision explicitly.

Record R1's source review and R3's caption review under their own names. `MISSION_CASE` remains null until this
handoff exists. Its automated identity gate is not a substitute for this scientific review.

| Excluded or parked run/source | Reason | Missing evidence / follow-up | Reviewer |
|---|---|---|---|
| No event-window review recorded yet | Pending | Inspect source queue | — |

Do not publish solely to reach 15 records. Do not equate 15 cards with 15 independent studies. Preset atmosphere
inputs and educational context are outside these experimental counts.
