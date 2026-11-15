import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SCENARIO_PRESETS } from '../src/engine/aliases';
import { presetAvailability } from '../src/engine/views';
import { useVerifiedCatalog } from '../src/lib/catalog';
import { COPY } from '../src/lib/copy';
import { gateExperiment } from '../src/lib/gates';
import { ExperimentSchema, FuelFormSchema } from '../src/lib/types';
import { Library } from '../src/pages/Library';
import { buildExport } from '../src/server/export';
import { card, scenario } from './helpers';

vi.mock('../src/lib/catalog', async (real) => ({ ...(await real<object>()), useVerifiedCatalog: vi.fn() }));
afterEach(() => vi.unstubAllGlobals());

const wire = card({ id: '00000000-0000-4000-8000-0000000000d1', campaign: 'USML-1 WIF', test_id: 'USML-1 WIF-B', fuel_material: 'polyethylene', material_class: 'insulation', fuel_form: 'insulated_wire', o2_pct: null, flow_cm_s: 10 });
const rod = card({ id: '00000000-0000-4000-8000-0000000000d2', test_id: 'KAPTON-ROD', fuel_material: 'polyethylene', material_class: 'insulation', fuel_form: 'rod' });

describe('form insulated_wire (decision 2026-11-15, USML-1 WIF)', () => {
  it('is a valid form', () => {
    expect(FuelFormSchema.options).toContain('insulated_wire');
    expect(ExperimentSchema.parse(wire).fuel_form).toBe('insulated_wire');
  });

  it('a cable scenario admits only insulated wire: never a rod or a sheet of the same material', () => {
    const cable = scenario({ fuel_form: 'insulated_wire', material: { status: 'resolved', fuel_material: 'polyethylene', material_class: 'insulation', via: 'preset', raw: null } } as never);
    expect(gateExperiment(cable, wire).eligible).toBe(true);
    expect(gateExperiment(cable, rod).reasons).toContain('form_incompatible');
  });

  it('the Cable insulation preset maps to it and states the campaign age; Cargo packaging became a gap line', () => {
    const preset = SCENARIO_PRESETS.find((p) => p.id === 'cable-insulation')!;
    expect(preset).toMatchObject({ fuel_form: 'insulated_wire', material: { fuel_material: 'polyethylene' } });
    expect(preset.note).toMatch(/USML-1.*1992/);
    expect(SCENARIO_PRESETS.map((p) => p.id)).toEqual(['cabin-wall-panel', 'cable-insulation', 'crew-clothing', 'silicone-sheet']);
    expect(COPY.plain.notInCatalog).toMatch(/^Cargo packaging: no verified flight test .* current IGNIS catalog/);
    expect(presetAvailability([wire, rod]).find((p) => p.preset_id === 'cable-insulation')).toMatchObject({ eligible: 1 });
  });

  it('library filters offer it; export carries it', () => {
    vi.mocked(useVerifiedCatalog).mockReturnValue({ catalog: { state: 'ready', revision: 'r', invalid: 0, experiments: [wire, rod] }, reload: vi.fn() });
    vi.stubGlobal('window', { location: { pathname: '/library', search: '?fuel_form=insulated_wire' } });
    const html = renderToStaticMarkup(<Library />);
    expect(html).toContain('value="insulated_wire"');
    expect(html).toContain('USML-1 WIF-B');
    expect(html).not.toContain('KAPTON-ROD');
    expect(buildExport([wire], 'r').experiments[0]!.fuel_form).toBe('insulated_wire');
  });
});
