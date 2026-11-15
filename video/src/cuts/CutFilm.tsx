import { type ReactNode, useMemo } from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { SpaceBackdrop } from '../components/SpaceBackdrop';
import { C, easeOut, MONO, monoLabel, SANS } from '../theme';
import { CUTS } from './cuts.data.ts';
import { captionChunks, layoutCut, LEAD_SEC, type Manifest, placeholderReasons } from './timing.ts';
import type { CutId } from './types';
import { VisualFor } from './visuals';

export type CutProps = { cutId: CutId; manifest: Manifest };

const FADE = 8; // frames: a beat that isn't a straight cut inside the product flow fades up from the backdrop
const dB = (db: number) => 10 ** (db / 20);
const MUSIC_BED_DB = -8; // no voice
const MUSIC_DUCK_DB = -18; // under voice (VO and music are both normalised to −16 LUFS)
const ATTACK = 0.15; // s: the dip starts just before the voice
const RELEASE = 0.45;
const LOOP_XFADE = 2; // s

export function cutLayout(cutId: CutId, manifest: Manifest, fps: number) {
  const cut = CUTS.find((c) => c.id === cutId)!;
  const layout = layoutCut(cut, manifest, fps);
  const fr = (s: number) => Math.round(s * fps);
  const beats = layout.beats.map((b) => ({ ...b, from: fr(b.fromSec), frames: fr(b.sec), voFrom: fr(b.fromSec + LEAD_SEC), voFrames: fr(b.voSec) }));
  return { cut, beats, total: fr(layout.totalSec), reasons: placeholderReasons(cut, manifest) };
}

