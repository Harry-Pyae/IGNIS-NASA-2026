import { Panel, textLink } from '../../components/ui';
import type { Experiment } from '../../lib/types';

// R1-published sample set recorded in docs/MILESTONES.md. Resolve against the
// current verified catalog so a withdrawn run disappears from the explorer.
const reviewedRuns = ['BASS:GMT96-T7', 'BASS:GMT96-T8', 'BASS-II:GMT45-T4'];

export function SpecimenExplorer({ cards }: { cards: Experiment[] }) {
  const specimens = reviewedRuns.flatMap(run => cards.filter(card =>
    run === `${card.campaign}:${card.test_id.replace(/^(?:BASS-II|BASS)\s+/, '')}`,
  ));
  if (specimens.length === 0) return null;

  return <Panel as="section" aria-labelledby="specimen-explorer" className="mb-5">
    <h2 id="specimen-explorer" className="mb-2 text-lg font-semibold">Specimen Explorer</h2>
    <p className="mb-3 text-sm text-dim">Open a verified fabric run to inspect its reported conditions, quotation, and source locator.</p>
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {specimens.map(card => <li key={card.id}>
        <a className={textLink} href={`/library/${encodeURIComponent(card.id)}?specimen=1`}>{card.test_id}</a>
      </li>)}
    </ul>
  </Panel>;
}
