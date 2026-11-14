import { type CSSProperties, type ReactNode, useMemo } from 'react';
import { AbsoluteFill, Freeze, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { videoData as data } from '@data';
import { SpaceBackdrop } from './components/SpaceBackdrop';
import { ColdOpen } from './scenes/ColdOpen';
import { End } from './scenes/End';
import { Evidence } from './scenes/Evidence';
import { Limit } from './scenes/Limit';
import { Mission } from './scenes/Mission';
import { Problem } from './scenes/Problem';
import { Product } from './scenes/Product';
import { C, easeInOut, MONO, SANS } from './theme';
import { type Impl, JOURNEY, MOOD } from './transitions/journey';
import { resolve } from './transitions/registry';
import type { TransitionDef } from './transitions/types';
import type { SceneId, SceneSlot } from './types';
import { clipsFor, type Cut, slotSec } from './validate';

export { data };

type SceneBlock = { kind: 'scene'; slot: SceneSlot; from: number; frames: number };
type TransitionBlock = { kind: 'transition'; into: Exclude<SceneId, 'coldOpen'>; from: number; frames: number; seed: number; pre: number; post: number };
type Block = SceneBlock | TransitionBlock;

/**
 * Frame layout of a cut: scene, transition gap, scene, ... One place computes it for metadata and rendering.
 * Gaps are the data file's `transitionSec`, so the timeline (and every caption time) is unchanged by transitions;
 * each transition's handles (journey.ts) overlap the neighbouring scenes instead of adding time.
 */
export function layout(cut: Cut): { blocks: Block[]; total: number } {
  const fr = (s: number) => Math.round(s * data.fps);
  const blocks: Block[] = [];
  let t = 0;
  let prev: SceneBlock | null = null;
  data.timeline[cut].forEach((slot, i) => {
    const frames = fr(slotSec(data, slot, cut));
    if (i > 0 && slot.scene !== 'coldOpen') {
      const leg = JOURNEY[slot.scene];
      const pre = Math.min(fr(leg.preSec), prev ? prev.frames : 0);
      const post = Math.min(fr(leg.postSec), frames);
      blocks.push({ kind: 'transition', into: slot.scene, from: t, frames: fr(data.transitionSec), seed: i, pre, post });
      t += fr(data.transitionSec);
    }
    const block: SceneBlock = { kind: 'scene', slot, from: t, frames };
    blocks.push(block);
    prev = block;
    t += frames;
  });
  return { blocks, total: t };
}

/** Per-frame backdrop drift and brightness from the scene moods, eased across each transition. */
function backdropEnvelope(blocks: Block[], total: number) {
  const mood = (id: SceneId) => ({ speed: 1, light: 1, ...MOOD[id] });
  const speed: number[] = new Array(total).fill(1);
  const light: number[] = new Array(total).fill(1);
  blocks.forEach((b, i) => {
    for (let f = b.from; f < b.from + b.frames && f < total; f++) {
      if (b.kind === 'scene') {
        const m = mood(b.slot.scene);
        speed[f] = m.speed;
        light[f] = m.light;
      } else {
        const a = mood((blocks[i - 1] as SceneBlock).slot.scene);
        const z = mood(b.into);
        const k = easeInOut((f - b.from) / b.frames);
        speed[f] = a.speed + (z.speed - a.speed) * k;
        light[f] = a.light + (z.light - a.light) * k;
      }
    }
  });
  const travel = [0];
  for (let f = 1; f < total; f++) travel.push(travel[f - 1]! + speed[f]!);
  return { travel, light };
}

function scene(id: SceneId, cut: Cut): ReactNode {
  switch (id) {
    case 'coldOpen': return <ColdOpen d={data.coldOpen} art={data.art} />;
    case 'problem': return <Problem d={data.problem} papers={data.art.papers} />;
    case 'product': return <Product clips={clipsFor(data, cut)} />;
    case 'evidence': return <Evidence d={data.evidence} labels={data.labels} />;
    case 'limit': return <Limit d={data.limit} />;
    case 'mission': return <Mission d={data.mission} />;
    case 'end': return <End d={data.end} patch={data.art.patch} />;
  }
}

/**
 * A scene's entry and exit belong to the transitions around it (their `in` / `out` styles over the handle frames).
 * The gap scene is still by rule: any transform is dropped, only opacity passes through.
 */
function SceneFrame({ children, still, enter, exit }: { children: ReactNode; still: boolean; enter?: { def: TransitionDef; frames: number }; exit?: { def: TransitionDef; frames: number } }) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  let style: CSSProperties = {};
  if (enter?.def.in && f < enter.frames) style = { ...style, ...enter.def.in(Math.min(1, f / Math.max(1, enter.frames))) };
  if (exit?.def.out && f >= durationInFrames - exit.frames) style = { ...style, ...exit.def.out(Math.min(1, (f - (durationInFrames - exit.frames)) / Math.max(1, exit.frames))) };
  if (still) style = { opacity: style.opacity };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
}

