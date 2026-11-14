import { CardComparison } from '../components/CardComparison';
import { Button, Page, PageHeader, Panel } from '../components/ui';
import { useVerifiedCatalog } from '../lib/catalog';
import { compareSelection } from '../features/compare/compareSelection';

export function Compare() {
  const { catalog, reload } = useVerifiedCatalog();
  const all = catalog.state === 'ready' ? catalog.experiments : [];
  const { cards, missing } = compareSelection(window.location.search, all);
  // One ID (from a detail page): keep it first and let the visitor pick the second from the verified catalog.
  const others = all.filter((card) => card.verified_by && card.domain === 'solid_flammability' && card.id !== cards[0]?.id);
  const choices = cards.length === 1 && others.length ? [cards[0]!, ...others] : cards;
  const settled = catalog.state === 'ready' || catalog.state === 'empty';

  return <Page>
    <PageHeader eyebrow="Compare / verified catalog" title="Compare experiments" />
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
        {choices.length < 2 && <p>Select two distinct verified solid-material experiments to compare.</p>}
        {choices.length >= 2 && <CardComparison cards={choices} standalone />}
      </>}
    </Panel>
  </Page>;
}
