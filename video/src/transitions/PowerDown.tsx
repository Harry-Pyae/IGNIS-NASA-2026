import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, easeInOut, easeOut } from '../theme';
import { type TransitionDef, type TransitionProps } from './types';

/**
 * 04→05 POWER-DOWN DRIFT: the lights step down in three soft stages while the evidence floats away in zero-g,
 * then the gap scene fades up out of the dark with no movement at all (its content stays static).
 */
function PowerDownOverlay({ pre, gap, post }: TransitionProps) {
  const f = useCurrentFrame();
  const a = pre + gap * 0.15;
  const b = pre + gap * 0.5;
  const c = pre + gap * 0.85;
  // Three stepped dims (each step eased), then a slow lift as the gap scene arrives.
  const dark = interpolate(
    f,
    [0, pre * 0.4, pre * 0.5, a, a + 3, b, b + 4, c, pre + gap, pre + gap + post],
    [0, 0, 0.3, 0.3, 0.55, 0.55, 0.78, 0.78, 0.8, 0],
    { easing: easeInOut, extrapolateRight: 'clamp' },
  );
  // A vignette closing in, like cabin lights going to standby.
  const vignette = interpolate(f, [0, pre + gap, pre + gap + post], [0, 1, 0.2], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: C.bg, opacity: dark }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 35%, ${C.bg} 85%)`, opacity: vignette }} />
    </AbsoluteFill>
  );
}

export const powerDown: TransitionDef = {
  Overlay: PowerDownOverlay,
  // Zero-g: a slow upward float with the faintest roll, almost still.
  out: (p) => ({ opacity: 1 - easeInOut(p) * 0.6, transform: `translateY(${-easeInOut(p) * 26}px) rotate(${easeInOut(p) * 0.8}deg)` }),
  // The gap scene itself never moves: opacity only.
  in: (p) => ({ opacity: easeOut(p) }),
};
