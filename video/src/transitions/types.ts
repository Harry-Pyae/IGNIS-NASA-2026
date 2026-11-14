import type { ComponentType, CSSProperties, ReactNode } from 'react';

/** Frame counts for one transition. The overlay's local frame 0 is `pre` frames before the gap starts. */
export interface TransitionProps {
  pre: number;
  gap: number;
  post: number;
  seed: number;
  /** The incoming scene, frozen on its first frame (for transitions that show it before it starts, e.g. through a porthole). */
  renderNext: () => ReactNode;
}

export interface TransitionDef {
  /** Drawn above the scenes for pre + gap + post frames. */
  Overlay: ComponentType<TransitionProps>;
  /** Style of the outgoing scene over its last `pre` frames; p runs 0 → 1. */
  out?: (p: number) => CSSProperties;
  /** Style of the incoming scene over its first `post` frames; p runs 0 → 1. */
  in?: (p: number) => CSSProperties;
}

/** Phase helpers shared by every overlay: where we are in pre / gap / post, each 0 → 1. */
export function phases(f: number, { pre, gap, post }: Pick<TransitionProps, 'pre' | 'gap' | 'post'>) {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return {
    pre: clamp(f / Math.max(1, pre)),
    gap: clamp((f - pre) / Math.max(1, gap)),
    post: clamp((f - pre - gap) / Math.max(1, post)),
    /** 0 → 1 across the whole transition */
    all: clamp(f / Math.max(1, pre + gap + post)),
  };
}
