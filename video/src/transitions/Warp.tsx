import { useMemo } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, easeInOut, easeOut } from '../theme';
import { phases, type TransitionDef, type TransitionProps } from './types';

/** 01→02 WARP JUMP: stars stretch into light-lines radiating from the centre, then decelerate into the papers. */
function WarpOverlay(props: TransitionProps) {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { pre, gap, post } = props;
  const total = pre + gap + post;
  // Speed profile: ramps up through pre, peaks early in the gap, decelerates through post.
  const speedAt = (x: number) =>
    interpolate(x, [0, pre, pre + gap * 0.35, pre + gap, total], [0.002, 0.03, 0.06, 0.025, 0.001], { easing: easeInOut, extrapolateRight: 'clamp' });
  const travel = useMemo(() => {
    const acc = [0];
    for (let i = 1; i <= total; i++) acc.push(acc[i - 1]! + speedAt(i));
    return acc;
  }, [total]); // eslint-disable-line react-hooks/exhaustive-deps
  const t = travel[Math.min(f, total)]!;
  const v = speedAt(f);
  const stretch = Math.min(0.85, v * 22);
  const p = phases(f, props);
  const opacity = interpolate(f, [0, pre * 0.6, total - post * 0.6, total], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const cx = width / 2;
  const cy = height / 2;
  const R = Math.hypot(cx, cy);
  const stars = useMemo(() => Array.from({ length: 260 }, (_, i) => ({ a: random(`wa${i}`) * Math.PI * 2, z: random(`wz${i}`), b: 0.5 + random(`wb${i}`) * 0.5 })), []);

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height}>
        {stars.map((s, i) => {
          const z = 1 - ((s.z + t) % 1); // 1 = far, 0 = passing the camera
          const r = (R * 0.06) / Math.max(0.04, z);
          if (r > R * 1.2) return null;
          const r0 = r * (1 - stretch);
          const cos = Math.cos(s.a);
          const sin = Math.sin(s.a);
          return (
            <line key={i} x1={cx + cos * r0} y1={cy + sin * r0} x2={cx + cos * r} y2={cy + sin * r} stroke={i % 7 === 0 ? C.amber : '#cfe0ff'} strokeOpacity={s.b} strokeWidth={1 + (1 - z) * 2.2} strokeLinecap="round" />
          );
        })}
      </svg>
      {/* The jump's flash: a soft core that blooms at peak speed and is gone before the papers settle. */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #ffffff ${4 + p.gap * 6}%, ${C.blue}66 ${14 + p.gap * 10}%, transparent 45%)`, opacity: interpolate(v, [0.02, 0.06], [0, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
    </AbsoluteFill>
  );
}

export const warp: TransitionDef = {
  Overlay: WarpOverlay,
  out: (p) => ({ opacity: 1 - easeInOut(p), transform: `scale(${1 + easeInOut(p) * 0.18})` }),
  // Decelerate into the papers: arrives large and fast, settles with a strong ease-out.
  in: (p) => ({ opacity: easeOut(p), transform: `scale(${1.22 - 0.22 * easeOut(p)})` }),
};
