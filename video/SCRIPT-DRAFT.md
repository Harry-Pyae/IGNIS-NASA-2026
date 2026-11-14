# Pitch video — script DRAFT (for R3 review)

Status: **DRAFT, not approved.** R3 reviews and edits; Coder A approves anything that restates product behaviour.
Only after sign-off do these lines move into `src/data/video.data.ts` (replacing its `TODO(...)`s).
The dummy preview already plays them (`video/dummy/out/`) so you can judge timing by watching.

Rules every line follows (AGENTS.md guardrails): no "predict" / "will burn" / "would burn"; absence is bounded to
the current IGNIS catalog; no science values (those come from R1's published cards); no claim that all errors are
eliminated. Lines marked **(approved copy)** are quoted from `src/lib/copy.ts` or the approved landing text.
Times are seconds in the real timeline (film 121 s, trailer 44 s); retime to the recorded VO.

## On-screen text

| Field | Draft |
|---|---|
| `problem.beats[0]` | NASA has run fire experiments in orbit. Their results are spread across technical reports, tables and figures. |
| `problem.beats[1]` | Finding what was actually observed, for one material and one airflow, takes careful reading. |
| `problem.question` | What did NASA actually observe, and where does the evidence stop? |
| `product.clips[0].label` | Describe the scenario, then confirm the exact inputs |
| `product.clips[1].label` | The closest verified NASA experiments, on the evidence map |
| `product.clips[2].label` | Every card links to its quote, locator and NASA source |
| `product.clips[3].label` | The Mission Brief: observed facts, checked against each card |
| `product.trailerClips[0..2].label` | Same as clips 1, 2 and 4 |
| `evidence.heading` | What the verified catalog observed |

## Film captions (EN)

| From–to (s) | Scene | Line |
|---|---|---|
| 1.0–3.4 | Cold open | Spacecraft fire safety starts with what was actually observed. |
| 3.6–6.8 | Cold open | IGNIS: evidence-first fire-safety intelligence for human spaceflight. **(approved tagline)** |
| 8.5–12.0 | Problem | NASA's orbital fire experiments are spread across reports, tables and figures. |
| 12.0–15.8 | Problem | So we asked: what was actually observed, and where does the evidence stop? |
| 17.5–22.0 | Product · scenario | Describe a spacecraft fire scenario in mission terms. |
| 22.0–27.0 | Product · scenario | IGNIS shows what it understood, and you confirm the exact inputs. |
| 32.5–37.5 | Product · matches | Retrieval is deterministic: the closest verified NASA experiments for those conditions. |
| 37.5–42.5 | Product · matches | Ordered by similarity of reported conditions, not material safety. **(approved copy)** |
| 47.5–52.5 | Product · source | Every card is traceable: a verbatim quote, a page locator, the NASA source. |
| 52.5–57.5 | Product · source | And every card is published by a named human reviewer. |
| 62.5–67.5 | Product · Brief | The Mission Brief narrates only the evidence IGNIS retrieved. |
| 67.5–72.5 | Product · Brief | The server checks each cited value against its card before it is shown. |
| 72.5–76.5 | Product · Brief | Statements that fail that check are withheld, visibly. |
| 78.5–84.5 | Evidence | Three verified runs, each with its reported conditions and outcome. |
| 85.0–90.5 | Evidence | One quote, where it appears, and the NASA report it came from. |
| 93.0–100.5 | Limit | Where nothing matches, IGNIS doesn't guess. It marks the gap. |
| 102.5–107.0 | Mission | The guided mission walks through one reviewed case, step by step. |
| 107.0–111.5 | Mission | From the question, to the source, to the limit of the evidence. |
| 113.5–117.5 | End | What NASA saw. Nothing it didn't. **(approved landing line)** |
| 117.5–120.5 | End | Team AstroFlare · NASA Space Apps 2026 |

The limit scene shows the approved honesty line on screen (`COPY.gapNote`); its caption stays short so the two don't compete.

## Trailer captions (EN)

| From–to (s) | Line |
|---|---|
| 0.3–3.0 | What did NASA actually observe? |
| 4.5–11.0 | Describe a spacecraft fire scenario. Confirm the exact inputs. |
| 11.5–19.0 | See the closest verified NASA experiments for those conditions. |
| 19.5–26.0 | Every cited value is checked against its card before it is shown. |
| 27.5–32.0 | Each card traces to its quote and NASA source. |
| 33.5–39.0 | Where nothing matches, IGNIS marks the gap instead of guessing. |
| 40.5–43.8 | What NASA saw. Nothing it didn't. |

## For R3 to decide

- **Evidence beat:** once the three cards are chosen, R1 checks that "each with its reported conditions and outcome"
  still describes them (e.g. if one card has no reported airflow).
- **Burmese (`my`):** add per line only after `docs/MY-REVIEW.md` review; lines without `my` show English only.
- **VO:** if the VO reads these lines, retime `captions.*` to the recording; scene lengths live in `timeline`.
