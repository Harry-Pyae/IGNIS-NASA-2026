import { AbsoluteFill, Freeze, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { SpaceBackdrop } from '../components/SpaceBackdrop';
import { C, easeOut, MONO, SANS } from '../theme';
import { EndCard } from '../cuts/visuals';

/** Written by scripts/silent.mjs from the raw clips + the live export. */
export interface SilentPlan {
  /** `hold`: the clip's last `hold` s are its final frame, frozen (06's NASA page appears only in the clip's last frames). */
  segments: { file: string; fromSec: number; sec: number; caption: string; hold?: number }[];
  stats: { cards: number; campaigns: number; o2: [number, number]; kpa: [number, number]; revision: string };
  openSec: number;
  endSec: number;
}
export const EMPTY_PLAN: SilentPlan = { segments: [], stats: { cards: 0, campaigns: 0, o2: [0, 0], kpa: [0, 0], revision: '' }, openSec: 1, endSec: 6 };
const FADE = 8;
const Clip = ({ s }: { s: SilentPlan['segments'][number] }) => <OffthreadVideo src={staticFile(s.file)} trimBefore={Math.round(s.fromSec * 30)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;

/** The end card is fully risen by this frame; the opening holds exactly this frame, so first frame = last frame. */
const SETTLED = 75;

/**
 * The silent walkthrough for the live presentation: product clips in order, one short burned caption per scene (the
 * approved script text, no spoken numbers), the live stats line on the end card. No audio track. Loops cleanly: the
 * film opens on the settled end card and closes on it.
 */
export function SilentWalkthrough({ plan }: { plan: SilentPlan }) {
  const { fps, durationInFrames } = useVideoConfig();
  const fr = (s: number) => Math.round(s * fps);
  const open = fr(plan.openSec);
  let at = open;
  const placed = plan.segments.map((s) => { const from = at; at += fr(s.sec); return { ...s, from, frames: fr(s.sec) }; });
  const endFrom = at;
  const still = Array.from({ length: durationInFrames }, () => 0);
  const light = Array.from({ length: durationInFrames }, () => 1);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <SpaceBackdrop travel={still} light={light} />
      <Sequence durationInFrames={open} name="open (= last frame)"><Freeze frame={SETTLED}><Ending stats={plan.stats} /></Freeze></Sequence>
      {placed.map((s) => (
        <Sequence key={s.file + s.from} from={s.from} durationInFrames={s.frames} name={s.file}>
          <Fade frames={s.frames}>
            {s.hold ? (
              <>
                <Sequence durationInFrames={s.frames - fr(s.hold)}><Clip s={s} /></Sequence>
                <Sequence from={s.frames - fr(s.hold)}><Freeze frame={s.frames - fr(s.hold) - 1}><Clip s={s} /></Freeze></Sequence>
              </>
            ) : <Clip s={s} />}
          </Fade>
          <Caption text={s.caption} frames={s.frames} />
        </Sequence>
      ))}
      <Sequence from={endFrom} name="end card"><Ending stats={plan.stats} /></Sequence>
    </AbsoluteFill>
  );
}

function Fade({ frames, children }: { frames: number; children: React.ReactNode }) {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, FADE, frames - FADE, frames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
}

/** One line per scene, 76px on a dark bar: readable from the back of a room, never over the UI's own text block. */
function Caption({ text, frames }: { text: string; frames: number }) {
  const f = useCurrentFrame();
  const o = interpolate(f, [10, 18, frames - 14, frames - 6], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 70, opacity: o }}>
      <div style={{ maxWidth: 2240, background: `${C.bg}e6`, borderRadius: 20, padding: '18px 48px', textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 76, lineHeight: 1.2, color: C.text }}>{text}</div>
    </AbsoluteFill>
  );
}

/** The shared end card + the live catalog line (numbers on screen only, from /api/export at build time). */
function Ending({ stats }: { stats: SilentPlan['stats'] }) {
  return (
    <AbsoluteFill>
      <EndCard />
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120 }}>
        <div style={{ fontFamily: MONO, fontSize: 46, color: C.amber, letterSpacing: '0.04em' }}>
          {stats.cards} verified runs · {stats.campaigns} NASA campaigns · {stats.o2[0]}–{stats.o2[1]}% O₂ · {Math.round(stats.kpa[0])}–{Math.round(stats.kpa[1])} kPa
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
