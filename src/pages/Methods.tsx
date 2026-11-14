import { Panel } from '../components/ui';
import { COPY } from '../lib/copy';

const stages = [
  ['Confirm the scenario', 'Free text becomes editable conditions. A material alias resolves to a catalog name, or you choose the material yourself. Unspecified inputs stay blank.'],
  ['Retrieve verified experiments', 'Only cards published by a named reviewer enter the catalog. Domain, material and form gates run before ranking. Oxygen, airflow, thickness and pressure are compared where reported; the match chips explain which conditions contributed.'],
  ['Check each statement', 'The server checks the structure of the proposed Brief, its experiment IDs, and each cited field, value and unit against the retrieved cards. Observed sentences use checked facts; gaps come from the coverage check.'],
  ['Follow the evidence', 'Read the observation or labelled interpretation, select its citation, then open the source at the location recorded on the card. Invalid statements are withheld. If narration fails, the matched evidence remains available.'],
] as const;

const principles = [
  ['Report observations', 'A recorded outcome describes the experiment in which it was observed. It is not a verdict on a new scenario.'],
  ['Check every claim', COPY.claimsGuarantee],
  ['Retrieve before narrating', 'Material resolution, eligibility, ranking and coverage follow fixed rules. The language model parses the scenario and narrates retrieved evidence; it does not choose the matches.'],
  ['Keep scientific domains separate', 'Solid-material matches exclude smoke detection and liquid-droplet combustion. Research context is labelled separately.'],
  ['Show the limits', 'Missing measurements stay missing. Source quotations retain the original units. An uncovered combination and a value outside the current catalog range are different findings.'],
] as const;

export function Methods() {
  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <p className="console-label text-amber">Methods / evidence retrieval</p>
    <h1 className="display my-4 text-4xl text-text">From scenario to source</h1>
    <p className="max-w-2xl text-lg text-dim">Follow a mission question through IGNIS and see where the software checks a statement before you read it.</p>
    <section aria-labelledby="pipeline" className="my-10 grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <Panel>
        <h2 id="pipeline" className="text-xl font-semibold">Evidence pipeline</h2>
        <svg className="mx-auto mt-5 block w-full max-w-xs" viewBox="0 0 260 318" role="img" aria-labelledby="diagram-title diagram-desc">
          <title id="diagram-title">How the mission console builds a Brief</title>
          <desc id="diagram-desc">Confirmed inputs and verified catalog cards feed deterministic retrieval. Retrieved cards and coverage feed claim validation. The console displays checked claims or the evidence-only fallback.</desc>
          <g fill="none" stroke="var(--color-amber)" strokeWidth="2">
            <path d="M64 47v26h66m66-26v26h-66v20m-5-6 5 6 5-6 M130 143v27m-5-6 5 6 5-6 M130 220v27m-5-6 5 6 5-6"/>
          </g>
          {([[4,5,120,42,'Your inputs'],[136,5,120,42,'Verified cards'],[20,95,220,48,'Retrieval + coverage'],[20,172,220,48,'Claim validation'],[20,249,220,48,'Brief + citations']] as const).map(([x,y,w,h,label]) =>
            <g key={label}><rect x={x} y={y} width={w} height={h} rx="8" fill="var(--color-bg)" stroke="var(--color-raised)"/><text x={x+w/2} y={y+h/2+5} textAnchor="middle" fill="var(--color-text)" fontSize="14">{label}</text></g>)}
        </svg>
      </Panel>
      <ol className="space-y-5">{stages.map(([title, body], i) => <li key={title} className="border-l border-raised pl-5">
        <h3 className="font-semibold"><span className="mr-3 font-mono text-amber">0{i+1}</span>{title}</h3><p className="mt-1 text-dim">{body}</p>
      </li>)}</ol>
    </section>
    <h2 className="text-2xl font-semibold">Five principles behind the Brief</h2>
    <dl className="mt-5 divide-y divide-border">{principles.map(([title, body]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]"><dt className="font-semibold">{title}</dt><dd className="text-dim">{body}</dd></div>)}</dl>
    <p className="mt-6 border-l-2 border-raised pl-4 text-dim">{COPY.interpretationLimit}</p>
    <a className="mt-8 inline-block text-amber underline" href="/sources">Browse the source bibliography</a>
  </main>;
}
