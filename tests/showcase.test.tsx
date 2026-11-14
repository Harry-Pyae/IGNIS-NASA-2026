import { renderToStaticMarkup as render } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Methods } from '../src/pages/Methods';
import { NotFound } from '../src/pages/NotFound';
import { Sources, SourceList } from '../src/pages/Sources';
import { CardComparison } from '../src/components/CardComparison';
import type { VerifiedCatalog, CatalogSummary } from '../src/lib/catalog';
import { card, t4 } from './helpers';
import * as store from '../src/lib/catalog';

const summary: CatalogSummary = {state:'ready', stats:{verified:0,in_review:3,campaigns:[],last_updated:null,revision:'empty'}};
const sources = (catalog: VerifiedCatalog) => render(<SourceList catalog={catalog} summary={summary} retry={()=>{}}/>);

it('methods and the unknown-route recovery page work without a catalog', () => {
  const html = render(<Methods/>);
  expect(html.match(/<dt\b/g)).toHaveLength(5);
  expect(html).toContain('role="img"');
  expect(html).toContain('Invalid statements are withheld');
  expect(html).toContain('href="/sources"');
  expect(render(<NotFound/>)).toContain('href="/"');
});
it.each(['empty','ready'] as const)('renders every public showcase route with a %s catalog snapshot', state => {
  const catalog: VerifiedCatalog = state === 'ready'
    ? {state,revision:'published',invalid:0,experiments:[card({source_title:'Reviewed source title'})]}
    : {state,revision:'empty',invalid:0};
  vi.spyOn(store,'useVerifiedCatalog').mockReturnValue({catalog,reload:()=>{}});
  vi.spyOn(store,'useCatalogSummary').mockReturnValue({summary,retry:()=>{}});
  try {
    expect(render(<Sources/>)).toContain(state === 'empty' ? 'Catalog in verification' : 'Reviewed source title');
    expect(render(<Methods/>)).toContain('Five principles');
    expect(render(<NotFound/>)).toContain('Page not found');
  } finally { vi.restoreAllMocks(); }
});
it('bibliography distinguishes an empty revision, a failed load, and an unfinished load', () => {
  const empty = sources({state:'empty',invalid:0,revision:'empty'});
  expect(empty).toContain('Catalog in verification — 3 cards in review');
  expect(empty).toContain('Export verified dataset');
  expect(empty).not.toContain('href="https://ntrs');
  expect(sources({state:'loading'})).toContain('Loading verified catalog');
  const failed = sources({state:'unavailable',reason:'error'});
  expect(failed).toContain('Retry');
  expect(failed).not.toContain('3 cards in review');
  expect(sources({state:'empty',invalid:1,revision:'different'})).toContain('could not be validated');
});
it('groups overlapping paper identifiers across campaigns without counting private drafts', () => {
  const a = card(), b = t4({doi:'10.1234/abc', ntrs_id:null, source_url:'https://example.org/paper.pdf'});
  const bridge = card({doi:'https://doi.org/10.1234/abc', ntrs_id:a.ntrs_id});
  const other = card({source_title:'Another source',source_url:'javascript:alert(1)',ntrs_id:null});
  const html = sources({state:'ready',revision:'r1',invalid:0,experiments:[a,b,bridge,other,card({verified_by:null,source_title:'Private draft'})]});
  expect(html.match(/<h2\b/g)).toHaveLength(2);
  expect(html).toContain('3 verified cards');
  expect(html).toContain('BASS · BASS-II');
  expect(html).toContain('href="https://doi.org/10.1234/abc"');
  expect(html).toContain('href="https://ntrs.nasa.gov/citations/20150008962"');
  expect(html).not.toContain('javascript:');
  expect(html).not.toContain('Private draft');
});
it('comparison requires two verified solid matches and retains missing and changing conditions', () => {
  const a = card({o2_pct:null}), b = t4();
  expect(render(<CardComparison cards={[a,card({verified_by:null}),card({domain:'smoke_detection'})]}/>)).toBe('');
  const html = render(<CardComparison cards={[a,b]}/>);
  for (const value of ['Not reported','Entries differ','reduced after ignition','Source','GMT45-T4','GMT96-T7']) expect(html).toContain(value);
});
