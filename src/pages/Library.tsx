import { useEffect, useState } from 'react';
import { Button, Panel, Select } from '../components/ui';
import { useVerifiedCatalog } from '../lib/catalog';
import { evidenceLocator, evidenceSource } from '../lib/evidenceSource';
import { FIELD_UNITS, PARAM_LABELS, CONTINUOUS_PARAMS, type Experiment } from '../lib/types';
import mediaLedger from '../../docs/media-ledger.md?raw';

const missing = 'not reported';
const categories = [
  ['fuel_material', 'Material'], ['campaign', 'Campaign'],
  ['fuel_form', 'Form'], ['outcome', 'Observed outcome'],
] as const;
const ranges = [
  ['o2_pct', 'o2'], ['flow_cm_s', 'flow'],
] as const;
const readable = (value: string) => value.replaceAll('_', ' ');
const measure = (card: Experiment, field: keyof typeof FIELD_UNITS) =>
  card[field] == null ? missing : `${card[field]} ${FIELD_UNITS[field]}`;
const citationFields = ['source_page', 'source_figure', 'source_table', 'source_section', 'ntrs_id', 'doi'] as const;
const completeness = (card: Experiment) => citationFields.filter(field => card[field] != null).length;
const inputClass = 'w-full rounded-xl border border-border bg-bg/70 px-3 py-2 text-text';
const linkClass = 'text-amber underline [overflow-wrap:anywhere]';

export function Library() {
  const { catalog, reload } = useVerifiedCatalog();
  const [query, setQuery] = useState(() => window.location.search);
  const detail = window.location.pathname.replace(/\/$/, '').slice('/library/'.length);
  useEffect(() => {
    const update = () => setQuery(window.location.search);
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
    window.history.pushState(null, '', next);
    setQuery(next.search);
  }
  const cards = catalog.state === 'ready' ? catalog.experiments : [];
  const settled = catalog.state === 'empty' || catalog.state === 'ready';
  const card = detail ? cards.find(item => item.id === detail) : undefined;

  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <h1 className="display mb-6 text-4xl">{detail ? 'Experiment detail' : 'Evidence Library'}</h1>
    {detail && <a className={linkClass} href={'/library' + query}>Back to library</a>}
    <div className="mt-5">
      {catalog.state === 'loading' && <p role="status">Loading verified catalog…</p>}
      {catalog.state === 'unavailable' && <Panel>
        <p role="status">The verified catalog is unavailable.</p>
        <Button className="mt-3" onClick={reload}>Retry</Button>
      </Panel>}
      {settled && catalog.invalid > 0 && <p role="status" className="mb-4 text-warn">Some catalog records could not be validated and are omitted.</p>}
      {settled && (detail
        ? card ? <ExperimentDetail card={card} /> : <Panel>Not in the current IGNIS catalog</Panel>
        : <LibraryResults cards={cards} params={params} update={update} />)}
    </div>
  </main>;
}

function LibraryResults({ cards, params, update }: {
  cards: Experiment[];
  params: URLSearchParams;
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
        <span className="console-label text-dim">Search experiments</span>
        <input type="search" className={inputClass} value={params.get('q') ?? ''}
          onChange={event => update({ q: event.target.value })} />
      </label>
      {categories.map(([key, label]) => {
        const value = params.get(key) ?? '';
        const options = [...new Set([...cards.map(card => card[key]), ...(value ? [value] : [])])].sort();
        return <Select key={key} label={label} placeholder="All" value={value}
          options={options.map(item => ({ value: item, label: readable(item) }))}
          onChange={event => update({ [key]: event.target.value })} />;
      })}
      {ranges.map(([field, key]) => <fieldset key={key} className="min-w-0">
        <legend className="console-label mb-1.5 text-dim">{PARAM_LABELS[field]} ({FIELD_UNITS[field]})</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['min', 'max'] as const).map(bound => <label key={bound} className="text-sm text-dim">
            {bound === 'min' ? 'Minimum' : 'Maximum'}
            <input className={inputClass} type="number" step="any" value={params.get(key + '_' + bound) ?? ''}
              onChange={event => update({ [key + '_' + bound]: event.target.value })} />
          </label>)}
        </div>
      </fieldset>)}
    </form>
    <p className="my-5 text-sm text-dim" role="status">
      {results.length} results · {cards.length} verified {cards.length === 1 ? 'card' : 'cards'} so far
    </p>
    {invalidRange ? <Panel>Enter valid ranges with the minimum at or below the maximum.</Panel>
      : !results.length ? <Panel>{cards.length ? 'No verified cards match these filters.' : 'Verified experiments appear here as they are published.'}</Panel>
      : <>
        <p className="mb-3 text-sm text-dim">Sorted by citation completeness</p>
        <ul className="grid gap-4 sm:grid-cols-2">{results.map(card => <li key={card.id}>
          <Panel>
            <p className="console-label text-amber">{card.campaign}</p>
            <h2 className="my-2 text-lg font-semibold">
              <a className={linkClass} href={`/library/${card.id}${params.size ? '?' + params : ''}`}>{card.test_id}</a>
            </h2>
            <p>{readable(card.fuel_material)} · {readable(card.fuel_form)} · {readable(card.outcome)}</p>
            <p className="mt-2 text-sm text-dim">Oxygen {measure(card, 'o2_pct')} · Airflow {measure(card, 'flow_cm_s')}</p>
          </Panel>
        </li>)}</ul>
      </>}
  </>;
}

