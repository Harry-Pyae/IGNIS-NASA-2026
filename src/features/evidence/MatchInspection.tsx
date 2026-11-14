import { gateExperiment } from '../../lib/gates';
import { COPY } from '../../lib/copy';
import { evidenceSource } from '../../lib/evidenceSource';
import { CONTINUOUS_PARAMS, FIELD_UNITS, PARAM_LABELS, type Experiment, type MatchResult, type ResolvedScenario } from '../../lib/types';
import { textLink } from '../../components/ui';

const readable = (value: string | null) => value?.replaceAll('_', ' ') ?? 'Not specified';

export function MatchInspection({ scenario, match }: { scenario: ResolvedScenario; match: MatchResult }) {
  const card = match.experiment;
  const gate = gateExperiment(scenario, card);
  const source = evidenceSource(card);
  const decisive = CONTINUOUS_PARAMS.find(field => match.chips[field] === 'same')
    ?? CONTINUOUS_PARAMS.find(field => match.chips[field] === 'close')
    ?? CONTINUOUS_PARAMS.find(field => scenario[field] != null && card[field] != null);
  return <details className="mt-3 border-t border-border pt-3 text-sm">
    <summary className="cursor-pointer font-semibold">Why did this run appear?</summary>
    <dl className="my-2 space-y-1 text-dim">
      <div><dt className="inline font-medium text-text">Requested: </dt><dd className="inline">{readable(scenario.material.status === 'resolved' ? scenario.material.fuel_material : null)} · {readable(scenario.fuel_form)}</dd></div>
      <div><dt className="inline font-medium text-text">Reported: </dt><dd className="inline">{readable(card.fuel_material)} · {readable(card.fuel_form)}</dd></div>
    </dl>
    <p>{gate.fuel_match === 'class' ? `Shared material class: ${readable(card.material_class)}.` : 'Exact material match.'}</p>
    {decisive && <p>{PARAM_LABELS[decisive]}: {scenario[decisive]} {FIELD_UNITS[decisive]} requested · {card[decisive]} {FIELD_UNITS[decisive]} reported.</p>}
    {CONTINUOUS_PARAMS.map(field => (scenario[field] == null || card[field] == null) &&
      <p key={field} className="text-dim">{PARAM_LABELS[field]}: {scenario[field] == null ? 'not specified in the scenario' : 'specified in the scenario'} · {card[field] == null ? 'not reported in the run' : 'reported in the run'}.</p>)}
    <div className="mt-2 flex flex-wrap gap-3">
      <a className={textLink} href={`/library/${encodeURIComponent(card.id)}`}>Experiment card</a>
      {source && <a className={textLink} href={source.url} target="_blank" rel="noreferrer">Recorded source</a>}
    </div>
  </details>;
}

export function NoMatchInspection({ scenario, cards }: { scenario: ResolvedScenario; cards: Experiment[] }) {
  const exclusions = cards.map(card => ({ card, gate: gateExperiment(scenario, card) }));
  const forms = new Set(exclusions.filter(({ gate }) =>
    gate.reasons.length === 1 && gate.reasons.includes('form_incompatible'),
  ).map(({ card }) => readable(card.fuel_form)));
  const materialCount = exclusions.filter(({ gate }) =>
    !gate.reasons.includes('domain_mismatch') && gate.reasons.includes('material_mismatch'),
  ).length;
  return <details className="mt-3 rounded-xl border border-border p-3 text-sm">
    <summary className="cursor-pointer font-semibold">Why are there no matches?</summary>
    <p className="mt-2">{COPY.absence}</p>
    {scenario.material.status !== 'resolved' && <p>{COPY.materialUnresolved}</p>}
    {forms.size > 0 && <p>Requested form: {readable(scenario.fuel_form)}. Incompatible forms in otherwise eligible records: {[...forms].join(', ')}.</p>}
    {materialCount > 0 && <p>{materialCount} records in this domain have a different material and material class.</p>}
    <a className={textLink} href="/library">Browse the verified catalog</a>
  </details>;
}
