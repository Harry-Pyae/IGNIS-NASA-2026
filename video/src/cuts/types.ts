import type { ShotId } from './shots';

export type CutId = 'demo' | 'story' | 'pitch' | 'walkthrough' | 'demo30' | 'story30' | 'walk';

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
  /**
   * One raw clip from scripts/clips.mjs (assets/real/captures/<clip>.mp4), played at `rate`. `at` ≥ 0: start that many
   * seconds in. `at` < 0: end-anchored for clips that repeat the confirm flow first: the beat ends |at| s before the
   * clip does, starting no earlier than `floor` s, and its last `hold` s are the clip's final frame. Held on its last
   * frame whenever the beat outlasts the clip.
   */
  | { kind: 'clip'; clip: string; at: number; floor?: number; hold?: number; rate?: number }
  /** The shared end card + the live stats line and the data credit (numbers from /api/export at prep). */
  | { kind: 'endStats' }
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
  /**
   * Silent-first: no voice-over. Captions carry the narration, each beat lasts exactly its targetSec, and missing VO is
   * not a placeholder reason. Music (if any) sits low and dips 6 dB under each caption.
   */
  silent?: boolean;
  /** Shrink the picture into the top of the frame and set captions in the band below, so they never cover data. */
  captionBand?: boolean;
  beats: Beat[];
}

export interface TeamMember {
  name: string;
  role: string;
}
