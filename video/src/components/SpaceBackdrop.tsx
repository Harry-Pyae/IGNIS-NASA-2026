import { useMemo } from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../theme';

/**
 * The film's one continuous place: three parallax star layers and a faint nebula, behind every scene.
 * `travel[f]` is the accumulated drift at frame f and `light[f]` the brightness (both from the scene moods),
 * so the drift slows and dims for the quiet scene without ever jumping.
 */
const LAYERS = [
  { n: 150, r: 0.8, speed: 0.06, alpha: 0.45 },
  { n: 90, r: 1.3, speed: 0.16, alpha: 0.65 },
  { n: 36, r: 2.1, speed: 0.38, alpha: 0.9 },
];

export function SpaceBackdrop({ travel, light }: { travel: number[]; light: number[] }) {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = travel[Math.min(f, travel.length - 1)] ?? 0;
  const l = light[Math.min(f, light.length - 1)] ?? 1;
  const stars = useMemo(
    () =>
      LAYERS.flatMap((layer, li) =>
        Array.from({ length: layer.n }, (_, i) => ({ ...layer, x: random(`bx${li}-${i}`), y: random(`by${li}-${i}`), tw: random(`bt${li}-${i}`) })),
      ),
    [],
  );
  const W = width + 40;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* Nebula: three very soft colour fields drifting far slower than the nearest stars. */}
      <AbsoluteFill
        style={{
          opacity: 0.9 * l,
          background: [
            `radial-gradient(42% 55% at ${30 - ((t * 0.004) % 60)}% 32%, ${C.violet}1f, transparent 70%)`,
            `radial-gradient(38% 46% at ${78 - ((t * 0.003) % 50)}% 70%, ${C.blue}1a, transparent 70%)`,
            `radial-gradient(30% 34% at ${60 - ((t * 0.005) % 70)}% 18%, ${C.flame}10, transparent 72%)`,
          ].join(','),
        }}
      />
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0, opacity: l }}>
        {stars.map((s, i) => {
          const x = ((((s.x * W - t * s.speed * 1.4) % W) + W) % W) - 20;
          const y = s.y * height + Math.sin(t * 0.002 + s.tw * 6) * 6 * s.speed;
          return <circle key={i} cx={x} cy={y} r={s.r} fill={C.text} opacity={s.alpha * (0.75 + 0.25 * s.tw)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
}
