import { experimentLabel } from '../lib/runLabel';
import { format, t } from '../i18n';
import { useEffect, useState } from 'react';
import { CardComparison } from '../components/CardComparison';
import { Button, Page, PageHeader, Panel, Select } from '../components/ui';
import { useVerifiedCatalog } from '../lib/catalog';
import { compareSelection } from '../features/compare/compareSelection';

export function Compare() {
  const { catalog, reload } = useVerifiedCatalog();
  const all = catalog.state === 'ready' ? catalog.experiments : [];
  const [search, setSearch] = useState(() => window.location.search);
  useEffect(() => {
    const sync = () => setSearch(window.location.search);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  const ids = (new URLSearchParams(search).get('ids') ?? '').split(',').map(id => id.trim());
  const pair = [ids[0] ?? '', ids[1] ?? ''] as const;
  const eligible = all.filter(card => card.verified_by && card.domain === 'solid_flammability');
  const { cards, missing } = compareSelection(new URLSearchParams({ ids: pair.join(',') }).toString(), eligible);
  function select(side: number, id: string) {
    const next = [...pair];
    next[side] = id;
    const url = new URL(window.location.href);
    if (next.some(Boolean)) url.searchParams.set('ids', next.join(','));
    else url.searchParams.delete('ids');
    if (url.search === search) return;
    window.history.pushState(null, '', url);
    setSearch(url.search);
  }
  const settled = catalog.state === 'ready' || catalog.state === 'empty';

  return <Page>
    <PageHeader help="helpCompare" eyebrow={t('compareEyebrow')} title={t('compareTitle')} />
    <Panel>
      {catalog.state === 'loading' && <p role="status">{t('compareLoading')}</p>}
      {catalog.state === 'unavailable' && <div className="flex flex-wrap items-center gap-2">
        <p role="status">{t('compareUnavailable')}</p>
        <Button size="sm" onClick={reload}>{t('retry')}</Button>
      </div>}
      {settled && <>
        <div role="group" aria-label={t('compareChooseTwo')} className="mb-4 grid gap-3 sm:grid-cols-2">
          {pair.map((id, side) => {
            const options = eligible.filter(card => card.id !== pair[1 - side] || card.id === id)
              .map(card => ({ value: card.id, label: experimentLabel(card) }));
            if (id && !options.some(option => option.value === id)) options.unshift({ value: id, label: `${t('compareUnavailableOption')} · ${id}` });
            return <Select key={side} label={`${t('compareExperiment')} ${side + 1}`} placeholder={t('compareChoose')} placeholderDisabled
              value={id} options={options} onChange={event => select(side, event.target.value)} />;
          })}
        </div>
        {missing.length > 0 && <div role="status">
          <p>{t('compareMissing')}</p>
          <ul className="list-inside list-disc break-words">
            {missing.map((id) => <li key={id}>{id}</li>)}
          </ul>
        </div>}
        {cards.length < 2 && <p role="status">{t('compareDistinct')}</p>}
        {/* Screen readers hear which pair is shown after each change (the table itself is not re-read). */}
        <p role="status" className="sr-only">{cards.length >= 2 ? format('compareNow', { a: experimentLabel(cards[0]!), b: experimentLabel(cards[1]!) }) : ''}</p>
        {cards.length >= 2 && <CardComparison cards={cards} standalone />}
      </>}
    </Panel>
  </Page>;
}
