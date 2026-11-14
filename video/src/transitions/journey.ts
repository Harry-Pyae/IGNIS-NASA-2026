/**
 * THE transition config: which transition carries the camera INTO each scene, and how long its handles are.
 * Retime here; scene code never changes. Each transition keeps the data file's `transitionSec` gap (so captions and
 * the timeline stay valid) and adds handles: `preSec` overlaps the end of the outgoing scene, `postSec` the start of
 * the incoming one. Keyed by destination, so the trailer (which skips scenes) still gets a unique transition per cut.
 *
 * `impl`: '3d' (@remotion/three) or '2.5d' (DOM/SVG parallax). Every 3D type also has a 2.5D version;
 * set '2.5d' if the 3D one is too heavy to render (see the per-transition cost table in REUSE.md).
 */
import type { SceneId } from '../types';

export type TransitionType = 'warp' | 'airlock' | 'corridor' | 'powerDown' | 'orbital' | 'fold';
export type Impl = '3d' | '2.5d';
export interface Leg {
  type: TransitionType;
  impl: Impl;
  preSec: number;
  postSec: number;
}

export const JOURNEY: Record<Exclude<SceneId, 'coldOpen'>, Leg> = {
  problem: { type: 'warp', impl: '2.5d', preSec: 0.4, postSec: 0.7 }, // 01→02 warp jump
  product: { type: 'airlock', impl: '3d', preSec: 0.35, postSec: 0.6 }, // 02→03 airlock dock
  evidence: { type: 'corridor', impl: '3d', preSec: 0.35, postSec: 0.5 }, // 03→04 corridor dolly
  limit: { type: 'powerDown', impl: '2.5d', preSec: 0.7, postSec: 0.8 }, // 04→05 power-down drift
  mission: { type: 'orbital', impl: '3d', preSec: 0.35, postSec: 0.55 }, // 05→06 orbital swing
  end: { type: 'fold', impl: '2.5d', preSec: 0.4, postSec: 0.7 }, // 06→07 dimension fold
};

/** Backdrop mood per scene (default speed 1, light 1). The gap scene is the quiet one: lights down, almost no drift. */
export const MOOD: Partial<Record<SceneId, { speed: number; light: number }>> = {
  limit: { speed: 0.06, light: 0.4 },
  end: { speed: 0.5, light: 1 },
};
