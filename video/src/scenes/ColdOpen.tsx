import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FlameSphere, MonoLabel, Rise } from '../components/common';
import { C, easeOut, MONO, SANS } from '../theme';
import type { VideoData } from '../types';

/** A generic orbital station drawn from rectangles: original artwork, no agency marks. */
function Station() {
  const array = (x: number, y: number) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="150" height="64" fill="#1b2a4a" stroke={C.raised} strokeWidth="2" />
      {[30, 60, 90, 120].map((v) => (
        <line key={v} x1={v} y1="0" x2={v} y2="64" stroke={C.border} strokeWidth="2" />
      ))}
      <line x1="0" y1="32" x2="150" y2="32" stroke={C.border} strokeWidth="2" />
    </g>
  );
  return (
    <svg width="1100" height="420" viewBox="0 0 1100 420">
      <rect x="40" y="200" width="1020" height="16" fill="#2a3346" />
      {[60, 230, 720, 890].map((x) => (
        <g key={x}>
          {array(x, 110)}
          {array(x, 242)}
          <rect x={x + 72} y="174" width="6" height="68" fill="#2a3346" />
        </g>
      ))}
      <rect x="430" y="168" width="240" height="80" rx="40" fill="#cfd5e2" />
      <rect x="470" y="150" width="70" height="116" rx="30" fill="#b8c0cf" />
      <rect x="600" y="186" width="160" height="44" rx="22" fill="#aab3c4" />
      <rect x="520" y="248" width="44" height="90" fill="#d9dee8" opacity=".85" />
      <circle cx="660" cy="208" r="5" fill={C.amber} />
    </svg>
  );
}

export function ColdOpen({ d, art }: { d: VideoData['coldOpen']; art: VideoData['art'] }) {
  const f = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const split = Math.round(durationInFrames * 0.45);
  const exterior = interpolate(f, [0, 20, split - 10, split + 6], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glide = interpolate(f, [0, split + 6], [260, -120], { easing: easeOut, extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      {f < split + 8 && (
        <AbsoluteFill style={{ opacity: exterior, justifyContent: 'center', alignItems: 'center' }}>
          {d.exteriorFootage ? (
            <>
              <OffthreadVideo muted src={staticFile(d.exteriorFootage.src)} trimBefore={Math.round(d.exteriorFootage.trimStartSec * fps)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', left: 80, bottom: 150 }}>
                <MonoLabel size={18}>{d.exteriorFootage.credit}</MonoLabel>
              </div>
            </>
          ) : (
            <>
              <div style={{ transform: `translateX(${glide}px) rotate(-4deg)` }}>
                <Station />
              </div>
              <div style={{ position: 'absolute', left: 80, bottom: 150 }}>
                <MonoLabel size={18}>{d.stationIllustrationCaption}</MonoLabel>
              </div>
            </>
          )}
        </AbsoluteFill>
      )}
      {f >= split && (
        <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 140px 80px' }}>
          <div style={{ maxWidth: 1100 }}>
            <Rise at={split}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 168, letterSpacing: '0.04em', color: C.text, lineHeight: 1 }}>{d.title}</div>
            </Rise>
            <Rise at={split + 8}>
              <div style={{ fontFamily: MONO, fontSize: 36, color: C.amber, marginTop: 28, lineHeight: 1.35 }}>{d.tagline}</div>
            </Rise>
          </div>
          <Rise at={split + 4}>
            <FlameSphere src={art.flameSphere} caption={art.illustrationCaption} size={360} />
          </Rise>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
