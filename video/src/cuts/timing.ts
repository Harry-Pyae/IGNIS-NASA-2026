/**
 * The voice-fit edit, as pure functions shared by the prep report (Node) and the compositions (Remotion).
 * Each beat lasts as long as its recorded VO plus a short lead and tail, clamped to [minSec, maxSec] so visuals never
 * flash or drag. A voice is never sped up, trimmed short or pitch-shifted: if a line runs past maxSec the beat grows
 * and the line is reported. Before a line is recorded, its length is planned from its word count (PLAN_WPS).
 * Only type imports plus .ts paths, so Node can run this file directly.
 */
import { PLAN_WPS, TEAM } from './cuts.data.ts';
import { SHOTS } from './shots.ts';
import type { Beat, CutDef } from './types';

export interface Manifest {
  generatedAt: string;
  /** Beat id → processed VO (public/vo/…, trimmed + loudness-normalised) and its real length. */
  vo: Record<string, { file: string; sec: number }>;
  /** assets/music file name → processed copy in public/music and its length. */
  music: Record<string, { file: string; sec: number; cleared: boolean; ledger: string }>;
  /** The one continuous capture take and the second each shot starts at. */
  capture: { file: string; sec: number; width: number; height: number; marks: Partial<Record<string, number>> } | null;
  /** Read from /api/export when the manifest was built. */
  catalog: { cards: number; campaigns: number; sources: number; o2?: [number, number] | null; kpa?: [number, number] | null; revision: string; fetchedAt: string } | null;
  /** QR modules for the live URL, one string of 0/1 per row. */
  qr: string[] | null;
}

export const LEAD_SEC = 0.15;
export const TAIL_SEC = 0.35;
const TODO_MARK = '__TODO__';

