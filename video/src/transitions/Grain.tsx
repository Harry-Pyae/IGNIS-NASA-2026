import { useMemo } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

/** Film grain to sit 3D renders next to the art pack's baked grain. One small noise tile, jittered per frame. */
export function Grain({ opacity = 0.09 }: { opacity?: number }) {
  const f = useCurrentFrame();
  const tile = useMemo(() => {
    const size = 160;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d')!;
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < size * size; i++) {
      const v = Math.floor(random(`grain${i}`) * 255);
      img.data.set([v, v, v, 255], i * 4);
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL();
  }, []);
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: 'overlay',
        backgroundImage: `url(${tile})`,
        backgroundPosition: `${Math.floor(random(`gx${f}`) * 160)}px ${Math.floor(random(`gy${f}`) * 160)}px`,
        pointerEvents: 'none',
      }}
    />
  );
}
