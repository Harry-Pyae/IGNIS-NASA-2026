/** Round 8 · A3: zero vs unknown — only a successful catalog read can assert a count. */
import { describe, expect, it } from 'vitest';
import { evidenceViews, retrievalState } from '../src/engine/views';
import { card, scenario } from './helpers';

describe('retrievalState', () => {
  const confirmed = scenario();
  const views = (cards: ReturnType<typeof card>[]) => evidenceViews(cards, confirmed, 'rev-1');

  it('loading → unavailable → retry → matches: never a number until the read settles', () => {
    expect(retrievalState('loading', confirmed, null)).toEqual({ state: 'loading' });
    expect(retrievalState('unavailable', confirmed, null)).toEqual({ state: 'unavailable' });
    expect(retrievalState('loading', confirmed, null)).toEqual({ state: 'loading' }); // Retry
    const settled = retrievalState('connected', confirmed, views([card()]));
    expect(settled).toMatchObject({ state: 'settled', revision: 'rev-1' });
    expect(settled.state === 'settled' && settled.matches).toBeGreaterThan(0);
  });

  it('a genuine zero: the catalog was read and nothing matched', () => {
    const elsewhere = card({ fuel_material: 'nomex', material_class: 'aramid_fabric', fuel_form: 'fabric' });
    const pmma = scenario({ material: { status: 'resolved', raw: null, fuel_material: 'PMMA', material_class: 'thermoplastic', via: 'picker' }, fuel_form: 'flat_sheet' });
    expect(retrievalState('connected', pmma, evidenceViews([elsewhere], pmma, 'rev-2'))).toEqual({ state: 'settled', revision: 'rev-2', matches: 0 });
  });

  it('nothing confirmed → idle (no count, no gap)', () => {
    expect(retrievalState('connected', null, views([card()]))).toEqual({ state: 'idle' });
  });

  it('a stale "connected" status without loaded views is still loading, never zero', () => {
    expect(retrievalState('connected', confirmed, null)).toEqual({ state: 'loading' });
  });
});

describe('A4 · one map accounting: summary counts come from the map\'s own partition', () => {
  it('visible / off-axis / missing / shared coordinates', async () => {
    const { mapCoordinates } = await import('../src/engine/views');
    const rows = [
      card({ id: 'on-map', o2_pct: 21, flow_cm_s: 10 }),
      card({ id: 'shared', o2_pct: 21, flow_cm_s: 10 }), // same point as on-map: both drawn, both counted
      card({ id: 'off-axis', o2_pct: 35, flow_cm_s: 10 }), // measured, beyond the 14–30 % axis
      card({ id: 'missing', o2_pct: 21, flow_cm_s: null }), // no airflow: listed, never drawn, never zero
    ];
    const v = evidenceViews(rows, null, 'rev');
    expect(v.plotted.map((c) => c.id)).toEqual(['on-map', 'shared']);
    expect(v.off_axis.map((c) => c.id)).toEqual(['off-axis']);
    expect(v.not_plotted.map((n) => [n.experiment.id, n.missing])).toEqual([['missing', ['flow_cm_s']]]);
    // The SVG draws mapCoordinates(eligible).visible — the exact same rows the summary counts.
    expect(mapCoordinates(v.eligible).visible).toEqual(v.plotted);
    expect(v.plotted.length + v.off_axis.length + v.not_plotted.length).toBe(v.eligible.length);
  });
});

describe('A7 · preset availability from the real catalog', () => {
  it('counts eligible / exact / class-only / map partition per preset; every preset mapped', async () => {
    const { presetAvailability } = await import('../src/engine/views');
    const fabric = [
      card({ id: 'f1', o2_pct: 21, flow_cm_s: 10 }),
      card({ id: 'f2', o2_pct: 21, flow_cm_s: null }),
      card({ id: 'f3', fuel_material: 'nomex_like', material_class: 'fabric', o2_pct: 35, flow_cm_s: 5 }), // class-only, off-axis
      card({ id: 'p1', fuel_material: 'PMMA', material_class: 'thermoplastic', fuel_form: 'flat_sheet' }),
      card({ id: 'draft', verified_by: null }),
    ];
    const byId = Object.fromEntries(presetAvailability(fabric).map((p) => [p.preset_id, p]));
    expect(byId['crew-clothing']).toMatchObject({ state: 'ready', exact: 2, visible: 1, missing_coordinates: 1 });
    const crew = byId['crew-clothing']!;
    if (crew.state === 'ready') expect(crew.eligible).toBe(crew.exact + crew.class_only);
    // Every preset is mapped now (decision 2026-11-15): no evidence reads as 0 runs, never as a picker.
    expect(byId['cable-insulation']).toMatchObject({ state: 'ready', eligible: 0 });
    expect(byId['silicone-sheet']).toMatchObject({ state: 'ready', eligible: 0 });
    expect(byId['cargo-packaging']).toBeUndefined();
    // Only an insulated wire counts for cable insulation: an insulation rod never stands in for it.
    const wires = [
      card({ id: 'w1', fuel_material: 'polyethylene', material_class: 'insulation', fuel_form: 'insulated_wire', o2_pct: null, flow_cm_s: 10 }),
      card({ id: 'k1', fuel_material: 'kapton', material_class: 'insulation', fuel_form: 'rod' }),
    ];
    expect(presetAvailability(wires).find((p) => p.preset_id === 'cable-insulation')).toMatchObject({ state: 'ready', eligible: 1, exact: 1, missing_coordinates: 1 });
    expect(presetAvailability([]).find((p) => p.preset_id === 'crew-clothing')).toMatchObject({ state: 'ready', eligible: 0 });
  });
});
