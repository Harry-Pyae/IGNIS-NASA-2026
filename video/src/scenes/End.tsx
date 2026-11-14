import { AbsoluteFill, Img, staticFile } from 'remotion';
import { MonoLabel, Rise } from '../components/common';
import { C, MONO, SANS } from '../theme';
import type { VideoData } from '../types';

/** Ribbon text is set here, never baked into the patch master. Paths follow the ribbons in 1024-unit patch space. */
function RibbonText({ id, d, text }: { id: string; d: string; text: string }) {
  const size = Math.min(64, 560 / Math.max(1, text.length * 0.62));
  return (
    <>
      <path id={id} d={d} fill="none" />
      <text fontFamily={SANS} fontWeight={700} fontSize={size} fill="#16213d" letterSpacing="0.06em" dominantBaseline="middle">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </>
  );
}

export function End({ d, patch }: { d: VideoData['end']; patch: string }) {
  const P = 600;
  const creditSize = Math.max(16, Math.min(24, 200 / Math.max(1, d.credits.length)));
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', padding: '0 110px 140px', gap: 90 }}>
      <Rise style={{ position: 'relative', width: P, height: P, flex: 'none' }}>
        <Img src={staticFile(patch)} style={{ width: P, height: P }} />
        <svg viewBox="0 0 1024 1024" width={P} height={P} style={{ position: 'absolute', inset: 0 }}>
          <RibbonText id="top" d="M 240 215 Q 512 105 784 215" text={d.patchTopRibbon} />
          <RibbonText id="bottom" d="M 250 790 Q 512 905 774 790" text={d.patchBottomRibbon} />
        </svg>
      </Rise>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
        <Rise at={8}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 72, lineHeight: 1.1, color: C.text }}>{d.teamName}</div>
        </Rise>
        <Rise at={14}>
          <div style={{ fontFamily: MONO, fontSize: 38, color: C.amber, wordBreak: 'break-all' }}>{d.liveUrl}</div>
        </Rise>
        <Rise at={22} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
          {d.credits.map((c, i) => (
            <div key={i} style={{ fontFamily: MONO, fontSize: creditSize, lineHeight: 1.4, color: C.dim }}>{c}</div>
          ))}
        </Rise>
        <Rise at={28}>
          <MonoLabel size={17} color={C.faint}>{d.license}</MonoLabel>
        </Rise>
      </div>
    </AbsoluteFill>
  );
}