/** Spoken words in a line: emphasis markers stripped, a [placeholder] counts as two words (a first and last name). */
export function wordCount(text: string): number {
  return text
    .replace(/\[[^\]]*\]/g, 'x x')
    .replace(/[*“”"—–]/g, ' ')
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export const planSec = (beat: Beat) => wordCount(beat.vo) / PLAN_WPS;

export interface BeatTiming {
  beat: Beat;
  voSec: number;
  recorded: boolean;
  /** Lead + VO + tail: what the line needs. */
  needSec: number;
  sec: number;
  /** The line needs more than maxSec (it still gets it: voices are never cut). */
  overMax: boolean;
}

export interface CutLayout {
  cut: CutDef;
  beats: (BeatTiming & { fromSec: number })[];
  totalSec: number;
  /** For a capped cut: lines that pushed it past the cap, worst first. */
  overBudget: { id: string; overSec: number; vo: string; shorter?: string }[];
  /** Length outside the cut's window after every clamp. */
  lengthProblem: string | null;
}

/** Frame-exact layout of one cut for a manifest (missing VO = planned from words). */
export function layoutCut(cut: CutDef, manifest: Manifest, fps = 30): CutLayout {
  const snap = (s: number) => Math.round(s * fps) / fps;
  const timings: BeatTiming[] = cut.beats.map((beat) => {
    const vo = manifest.vo[beat.id];
    const voSec = vo ? vo.sec : planSec(beat);
    const needSec = LEAD_SEC + voSec + TAIL_SEC;
    const sec = snap(Math.min(Math.max(needSec, beat.minSec), Math.max(beat.maxSec, needSec)));
    return { beat, voSec, recorded: !!vo, needSec, sec, overMax: needSec > beat.maxSec };
  });
  const sum = () => timings.reduce((s, t) => s + t.sec, 0);
  const { min, max } = cut.lengthSec;
  const last = timings[timings.length - 1]!;

  // Short of the window: hold every beat longer, in proportion, up to its maxSec. A ≤30 s cut fills to the cap
  // through its end card instead, so the URL stays up for the remaining time.
  if (max <= 30) {
    // One frame under the cap: the AAC audio track ends ~16 ms after the last video frame, and the container length
    // (what a submission form reads) must stay ≤ 30.0 s.
    const spare = snap(max - 1 / fps - sum());
    if (spare > 0) last.sec = snap(last.sec + Math.min(spare, Math.max(0, last.beat.maxSec - last.sec)));
  } else if (sum() < min) {
    for (let pass = 0; pass < 4 && sum() < min; pass++) {
      const room = timings.map((t) => Math.max(0, t.beat.maxSec - t.sec));
      const totalRoom = room.reduce((a, b) => a + b, 0);
      if (totalRoom <= 0) break;
      const need = min - sum();
      timings.forEach((t, i) => (t.sec = snap(t.sec + Math.min(room[i]!, (room[i]! / totalRoom) * need))));
    }
  }

  let from = 0;
  const beats = timings.map((t) => {
    const b = { ...t, fromSec: from };
    from += t.sec;
    return b;
  });
  const totalSec = snap(from);
  const overBudget =
    totalSec > max + 1e-6
      ? timings
          .map((t) => ({ id: t.beat.id, overSec: t.needSec - t.beat.targetSec, vo: t.beat.vo, shorter: t.beat.shorter }))
          .filter((o) => o.overSec > 0.05)
          .sort((a, b) => b.overSec - a.overSec)
      : [];
  const lengthProblem =
    totalSec > max + 1e-6 ? `${totalSec.toFixed(2)}s is over the ${max.toFixed(1)}s cap by ${(totalSec - max).toFixed(2)}s`
      : totalSec < min - 1e-6 ? `${totalSec.toFixed(1)}s is under the ${min}s minimum`
        : null;
  return { cut, beats, totalSec, overBudget, lengthProblem };
}

/** Team placeholders in a line ([Name A] … [Name R3]) → the names in TEAM once filled in. */
export function withNames(text: string): string {
  const keys = ['A', 'B', 'C', 'R1', 'R2', 'R3'];
  return text.replace(/\[Name (A|B|C|R1|R2|R3)\]/g, (m, k: string) => {
    const name = TEAM[keys.indexOf(k)]?.name ?? '';
    return name && !name.startsWith(TODO_MARK) ? name : m;
  });
}

/**
 * Caption chunks for one line: sentence breaks first, then whole words up to `maxChars`, each chunk timed by its
 * share of the line's characters across the VO span. Short chunks stay readable on a phone at 96px.
 */
export function captionChunks(text: string, voSec: number, maxChars = 40): { text: string; fromSec: number; toSec: number }[] {
  const clauses = withNames(text).split(/(?<=[.?!:;—])\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (const clause of clauses) {
    let line = '';
    for (const word of clause.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (next.replace(/\*/g, '').length > maxChars && line) {
        chunks.push(line);
        line = word;
      } else line = next;
    }
    if (line) chunks.push(line);
  }
  // Merge a dangling one- or two-word chunk into its neighbour when it still fits.
  for (let i = chunks.length - 1; i > 0; i--) {
    const merged = `${chunks[i - 1]} ${chunks[i]}`;
    if (chunks[i]!.split(' ').length <= 2 && merged.replace(/\*/g, '').length <= maxChars) chunks.splice(i - 1, 2, merged);
  }
  const weight = (s: string) => s.replace(/\*/g, '').length + 6;
  const total = chunks.reduce((s, c) => s + weight(c), 0);
  let t = 0;
  return chunks.map((c) => {
    const d = (weight(c) / total) * voSec;
    const chunk = { text: c, fromSec: t, toSec: t + d };
    t += d;
    return chunk;
  });
}

/** Why a cut is still a placeholder (watermarked). Empty = ready for a final render. */
export function placeholderReasons(cut: CutDef, manifest: Manifest): string[] {
  const r: string[] = [];
  const missingVo = cut.beats.filter((b) => !manifest.vo[b.id]).map((b) => b.id);
  if (missingVo.length) r.push(`VO not recorded: ${missingVo.join(', ')}`);
  const shots = [...new Set(cut.beats.flatMap((b) => (b.visual.kind === 'ui' ? b.visual.shots : [])))];
  const missingShots = shots.filter((s) => manifest.capture?.marks[s] == null);
  if (!manifest.capture) r.push('no capture take (scripts/capture.mjs)');
  else if (missingShots.length) r.push(`capture is missing shots: ${missingShots.join(', ')}`);
  for (const b of cut.beats) if (b.signOff) r.push(`${b.id}: ${b.signOff}`);
  const strings = JSON.stringify(cut) + (cut.beats.some((b) => b.visual.kind === 'team' || /\[Name /.test(b.vo)) ? JSON.stringify(TEAM) : '');
  const todos = strings.match(new RegExp(`${TODO_MARK} ([^"]*)`, 'g')) ?? [];
  for (const todo of new Set(todos)) r.push(`TODO: ${todo.slice(TODO_MARK.length + 1)}`);
  if (cut.music) {
    const m = manifest.music[cut.music];
    if (!m) r.push(`music file missing: assets/music/${cut.music}`);
    else if (!m.cleared) r.push(`music not cleared in docs/media-ledger.md: ${cut.music}`);
  }
  if (!manifest.catalog) r.push('catalog numbers not fetched (/api/export)');
  else for (const b of cut.beats) for (const problem of liveMismatch(b, manifest.catalog)) r.push(`${b.id} [LIVE]: ${problem} — re-record the line`);
  return r;
}

/** Spoken catalog numbers that no longer match the live catalog (empty = the line is still true). */
export function liveMismatch(beat: Beat, catalog: NonNullable<Manifest['catalog']>): string[] {
  const out: string[] = [];
  const live = beat.live;
  if (!live) return out;
  if (live.cards != null && live.cards !== catalog.cards) out.push(`says ${live.cards} verified runs, catalog has ${catalog.cards}`);
  if (live.campaigns != null && live.campaigns !== catalog.campaigns) out.push(`says ${live.campaigns} campaigns, catalog has ${catalog.campaigns}`);
  const same = (a: [number, number], b: [number, number] | null | undefined) => !!b && a[0] === b[0] && a[1] === b[1];
  if (live.o2 && !same(live.o2, catalog.o2)) out.push(`says O₂ ${live.o2.join('–')} %, catalog spans ${catalog.o2?.join('–') ?? 'nothing'}`);
  if (live.kpa && !same(live.kpa, catalog.kpa)) out.push(`says ${live.kpa.join('–')} kPa, catalog spans ${catalog.kpa?.join('–') ?? 'nothing'}`);
  return out;
}

/** Every shot in capture order with the cuts that use it (for the shot list). */
export const shotUse = () => SHOTS.map((s) => ({ ...s }));
