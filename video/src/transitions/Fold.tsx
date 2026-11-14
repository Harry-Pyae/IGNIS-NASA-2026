import { useMemo } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, easeInOut, easeOut } from '../theme';
import { phases, type TransitionDef, type TransitionProps } from './types';

/**
 * 06→07 DIMENSION FOLD: space creases along a bright seam and refracts. Three tinted copies of one star sheet
 * scale and rotate against each other (layered 2.5D), then the end card unfolds out of the crease.
 */
function FoldOverlay(props: TransitionProps) {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = phases(f, props);
  const total = props.pre + props.gap + props.post;
  const fold = interpolate(f, [0, props.pre + props.gap * 0.5, total], [0, 1, 0], { easing: easeInOut, extrapolateRight: 'clamp' });
  const stars = useMemo(() => Array.from({ length: 240 }, (_, i) => ({ x: random(`fx${i}`), y: random(`fy${i}`), r: 1 + random(`fr${i}`) * 2.6 })), []);
  const sheet = (tint: string) => (
    <svg width={width} height={height}>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x * width} cy={s.y * height} r={s.r} fill={tint} />
      ))}
    </svg>
  );
  const layers: { tint: string; k: number }[] = [
    { tint: C.violet, k: -1 },
    { tint: C.blue, k: 0.6 },
    { tint: C.amber, k: 1.4 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: interpolate(f, [0, props.pre, total - props.post * 0.5, total], [0, 1, 1, 0], { extrapolateRight: 'clamp' }) }}>
      <AbsoluteFill style={{ background: C.bg, opacity: 0.55 * fold }} />
      {layers.map((l, i) => (
        <AbsoluteFill
          key={i}
          style={{
            mixBlendMode: 'screen',
            opacity: 0.95 * fold,
            transform: `perspective(1400px) rotateY(${l.k * fold * 38}deg) rotate(${l.k * fold * 9}deg) scale(${1 + l.k * fold * 0.12})`,
          }}
        >
          {sheet(l.tint)}
        </AbsoluteFill>
      ))}
      {/* The lens: a refracting ring that widens as space folds, then relaxes. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent ${18 + fold * 22}%, ${C.violet}40 ${22 + fold * 24}%, #ffffff55 ${23 + fold * 24.5}%, ${C.blue}40 ${24 + fold * 25}%, transparent ${30 + fold * 28}%)`,
          opacity: fold,
          transform: `scale(${1 + fold * 0.15}, ${1 - fold * 0.25}) rotate(${fold * -12}deg)`,
        }}
      />
      {/* The crease: a thin refracting seam that sweeps across, brightest at the fold's deepest point. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, transparent ${44 + p.gap * 4}%, ${C.violet}55 ${49 + p.gap * 2}%, #ffffffcc 50%, ${C.blue}55 ${51 - p.gap * 2}%, transparent ${56 - p.gap * 4}%)`,
          opacity: fold,
          transform: `translateX(${(p.all - 0.5) * 30}%) skewX(${-8 * fold}deg)`,
        }}
      />
    </AbsoluteFill>
  );
}

export const fold: TransitionDef = {
  Overlay: FoldOverlay,
  // The outgoing scene folds away from its centre line.
  out: (p) => ({ opacity: 1 - easeInOut(p), transform: `perspective(1600px) rotateY(${-easeInOut(p) * 32}deg) scale(${1 - easeInOut(p) * 0.08})` }),
  // The end card unfolds out of the crease and is completely still once it lands.
  in: (p) => ({ opacity: easeOut(p), transform: `perspective(1600px) rotateY(${(1 - easeOut(p)) * 40}deg) scale(${0.92 + 0.08 * easeOut(p)})` }),
};
