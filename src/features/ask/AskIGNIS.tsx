import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { resolveMaterial, pickMaterial, materialLabel } from '../../engine/aliases';
import { Button, CitationChip, Icon, Panel } from '../../components/ui';
import { COPY } from '../../lib/copy';
import { ParseScenarioResponseSchema, type Briefing, type Experiment, type MatchResult, type ParsedScenario, type ResolvedMaterial } from '../../lib/types';
import { t } from '../../i18n';
import { classifyAskIntent, explicitScenarioPatch, SCENARIO_PATCH_FIELDS, type ScenarioPatch } from './scenarioPatch';

type Retrieval = 'idle' | 'loading' | 'unavailable' | 'settled';
type BriefStatus = 'idle' | 'waiting' | 'loading' | 'ready' | 'fallback';
type Destination = 'scenario' | 'map' | 'methods';

interface Proposal {
  patch: ScenarioPatch;
  base: ParsedScenario;
  revision: number;
}

interface AskIGNISProps {
  scenario: ParsedScenario;
  currentMaterial: ResolvedMaterial;
  scenarioRevision: number;
  confirmed: boolean;
  retrieval: Retrieval;
  matches: MatchResult[];
  briefing: Briefing | null;
  briefingStatus: BriefStatus;
  materials: Pick<Experiment, 'domain' | 'fuel_material' | 'material_class'>[];
  onApply: (patch: ScenarioPatch, materialChoice: string | null) => void;
  onCitation: (experimentId: string) => void;
  onNavigate: (destination: Destination) => void;
}

const EXAMPLES = [
  { text: t('askScenarioExample'), kind: 'scenario' as const },
  { text: t('askEvidenceExample'), kind: 'evidence' as const },
  { text: t('askViewExample'), kind: 'view' as const },
];

const FIELD_LABELS: Record<(typeof SCENARIO_PATCH_FIELDS)[number], string> = {
  fuel_material_raw: t('askFieldMaterial'),
  fuel_form: t('askFieldForm'),
  thickness_mm: t('askFieldThickness'),
  o2_pct: t('askFieldOxygen'),
  flow_cm_s: t('askFieldAirflow'),
  pressure_kpa: t('askFieldPressure'),
};

function valueLabel(field: (typeof SCENARIO_PATCH_FIELDS)[number], value: unknown, material?: ResolvedMaterial): string {
  if (value == null || value === '') return t('askNotSpecified');
  if (field === 'fuel_material_raw') {
    if (material?.status === 'resolved') return materialLabel(material.fuel_material);
    return String(value);
  }
  if (field === 'fuel_form') return String(value).replace(/_/g, ' ');
  if (field === 'o2_pct') return `${value}% O₂`;
  if (field === 'flow_cm_s') return `${value} cm/s`;
  if (field === 'thickness_mm') return `${value} mm`;
  return `${value} kPa`;
}

function proposalMaterial(raw: string | null, selected: string, materials: AskIGNISProps['materials']): ResolvedMaterial {
  if (selected && raw) return pickMaterial(raw, selected, materials);
  return resolveMaterial(raw, materials);
}

