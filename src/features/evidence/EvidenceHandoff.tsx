import { experimentLabel } from '../../lib/runLabel';
import { COPY } from '../../lib/copy';
import { evidenceLocator, evidenceSource } from '../../lib/evidenceSource';
import { CONTINUOUS_PARAMS, FIELD_UNITS, PARAM_LABELS, type Briefing, type MatchResult, type ResolvedScenario } from '../../lib/types';
import { format, t } from '../../i18n';

export function EvidenceHandoff({ scenario, revision, matches, briefing, status }: {
  scenario: ResolvedScenario;
  revision: string;
  matches: MatchResult[];
  briefing: Briefing | null;
  status: 'idle' | 'waiting' | 'loading' | 'ready' | 'fallback';
}) {
  return <section className="brief-print-only" aria-label={t('handoffRegion')}>
    <h3>{t('handoffTitle')}</h3>
    <p>{format('handoffRevision', { revision })}</p>
    <p>{t('handoffScenario')}: {scenario.material.status === 'resolved' ? scenario.material.fuel_material.replaceAll('_', ' ') : COPY.materialUnresolved}
      {' · '}{scenario.fuel_form?.replaceAll('_', ' ') ?? t('handoffFormUnset')}</p>
    <ul>{CONTINUOUS_PARAMS.map(field => <li key={field}>{PARAM_LABELS[field]}: {
      scenario[field] == null ? t('handoffUnset') : `${scenario[field]} ${FIELD_UNITS[field]}`
    }</li>)}</ul>
    <p>{matches.length === 0 ? COPY.absence : status === 'fallback' || briefing?.status === 'fallback'
      ? COPY.fallback : t(briefing ? 'handoffNarrated' : 'handoffPending')}</p>
    {!!briefing?.withheld_count && <p>{COPY.withheld(briefing.withheld_count)}</p>}
    <p>{COPY.mapScope}</p>
    {matches.length > 0 && <ol aria-label={t('handoffRuns')}>{matches.map(({ experiment }, index) => {
      const source = evidenceSource(experiment);
      return <li key={experiment.id} className="mt-2">
        <p>{index + 1}. {experimentLabel(experiment)} · {t('handoffRecordId')}: {experiment.id}</p>
        <p>{experiment.source_title} · {evidenceLocator(experiment) || t('handoffLocatorUnset')}</p>
        {experiment.condition_changes?.map((change, i) => <p key={i}>{COPY.changingConditions}: {change.note}</p>)}
        {source && <p>{source.url}</p>}
      </li>;
    })}</ol>}
  </section>;
}
