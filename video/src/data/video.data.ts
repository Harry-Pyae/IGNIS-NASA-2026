/**
 * THE data file for the real film. Every TODO(...) below is a field the real version must fill;
 * `npm run check:no-dummy` lists the ones left, and a real render refuses to start while any remain.
 * Approved copy comes straight from the app (src/lib/copy.ts) so it can never drift from the product.
 * Scientific values are copied from verified, published cards only (Core Principles 1, 2, 5).
 */
import { COPY } from '../../../src/lib/copy.ts';
import type { VideoData } from '../types';
import { TODO } from '../validate.ts';

export const videoData: VideoData = {
  isDummy: false,
  fps: 30,
  transitionSec: 1,

  art: {
    papers: 'art/bg-papers.webp',
    patch: 'art/mission-patch.png',
    flameSphere: 'art/flame-sphere.webp',
    illustrationCaption: COPY.illustration,
  },

  labels: {
    notReported: 'Not reported',
    scenario: 'Your scenario',
    verifiedBy: 'Verified by',
    campaignContext: COPY.campaignContext,
  },

  coldOpen: {
    title: 'IGNIS',
    tagline: 'Evidence-first fire-safety intelligence for human spaceflight',
    // Set to { src: 'real/<file>', trimStartSec, credit } once R2's ledger row is Approved; null draws the station.
    exteriorFootage: null,
    stationIllustrationCaption: COPY.illustration,
  },

  problem: {
    beats: [TODO('problem beat 1 (pitch script, R3)'), TODO('problem beat 2 (pitch script, R3)')],
    question: TODO('the problem question (pitch script, R3)'),
  },

  product: {
    // Screen recordings of the LIVE app with real verified data (demo-script.md flow). Durations are the cut lengths.
    clips: [
      { src: 'real/product-01-scenario.mp4', label: TODO('clip 1 label'), trimStartSec: 0, durationSec: 15 },
      { src: 'real/product-02-matches.mp4', label: TODO('clip 2 label'), trimStartSec: 0, durationSec: 15 },
      { src: 'real/product-03-source.mp4', label: TODO('clip 3 label'), trimStartSec: 0, durationSec: 15 },
      { src: 'real/product-04-brief.mp4', label: TODO('clip 4 label'), trimStartSec: 0, durationSec: 15 },
    ],
    trailerClips: [
      { src: 'real/product-01-scenario.mp4', label: TODO('trailer clip 1 label'), trimStartSec: 0, durationSec: 7 },
      { src: 'real/product-02-matches.mp4', label: TODO('trailer clip 2 label'), trimStartSec: 0, durationSec: 8 },
      { src: 'real/product-04-brief.mp4', label: TODO('trailer clip 3 label'), trimStartSec: 0, durationSec: 7 },
    ],
  },

  evidence: {
    heading: TODO('evidence heading'),
    stats: [
      { value: TODO('verified card count from /api/export'), label: 'verified cards' },
      { value: TODO('campaign count'), label: 'campaigns' },
    ],
    scenario: [
      { label: 'Material', value: TODO('mission case material, as confirmed in the app') },
      { label: 'Oxygen', value: TODO('scenario O₂ with units, or null') },
      { label: 'Airflow', value: TODO('scenario airflow with units, or null') },
    ],
    cards: [card(1), card(2), card(3)],
    quote: {
      text: TODO('verbatim source quote from one of the three cards'),
      locator: TODO('its page/section locator'),
      sourceId: TODO('e.g. NTRS 2015xxxxxxx'),
      url: TODO('the reviewed source URL on the card'),
    },
  },

  limit: {
    // Axes and grid = the app's shared GRID (src/engine/gaps.ts): O₂ 14–30 % in 1-pt bands, airflow 0–30 cm/s in 2 cm/s bands.
    map: {
      xLabel: 'Airflow (cm/s)',
      yLabel: 'Oxygen (% O₂)',
      xTicks: ['0', '10', '20', '30'],
      yTicks: ['14', '18', '22', '26', '30'],
      columns: 15,
      rows: 16,
      tested: [], // TODO: the mission case's map, read from the live app
      gap: [], // TODO: the reviewed gap cells
      scenario: [0, 0], // TODO: the scenario marker cell
      source: TODO('map cells: preset + catalog revision they were read from (tested, gap, scenario above)'),
    },
    untestedLabel: 'UNTESTED',
    honestyLine: COPY.gapNote,
  },

  mission: {
    heading: 'Guided mission',
    clip: { src: 'real/mission-guided.mp4', trimStartSec: 0 },
    steps: ['Open the case', 'Examine observations', 'Inspect the source', 'Explain the Brief', 'Find the limit'],
  },

  end: {
    patchTopRibbon: 'IGNIS',
    patchBottomRibbon: 'Team AstroFlare',
    teamName: 'Team AstroFlare',
    liveUrl: 'ignisprototype01.vercel.app',
    credits: [TODO('NASA data credits: one line per source used on screen (NTRS IDs, footage credits from the media ledger)')],
    license: 'Code: Apache-2.0 · NASA material: public domain per NASA media guidelines · Art pack: illustration',
  },

  timeline: {
    film: [
      { scene: 'coldOpen', durationSec: 7 },
      { scene: 'problem', durationSec: 8 },
      { scene: 'product' },
      { scene: 'evidence', durationSec: 13 },
      { scene: 'limit', durationSec: 9 },
      { scene: 'mission', durationSec: 10 },
      { scene: 'end', durationSec: 8 },
    ],
    trailer: [
      { scene: 'coldOpen', durationSec: 3 },
      { scene: 'product' },
      { scene: 'evidence', durationSec: 5 },
      { scene: 'limit', durationSec: 6 },
      { scene: 'end', durationSec: 4 },
    ],
  },

  captions: {
    film: [{ fromSec: 0, toSec: 4, en: TODO('film captions, timed to the VO') }],
    trailer: [{ fromSec: 0, toSec: 3, en: TODO('trailer captions, timed to the VO') }],
  },
};

function card(n: number) {
  return {
    id: TODO(`card ${n} campaign + test ID`),
    material: TODO(`card ${n} fuel_material`),
    rows: [
      { label: 'Oxygen', value: TODO(`card ${n} O₂ as reported, with units`) },
      { label: 'Airflow', value: TODO(`card ${n} airflow as reported, with units`) },
      { label: 'Pressure', value: TODO(`card ${n} pressure as reported, with units`) },
    ],
    outcome: 'sustained' as const, // TODO: the card's outcome
    outcomeLabel: TODO(`card ${n} outcome label`),
    verifiedBy: TODO(`card ${n} verified_by (the reviewer's own name)`),
    still: null,
  };
}
