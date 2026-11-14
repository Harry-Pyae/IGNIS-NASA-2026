import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { MonoLabel } from '../components/common';
import { C, MONO, SANS } from '../theme';
import type { VideoData } from '../types';

/** The guided-mission recording with its five steps as captions; the active step is lit, nothing slides. */
export function Mission({ d }: { d: VideoData['mission'] }) {
  const f = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const active = Math.min(d.steps.length - 1, Math.floor((f / durationInFrames) * d.steps.length));
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <OffthreadVideo muted src={staticFile(d.clip.src)} trimBefore={Math.round(d.clip.trimStartSec * fps)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.bg}f0 0%, ${C.bg}b3 30%, transparent 46%)` }} />
      <div style={{ position: 'absolute', left: 70, top: 90, width: 620, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <MonoLabel size={22} color={C.amber}>{d.heading}</MonoLabel>
        {d.steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'baseline', opacity: i === active ? 1 : 0.45 }}>
            <span style={{ fontFamily: MONO, fontSize: 24, color: i === active ? C.amber : C.faint }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ fontFamily: SANS, fontWeight: i === active ? 600 : 400, fontSize: 34, lineHeight: 1.25, color: C.text }}>{s}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}
