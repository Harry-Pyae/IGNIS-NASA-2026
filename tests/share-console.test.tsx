import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { Console } from '../src/pages/Console';
import { encodeShare } from '../src/features/share/shareLink';
import { card, scenario } from './helpers';

vi.mock('../src/lib/catalog', () => ({
  useVerifiedCatalog: () => ({
    catalog: { state: 'ready', revision: 'r1', invalid: 0, experiments: [record] },
    reload: vi.fn(),
  }),
}));

// Run the restoration callback while rendering so React applies its state update
// before the assertions. Server rendering alone never runs mount effects.
vi.mock('../src/features/share/useScenarioShare', async () => {
  const { useRef } = await import('react');
  const { decodeShare } = await import('../src/features/share/shareLink');
  return {
    useScenarioShare: (_catalog: unknown, restore: (value: unknown) => void) => {
      const restored = useRef(false);
      if (!restored.current) {
        restored.current = true;
        restore(decodeShare(new URLSearchParams(window.location.search).get('share')!)!.scenario);
      }
      return { invalid: false, status: { state: 'current' } };
    },
  };
});

const record = card();
afterEach(() => vi.unstubAllGlobals());

it('restores a shared scenario without confirming or requesting a Brief', () => {
  const fetchSpy = vi.fn();
  vi.stubGlobal('fetch', fetchSpy);
  vi.stubGlobal('window', { location: { search: '?share=' + encodeURIComponent(encodeShare(scenario(), 'r1', [record.id])) } });
  const html = renderToStaticMarkup(<Console />);
  expect(html).toContain('Inputs changed');
  expect(html).not.toContain('Copy share link');
  expect(html).not.toContain('Live retrieval');
  expect(fetchSpy).not.toHaveBeenCalled();
});
