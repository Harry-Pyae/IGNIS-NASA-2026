import { describe, expect, it } from 'vitest';
import { classifyAskIntent, explicitScenarioPatch } from '../src/features/ask/scenarioPatch';
import type { ParsedScenario } from '../src/lib/types';

const parsed = (over: Partial<ParsedScenario> = {}): ParsedScenario => ({
  domain: 'solid_flammability',
  fuel_material_raw: null,
  fuel_form: null,
  thickness_mm: null,
  o2_pct: null,
  flow_cm_s: null,
  pressure_kpa: null,
  ...over,
});

describe('Ask IGNIS scenario patch', () => {
  it('keeps omitted values out of the patch, including a previously populated value or null', () => {
    const patch = explicitScenarioPatch(parsed({ o2_pct: 21, flow_cm_s: 5 }), 'Set oxygen to 21% and airflow to 5 cm/s');
    expect(patch).toEqual({ o2_pct: 21, flow_cm_s: 5 });
    expect({ fuel_material_raw: 'PMMA', fuel_form: 'flat_sheet', thickness_mm: null, pressure_kpa: null, ...patch })
      .toEqual({ fuel_material_raw: 'PMMA', fuel_form: 'flat_sheet', thickness_mm: null, o2_pct: 21, flow_cm_s: 5, pressure_kpa: null });
  });

  it('preserves explicit zero as a real requested value', () => {
    expect(explicitScenarioPatch(parsed({ flow_cm_s: 0 }), 'Set airflow to 0 cm/s')).toEqual({ flow_cm_s: 0 });
  });

  it('clears only a field explicitly named with an explicit clear request', () => {
    expect(explicitScenarioPatch(parsed(), 'Clear pressure and leave oxygen unspecified'))
      .toEqual({ o2_pct: null, pressure_kpa: null });
  });

  it('does not clear a named field when the parser leaves it null without a clear instruction', () => {
    expect(explicitScenarioPatch(parsed(), 'Set pressure to 80 kPa')).toEqual({});
  });
});

describe('Ask IGNIS intent routing', () => {
  it('routes view commands without classifying them as parse requests', () => {
    expect(classifyAskIntent('Open the Evidence Map')).toEqual({ kind: 'view', destination: 'map' });
    expect(classifyAskIntent('Open Methods')).toEqual({ kind: 'view', destination: 'methods' });
    expect(classifyAskIntent('Open the Scenario Builder')).toEqual({ kind: 'view', destination: 'scenario' });
  });

  it('recognizes evidence questions and limits out-of-scope requests', () => {
    expect(classifyAskIntent('What did these experiments observe?')).toEqual({ kind: 'evidence' });
    expect(classifyAskIntent('Tell me a story about fire')).toEqual({ kind: 'unsupported' });
    expect(classifyAskIntent('Open the telemetry dashboard')).toEqual({ kind: 'unknown-view' });
  });
});