export function CutFilm({ cutId, manifest }: CutProps) {
  const { fps } = useVideoConfig();
  const { cut, beats, total, reasons } = useMemo(() => cutLayout(cutId, manifest, fps), [cutId, manifest, fps]);
  const env = useMemo(() => ({ travel: Array.from({ length: total }, (_, f) => f), light: Array.from({ length: total }, () => 1) }), [total]);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <SpaceBackdrop travel={env.travel} light={env.light} />
      {beats.map((b, i) => {
        const straightCut = b.beat.visual.kind === 'ui' && beats[i - 1]?.beat.visual.kind === 'ui';
        return (
          <Sequence key={b.beat.id} from={b.from} durationInFrames={b.frames} name={b.beat.id}>
            <FadeIn frames={straightCut ? 0 : FADE}><VisualFor v={b.beat.visual} manifest={manifest} /></FadeIn>
            {b.recorded && (
              <Sequence from={b.voFrom - b.from} name={`vo ${b.beat.id}`}>
                <Audio src={staticFile(manifest.vo[b.beat.id]!.file)} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {cut.music && manifest.music[cut.music] && <Music file={manifest.music[cut.music]!.file} trackSec={manifest.music[cut.music]!.sec} total={total} voice={beats.map((b) => [b.voFrom, b.voFrom + b.voFrames] as const)} endFrom={beats.at(-1)!.from} />}
      <Chapter beats={beats} />
      <Captions beats={beats} />
      {reasons.length > 0 && <Watermark />}
    </AbsoluteFill>
  );
}

function FadeIn({ frames, children }: { frames: number; children: ReactNode }) {
  const f = useCurrentFrame();
  const o = frames ? interpolate(f, [0, frames], [0, 1], { extrapolateRight: 'clamp', easing: easeOut }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
}

type Laid = ReturnType<typeof cutLayout>['beats'];

/**
 * Music bed: −8 dB alone, dipping to −18 dB under every voice line (sidechain-style: ramps down ATTACK before the
 * line, back up over RELEASE after it), 0.5 s fade-in, fading to silence across the end card. Loops with a crossfade
 * when the track is shorter than the cut.
 */
function Music({ file, trackSec, total, voice, endFrom }: { file: string; trackSec: number; total: number; voice: (readonly [number, number])[]; endFrom: number }) {
  const { fps } = useVideoConfig();
  const a = ATTACK * fps;
  const r = RELEASE * fps;
  const duck = (f: number) => {
    let d = 0;
    for (const [s, e] of voice) {
      if (f >= s && f <= e) return 1;
      if (f < s && f > s - a) d = Math.max(d, 1 - (s - f) / a);
      if (f > e && f < e + r) d = Math.max(d, 1 - (f - e) / r);
    }
    return d;
  };
  const level = (f: number) => {
    const db = MUSIC_BED_DB + (MUSIC_DUCK_DB - MUSIC_BED_DB) * duck(f);
    const fadeIn = Math.min(1, f / (0.5 * fps));
    const fadeOut = f < endFrom ? 1 : Math.max(0, 1 - (f - endFrom) / Math.max(1, total - endFrom));
    return dB(db) * fadeIn * fadeOut * fadeOut;
  };
  const track = Math.floor(trackSec * fps);
  const x = LOOP_XFADE * fps;
  const step = track - x;
  const starts = [];
  for (let s = 0; s < total; s += step) starts.push(s);
  return (
    <>
      {starts.map((start, i) => (
        <Sequence key={start} from={start} durationInFrames={Math.min(track, total - start)} name={`music ${i + 1}`}>
          <Audio
            src={staticFile(file)}
            volume={(f) => {
              const inFade = i > 0 ? Math.min(1, f / x) : 1;
              const outFade = i < starts.length - 1 ? Math.min(1, (track - f) / x) : 1;
              return level(start + f) * inFade * outFade;
            }}
          />
        </Sequence>
      ))}
    </>
  );
}

function Chapter({ beats }: { beats: Laid }) {
  const f = useCurrentFrame();
  const b = beats.find((x) => f >= x.from && f < x.from + x.frames);
  if (!b?.beat.chapter) return null;
  return (
    <div style={{ position: 'absolute', top: 40, left: 48, ...monoLabel, fontSize: 32, color: C.amber, background: `${C.bg}cc`, padding: '10px 20px', borderRadius: 10 }}>
      {b.beat.chapter}
    </div>
  );
}

/** Burned-in English captions from the script lines, timed across each VO clip. 88px at 2560 wide ≈ 13px on a phone. */
function Captions({ beats }: { beats: Laid }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = beats.find((x) => f >= x.voFrom && f < x.voFrom + x.voFrames + fps * 0.2);
  if (!b) return null;
  const t = (f - b.voFrom) / fps;
  const chunks = captionChunks(b.beat.vo, b.voSec);
  const c = chunks.find((x) => t >= x.fromSec && t < x.toSec) ?? chunks.at(-1)!;
  const parts = c.text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80 }}>
      <div style={{ maxWidth: 2200, background: `${C.bg}e0`, borderRadius: 22, padding: '20px 52px', textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 88, lineHeight: 1.18, color: C.text }}>
        {parts.map((p, i) => {
          const em = p.startsWith('*');
          const text = em ? p.slice(1, -1) : p;
          const todo = /\[Name [^\]]+\]/.test(text);
          return <span key={i} style={{ color: em || todo ? C.amber : C.text }}>{text}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
}

function Watermark() {
  const text = 'PREVIEW — PLACEHOLDER';
  const badge = { position: 'absolute', fontFamily: MONO, fontWeight: 500, fontSize: 36, letterSpacing: '0.08em', color: C.bg, background: C.amber, padding: '12px 22px', borderRadius: 10 } as const;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: 'rotate(-18deg)', fontFamily: MONO, fontSize: 130, fontWeight: 500, color: C.amber, opacity: 0.12, whiteSpace: 'nowrap' }}>{text}</div>
      </AbsoluteFill>
      <div style={{ ...badge, top: 32, left: '50%', transform: 'translateX(-50%)' }}>{text}</div>
    </AbsoluteFill>
  );
}
