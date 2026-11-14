import { CardComparison } from '../components/CardComparison';
import { Button, Panel } from '../components/ui';
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
  </main>;
}
