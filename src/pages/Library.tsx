import { format, t } from '../i18n';
import { useEffect, useRef, useState } from 'react';
import { Button, buttonClass, Page, PageHeader, Panel, Select, textLink } from '../components/ui';
import { useVerifiedCatalog } from '../lib/catalog';
import { datasetCitation, evidenceLocator, evidenceSource } from '../lib/evidenceSource';
import { COPY } from '../lib/copy';
import { FIELD_UNITS, CONTINUOUS_PARAMS, type Experiment } from '../lib/types';

const missing = t('libraryNotReported');
const categories = [
  ['fuel_material', t('material')], ['campaign', t('campaign')],
  ['fuel_form', t('form')], ['outcome', t('libraryOutcome')],
] as const;
const parameterLabels = {
  o2_pct: 'libraryOxygen', flow_cm_s: 'libraryAirflow', thickness_mm: 'libraryThickness', pressure_kpa: 'libraryPressure',
} as const;
const ranges = [
  ['o2_pct', 'o2'], ['flow_cm_s', 'flow'],
] as const;
const readable = (value: string) => value.replaceAll('_', ' ');
const measure = (card: Experiment, field: keyof typeof FIELD_UNITS) =>
  card[field] == null ? missing : `${card[field]} ${FIELD_UNITS[field]}`;
