import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { AskIGNIS } from '../src/features/ask/AskIGNIS';
import type { ParsedScenario, ResolvedMaterial } from '../src/lib/types';

const scenario: ParsedScenario = {
  domain: 'solid_flammability',
  fuel_material_raw: 'PMMA',
  fuel_form: 'flat_sheet',
  thickness_mm: null,
  o2_pct: 21,
  flow_cm_s: null,
  pressure_kpa: 101.325,
};

const material: ResolvedMaterial = {
  status: 'resolved',
  raw: 'PMMA',
  fuel_material: 'PMMA',
  material_class: 'thermoplastic',
  via: 'preset',
};

it('renders the labelled trigger, a persistent controlled panel, and the three supported example actions', () => {
  const html = renderToStaticMarkup(<AskIGNIS
    scenario={scenario}
    currentMaterial={material}
    scenarioRevision={0}
    confirmed={false}
    retrieval="idle"
    matches={[]}
    briefing={null}
    briefingStatus="idle"
    materials={[]}
    onApply={() => {}}
    onCitation={() => {}}
    onNavigate={() => {}}
  />);

  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain('aria-controls="ask-ignis-panel"');
  expect(html).toContain('Ask IGNIS');
  expect(html).toContain('id="ask-ignis-panel"');
  expect(html).toContain('hidden=""');
  expect(html).toContain('Set oxygen to 21% and airflow to 5 cm/s');
  expect(html).toContain('What did these experiments observe?');
  expect(html).toContain('Open the Evidence Map');
});
