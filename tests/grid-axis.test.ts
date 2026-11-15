import { describe, expect, it } from 'vitest';
import { gapGrid, GRID } from '../src/engine/gaps';
import { mapCoordinates } from '../src/engine/views';
import { card } from './helpers';

// Saffire VI-2 burned at 31.0 % O₂ (54.1 kPa): the shared GRID now reaches 32 % so it plots instead of counting off-axis.
describe('O₂ axis reaches 32 % (Saffire VI)', () => {
  const vi2 = card({ id: '00000000-0000-4000-8000-0000000000e2', o2_pct: 31.0, flow_cm_s: 20 });
  const low = card({ id: '00000000-0000-4000-8000-0000000000e1', o2_pct: 16.4, flow_cm_s: 10 });

  it('a 31 % run is on the map axes, not off-axis', () => {
    expect(GRID.o2.max).toBe(32);
    const { visible, outside } = mapCoordinates([vi2, low]);
    expect(visible.map((c) => c.id)).toContain(vi2.id);
    expect(outside).toHaveLength(0);
    expect(mapCoordinates([card({ o2_pct: 33, flow_cm_s: 20 })]).outside).toHaveLength(1);
  });

  it('cells re-derive over the new range: 18 one-percent rows, the 31–32 % cell tested, cells between untested', () => {
    const grid = gapGrid([vi2, low], null);
    expect(grid.cells).toHaveLength(18);
    const at = (o2: number, flow: number) => grid.cells.flat().find((c) => o2 >= c.o2_min && o2 < c.o2_max && flow >= c.flow_min && flow < c.flow_max)!;
    expect(at(31.0, 20).state).toBe('tested');
    expect(at(16.4, 10).state).toBe('tested');
    expect(at(25.5, 15).state).toBe('untested');
    expect(at(31.5, 14).state).toBe('untested');
    expect(at(31.5, 2).state).toBe('outside_range'); // beyond the catalog's flow envelope
  });
});
