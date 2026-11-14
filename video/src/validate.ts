/**
 * Pure checks shared by `npm run check:no-dummy` (Node, type stripping) and the render itself (calculateMetadata).
 * Keep this file free of imports other than `import type` so Node can run it directly.
 */
import type { SceneSlot, VideoData } from './types';

export const TODO_MARK = '__TODO__';
/** A field the real version still needs. Any TODO left in the data fails the render. */
export const TODO = (what: string): string => `${TODO_MARK} ${what}`;

export type Cut = 'film' | 'trailer';

export function clipsFor(data: VideoData, cut: Cut) {
  return cut === 'film' ? data.product.clips : data.product.trailerClips;
}

export function slotSec(data: VideoData, slot: SceneSlot, cut: Cut): number {
  return slot.scene === 'product' ? clipsFor(data, cut).reduce((s, c) => s + c.durationSec, 0) : slot.durationSec;
}

export function totalSec(data: VideoData, cut: Cut): number {
  const slots = data.timeline[cut];
  return slots.reduce((s, slot) => s + slotSec(data, slot, cut), 0) + Math.max(0, slots.length - 1) * data.transitionSec;
}

/** Seconds of real product UI on screen: the product recordings plus the guided-mission recording. */
export function productUiSec(data: VideoData, cut: Cut): number {
  return data.timeline[cut]
    .filter((s) => s.scene === 'product' || s.scene === 'mission')
    .reduce((sum, slot) => sum + slotSec(data, slot, cut), 0);
}

export function mediaPaths(data: VideoData): string[] {
  return [
    data.art.papers,
    data.art.patch,
    data.art.flameSphere,
    ...(data.coldOpen.exteriorFootage ? [data.coldOpen.exteriorFootage.src] : []),
    ...data.product.clips.map((c) => c.src),
    ...data.product.trailerClips.map((c) => c.src),
    ...data.evidence.cards.flatMap((c) => (c.still ? [c.still] : [])),
    data.mission.clip.src,
  ];
}

function strings(v: unknown, path: string, out: [string, string][]) {
  if (typeof v === 'string') out.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, path ? `${path}.${k}` : k, out);
}

/** Every problem with this data. `real` = a render meant for people outside the team. */
export function problems(data: VideoData, real: boolean): string[] {
  const p: string[] = [];
  const all: [string, string][] = [];
  strings(data, '', all);

  if (real && data.isDummy) p.push('isDummy is true: this is placeholder data.');
  for (const [path, s] of all) {
    if (s.includes(TODO_MARK)) p.push(`${path}: still TODO (${s.slice(TODO_MARK.length).trim()})`);
    if (real && /(^|\/)placeholder\//.test(s)) p.push(`${path}: references a placeholder asset (${s})`);
  }

  for (const cut of ['film', 'trailer'] as const) {
    const total = totalSec(data, cut);
    const ui = productUiSec(data, cut);
    if (ui / total < 0.5) p.push(`${cut}: product UI is ${Math.round((ui / total) * 100)}% of ${total}s (needs ≥50%).`);
    if (!data.timeline[cut].some((s) => s.scene === 'end')) p.push(`${cut}: no end card.`);
    for (const c of data.captions[cut]) {
      if (!(c.fromSec < c.toSec) || c.fromSec < 0 || c.toSec > total) p.push(`${cut} caption "${c.en}" is outside 0–${total}s or empty.`);
    }
  }
  if (clipsFor(data, 'film').length === 0) p.push('product.clips is empty.');

  const { columns, rows, tested, gap, scenario } = data.limit.map;
  const inGrid = ([c, r]: [number, number]) => c >= 0 && r >= 0 && c < columns && r < rows;
  for (const cell of [...tested.map((t) => t.cell), ...gap, scenario]) if (!inGrid(cell)) p.push(`limit.map cell ${cell} is outside ${columns}×${rows}.`);
  if (real && (tested.length === 0 || gap.length === 0)) p.push('limit.map: tested and gap cells are empty.');
  return p;
}
