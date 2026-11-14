import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Fit, Rise } from '../components/common';
import { C, SANS } from '../theme';
import type { VideoData } from '../types';

/** Drifting papers: two layers of the same art at different speeds give the 2.5D parallax. */
export function Problem({ d, papers }: { d: VideoData['problem']; papers: string }) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = f / durationInFrames;
  const beatStep = Math.round((durationInFrames * 0.5) / Math.max(1, d.beats.length));
  const questionAt = Math.round(durationInFrames * 0.55);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img src={staticFile(papers)} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen', transform: `scale(${1.05 + t * 0.08}) translate(${-t * 40}px, ${t * 20}px)` }} />
      <Img
        src={staticFile(papers)}
        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, transform: `scaleX(-1) scale(${1.3 + t * 0.2}) translate(${t * 120}px, ${-t * 60}px)` }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.bg}f2 0%, ${C.bg}cc 45%, transparent 80%)` }} />
      <AbsoluteFill style={{ padding: '120px 140px 240px' }}>
        <Fit style={{ flex: 1, maxWidth: 1240, justifyContent: 'center' }} origin="left center">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {d.beats.map((b, i) => (
          <Rise key={i} at={10 + i * beatStep}>
            <div style={{ fontFamily: SANS, fontSize: 46, lineHeight: 1.3, color: C.dim }}>{b}</div>
          </Rise>
        ))}
        <Rise at={questionAt}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 60, lineHeight: 1.2, color: C.amber, marginTop: 20 }}>{d.question}</div>
        </Rise>
        </div>
        </Fit>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