const citationFields = ['source_page', 'source_figure', 'source_table', 'source_section', 'ntrs_id', 'doi'] as const;
const completeness = (card: Experiment) => citationFields.filter(field => card[field] != null).length;
const inputClass = 'w-full rounded-xl border border-border bg-bg/70 px-3 py-2 text-text';
const linkClass = textLink + ' focus-visible:outline-2 focus-visible:outline-amber';
/** External sources open in a new tab everywhere in IGNIS. */
const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function Library() {
  const { catalog, reload } = useVerifiedCatalog();
  const [query, setQuery] = useState(() => window.location.search);
  const typing = useRef(false);
  const detail = window.location.pathname.replace(/\/$/, '').slice('/library/'.length);
  useEffect(() => {
    const update = () => { typing.current = false; setQuery(window.location.search); };
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  const params = new URLSearchParams(query);
  function update(fields: Record<string, string>) {
    const next = new URL(window.location.href);
    for (const [key, value] of Object.entries(fields)) {
      if (value.trim()) next.searchParams.set(key, value);
      else next.searchParams.delete(key);
    }
    if (next.search === window.location.search) return;
    const searchEdit = Object.keys(fields).length === 1 && 'q' in fields;
    if (searchEdit && typing.current) window.history.replaceState(null, '', next);
    else window.history.pushState(null, '', next);
    typing.current = searchEdit;
    setQuery(next.search);
  }
  const cards = catalog.state === 'ready' ? catalog.experiments : [];
  const settled = catalog.state === 'empty' || catalog.state === 'ready';
  const card = detail ? cards.find(item => item.id === detail) : undefined;

  return <Page>
    <PageHeader help={detail ? 'helpDetail' : 'helpLibrary'} eyebrow={t('libraryEyebrow')} title={detail ? t('libraryDetail') : t('libraryTitle')} />
    {detail && <a className={linkClass} href={'/library' + query}>{t('libraryBack')}</a>}
    <div className="mt-5">
      {catalog.state === 'loading' && <p role="status">{t('libraryLoading')}</p>}
      {catalog.state === 'unavailable' && <Panel>
        <p role="status">{t('libraryUnavailable')}</p>
        <Button className="mt-3" onClick={reload}>{t('retry')}</Button>
      </Panel>}
      {settled && catalog.invalid > 0 && <p role="status" className="mb-4 text-warn">{t('libraryInvalid')}</p>}
      {settled && (detail
        ? card ? <ExperimentDetail card={card} /> : <Panel>{t('libraryUnknown')}</Panel>
        : <LibraryResults cards={cards} params={params} update={update} endSearch={() => { typing.current = false; }} />)}
    </div>
  </Page>;
}

function LibraryResults({ cards, params, update, endSearch }: {
  cards: Experiment[];
  params: URLSearchParams;
  endSearch: () => void;
  update: (fields: Record<string, string>) => void;
}) {
  const search = (params.get('q') ?? '').trim().toLowerCase();
  const bounds = ranges.map(([field, key]) => ({
    field,
    min: params.get(key + '_min'),
    max: params.get(key + '_max'),
  }));
  const invalidRange = bounds.some(({ min, max }) =>
    [min, max].some(value => value && !Number.isFinite(Number(value))) ||
    (min && max && Number(min) > Number(max)));
  const results = invalidRange ? [] : cards.filter(card =>
    categories.every(([key]) => !params.get(key) || card[key] === params.get(key)) &&
    bounds.every(({ field, min, max }) => {
      const value = card[field];
      return (!min && !max) || (value != null &&
        (!min || value >= Number(min)) && (!max || value <= Number(max)));
    }) &&
    [card.campaign, card.test_id, readable(card.fuel_material), card.source_title, card.observation_summary]
      .join(' ').toLowerCase().includes(search),
  ).sort((a, b) => completeness(b) - completeness(a) || a.id.localeCompare(b.id));

  return <>
    <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={event => event.preventDefault()}>
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="console-label text-dim">{t('librarySearch')}</span>
        <input type="search" aria-label={t('librarySearch')} onBlur={endSearch} className={inputClass} value={params.get('q') ?? ''}
          onChange={event => update({ q: event.target.value })} />
      </label>
      {categories.map(([key, label]) => {
        const value = params.get(key) ?? '';
        const options = [...new Set([...cards.map(card => card[key]), ...(value ? [value] : [])])].sort();
        return <Select key={key} label={label} placeholder={t('libraryAll')} value={value}
          options={options.map(item => ({ value: item, label: readable(item) }))}
          onChange={event => update({ [key]: event.target.value })} />;
      })}
      {ranges.map(([field, key]) => <fieldset key={key} className="min-w-0">
        <legend className="console-label mb-1.5 text-dim">{t(parameterLabels[field])} ({FIELD_UNITS[field]})</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['min', 'max'] as const).map(bound => <label key={bound} className="text-sm text-dim">
            {bound === 'min' ? t('libraryMinimum') : t('libraryMaximum')}
            <input className={inputClass} type="number" step="any" value={params.get(key + '_' + bound) ?? ''}
              onChange={event => update({ [key + '_' + bound]: event.target.value })} />
          </label>)}
        </div>
      </fieldset>)}
    </form>
    <p className="my-5 text-sm text-dim" role="status">
      {format('libraryResultCount', { results: results.length, cards: cards.length, cardLabel: t(cards.length === 1 ? 'libraryCard' : 'libraryCards') })}
    </p>
    {invalidRange ? <Panel>{t('libraryInvalidRange')}</Panel>
      : !results.length ? <Panel>{cards.length ? t('libraryNoMatches') : t('libraryEmpty')}</Panel>
      : <>
        <p className="mb-3 text-sm text-dim">{t('librarySorted')}</p>
        <ul className="grid gap-4 sm:grid-cols-2">{results.map(card => <li key={card.id}>
          <Panel>
            <p className="console-label text-amber">{card.campaign}</p>
            <h2 className="my-2 text-lg font-semibold">
              <a className={linkClass} href={`/library/${card.id}${params.size ? '?' + params : ''}`}>{card.test_id}</a>
            </h2>
            <p>{readable(card.fuel_material)} · {readable(card.fuel_form)} · {readable(card.outcome)}</p>
            <p className="mt-2 text-sm text-dim">{t('libraryOxygen')} {measure(card, 'o2_pct')} · {t('libraryAirflow')} {measure(card, 'flow_cm_s')}</p>
          </Panel>
        </li>)}</ul>
      </>}
  </>;
}

