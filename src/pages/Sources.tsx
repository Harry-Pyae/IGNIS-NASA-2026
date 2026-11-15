import { useCatalogRevisionWatch, useCatalogSummary, useVerifiedCatalog, type VerifiedCatalog, type CatalogSummary } from '../lib/catalog';
import { ExportButton } from '../components/CatalogStatus';
import { Button, Page, PageHeader, Panel, tapLink, textLink } from '../components/ui';
import { COPY } from '../lib/copy';
import { format, t } from '../i18n';
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
  const { summary } = useCatalogSummary();
  useCatalogRevisionWatch();
  return <SourceList catalog={catalog} summary={summary} retry={reload}/>;
}
export function SourceList({catalog, summary, retry}: {catalog: VerifiedCatalog; summary: CatalogSummary; retry: () => void}) {
  const verified = catalog.state === 'ready' ? catalog.experiments.filter(card => card.verified_by != null) : [];
  const campaigns = [...new Set(verified.map(card => card.campaign))].sort();
  const inReview = summary.state === 'ready' && catalog.state === 'empty' && catalog.revision === summary.stats.revision ? summary.stats.in_review : 0;
  return <Page>
    <PageHeader help="helpSources" eyebrow={t('sourcesEyebrow')} title={t('sourcesTitle')} intro={t('sourcesIntro')} />
    <div className="flex flex-wrap items-center gap-2">
      <ExportButton summary={summary} label={t('sourcesExportJson')}/>
      <ExportButton summary={summary} label={t('sourcesExportCsv')} format="csv"/>
    </div>
    <p className="mt-2 text-sm text-dim">{t('sourcesFormats')}</p>
    <div className="mt-8">
      {catalog.state === 'loading' ? <p role="status">{t('sourcesLoading')}</p>
        : catalog.state === 'unavailable' ? <Panel><p role="status">{t('sourcesUnavailable')}</p><Button size="sm" className="mt-3" onClick={retry}>{t('sourcesRetry')}</Button></Panel>
        : <>
          {catalog.invalid > 0 && <p role="status" className="mb-4 text-warn">{t('sourcesInvalid')}</p>}
          {!campaigns.length ? <Panel><p role="status">{inReview ? COPY.inReview(inReview) : t('sourcesEmpty')}</p><p className="mt-2 text-dim">{t('sourcesEmptyNote')}</p></Panel>
            : <div className="space-y-8">{campaigns.map(campaign => <section key={campaign} aria-label={campaign}>
              <h2 className="mb-3 text-xl font-semibold [overflow-wrap:anywhere]">{campaign}</h2>
              <ol className="space-y-4">{papers(verified.filter(card => card.campaign === campaign)).map(group => {
                const card = group[0]!;
                const links = new Map<string, string>();
                for (const c of group) {
                  const src = evidenceSource(c);
                  if (src) links.set(src.url, src.pdf ? t('sourcesPdf') : t('sourcesRecorded'));
                  if (c.ntrs_id && /^\d+$/.test(c.ntrs_id)) links.set('https://ntrs.nasa.gov/citations/'+c.ntrs_id, 'NTRS '+c.ntrs_id);
                  const doi = doiId(c.doi);
                  if (doi) links.set('https://doi.org/'+doi.split('/').map(encodeURIComponent).join('/'), 'DOI '+doi);
                  const dataset = doiId(c.dataset_doi ?? null);
                  if (dataset) links.set('https://doi.org/'+dataset.split('/').map(encodeURIComponent).join('/'), format('sourcesPsiDoi', { doi: dataset }));
                }
                return <li key={card.id}><Panel>
                  <h3 className="mb-2 text-lg font-semibold [overflow-wrap:anywhere]">{card.source_title}</h3>
                  <p className="text-sm text-dim">{group.length === 1 ? t('sourcesCardsOne') : format('sourcesCardsMany', { n: group.length })}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{[...links].map(([url,label]) => <li key={url}><a className={textLink} href={url} target="_blank" rel="noopener noreferrer">{label}</a></li>)}</ul>
                </Panel></li>;
              })}</ol>
            </section>)}</div>}
        </>}
    </div>
    {/* Project resources stay apart from the verified bibliography above. */}
    <section className="mt-10 border-t border-border pt-6" aria-labelledby="challenge-resources">
      <h2 id="challenge-resources" className="mb-2 text-xl font-semibold">{t('sourcesChallenge')}</h2>
      <a className={`${textLink} ${tapLink}`} href="https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/?tab=resources"
        target="_blank" rel="noopener noreferrer">{t('sourcesChallengeLink')}</a>
    </section>
  </Page>;
}
