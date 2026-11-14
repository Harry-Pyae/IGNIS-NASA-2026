/**
 * Approved scientific copy (docs/DECISIONS-ROUND2.md, decisions 3–4). OWNER: Coder A.
 * Coder B and R3 render these strings (or reviewed translations of them) — never paraphrase
 * them into stronger claims. A finite curated catalog cannot establish absence across all
 * NASA research, so absence is always bounded to "the current IGNIS catalog".
 */
export const COPY = {
  sliderCaption: 'Sliders change which verified NASA experiments IGNIS retrieves.',
  // Environment presets (DECISIONS-ROUND5 #1): framed as showing where evidence ends, never as a fault.
  environmentCaption: "Environment presets change oxygen and pressure only. Use them to see where the verified catalog's evidence ends.",
  elevatedO2: (pct: number) => `Elevated oxygen: ${pct}% O₂ is above the 21% of Earth-normal air.`,
  absence: 'No matching verified evidence in the current IGNIS catalog.',
  gapNote:
    'Gaps are not necessarily unsafe — they have no matching verified evidence in the current IGNIS catalog. IGNIS lists them as candidate areas for further study.',
  claimsGuarantee:
    'Observed and supported statements cite retrieved experiments, and the server checks each cited value against its card. Gaps are marked separately.',
  interpretationLimit: 'Interpretation of the cited experiments, not a direct observation. Checked references do not establish causation or equivalence between tests.',
  mapScope: 'Each occupied cell contains at least one catalog observation in a 1 percentage-point oxygen and 2 cm/s airflow band. Inspect the card for material, form, thickness, pressure and changing conditions; the cell does not establish coverage of every condition within it.',
  matchOrder: 'Ordered by similarity of reported conditions, not material safety. A class-only match does not establish equivalent material behavior.',
  changingConditions: 'Conditions changed during this run',
  staleScenario: 'Inputs changed. Confirm this scenario to update its matches and Mission Brief.',
  fallback: 'Briefing unavailable — showing matched evidence only.',
  materialUnresolved: 'Material unresolved — select a catalog material',
  outsideRange:
    'Your value is outside the range covered by the current verified IGNIS catalog. Nearby observations do not establish evidence at that value.',
  // Match summary (decision 10): the count, then why every uncounted parameter is uncounted.
  compared: (n: number, m: number) => `Compared on ${n} of ${m} parameters`,
  weakEvidence: (m: number) => `Weak evidence — compared on 0 of ${m} parameters`,
  unscored: {
    not_specified: (n: number) => `${n} not specified`,
    identical: (n: number) => `${n} identical across all candidates`,
    not_reported: (n: number) => `${n} not reported by this experiment`,
    none_reported: (n: number) => `${n} not reported by any candidate`,
  },
  illustration: 'Illustration — not NASA experiment imagery.',
  withheld: (n: number) => `${n} statement${n === 1 ? '' : 's'} withheld (failed evidence validation)`,
  inReview: (n: number) => `Catalog in verification — ${n} card${n === 1 ? '' : 's'} in review`,

  // Round 6 (docs/DECISIONS-ROUND6.md). Two paths through one product: the mission is primary only once it is ready.
  landingCta: { mission: 'Start the guided mission', explore: 'Explore the evidence' },
  missionAvailability:
    'The guided mission opens once a case built from verified NASA cards has been reviewed. Until then, explore the evidence on your own.',
  // Current-investigation summary: these counts mean different things, so each keeps its own label.
  summary: {
    scenario: 'Your scenario',
    conditions: 'Conditions',
    evidence: 'Evidence',
    eligible: (n: number) => `${n} eligible`,
    plotted: (n: number) => `${n} with plot coordinates`,
    notPlotted: (n: number) => `${n} missing plot coordinates`,
    topMatches: (n: number) => `${n} top match${n === 1 ? '' : 'es'}`,
    o2: (v: number | null) => (v == null ? 'O₂ not specified' : `O₂ ${v}%`),
    flow: (v: number | null) => (v == null ? 'Flow not specified' : `Flow ${v} cm/s`),
    // Before confirmation the counts are whole-catalog counts; never label them with unconfirmed inputs.
    notConfirmed: 'Not confirmed yet. These counts cover the whole verified catalog; confirm the scenario to see its own evidence.',
  },
  environmentExplanation: 'Sets oxygen and pressure only.',
  environmentLimit: 'These atmosphere inputs do not establish lunar partial-gravity behavior or spacesuit operational safety from orbital microgravity observations.',
  environmentApplied: 'Oxygen updated · Pressure updated · Other inputs unchanged',
  contextBanner: 'Research context — not matched evidence.',
  campaignContext: 'Campaign context',

  // Round 3 plain-language layer (docs/WHO-DOES-WHAT.md). One sentence + one anchor already in the product, ≤ 25 words.
  // Longer explanations live in `glossary` (/methods). Facts still waiting for R1's source are deliberately absent:
  // the Moon-base oxygen figure, "flames need moving air", the ISS cabin pressure, and the transition/partial outcomes.
  plain: {
    hints: {
      material: 'What the sample is made of and its shape. IGNIS only compares experiments with a compatible material and form.',
      o2: 'The share of oxygen in the air around the sample. Earth-normal air is 21%.',
      airflow: "How fast air moves past the sample, in cm/s. 0 means still air; leave it empty if you don't know.",
      thickness: 'How thick the sample is. The verified BASS cotton-fiberglass fabric was about 0.32 mm.',
      pressure: 'Air pressure around the sample. The verified BASS runs were at 1 atm (101.325 kPa), Earth sea-level pressure.',
    },
    chips: {
      exact: 'Same material as your scenario.',
      same: 'Same as your value.',
      class: 'A different material of the same class as yours.',
      close: 'Close to your value.',
      different: 'Different from your value.',
      not_reported: 'This experiment did not report it.',
      untested: 'No card in the current IGNIS catalog reports it.',
      outside_range: 'Your value is outside the range of the current IGNIS catalog.',
      not_specified: 'You left it empty, so it is not compared.',
    },
    outcomes: {
      sustained: 'The flame kept burning during the recorded run.',
      extinguished: 'The flame went out during the recorded run.',
    },
    brief: {
      OBSERVED: 'What the cited NASA experiment recorded.',
      SUPPORTED: 'Our reading of the cited experiments: an interpretation, not a measurement.',
      UNTESTED: 'No experiment in the current IGNIS catalog covers this.',
    },
    map: {
      untested: 'Hatched: inside the catalog’s range, but no verified card at these conditions yet.',
      outside: 'Dashed: beyond the range the current IGNIS catalog covers.',
    },
    compared: 'How many of your conditions were compared. Empty, unreported or identical-everywhere conditions are not counted.',
    firstVisit: {
      mission: 'New here? Run the guided mission. It walks you through one real investigation.',
      explore: 'New here? Pick a preset, confirm it, then follow the numbered steps down the page.',
      dismiss: 'Dismiss',
    },
    hintButton: (label: string) => `What is ${label}?`,
  },
  /** /methods "Plain words" section. Each entry: the term as it appears in the app, then what it means. */
  glossary: [
    { term: 'Verified card', plain: 'One NASA experiment run, checked field by field against its source and published under a named reviewer.' },
    { term: 'Scenario', plain: 'The material and conditions you describe. IGNIS uses it only to find comparable experiments.' },
    { term: 'Confirm', plain: 'Locks in your scenario. Matches and the Mission Brief are built only after you confirm.' },
    { term: 'Match', plain: 'A verified experiment with compatible material and form, ordered by how similar its reported conditions are.' },
    { term: 'Compared on N of M', plain: 'How many of your conditions could actually be compared with the experiments retrieved.' },
    { term: 'Observed', plain: 'A statement of what the cited experiment recorded, checked against its card.' },
    { term: 'Supported', plain: 'Our interpretation of the cited experiments. It is labelled as interpretation and does not establish cause.' },
    { term: 'Untested', plain: 'Inside the catalog’s range, but no verified card at these conditions in the current IGNIS catalog.' },
    { term: 'Outside catalog range', plain: 'Beyond the lowest or highest value any verified card reports. Nearby cards are not evidence there.' },
    { term: 'Not reported', plain: 'The experiment’s source does not state this value, so it stays empty rather than guessed.' },
    { term: 'Not specified', plain: 'You left this condition empty, so it is not used in the comparison.' },
    { term: 'Conditions changed', plain: 'A condition, such as airflow, changed during the run. The card records how.' },
    { term: 'Catalog revision', plain: 'A fingerprint of the published catalog. It changes whenever a card is published or corrected.' },
  ],
} as const;
