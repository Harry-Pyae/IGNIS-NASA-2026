import { useEffect } from 'react';
import { useCatalogSummary, useVerifiedCatalog, type VerifiedCatalog, type CatalogSummary } from '../lib/catalog';
import { ExportButton } from '../components/CatalogStatus';
import { Button, Panel } from '../components/ui';
import { COPY } from '../lib/copy';
import { evidenceSource } from '../lib/evidenceSource';
import type { Experiment } from '../lib/types';

// A PDF and its NTRS landing page can describe the same paper. Never infer an identifier from a title.
function papers(cards: Experiment[]) {
  const groups = new Set<Experiment[]>();
  const byId = new Map<string, Experiment[]>();
  for (const card of cards) {
    const doi = doiId(card.doi);
    const ids = [JSON.stringify([card.source_title.trim().toLowerCase(), card.source_url.split('#')[0]])];
    if (card.ntrs_id) ids.push('ntrs:'+card.ntrs_id);
    if (doi) ids.push('doi:'+doi.toLowerCase());
    const overlaps = new Set(ids.map(id => byId.get(id)).filter(g => g !== undefined));
    const group = overlaps.values().next().value ?? [];
    for (const other of overlaps) {
      if (other === group) continue;
      group.push(...other);
      groups.delete(other);
      for (const [id,g] of byId) if (g === other) byId.set(id,group);
    }
    group.push(card);
    groups.add(group);
    for (const id of ids) byId.set(id,group);
  }
  return [...groups].sort(([a],[b]) => a!.source_title.localeCompare(b!.source_title));
}
function doiId(value: string | null) {
  const id = value?.trim().replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, '');
  return id && /^10\.\d{4,9}\/\S+$/i.test(id) ? id : null;
}

export function Sources() {
  const { catalog, reload } = useVerifiedCatalog();
  const { summary, retry: refreshSummary } = useCatalogSummary();
  useEffect(() => {
    // The existing stores refresh rows when the lightweight revision check changes.
    const check = () => { if (document.visibilityState === 'visible') refreshSummary(); };
    const timer = window.setInterval(check, 60_000);
    document.addEventListener('visibilitychange',check);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange',check); };
  }, [refreshSummary]);
  return <SourceList catalog={catalog} summary={summary} retry={reload}/>;
}
export function SourceList({catalog, summary, retry}: {catalog: VerifiedCatalog; summary: CatalogSummary; retry: () => void}) {
  const groups = catalog.state === 'ready' ? papers(catalog.experiments.filter(c => c.verified_by != null)) : [];
  const inReview = summary.state === 'ready' && catalog.state === 'empty' && catalog.revision === summary.stats.revision ? summary.stats.in_review : 0;
  return <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
    <p className="console-label text-amber">Sources / verified catalog</p>
    <h1 className="display my-4 text-4xl">Source bibliography</h1>
    <p className="mb-5 max-w-2xl text-lg text-dim">These are the papers and datasets cited by published experiment cards. Counts refer to cards in the current catalog.</p>
    <ExportButton summary={summary} label="Export verified dataset (.json)"/>
    <div className="mt-8">
      {catalog.state === 'loading' ? <p role="status">Loading verified catalog…</p>
        : catalog.state === 'unavailable' ? <Panel><p role="status">The catalog could not be loaded. This is a connection problem, not an empty bibliography.</p><Button size="sm" className="mt-3" onClick={retry}>Retry</Button></Panel>
        : <>
          {catalog.invalid > 0 && <p role="status" className="mb-4 text-warn">Some catalog records could not be validated and are not listed.</p>}
          {!groups.length ? <Panel><p role="status">{inReview ? COPY.inReview(inReview) : 'No verified sources to display yet.'}</p><p className="mt-2 text-dim">Sources appear here when a reviewed card is published.</p></Panel>
            : <ol className="space-y-4">{groups.map(group => {
              const card = group[0]!;
              const links = new Map<string, string>();
              for (const c of group) {
                const src = evidenceSource(c);
                if (src) links.set(src.url, src.pdf ? 'Source PDF' : 'Recorded source');
                if (c.ntrs_id && /^\d+$/.test(c.ntrs_id)) links.set('https://ntrs.nasa.gov/citations/'+c.ntrs_id, 'NTRS '+c.ntrs_id);
                const doi = doiId(c.doi);
                if (doi) links.set('https://doi.org/'+doi.split('/').map(encodeURIComponent).join('/'), 'DOI '+doi);
              }
              return <li key={card.id}><Panel>
                <p className="console-label text-amber">{[...new Set(group.map(c => c.campaign))].sort().join(' · ')}</p>
                <h2 className="my-2 text-xl font-semibold [overflow-wrap:anywhere]">{card.source_title}</h2>
                <p className="text-sm text-dim">{group.length} verified {group.length === 1 ? 'card' : 'cards'}</p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{[...links].map(([url,label]) => <li key={url}><a className="text-amber underline [overflow-wrap:anywhere]" href={url}>{label}</a></li>)}</ul>
              </Panel></li>;
            })}</ol>}
        </>}
    </div>
  </main>;
}
