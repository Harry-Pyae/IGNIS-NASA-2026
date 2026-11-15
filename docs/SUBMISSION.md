# IGNIS — NASA Space Apps 2026 submission package

**Challenge:** Flame in Freefall · **Team:** AstroFlare · **Freeze:** 2026-11-15 18:00

Every number in this file must match the live export at the final edit (`GET /api/export`); the checklist at the
bottom records that check. Numbers below were read from revision `a0363adf…` on 2026-11-15, **before the data restore**: re-read every one from the
live export once all 31 cards are republished (the restore changed 21 field values, not the ranges' end points).

## Links

| What | Link |
|---|---|
| Live product | <https://ignis-nasa-2026.vercel.app> |
| The 60-second case | <https://ignis-nasa-2026.vercel.app/case> |
| Open dataset (JSON) | <https://ignis-nasa-2026.vercel.app/api/export> |
| Source code (Apache-2.0) | <https://github.com/Harry-Pyae/IGNIS-NASA-2026> |
| Submission video (≤ 30.0 s) | **The Demo** (casual VO, `vo-demo-01…08`), final render after the data restore + re-capture; The Story is the backup only once R1 signs its heritage facts — upload link: **TODO** |
| Live-presentation walkthrough (silent, 80 s) + voiced (~1:42) | **Re-render pending:** the current files were recorded at the off-source revision `a0363adf` and must not be shown; both are rebuilt from the post-restore re-capture |

## Submission text

> **TODO — the team lead's draft goes here verbatim** (pasted next). Live links and numbers are filled from the
> tables in this file; nothing else is edited.

## Final numbers (live, revision `a0363adf…`)

**31 verified runs · 8 NASA campaigns · 5 source reports · 16.4–31 % O₂ · 54–101 kPa · outcomes 15 sustained /
7 extinguished / 9 did not ignite · source reports 1994–2024.** Campaigns: BASS, BASS-II, Saffire-I, Saffire-II,
Saffire-IV, Saffire-V, Saffire-VI, USML-1 WIF. Flight years are not claimed (not in the catalog).

## NASA sources (exactly as the cards cite them)

| Source (as on the cards) | NTRS | Dataset | Campaigns · cards |
|---|---|---|---|
| *Concurrent flame growth, spread and extinction over composite fabric samples in low speed purely forced flow in microgravity* | [20150008962](https://ntrs.nasa.gov/citations/20150008962) | PSI-25, DOI [10.60555/4qc4-de67](https://doi.org/10.60555/4qc4-de67), Version 4 | BASS, BASS-II · 12 |
| *Results of Large-Scale Spacecraft Flammability Tests* | [20170008805](https://ntrs.nasa.gov/citations/20170008805) | — | Saffire-I, Saffire-II · 6 |
| *Fire Safety Implications of Preliminary Results from Saffire IV and V Experiments on Large Scale Spacecraft Fires* | [20210011521](https://ntrs.nasa.gov/citations/20210011521) | — | Saffire-II, -IV, -V · 6 |
| *Preliminary Results from the Saffire VI Experiment* | [20240002981](https://ntrs.nasa.gov/citations/20240002981) | — | Saffire-VI · 4 |
| *Wire Insulation Flammability Experiment: USML-1 One Year Post Mission Summary* | [20030075805](https://ntrs.nasa.gov/citations/20030075805) | — | USML-1 WIF · 3 |

No card carries a paper DOI (`doi` is null on all 31); the PSI dataset DOI is on the 12 BASS/BASS-II cards.
Context only (no cards): NTRS [20180004258](https://ntrs.nasa.gov/citations/20180004258) (FISO deck);
corroboration only: NTRS [20250002675](https://ntrs.nasa.gov/citations/20250002675) (Saffire VI vehicle modeling, a
simulation paper).

## AI-use disclosure (matches `docs/CREDITS.md` → "Use of AI")

- **Development:** an AI coding assistant (Claude Code, by Anthropic) wrote most of the code under the team lead's
  direction; OpenAI Codex assisted on 2026-11-13. The team lead reviewed, tested and merged every change.
- **In the product:** Groq-hosted `openai/gpt-oss-120b` (primary) and Google Gemini `gemini-3.5-flash-lite` (backup)
  turn a typed scenario into structured fields that the user confirms, and narrate retrieved evidence as structured
  claims that the server validates. The LLMs never classify materials, rank matches or explain matches. Every card
  is verified and published by a named human reviewer.
- **Art and music:** branding illustrations are AI-generated (ChatGPT, with Claude assistance) and captioned as
  illustration; the video music is AI-generated (Google Gemini), used with permission. No NASA imagery is
  AI-generated.

## Submit-time checklist

| ✓ | Check | How | Status |
|---|---|---|---|
| ☐ | Submission video ≤ 30.0 s | `ffprobe` container duration of the uploaded file (placeholders measured 29.973 s) | |
| ☐ | Deck = 7 slides | count in the exported deck | |
| ☐ | Every link above opens in an incognito window | site, /case, /api/export, GitHub, video | |
| ☐ | QR code opens the live site | scan from a phone | |
| ☐ | Numbers in the submission text = live export | re-read `/api/export` at the final edit | |
| ☐ | Form fields mapped | title, description, links, video, team, AI use (table below) | |

| Form field | Source in this file |
|---|---|
| Project name | IGNIS |
| Challenge | Flame in Freefall |
| Description | Submission text |
| Project link | Live product |
| Code repository | Source code |
| Video | Submission video |
| Use of AI | AI-use disclosure |
| NASA data used | NASA sources |
