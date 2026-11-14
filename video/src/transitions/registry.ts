/** One component per transition type and implementation. Pick and retime them in journey.ts, not here. */
import { airlock25, airlock3d } from './Airlock';
import { corridor25, corridor3d } from './Corridor';
import { fold } from './Fold';
import type { Impl, Leg, TransitionType } from './journey';
import { orbital25, orbital3d } from './Orbital';
import { powerDown } from './PowerDown';
import type { TransitionDef } from './types';
import { warp } from './Warp';

export const REGISTRY: Record<TransitionType, { '2.5d': TransitionDef; '3d'?: TransitionDef }> = {
  warp: { '2.5d': warp },
  airlock: { '2.5d': airlock25, '3d': airlock3d },
  corridor: { '2.5d': corridor25, '3d': corridor3d },
  powerDown: { '2.5d': powerDown },
  orbital: { '2.5d': orbital25, '3d': orbital3d },
  fold: { '2.5d': fold },
};

/** The definition a leg renders with; a type without a 3D version always uses its 2.5D one. */
export function resolve(leg: Leg, impl: Impl = leg.impl): TransitionDef {
  const entry = REGISTRY[leg.type];
  return (impl === '3d' && entry['3d']) || entry['2.5d'];
}
