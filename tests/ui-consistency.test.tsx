/** UI consistency pass: three button tiers, touch-safe hit areas, no dead-end Compare, no ghost on public pages. */
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buttonClass } from '../src/components/ui/buttonStyles';
import { useVerifiedCatalog } from '../src/lib/catalog';
import { Compare } from '../src/pages/Compare';
import { Library } from '../src/pages/Library';
import { card } from './helpers';

vi.mock('../src/lib/catalog', () => ({ useVerifiedCatalog: vi.fn() }));
afterEach(() => vi.unstubAllGlobals());
const at = (pathname: string, search = '') => vi.stubGlobal('window', { location: { pathname, search, href: 'https://x' + pathname + search }, addEventListener() {}, removeEventListener() {} });
const catalog = (experiments: ReturnType<typeof card>[]) =>
  vi.mocked(useVerifiedCatalog).mockReturnValue({ catalog: { state: 'ready', revision: 'r', invalid: 0, experiments }, reload: vi.fn() });

describe('button tiers', () => {
  it('every tier gets a ≥44px hit area; boxed tiers share fixed heights; tertiary stays inline', () => {
    for (const v of ['primary', 'secondary', 'tertiary'] as const) expect(buttonClass(v)).toContain('after:h-11');
    expect(buttonClass('secondary', 'md')).toContain('h-10');
    expect(buttonClass('primary', 'md')).toContain('h-10');
    expect(buttonClass('tertiary')).toContain('h-auto');
    expect(buttonClass('secondary')).toContain('border-raised');
  });

  it('public pages never use the ghost variant', () => {
    for (const f of ['Console', 'Library', 'Compare', 'Methods', 'Sources', 'Home'])
      expect(readFileSync(`src/pages/${f}.tsx`, 'utf8'), f).not.toMatch(/variant="ghost"/);
  });
});

describe('detail page actions', () => {
  it('Cite this and Compare sit in one row as same-height secondary actions', () => {
    const a = card();
    catalog([a]);
    at('/library/' + a.id);
    const html = renderToStaticMarkup(<Library />);
    const row = html.slice(html.indexOf('Cite this') - 400, html.indexOf('>Compare<') + 10);
    expect(row).toContain('h-10');
    expect(row.match(/h-10/g)!.length).toBeGreaterThanOrEqual(2);
    expect(html).toContain(`href="/compare?ids=${a.id}"`);
  });
});

describe('Compare from a detail page', () => {
  it('one ID opens a comparison with that card first and the second picked from the catalog (no dead end)', () => {
    const a = card({ test_id: 'A-run' }), b = card({ test_id: 'B-run' });
    catalog([a, b]);
    at('/compare', '?ids=' + a.id);
    const html = renderToStaticMarkup(<Compare />);
    expect(html).toContain('Choose two different');
    expect(html).toContain('A-run');
    expect(html).toContain('B-run');
  });
});

describe('explanations take the form that fits', () => {
  const src = readFileSync('src/pages/Console.tsx', 'utf8');
  /** True when some `{expr}` sits directly inside an <InfoHint …> tag (the nearest opening tag before it). */
  const behindHint = (expr: string) => {
    for (let i = src.indexOf(`{${expr}}`); i >= 0; i = src.indexOf(`{${expr}}`, i + 1))
      if (src.startsWith('<InfoHint', src.lastIndexOf('<', i))) return true;
    return false;
  };

  it('"?" is only for form labels; sections use a legend, a key strip and a footnote', () => {
    expect(src.split('<InfoHint ').length - 1).toBe(1); // the InputHint helper for the five scenario inputs
    expect(readFileSync('src/pages/Library.tsx', 'utf8')).not.toContain('InfoHint');
    expect(src).toContain('?? COPY.mapScope'); // interactive legend; the map caveat is its default caption (rendered: console-evidence test)
    expect(src.split('{COPY.plain.compared}').length - 1).toBe(1); // explained once, not per card
    expect(src).toContain('id="region-footnote"');
  });

  it('disclaimers and states are never hidden', () => {
    for (const e of ['COPY.gapNote', 'COPY.matchOrder', 'COPY.outsideRange', 'COPY.interpretationLimit', 'summary.notConfirmed']) {
      expect(src, e).toContain(`{${e}}`);
      expect(behindHint(e), e).toBe(false);
    }
  });
});
