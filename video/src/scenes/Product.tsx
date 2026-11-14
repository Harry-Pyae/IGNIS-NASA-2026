import type React from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, Series, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Rise } from '../components/common';
import { C, monoLabel } from '../theme';
import type { ProductClip } from '../types';

/** The core of the film: full-screen recordings of the live app, one after another, each with its label. */
export function Product({ clips }: { clips: ProductClip[] }) {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Series>
        {clips.map((c, i) => (
          <Series.Sequence key={i} durationInFrames={Math.round(c.durationSec * fps)}>
            <OffthreadVideo muted src={staticFile(c.src)} trimBefore={Math.round(c.trimStartSec * fps)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <LabelOut>
            <div style={{ position: 'absolute', left: 48, top: 44, maxWidth: 1180 }}>
              <Rise at={4}>
                <div
                  style={{
                    ...monoLabel,
                    fontSize: 24,
                    lineHeight: 1.4,
                    color: C.text,
                    background: `${C.bg}e6`,
                    border: `1px solid ${C.raised}`,
                    borderLeft: `4px solid ${C.amber}`,
                    borderRadius: 10,
                    padding: '12px 20px',
                  }}
                >
                  {c.label}
                </div>
              </Rise>
            </div>
            </LabelOut>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
}

/** The label introduces the clip, then gets out of the way of the app's own UI. */
function LabelOut({ children }: { children: React.ReactNode }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <div style={{ opacity: interpolate(f, [3.6 * fps, 4.2 * fps], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{children}</div>;
}
