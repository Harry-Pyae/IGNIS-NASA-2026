/**
 * Every UI moment the four cuts need, in CAPTURE order: one session (scripts/capture.mjs) records them all as one
 * continuous take and marks where each shot starts. Cuts reference shots by id, so capture order and edit order are
 * independent. No imports: Node runs this file directly (type stripping) for the capture script and the prep report.
 */
export const SHOTS = [
  { id: 'landing', what: 'Landing page: hero, IGNIS title, the two entry buttons', cuts: ['pitch'] },
  { id: 'preset', what: 'Console: pick the "Crew clothing (cotton blend)" preset in the scenario rail', cuts: ['demo', 'story', 'pitch', 'walkthrough'] },
  { id: 'confirm', what: 'Press "Find matching experiments": the inputs are confirmed, the page settles on the results', cuts: ['demo', 'story', 'pitch', 'walkthrough'] },
  { id: 'map', what: 'Evidence map with the matched runs, outcome shapes and the scenario marker', cuts: ['demo', 'story', 'pitch', 'walkthrough'] },
  { id: 'dotTap', what: 'Tap a map point: ring + its record panel right under the plot', cuts: ['pitch'] },
  { id: 'match', what: 'Match panel: ranked cards, "why it matched" chips', cuts: ['demo', 'story', 'pitch'] },
  { id: 'brief', what: 'Mission brief: OBSERVED / SUPPORTED claims with citation chips', cuts: ['pitch'] },
  { id: 'citation', what: 'Click a citation chip [E1]: the cited card opens, its quote and locator in view', cuts: ['demo', 'story', 'pitch', 'walkthrough'] },
  { id: 'slider', what: 'Drag the airflow slider: retrieval and the map update live', cuts: ['demo', 'pitch'] },
  { id: 'gap', what: 'Gap radar: tap region 1, its untested cells highlight on the map', cuts: ['demo', 'story', 'pitch', 'walkthrough'] },
  { id: 'nasaPage', what: 'Click the card\'s NASA source: the NASA report opens', cuts: ['demo', 'story', 'pitch', 'walkthrough'] },
  { id: 'library', what: 'Library: filter the verified runs, open one', cuts: ['pitch', 'walkthrough'] },
  { id: 'verifiedBy', what: 'Experiment detail: "Verified by <reviewer> · <date>", the quote, NTRS/DOI, Cite this', cuts: ['pitch', 'walkthrough'] },
  { id: 'compare', what: 'Compare two runs side by side', cuts: ['pitch'] },
  { id: 'caseWithheld', what: '60-second case: claim GMT96-T8 used 10 cm/s → WITHHELD with the source row', cuts: ['demo', 'story', 'pitch', 'walkthrough'] },
  { id: 'caseAccepted', what: '60-second case, same run: claim 5 cm/s (the card\'s value) → ACCEPTED with the same source row', cuts: ['walkthrough'] },
  { id: 'export', what: 'Sources page / Export dataset: the open verified dataset', cuts: ['pitch'] },
] as const;

export type ShotId = (typeof SHOTS)[number]['id'];