export function AskIGNIS({
  scenario,
  currentMaterial,
  scenarioRevision,
  confirmed,
  retrieval,
  matches,
  briefing,
  briefingStatus,
  materials,
  onApply,
  onCitation,
  onNavigate,
}: AskIGNISProps) {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState('');
  const [busyRevision, setBusyRevision] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [materialSelection, setMaterialSelection] = useState('');
  const [evidenceRevision, setEvidenceRevision] = useState<number | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const currentRevision = useRef(scenarioRevision);
  const requestSequence = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const priorRevision = useRef(scenarioRevision);

  useEffect(() => {
    currentRevision.current = scenarioRevision;
    if (priorRevision.current === scenarioRevision) return;
    priorRevision.current = scenarioRevision;
    requestSequence.current += 1;
    controller.current?.abort();
    controller.current = null;
  }, [scenarioRevision]);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => () => controller.current?.abort(), []);

  function cancelRequest() {
    requestSequence.current += 1;
    controller.current?.abort();
    controller.current = null;
    setBusyRevision(null);
  }

  function close(returnFocus: boolean) {
    cancelRequest();
    setOpen(false);
    if (returnFocus) requestAnimationFrame(() => document.getElementById('ask-ignis-trigger')?.focus());
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    }
  }

  async function runRequest(text: string) {
    const intent = classifyAskIntent(text);
    setRequest(text);
    setProposal(null);
    setMaterialSelection('');
    setEvidenceRevision(null);
    setAnnouncement('');
    cancelRequest();

    if (intent.kind === 'view') {
      close(false);
      onNavigate(intent.destination);
      return;
    }
    if (intent.kind === 'unknown-view') {
      setAnnouncement(t('askUnknownView'));
      return;
    }
    if (intent.kind === 'unsupported') {
      setAnnouncement(t('askSupportedOptions'));
      return;
    }
    if (intent.kind === 'evidence') {
      setEvidenceRevision(scenarioRevision);
      return;
    }

    const sequence = requestSequence.current + 1;
    requestSequence.current = sequence;
    const startRevision = scenarioRevision;
    const abort = new AbortController();
    controller.current = abort;
    setBusyRevision(startRevision);
    setAnnouncement(t('askParsing'));
    try {
      const response = await fetch('/api/parse-scenario', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: abort.signal,
      });
      if (!response.ok) throw new Error('parse-unavailable');
      const result = ParseScenarioResponseSchema.safeParse(await response.json());
      if (!result.success) throw new Error('parse-invalid');
      if (requestSequence.current !== sequence || currentRevision.current !== startRevision) return;

      const patch = explicitScenarioPatch(result.data.scenario, text);
      if (Object.keys(patch).length === 0) {
        setAnnouncement(t('askNoEdits'));
        return;
      }
      setProposal({ patch, base: scenario, revision: startRevision });
      setAnnouncement(t('askReviewProposal'));
    } catch (error) {
      if (requestSequence.current !== sequence || abort.signal.aborted || currentRevision.current !== startRevision) return;
      setAnnouncement(error instanceof Error && error.message === 'parse-invalid' ? t('askInvalidParse') : t('askParseUnavailable'));
    } finally {
      if (requestSequence.current === sequence) {
        setBusyRevision(null);
        controller.current = null;
      }
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.trim()) void runRequest(request.trim());
  }

  const activeProposal = proposal?.revision === scenarioRevision ? proposal : null;
  const busy = busyRevision === scenarioRevision;
  const showEvidence = evidenceRevision === scenarioRevision;
  const hasStaleWork = Boolean((proposal && !activeProposal) || (busyRevision != null && !busy));
  const visibleAnnouncement = hasStaleWork ? t('askProposalExpired') : announcement;
  const proposedMaterial = activeProposal && 'fuel_material_raw' in activeProposal.patch
    ? proposalMaterial(activeProposal.patch.fuel_material_raw ?? null, materialSelection, materials)
    : currentMaterial;
  const materialNeedsSelection = Boolean(
    activeProposal && 'fuel_material_raw' in activeProposal.patch && activeProposal.patch.fuel_material_raw != null && proposedMaterial.status !== 'resolved',
  );
  const canApply = Boolean(activeProposal && !materialNeedsSelection);

  function applyProposal() {
    if (!proposal || !canApply || proposal.revision !== currentRevision.current) return;
    onApply(proposal.patch, 'fuel_material_raw' in proposal.patch ? materialSelection || null : null);
    setProposal(null);
    setMaterialSelection('');
    setAnnouncement(t('askProposalApplied'));
  }

  function evidenceView() {
    if (!confirmed) return <p role="status" className="rounded-lg border border-border bg-bg/45 p-3 text-sm text-dim">{t('askNeedConfirmed')}</p>;
    if (retrieval === 'loading' || retrieval === 'idle') return <p role="status" className="rounded-lg border border-border bg-bg/45 p-3 text-sm text-dim">{t('askCatalogLoading')}</p>;
    if (retrieval === 'unavailable') return <p role="status" className="rounded-lg border border-warn/35 bg-warn/[0.05] p-3 text-sm text-dim">{t('askCatalogUnavailable')}</p>;
    if (matches.length === 0) return <p role="status" className="rounded-lg border border-border bg-bg/45 p-3 text-sm text-text">{COPY.absence}</p>;
    if (briefing) return <ValidatedEvidence briefing={briefing} matches={matches} onCitation={onCitation} />;
    if (briefingStatus === 'fallback') return <p role="status" className="rounded-lg border border-warn/35 bg-warn/[0.05] p-3 text-sm text-dim">{t('askBriefUnavailable')}</p>;
    return <p role="status" className="rounded-lg border border-border bg-bg/45 p-3 text-sm text-dim">{t('askBriefLoading')}</p>;
  }

  return (
    <div className="min-w-0" onKeyDown={onPanelKeyDown}>
      <Button
        id="ask-ignis-trigger"
        variant="secondary"
        size="sm"
        icon="evidence"
        aria-expanded={open}
        aria-controls="ask-ignis-panel"
        aria-label={t('askIgnis')}
        onClick={() => setOpen((value) => !value)}
      >{t('askIgnis')}</Button>
      <Panel id="ask-ignis-panel" as="section" aria-label={t('askIgnisPanel')} hidden={!open} className="mt-4 !p-4 sm:!p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="console-label text-amber">{t('askIgnisPanel')}</h3>
            <p className="mt-1 text-sm leading-relaxed text-dim">{t('askSupportedOptions')}</p>
          </div>
          <Button variant="tertiary" icon="close" aria-label={t('askClose')} onClick={() => close(true)} />
        </div>
        <form onSubmit={submit} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="sr-only" htmlFor="ask-ignis-request">{t('askIgnisPanel')}</label>
          <textarea
            ref={input}
            id="ask-ignis-request"
            value={request}
            onChange={(event) => {
              if (busy) cancelRequest();
              setRequest(event.target.value);
            }}
            maxLength={2000}
            rows={2}
            placeholder={t('askPlaceholder')}
            className="min-h-11 w-full resize-y rounded-xl border border-border bg-bg/70 px-3 py-2.5 text-sm text-text placeholder:text-faint focus:border-amber"
          />
          <Button type="submit" variant="primary" size="md" disabled={busy || !request.trim()} className="self-start">{t('askSubmit')}</Button>
        </form>
        <div className="mt-3">
          <p className="console-label mb-2 text-dim">{t('askExamples')}</p>
          <div className="grid min-w-0 gap-2">
            {EXAMPLES.map((example) => (
              <Button key={example.kind} variant="secondary" size="sm" className="h-auto min-h-11 w-full min-w-0 whitespace-normal text-left leading-snug" onClick={() => void runRequest(example.text)}>
                {example.text}
              </Button>
            ))}
          </div>
        </div>
        {visibleAnnouncement && <p role="status" aria-live="polite" className="mt-3 rounded-lg border border-border bg-bg/45 p-3 text-sm text-dim">{visibleAnnouncement}</p>}
        {activeProposal && <div className="mt-3 rounded-xl border border-amber/35 bg-bg/55 p-3">
          <h4 className="console-label text-amber">{t('askReviewProposal')}</h4>
          <dl className="mt-3 grid gap-2">
            {SCENARIO_PATCH_FIELDS.filter((field) => field in activeProposal.patch).map((field) => {
              const oldValue = activeProposal.base[field];
              const newValue = activeProposal.patch[field];
              return <div key={field} className="grid gap-x-3 gap-y-1 border-t border-border/70 pt-2 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <dt className="console-label text-dim">{FIELD_LABELS[field]}</dt>
                <dd className="min-w-0 text-sm text-text">
                  <span className="sr-only">{t('askOldValue')}: </span>{valueLabel(field, oldValue, currentMaterial)}
                  <span aria-hidden="true" className="mx-2 text-amber">→</span>
                  <span className="sr-only">{t('askNewValue')}: </span>{valueLabel(field, newValue, field === 'fuel_material_raw' ? proposedMaterial : undefined)}
                </dd>
              </div>;
            })}
          </dl>
          {materialNeedsSelection && <div className="mt-3 grid gap-2">
            <label htmlFor="ask-ignis-material" className="text-sm text-dim">{t('askChooseMaterial')}</label>
            {proposedMaterial.status === 'unresolved' && proposedMaterial.candidates.length > 0
              ? <select id="ask-ignis-material" value={materialSelection} onChange={(event) => setMaterialSelection(event.target.value)} className="h-11 rounded-xl border border-border bg-bg px-3 text-sm text-text focus:border-amber">
                <option value="">{t('selectMaterial')}</option>
                {proposedMaterial.candidates.map((candidate) => <option key={candidate} value={candidate}>{materialLabel(candidate)}</option>)}
              </select>
              : <p className="text-sm text-dim">{t('askMaterialUnavailable')}</p>}
          </div>}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" disabled={!canApply} onClick={applyProposal}>{t('askApply')}</Button>
            <Button onClick={() => { setProposal(null); setMaterialSelection(''); setAnnouncement(t('askProposalCancelled')); }}>{t('askCancel')}</Button>
            {materialNeedsSelection && <span className="self-center text-xs text-dim">{t('askChooseMaterial')}</span>}
          </div>
        </div>}
        {showEvidence && <div className="motion-still mt-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {!confirmed && <Button size="sm" onClick={() => onNavigate('scenario')}>{t('askOpenScenario')}</Button>}
            {confirmed && <Button size="sm" onClick={() => onNavigate('map')}>{t('askOpenMap')}</Button>}
            <Button size="sm" onClick={() => onNavigate('methods')}>{t('askOpenMethods')}</Button>
          </div>
          {evidenceView()}
        </div>}
      </Panel>
    </div>
  );
}