function Captions({ cut }: { cut: Cut }) {
  const f = useCurrentFrame();
  const t = f / data.fps;
  const c = data.captions[cut].find((x) => t >= x.fromSec && t < x.toSec);
  if (!c) return null;
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 104 }}>
      <div style={{ maxWidth: 1500, background: `${C.bg}d9`, borderRadius: 12, padding: '14px 28px', textAlign: 'center' }}>
        <div style={{ fontFamily: SANS, fontSize: 40, lineHeight: 1.3, color: C.text }}>{c.en}</div>
        {c.my && <div style={{ fontFamily: `${SANS.split(',')[0]}, 'Myanmar Text', 'Noto Sans Myanmar', 'Padauk', sans-serif`, fontSize: 34, lineHeight: 1.5, color: C.dim, marginTop: 6 }}>{c.my}</div>}
      </div>
    </AbsoluteFill>
  );
}

/** Burned into every dummy frame: two opposite corners plus a diagonal band, so no crop removes it. */
function Watermark() {
  const text = 'PREVIEW — PLACEHOLDER DATA';
  const badge = { position: 'absolute', fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.08em', color: C.bg, background: C.amber, padding: '10px 18px', borderRadius: 8 } as const;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: 'rotate(-18deg)', fontFamily: MONO, fontSize: 92, fontWeight: 500, color: C.amber, opacity: 0.16, whiteSpace: 'nowrap' }}>{text}</div>
      </AbsoluteFill>
      <div style={{ ...badge, top: 24, right: 24 }}>{text}</div>
      <div style={{ ...badge, bottom: 24, left: 24 }}>{text}</div>
    </AbsoluteFill>
  );
}

export function Film({ cut, impl, window }: { cut: Cut; impl?: Impl | 'none'; window?: { from: number; frames: number } }) {
  const { blocks, total } = layout(cut);
  const env = useMemo(() => backdropEnvelope(blocks, total), [cut]); // eslint-disable-line react-hooks/exhaustive-deps
  // impl 'none' = a plain cut with no overlay: the baseline the transition benchmark subtracts.
  const def = (b: TransitionBlock): TransitionDef => (impl === 'none' ? { Overlay: () => null } : resolve(JOURNEY[b.into], impl));
  const body = (
    <>
      <SpaceBackdrop travel={env.travel} light={env.light} />
      {blocks.map((b, i) => {
        if (b.kind !== 'scene') return null;
        const before = blocks[i - 1] as TransitionBlock | undefined;
        const after = blocks[i + 1] as TransitionBlock | undefined;
        return (
          <Sequence key={i} from={b.from} durationInFrames={b.frames}>
            <SceneFrame still={b.slot.scene === 'limit'} enter={before && { def: def(before), frames: before.post }} exit={after && { def: def(after), frames: after.pre }}>
              {scene(b.slot.scene, cut)}
            </SceneFrame>
          </Sequence>
        );
      })}
      {blocks.map((b, i) => {
        if (b.kind !== 'transition') return null;
        const { Overlay } = def(b);
        return (
          <Sequence key={`t${i}`} from={b.from - b.pre} durationInFrames={b.pre + b.frames + b.post}>
            <Overlay pre={b.pre} gap={b.frames} post={b.post} seed={b.seed} renderNext={() => <Freeze frame={0}>{scene(b.into, cut)}</Freeze>} />
          </Sequence>
        );
      })}
      <Captions cut={cut} />
    </>
  );
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {window ? <Sequence from={-window.from}>{body}</Sequence> : body}
      {data.isDummy && <Watermark />}
    </AbsoluteFill>
  );
}

/** Where each transition sits in a cut (for the isolated preview / benchmark compositions). */
export function transitionWindows(cut: Cut) {
  return layout(cut).blocks.flatMap((b) => (b.kind === 'transition' ? [{ into: b.into, from: b.from - b.pre, frames: b.pre + b.frames + b.post }] : []));
}