function ExperimentDetail({ card }: { card: Experiment }) {
  const [copyStatus, setCopyStatus] = useState('');
  const source = evidenceSource(card);
  const locator = evidenceLocator(card);
  const doi = card.doi?.replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, '');
  const media = card.media_url && /^https?:\/\//i.test(card.media_url) &&
    mediaLedger.split(/\r?\n/).some(line => {
      const columns = line.split('|').slice(1, -1).map(column => column.trim());
      return columns[6]?.toLowerCase() === 'yes' &&
        columns[0]?.split(/[\s()<>`]+/).includes(card.media_url!);
    }) ? card.media_url : null;
  const citation = [card.source_title, `${card.campaign} / ${card.test_id}`, locator, source?.url,
    card.ntrs_id && 'NTRS ' + card.ntrs_id, doi && 'DOI ' + doi].filter(Boolean).join(' · ');
  const fields = [
    ['Domain', readable(card.domain)], ['Material', readable(card.fuel_material)],
    ['Material class', readable(card.material_class)], ['Form', readable(card.fuel_form)],
    ...CONTINUOUS_PARAMS.map(field => [PARAM_LABELS[field], measure(card, field)] as const),
    ['Ignition method', card.ignition_method ?? missing],
    ['Observed outcome', readable(card.outcome)], ['Spread rate', measure(card, 'spread_rate_mm_s')],
  ];

  return <div className="space-y-5">
    <Panel>
      <p className="console-label text-amber">{card.campaign}</p>
      <h2 className="my-2 text-2xl font-semibold">{card.test_id}</h2>
      <p className="text-sm text-dim">Verified by {card.verified_by} · {card.verified_at?.slice(0, 10) ?? missing}</p>
      <table className="mt-4 w-full table-fixed text-left text-sm [overflow-wrap:anywhere]">
        <caption className="mb-2 text-left font-semibold">Reported conditions and observations</caption>
        <tbody>{fields.map(([label, value]) => <tr className="border-t border-border" key={label}>
          <th scope="row" className="w-2/5 py-2 pr-3 font-medium">{label}</th><td className="py-2">{value}</td>
        </tr>)}</tbody>
      </table>
      {card.condition_changes?.map((change, index) => <p key={index} className="mt-3 text-sm text-warn">
        {PARAM_LABELS[change.parameter]} changed from {change.from} to {change.to} {FIELD_UNITS[change.parameter]}.
        {' '}Stored value is {readable(change.stored)}. {change.note}
      </p>)}
    </Panel>
    <Panel>
      <h2 className="text-lg font-semibold">Verbatim source observation</h2>
      <blockquote className="my-3 whitespace-pre-wrap border-l-2 border-border pl-4">{card.key_observation_quote}</blockquote>
      <p className="mb-3 text-sm text-dim">The table uses normalized units. The source quote preserves units as reported.</p>
      <p>{source ? <a className={linkClass} href={source.url}>{card.source_title}</a> : card.source_title}</p>
      <p className="text-sm text-dim">Locator · {locator || missing}</p>
      {card.ntrs_id && <p>{/^\d+$/.test(card.ntrs_id)
        ? <a className={linkClass} href={'https://ntrs.nasa.gov/citations/' + card.ntrs_id}>NTRS {card.ntrs_id}</a>
        : 'NTRS ' + card.ntrs_id}</p>}
      {doi && <p>{/^10\.\d{4,9}\/\S+$/.test(doi)
        ? <a className={linkClass} href={'https://doi.org/' + doi.split('/').map(encodeURIComponent).join('/')}>DOI {doi}</a>
        : 'DOI ' + doi}</p>}
      <Button className="mt-4" onClick={async () => {
        try {
          await navigator.clipboard.writeText(citation);
          setCopyStatus('Citation copied.');
        } catch {
          setCopyStatus(citation);
        }
      }}>Cite this</Button>
      <p role="status" className="mt-2 break-words text-sm">{copyStatus}</p>
    </Panel>
    {media && <figure>
      <img src={media} alt={card.campaign + ' campaign still'} className="max-h-96 rounded-xl object-contain" />
      <figcaption className="text-sm text-dim">Campaign context</figcaption>
    </figure>}
    <a className={linkClass} href={'/compare?ids=' + encodeURIComponent(card.id)}>Compare</a>
  </div>;
}
