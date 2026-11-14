import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from 'react';
import { continueRender, delayRender, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, easeOut, MONO, monoLabel } from '../theme';

/** Fade + rise in, once. `at` in frames. The only entrance used outside the corridor. */
export function Rise({ at = 0, children, style }: { at?: number; children: ReactNode; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut });
  return <div style={{ ...style, opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>{children}</div>;
}

/** The flame sphere is decor only and always carries its caption. */
export function FlameSphere({ src, caption, size }: { src: string; caption: string; size: number }) {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: size + 120 }}>
      <Img src={staticFile(src)} style={{ width: size, height: size, transform: `rotate(${f * 0.12}deg)`, WebkitMaskImage: 'radial-gradient(circle, #000 52%, transparent 66%)' }} />
      <div style={{ ...monoLabel, fontSize: 18, color: C.dim, textAlign: 'center' }}>{caption}</div>
    </div>
  );
}

export function MonoLabel({ children, color = C.dim, size = 22 }: { children: ReactNode; color?: string; size?: number }) {
  return <div style={{ ...monoLabel, fontSize: size, color }}>{children}</div>;
}

export const panel: CSSProperties = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
};

export function Value({ v, notReported }: { v: string | null; notReported: string }) {
  return <span style={{ fontFamily: MONO, color: v == null ? C.faint : C.text }}>{v ?? notReported}</span>;
}

/**
 * Shrinks its content (never grows it) until it fits the box: the largest scale whose re-wrapped height fits.
 * Measured once on mount, so every frame of a scene renders identically. This is what keeps 2x-length data on screen.
 */
export function Fit({ children, style, origin = 'left top' }: { children: ReactNode; style?: CSSProperties; origin?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const o = outer.current!;
    const i = inner.current!;
    const apply = (sc: number) => {
      i.style.width = `${100 / sc}%`;
      i.style.transform = `scale(${sc})`;
      return i.offsetHeight * sc <= o.clientHeight;
    };
    const fit = () => {
      if (apply(1)) return;
      let lo = 0.3;
      let hi = 1;
      for (let n = 0; n < 8; n++) {
        const mid = (lo + hi) / 2;
        if (apply(mid)) lo = mid;
        else hi = mid;
      }
      apply(lo);
    };
    // On mount the frame may not be laid out yet (0×0); hold the render until it is, then measure once.
    const handle = delayRender('fit');
    let raf = 0;
    let done = false;
    const finish = () => {
      if (!done) continueRender(handle);
      done = true;
    };
    const wait = () => {
      if (o.clientHeight > 0 && o.clientWidth > 0) {
        fit();
        finish();
      } else raf = requestAnimationFrame(wait);
    };
    wait();
    return () => {
      cancelAnimationFrame(raf);
      finish();
    };
  }, []);
  return (
    <div ref={outer} style={{ minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', ...style }}>
      <div ref={inner} style={{ transformOrigin: origin, flex: 'none' }}>
        {children}
      </div>
    </div>
  );
}
