/**
 * The reuse contract. Every word, number, image and clip in the film comes from one VideoData object.
 * Scenes take their slice as props; none of them hardcodes content.
 * Media paths are relative to the active public dir (video/public for real, video/dummy/public for dummy).
 */
export type MediaPath = string;

/** A displayed value keeps its original units as written (Core Principle 5). null = "not reported", shown as such. */
export type Reported = string | null;

export type SceneId = 'coldOpen' | 'problem' | 'product' | 'evidence' | 'limit' | 'mission' | 'end';
/** Product duration is the sum of its clip list, so it has no durationSec of its own. */
export type SceneSlot = { scene: Exclude<SceneId, 'product'>; durationSec: number } | { scene: 'product' };

/** Absolute times in seconds within the composition. `my` renders only when present (R3's reviewed set). */
export interface Caption {
  fromSec: number;
  toSec: number;
  en: string;
  my?: string;
}

export interface ProductClip {
  src: MediaPath;
  /** Lower-third label: what the viewer is looking at. */
  label: string;
  trimStartSec: number;
  durationSec: number;
}

export interface EvidenceCard {
  /** Campaign + test ID exactly as on the verified card. */
  id: string;
  material: string;
  rows: { label: string; value: Reported }[];
  outcome: 'sustained' | 'extinguished' | 'transition' | 'partial';
  outcomeLabel: string;
  verifiedBy: string;
  /** Approved still from the media ledger, labeled campaign context; null = text card. */
  still: MediaPath | null;
}

export interface VideoData {
  /** true only for the local dummy preview. A real render refuses to run while this is true. */
  isDummy: boolean;
  fps: number;
  /** Seconds of corridor flight between scenes. */
  transitionSec: number;

  art: {
    papers: MediaPath;
    patch: MediaPath;
    flameSphere: MediaPath;
    /** Shown under the flame sphere every time it appears. */
    illustrationCaption: string;
  };

  labels: {
    notReported: string;
    scenario: string;
    verifiedBy: string;
    campaignContext: string;
  };

  coldOpen: {
    title: string;
    tagline: string;
    /** Real NASA exterior footage from R2's ledger, or null for the drawn station (captioned as illustration). */
    exteriorFootage: { src: MediaPath; trimStartSec: number; credit: string } | null;
    stationIllustrationCaption: string;
  };

  problem: {
    beats: string[];
    question: string;
  };

  product: {
    clips: ProductClip[];
    trailerClips: ProductClip[];
  };

  evidence: {
    heading: string;
    stats: { value: string; label: string }[];
    scenario: { label: string; value: Reported }[];
    cards: [EvidenceCard, EvidenceCard, EvidenceCard];
    quote: {
      text: string;
      locator: string;
      sourceId: string;
      url: string;
    };
  };

  limit: {
    map: {
      xLabel: string;
      yLabel: string;
      xTicks: string[];
      yTicks: string[];
      columns: number;
      rows: number;
      /** [col, row] from the bottom-left; tested cells carry an outcome dot. */
      tested: { cell: [number, number]; outcome: EvidenceCard['outcome'] }[];
      gap: [number, number][];
      scenario: [number, number];
      /** Where these cells were read from: the live app view + catalog revision. */
      source: string;
    };
    untestedLabel: string;
    /** Approved copy, verbatim (src/lib/copy.ts). */
    honestyLine: string;
  };

  mission: {
    heading: string;
    /** Screen recording of the guided mission; the five steps are captions over it. */
    clip: { src: MediaPath; trimStartSec: number };
    steps: [string, string, string, string, string];
  };

  end: {
    patchTopRibbon: string;
    patchBottomRibbon: string;
    teamName: string;
    liveUrl: string;
    credits: string[];
    license: string;
  };

  timeline: {
    film: SceneSlot[];
    trailer: SceneSlot[];
  };
  captions: {
    film: Caption[];
    trailer: Caption[];
  };
}
