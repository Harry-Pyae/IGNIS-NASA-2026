import { describe, expect, it } from 'vitest';
import { parseConsoleDraft } from '../src/lib/consoleDraft';

const draft = {
  presetId: null,
  scenario: { domain: 'solid_flammability', fuel_material_raw: 'PMMA', fuel_form: 'flat_sheet', thickness_mm: null, o2_pct: 21, flow_cm_s: 10, pressure_kpa: 101.325 },
  materialChoice: null,
  description: 'Cabin wall panel near a vent',
  appliedEnvironmentId: null,
  confirmed: null,
  inputsChanged: false,
};

describe('console draft (sessionStorage)', () => {
  it('round-trips a saved draft', () => {
    expect(parseConsoleDraft(JSON.stringify(draft))).toEqual(draft);
  });
  it('ignores missing, malformed or out-of-contract drafts instead of throwing', () => {
    expect(parseConsoleDraft(null)).toBeNull();
    expect(parseConsoleDraft('{not json')).toBeNull();
    expect(parseConsoleDraft(JSON.stringify({ ...draft, scenario: { ...draft.scenario, domain: 'smoke_detection' } }))).toBeNull();
  });
});
