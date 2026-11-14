import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { Library } from '../src/pages/Library';
import { useVerifiedCatalog } from '../src/lib/catalog';
import { card } from './helpers';

vi.mock('../src/lib/catalog', () => ({ useVerifiedCatalog: vi.fn() }));
afterEach(() => vi.unstubAllGlobals());

it('keeps missing measurements visible until filtered and bounds detail to the current catalog', () => {
  const measured = card({ test_id: 'Measured run', o2_pct: 21 });
  const missing = card({ id: 'another-id', test_id: 'Missing oxygen run', o2_pct: null });
  vi.mocked(useVerifiedCatalog).mockReturnValue({
    catalog: { state: 'ready', revision: 'test', invalid: 0, experiments: [measured, missing] },
    reload: vi.fn(),
  });
  const render = (pathname: string, search = '') => {
    vi.stubGlobal('window', { location: { pathname, search } });
    return renderToStaticMarkup(<Library />);
  };

  expect(render('/library')).toContain('Oxygen not reported');
  const filtered = render('/library', '?o2_min=21&o2_max=21');
  expect(filtered).toContain('Measured run');
  expect(filtered).not.toContain('Missing oxygen run');
  expect(render('/library/' + measured.id)).toContain('Verbatim source observation');
  expect(render('/library/private-id')).toContain('Not in the current IGNIS catalog');
});
