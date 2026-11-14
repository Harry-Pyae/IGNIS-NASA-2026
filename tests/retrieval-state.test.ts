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
