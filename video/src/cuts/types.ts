import type { ShotId } from './shots';

export type CutId = 'demo' | 'story' | 'pitch' | 'walkthrough';

/** What fills the frame during one beat. Every word on screen comes from the data file or the generated manifest. */
export type Visual =
  | { kind: 'title' }
  | { kind: 'statement'; text: string; sub?: string }
  /** A heritage fact. `factId` is the context-content entry R1 signs; until then the render stays a placeholder. */
  | { kind: 'history'; year: string; name: string; fact: string; factId: string }
  /**
   * The live product: the capture take, played from each shot's mark in turn (the beat's time split evenly across
   * `shots`). `at` starts that many seconds after the first mark; `rate` > 1 tightens UI time (never voice);
   * `zoom` slowly pushes in towards (x, y) as fractions of the frame, for readability on phones.
   */
  | { kind: 'ui'; shots: ShotId[]; at?: number; rate?: number; zoom?: { x: number; y: number; scale: number } }
  | { kind: 'team' }
  | { kind: 'physics' }
  /** Catalog numbers from the manifest ({cards}, {campaigns}, {sources}), read from /api/export at prep time. */
  | { kind: 'catalog' }
  | { kind: 'list'; heading: string; items: string[] }
  /** The end card shared, frame for frame, by both 30-second cuts. */
  | { kind: 'end' }
  /** The team pitch close: URL + QR, credits, AI-use disclosure, not-affiliated line. */
  | { kind: 'close' };

export interface Beat {
  /** `<cut>-<nn>`: also the VO file name (assets/vo/vo-<cut>-<nn>.wav|m4a|mp3). */
  id: string;
  /** The spoken line, also the caption. *Asterisks* mark emphasis (amber in captions, stressed when read). */
  vo: string;
  /** Shorter wording to re-record if this line runs over its budget (30-second cuts). */
  shorter?: string;
  visual: Visual;
  /** Planned length; the recorded VO decides the real one within [minSec, maxSec]. */
  targetSec: number;
  minSec: number;
  maxSec: number;
  /** Chapter label shown top-left (team pitch). */
  chapter?: string;
  /** A fact in this line that still needs a named sign-off (R1 science/history). Pending = placeholder render. */
  signOff?: string;
  /** [LIVE] catalog numbers this line SPEAKS. Checked against the live export at prep; a mismatch keeps the cut a placeholder. */
  live?: { cards?: number; campaigns?: number; o2?: [number, number]; kpa?: [number, number] };
  /** Presenter note for whoever delivers the line live (not spoken, not captioned). */
  note?: string;
}

export interface CutDef {
  id: CutId;
  composition: string;
  title: string;
  /** Hard ceiling (30.0 for the submission cuts) or a [min, max] window (team pitch). */
  lengthSec: { min: number; max: number };
  /** File in assets/music/; null = VO only. */
  music: string | null;
  beats: Beat[];
}

export interface TeamMember {
  name: string;
  role: string;
}
