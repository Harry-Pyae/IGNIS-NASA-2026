import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Badge } from '../src/components/ui';
import { gapGrid } from '../src/engine/gaps';
import { matchScenario } from '../src/engine/match';
import { COPY } from '../src/lib/copy';
import { useVerifiedCatalog } from '../src/lib/catalog';
import { ExperimentSchema, OutcomeSchema, type Claim } from '../src/lib/types';
import { computeCoverage } from '../src/lib/coverage';
import { EvidenceMap } from '../src/pages/Console';
import { Library } from '../src/pages/Library';
import { buildContext, claimProblem } from '../src/server/claims';
import { buildExport, EXPORT_README } from '../src/server/export';
import { card, scenario } from './helpers';

vi.mock('../src/lib/catalog', async (real) => ({ ...(await real<object>()), useVerifiedCatalog: vi.fn() }));
afterEach(() => vi.unstubAllGlobals());

const silent = card({ id: '00000000-0000-4000-8000-0000000000aa', test_id: 'GMT175-T9', outcome: 'no_ignition', o2_pct: 16.4, flow_cm_s: 10 });
const burned = card({ id: '00000000-0000-4000-8000-0000000000bb', test_id: 'BURNED-RUN-X', outcome: 'sustained', o2_pct: 21, flow_cm_s: 10 });

describe('outcome no_ignition (decision 2026-11-15, migration 0006)', () => {
  it('is a valid outcome in the schema and the migration', () => {
    expect(OutcomeSchema.parse('no_ignition')).toBe('no_ignition');
    expect(ExperimentSchema.parse(silent).outcome).toBe('no_ignition');
    expect(readFileSync('supabase/migrations/0006_outcome_no_ignition.sql', 'utf8')).toMatch(/'no_ignition'/);
  });

  it('is retrievable evidence with no special ranking', () => {
    const twin = { ...silent, id: '00000000-0000-4000-8000-0000000000cc', outcome: 'sustained' as const };
    const matches = matchScenario(scenario({ o2_pct: 16.4, flow_cm_s: 10 }), [silent, twin]);
    expect(matches.map((m) => m.experiment.id)).toContain(silent.id);
    const [a, b] = [silent.id, twin.id].map((id) => matches.find((m) => m.experiment.id === id)!.score);
    expect(a).toBe(b); // the outcome never moves a run up or down
  });

  it('counts as tested at its conditions on the gap grid, never as a gap', () => {
    const grid = gapGrid([silent], null);
    const cells = grid.cells.flat();
    expect(cells.filter((c) => c.state === 'tested')).toHaveLength(1);
    expect(grid.plotted).toBe(1);
  });

  it('has its own map marker and an explained legend entry, without safety colours', () => {
    const html = renderToStaticMarkup(<EvidenceMap experiments={[silent, burned]} scenario={null} matches={[]} status="connected" selectedId={null} onSelect={() => {}} />);
    expect(html).toContain('Did not ignite');
    expect(COPY.plain.outcomes.no_ignition).toBe('Did not ignite — ignition was attempted and the sample never caught.');
    const point = html.slice(html.indexOf(`map-point-${silent.id}`));
    const mark = point.slice(0, point.indexOf('</g>'));
    expect(mark).toContain('<path'); // hexagon, not the circle/square of sustained/extinguished
    expect(mark).not.toMatch(/--color-(success|danger|flame)/);
  });

  it('chips and badges name it plainly', () => {
    const html = renderToStaticMarkup(<Badge variant="no_ignition" />);
    expect(html).toContain('Did not ignite');
    expect(html).not.toMatch(/success|danger/);
  });

  it('library filters offer it and filter by it', () => {
    vi.mocked(useVerifiedCatalog).mockReturnValue({ catalog: { state: 'ready', revision: 'r', invalid: 0, experiments: [silent, burned] }, reload: vi.fn() });
    const render = (search: string) => {
      vi.stubGlobal('window', { location: { pathname: '/library', search } });
      return renderToStaticMarkup(<Library />);
    };
    expect(render('')).toContain('value="no_ignition"');
    const filtered = render('?outcome=no_ignition');
    expect(filtered).toContain('GMT175-T9');
    expect(filtered).not.toContain('BURNED-RUN-X');
  });

  it('export documents it and carries it', () => {
    expect(JSON.stringify(EXPORT_README)).toContain('no_ignition');
    expect(buildExport([silent], 'r').experiments[0]!.outcome).toBe('no_ignition');
  });

  it('a narrated "did not ignite" needs an outcome ref to the card', () => {
    const ctx = buildContext([silent], computeCoverage(scenario(), [silent], [silent], 'r'));
    const claim = (refs: Claim['refs']): Claim => ({ classification: 'OBSERVED', text: 'GMT175-T9 did not ignite at 16.4% O2.', evidence_ids: ['E1'], refs, gap_ids: [] });
    const o2 = { evidence_id: 'E1', field: 'o2_pct' as const, value: 16.4, unit: '%' };
    expect(claimProblem(claim([o2]), ctx)).toBe('unsupported_outcome');
    expect(claimProblem(claim([o2, { evidence_id: 'E1', field: 'outcome', value: 'no_ignition', unit: null }]), ctx)).toBeNull();
  });
});