function ValidatedEvidence({ briefing, matches, onCitation }: { briefing: Briefing; matches: MatchResult[]; onCitation: (experimentId: string) => void }) {
  const experimentByEvidence = new Map(briefing.evidence.map(({ evidence_id, experiment_id }) => [evidence_id, experiment_id]));
  const groups = [
    { classification: 'OBSERVED' as const, label: t('askStatusObserved') },
    { classification: 'SUPPORTED' as const, label: t('askStatusSupported') },
    { classification: 'UNTESTED' as const, label: t('askStatusUntested') },
  ];
  return <div className="rounded-xl border border-border bg-bg/55 p-3">
    {briefing.status === 'fallback' && <p role="status" className="mb-3 rounded-lg border border-warn/35 bg-warn/[0.05] p-2 text-sm text-dim">{COPY.fallback}</p>}
    {briefing.withheld_count > 0 && <p role="status" className="mb-3 flex items-center gap-2 text-sm text-warn"><Icon name="withheld" size={16} />{t('askBriefWithheld')}</p>}
    <div className="grid gap-3">
      {groups.map(({ classification, label }) => {
        const claims = briefing.claims.filter((claim) => claim.classification === classification);
        if (!claims.length) return null;
        return <section key={classification}>
          <h4 className="console-label text-dim">{label}</h4>
          <ul className="mt-2 grid gap-3">
            {claims.map((claim, index) => <li key={`${classification}-${index}`}>
              <p className="text-sm leading-relaxed text-text">{claim.text}</p>
              {classification === 'SUPPORTED' && <p className="mt-1 text-xs leading-relaxed text-dim">{COPY.interpretationLimit}</p>}
              {claim.evidence_ids.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                {claim.evidence_ids.map((evidenceId) => {
                  const experimentId = experimentByEvidence.get(evidenceId);
                  return experimentId && matches.some((match) => match.experiment.id === experimentId)
                    ? <CitationChip key={evidenceId} evidenceId={evidenceId} onClick={() => onCitation(experimentId)} />
                    : null;
                })}
              </div>}
              {claim.gap_ids.length > 0 && <p className="mt-2 console-label text-warn">{claim.gap_ids.map((id) => `${t('gap')} ${id}`).join(' · ')}</p>}
            </li>)}
          </ul>
        </section>;
      })}
    </div>
    {briefing.claims.length === 0 && <p className="text-sm text-dim">{t('askBriefUnavailable')}</p>}
  </div>;
}
