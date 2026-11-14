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
    <PageHeader eyebrow="Compare / verified catalog" title="Compare experiments" />
    <Panel>
      {catalog.state === 'loading' && <p role="status">Loading verified experimentsâ€¦</p>}
      {catalog.state === 'unavailable' && <div className="flex flex-wrap items-center gap-2">
        <p role="status">The verified catalog is unavailable.</p>
        <Button size="sm" onClick={reload}>Retry</Button>
      </div>}
      {settled && <>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {pair.map((id, side) => {
            const options = eligible.filter(card => card.id !== pair[1 - side] || card.id === id)
              .map(card => ({ value: card.id, label: `${card.campaign} Â· ${card.test_id}` }));
            if (id && !options.some(option => option.value === id)) options.unshift({ value: id, label: `Unavailable Â· ${id}` });
            return <Select key={side} label={`Experiment ${side + 1}`} placeholder="Choose a verified experiment"
              value={id} options={options} onChange={event => select(side, event.target.value)} />;
          })}
        </div>
        {missing.length > 0 && <div role="status">
          <p>These IDs are unavailable for comparison in the current IGNIS catalog.</p>
          <ul className="list-inside list-disc break-words">
            {missing.map((id) => <li key={id}>{id}</li>)}
          </ul>
        </div>}
        {cards.length < 2 && <p>Select two distinct verified solid-material experiments to compare.</p>}
        {cards.length >= 2 && <CardComparison cards={cards} standalone />}
      </>}
    </Panel>
  </Page>;
}
