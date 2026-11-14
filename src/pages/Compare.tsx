import { CardComparison } from '../components/CardComparison';
import { Button, Panel, Select } from '../components/ui';
import { useVerifiedCatalog } from '../lib/catalog';
import { compareSelection } from '../features/compare/compareSelection';

export function Compare() {
  const { catalog, reload } = useVerifiedCatalog();
  const { cards, missing } = compareSelection(window.location.search, catalog.state === 'ready' ? catalog.experiments : []);
  const settled = catalog.state === 'ready' || catalog.state === 'empty';

  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <h1 className="display my-4 text-4xl text-text">Compare experiments</h1>
    <Panel>
      {catalog.state === 'loading' && <p role="status">Loading verified experiments…</p>}
      {catalog.state === 'unavailable' && <div className="flex flex-wrap items-center gap-2">
        <p role="status">The verified catalog is unavailable.</p>
        <Button size="sm" onClick={reload}>Retry</Button>
      </div>}
      {settled && <>
        <form className="mb-5 grid gap-3 sm:grid-cols-2" action="/compare" onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const ids = [data.get('first'), data.get('second')].filter(Boolean).join(',');
          window.location.assign('/compare?ids=' + encodeURIComponent(ids));
        }}>
          {['first', 'second'].map((name, index) => <Select
            key={window.location.search + name}
            name={name}
            label={index === 0 ? 'First experiment' : 'Second experiment'}
            placeholder="Choose an experiment"
            defaultValue={cards[index]?.id ?? ''}
            options={(catalog.state === 'ready' ? catalog.experiments : [])
              .filter((card) => card.verified_by && card.domain === 'solid_flammability')
              .map((card) => ({ value: card.id, label: card.campaign + ' · ' + card.test_id }))}
          />)}
          <Button type="submit">Compare selected experiments</Button>
        </form>
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
    <a className="mt-5 inline-block text-amber underline" href="/library">Browse evidence library</a>
  </main>;
}