function ExperimentDetail({ card }: { card: Experiment }) {
  const [copyStatus, setCopyStatus] = useState('');
  const source = evidenceSource(card);
  const locator = evidenceLocator(card);
  const dataset = datasetCitation(card);
  const doi = card.doi?.replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, '');
  const citation = [card.source_title, `${card.campaign} / ${card.test_id}`, locator, source?.url, dataset,
    card.ntrs_id && 'NTRS ' + card.ntrs_id, doi && 'DOI ' + doi].filter(Boolean).join(' · ');
  const fields = [
    [t('libraryDomain'), readable(card.domain)], [t('material'), readable(card.fuel_material)],
    [t('libraryClass'), readable(card.material_class)], [t('form'), readable(card.fuel_form)],
    ...CONTINUOUS_PARAMS.map(field => [t(parameterLabels[field]), measure(card, field)] as const),
    [t('libraryIgnition'), card.ignition_method ?? missing],
    [t('libraryOutcome'), readable(card.outcome)], [t('librarySpread'), measure(card, 'spread_rate_mm_s')],
  ];

  return <div className="space-y-5">
    <Panel>
      {card.media_url && <figure className="mb-4">
        <img src={card.media_url} alt={`${COPY.campaignContext}: ${card.campaign} ${card.test_id}`}
          loading="lazy" className="max-h-96 max-w-full rounded-xl object-contain" />
        <figcaption className="text-sm text-dim">{COPY.campaignContext}</figcaption>
      </figure>}
      <p className="console-label text-amber">{card.campaign}</p>
      <h2 className="my-2 text-2xl font-semibold">{card.test_id}</h2>
      <p className="text-sm text-dim">{t('libraryVerifiedBy')} {card.verified_by} · {card.verified_at?.slice(0, 10) ?? missing}</p>
      <table className="mt-4 w-full table-fixed text-left text-sm [overflow-wrap:anywhere]">
        <caption className="mb-2 text-left font-semibold">{t('libraryConditions')} <span className="console-label ml-2 font-normal text-dim">{COPY.plain.units.normalized}</span></caption>
        <tbody>{fields.map(([label, value]) => <tr className="border-t border-border" key={label}>
          <th scope="row" className="w-2/5 py-2 pr-3 font-medium">{label}</th><td className="py-2">{value}</td>
        </tr>)}</tbody>
      </table>
      {card.condition_changes?.map((change, index) => <p key={index} className="mt-3 text-sm text-warn">
        {format('libraryConditionChange', {
          field: t(parameterLabels[change.parameter]), from: change.from, to: change.to,
          unit: FIELD_UNITS[change.parameter], stored: readable(change.stored),
        })} {change.note}
      </p>)}
    </Panel>
    <Panel>
      <h2 className="flex flex-wrap items-baseline gap-x-3 text-lg font-semibold">{t('librarySourceQuote')}
        <span className="console-label font-normal text-dim">{COPY.plain.units.asReported}</span>
      </h2>
      <blockquote className="my-3 whitespace-pre-wrap border-l-2 border-border pl-4">{card.key_observation_quote}</blockquote>
      <p>{source ? <a className={linkClass} href={source.url} {...external}>{card.source_title}</a> : card.source_title}</p>
      <p className="text-sm text-dim">{t('libraryLocator')} · {locator || missing}</p>
      {card.ntrs_id && <p>{/^\d+$/.test(card.ntrs_id)
        ? <a className={linkClass} href={'https://ntrs.nasa.gov/citations/' + card.ntrs_id} {...external}>NTRS {card.ntrs_id}</a>
        : 'NTRS ' + card.ntrs_id}</p>}
      {doi && <p>{/^10\.\d{4,9}\/\S+$/.test(doi)
        ? <a className={linkClass} href={'https://doi.org/' + doi.split('/').map(encodeURIComponent).join('/')} {...external}>DOI {doi}</a>
        : 'DOI ' + doi}</p>}
      {dataset && <p className="break-words text-sm text-dim [overflow-wrap:anywhere]">{dataset}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-3">
      <Button onClick={async () => {
        try {
          await navigator.clipboard.writeText(citation);
          setCopyStatus(t('libraryCopied'));
        } catch {
          setCopyStatus(citation);
        }
      }}>{t('libraryCite')}</Button>
      <a className={buttonClass('secondary', 'md')} href={'/compare?ids=' + encodeURIComponent(card.id)}>{t('libraryCompare')}</a>
      </div>
      <p role="status" className="mt-2 break-words text-sm">{copyStatus}</p>
    </Panel>
  </div>;
}
