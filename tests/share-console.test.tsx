import { COPY } from '../src/lib/copy';
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
  useCatalogSummary: () => ({ summary: { state: 'ready', stats: { verified: 1, in_review: 0, campaigns: [], last_updated: null, revision: 'r1' } }, retry: vi.fn() }),
  useCatalogRevisionWatch: () => {},
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

it('before Confirm, steps 03/04 are slim single rows and step 05 labels its catalog-wide scope', () => {
  vi.stubGlobal('fetch', vi.fn());
  vi.stubGlobal('window', { location: { search: '?share=' + encodeURIComponent(encodeShare(scenario(), 'r1', [record.id])) } });
  const html = renderToStaticMarkup(<Console />);
  expect(html).toContain(COPY.plain.collapsed.matches);
  expect(html).toContain(COPY.plain.collapsed.brief);
  expect(html).toMatch(/Find matching experiments|Choose a material/);
  expect(html).toContain(COPY.plain.gapScope.catalog);
  // Anchors and the step headings survive the collapse (guided mission + deep links).
  for (const id of ['s1', 's2', 's3', 's4', 's5']) expect(html).toContain(`id="${id}"`);
  // One call to action only: the brief row has no button.
  const brief = html.slice(html.indexOf('id="s4"'), html.indexOf('id="s5"'));
  expect(brief).not.toContain('<button');
});
