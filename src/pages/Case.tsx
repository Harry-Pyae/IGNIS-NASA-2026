import { useId, useRef, useState, type FormEvent } from 'react';
import { Badge, Button, buttonClass, Page, PageHeader, Panel, textLink } from '../components/ui';
import { format, t } from '../i18n';
import { CASE_RUNS, CASE_SOURCE, renderableGreenFlash, sourceRowFor, type GreenFlashBeat } from '../lib/caseContent';
import { useVerifiedCatalog } from '../lib/catalog';
import { ClaimCheckResponseSchema, type ClaimCheckResponse, type Experiment } from '../lib/types';

/**
 * The 60-second case (/case, also /case/green-flash). The BASS two-run question: two verified fabric runs at the same
 * oxygen and different airflow; inspect their p.9 source rows, make a claim, and see it checked by the production
 * validator (/api/check-claim → checkClaim in src/server/claims.ts). The green flash opens the page only once R1 and
 * R2 have signed and ledgered it. Static (no motion), works silent, keyboard operable.
 */
export function Case() {
  const beat1 = renderableGreenFlash();
  const { catalog, reload } = useVerifiedCatalog();
  const runs = catalog.state === 'ready'
    ? CASE_RUNS.map((run) => catalog.experiments.find((e) => e.id === run.id)).filter((card): card is Experiment => !!card)
    : [];
  return (
    <Page>
      <PageHeader eyebrow={t('caseEyebrow')} title={t(beat1 ? 'caseTitleFlash' : 'caseTitle')} intro={t('caseIntro')} />
      <div className="grid gap-6">
        {beat1 && <GreenFlash beat={beat1} />}
        {catalog.state === 'loading' ? <p role="status" className="text-dim">{t('caseCardsLoading')}</p>
          : catalog.state === 'unavailable' ? (
            <Panel role="status" className="flex flex-wrap items-center gap-3">
              <p className="min-w-0 flex-1 text-text">{t('caseCatalogUnavailable')}</p>
              <Button onClick={reload}>{t('retry')}</Button>
            </Panel>
          )
          : runs.length === 0 ? <Panel role="status"><p className="text-text">{t('caseRunsMissing')}</p></Panel>
          : <>
            <Runs runs={runs} />
            <ClaimCheck runs={runs} />
          </>}
        <footer className="border-t border-border pt-4 text-sm text-dim">
          {runs[0] && <p>{format('caseCreditData', { campaign: runs[0].campaign, source: `NTRS ${CASE_SOURCE.ntrs_id}` })}</p>}
          {beat1 && <p>{beat1.still_credit}</p>}
          <p className="mt-1">{t('nasaDisclaimer')}</p>
        </footer>
      </div>
    </Page>
  );
}

const readable = (value: string | null) => value?.replaceAll('_', ' ') ?? t('notSpecified');

function GreenFlash({ beat }: { beat: GreenFlashBeat }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <Panel as="section" aria-labelledby="case-beat1" className="motion-still">
      <h2 id="case-beat1" className="console-label mb-3 text-amber">{t('caseBeat1')}</h2>
      <figure>
        <img src={beat.still_url} alt={beat.still_alt} className="aspect-video w-full rounded-xl border border-border object-cover" />
        <figcaption className="mt-2 text-xs text-dim">{beat.still_credit}</figcaption>
      </figure>
      <Button className="mt-4" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
        {t(open ? 'caseHideExplanation' : 'caseInspect')}
      </Button>
      <div id={panelId} hidden={!open} className="mt-4 border-l-2 border-amber/60 pl-4">
        <p className="console-label mb-2 text-dim">{t('caseNasaExplains')}</p>
        <blockquote className="text-text">“{beat.quote}”</blockquote>
        <p className="mt-2 text-sm text-dim">
          {beat.source_title} · {beat.locator} · <a className={textLink} href={beat.source_url} target="_blank" rel="noopener noreferrer">{t('source')}</a>
        </p>
        <p className="mt-1 text-xs text-dim">{format('caseCheckedBy', { name: beat.verified_by })}</p>
      </div>
    </Panel>
  );
}

/** The printed appendix row, airflow column highlighted, with the PDF one click away. */
function SourceRow({ card }: { card: Experiment }) {
  const run = sourceRowFor(card);
  const pdf = <a className={textLink} href={CASE_SOURCE.pdf_url} target="_blank" rel="noopener noreferrer">{format('caseOpenPdf', { page: CASE_SOURCE.page })}</a>;
  if (!run) return <p className="text-sm text-dim">{t('caseRowWithdrawn')} {pdf}</p>;
  return (
    <figure className="text-sm">
      {/* Phones: the five printed columns as label/value pairs (a table would clip at 390px); airflow highlighted. */}
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 rounded-lg border border-border p-3 sm:hidden">
        {CASE_SOURCE.columns.map((column, i) => <div key={column} className="contents">
          <dt className={i === 2 ? 'text-amber' : 'text-dim'}>{column}</dt>
          <dd className={`font-mono ${i === 2 ? 'font-medium text-amber' : 'text-text'}`}>{run.row[i]}</dd>
        </div>)}
      </dl>
      <div className="hidden overflow-hidden rounded-lg border border-border sm:block">
        <table className="w-full table-fixed text-left">
          <thead className="bg-bg/50 text-xs text-dim">
            <tr>{CASE_SOURCE.columns.map((column, i) => <th key={column} scope="col" className={`px-2 py-1.5 font-normal ${i === 2 ? 'text-amber' : ''}`}>{column}</th>)}</tr>
          </thead>
          <tbody className="font-mono">
            <tr>{run.row.map((cell, i) => <td key={i} className={`px-2 py-1.5 ${i === 2 ? 'bg-amber/10 font-medium text-amber' : 'text-text'}`}>{cell}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <figcaption className="mt-1.5 text-dim">{format('caseRowCaption', { table: CASE_SOURCE.table, page: CASE_SOURCE.page })} · {pdf}</figcaption>
    </figure>
  );
}

function Runs({ runs }: { runs: Experiment[] }) {
  return (
    <section aria-labelledby="case-step1">
      <h2 id="case-step1" className="console-label mb-3 text-amber">{t('caseStep1')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {runs.map((card) => <RunCard key={card.id} card={card} />)}
      </div>
    </section>
  );
}

function RunCard({ card }: { card: Experiment }) {
  const [open, setOpen] = useState(false);
  const rowId = useId();
  return (
    <Panel as="article" className="motion-still flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-text">{card.test_id}</h3>
      <p className="text-sm text-dim">{format('caseRunFacts', { material: readable(card.fuel_material), form: readable(card.fuel_form), o2: card.o2_pct ?? '—', outcome: t(card.outcome) })}</p>
      <div>
        <p className="console-label text-dim">{format('caseObservation', { page: card.source_page ?? '—' })}</p>
        <blockquote className="mt-1 border-l-2 border-border pl-3 text-text">“{card.key_observation_quote}”</blockquote>
      </div>
      <Button className="self-start" aria-expanded={open} aria-controls={rowId} onClick={() => setOpen((value) => !value)}>
        {t(open ? 'caseHideRow' : 'caseInspectRow')}
      </Button>
      <div id={rowId} hidden={!open}><SourceRow card={card} /></div>
    </Panel>
  );
}

type CheckState =
  | { kind: 'idle' }
  | { kind: 'invalid' }
  | { kind: 'checking' }
  | { kind: 'error'; message: string }
  | { kind: 'done'; card: Experiment; value: number; result: ClaimCheckResponse };

function ClaimCheck({ runs }: { runs: Experiment[] }) {
  const [runId, setRunId] = useState('');
  const [value, setValue] = useState('10');
  const [state, setState] = useState<CheckState>({ kind: 'idle' });
  // Each check belongs to one submitted run + value: an edit or a newer check aborts the old request and its
  // result, error and pending state are ignored (the same pattern as the console's parse, Round 8 A5).
  const request = useRef<{ generation: number; abort: AbortController | null }>({ generation: 0, abort: null });
  const runSelect = useId();
  const valueInput = useId();
  const checked = state.kind === 'done' ? state.card : runs.find((r) => r.id === runId) ?? runs[0]!;

  const invalidate = () => {
    request.current.abort?.abort();
    request.current = { generation: request.current.generation + 1, abort: null };
    setState({ kind: 'idle' });
  };

  async function check(event: FormEvent) {
    event.preventDefault();
    const card = runs.find((r) => r.id === runId);
    const number = Number(value);
    if (!card) return;
    if (value.trim() === '' || !Number.isFinite(number) || number < 0) return setState({ kind: 'invalid' });
    request.current.abort?.abort();
    const abort = new AbortController();
    const generation = request.current.generation + 1;
    request.current = { generation, abort };
    setState({ kind: 'checking' });
    const current = () => request.current.generation === generation;
    try {
      const response = await fetch('/api/check-claim', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ experiment_id: card.id, field: 'flow_cm_s', value: number }),
        signal: abort.signal,
      });
      if (!current()) return;
      if (response.status === 429) return setState({ kind: 'error', message: t('caseRateLimited') });
      const parsed = ClaimCheckResponseSchema.safeParse(await response.json());
      if (!current()) return;
      // A verdict only for exactly what was submitted.
      const result = parsed.success ? parsed.data : null;
      const matches = result && result.experiment_id === card.id && result.field === 'flow_cm_s'
        && (result.verdict === 'accepted' ? result.value === number : result.claimed.value === number);
      setState(matches ? { kind: 'done', card, value: number, result } : { kind: 'error', message: t('caseError') });
    } catch {
      if (current()) setState({ kind: 'error', message: t('caseError') });
    }
  }

  const [t7, t8] = [runs.find((r) => r.id === CASE_RUNS[0]!.id), runs.find((r) => r.id === CASE_RUNS[1]!.id)];
  return (
    <Panel as="section" aria-labelledby="case-step2" className="motion-still">
      <h2 id="case-step2" className="console-label mb-3 text-amber">{t('caseStep2')}</h2>
      <form onSubmit={check} className="flex flex-wrap items-center gap-x-3 gap-y-3 text-lg">
        <label htmlFor={runSelect} className="sr-only">{t('caseClaimRunLabel')}</label>
        <select id={runSelect} value={runId} onChange={(event) => { setRunId(event.target.value); invalidate(); }}
          className="h-11 rounded-xl border border-border bg-bg/70 px-3 text-base text-text">
          <option value="" disabled>{t('compareChoose')}</option>
          {runs.map((card) => <option key={card.id} value={card.id}>{card.test_id}</option>)}
        </select>
        <span className="text-text">{t('caseClaimVerb')}</span>
        <label htmlFor={valueInput} className="sr-only">{t('caseClaimValueLabel')}</label>
        <input id={valueInput} type="number" inputMode="decimal" step="any" min="0" value={value}
          aria-invalid={state.kind === 'invalid'} aria-describedby={state.kind === 'invalid' ? `${valueInput}-error` : undefined}
          onChange={(event) => { setValue(event.target.value); invalidate(); }}
          className="h-11 w-24 rounded-xl border border-border bg-bg/70 px-3 text-center font-mono text-lg text-text tabular-nums focus:border-amber aria-invalid:border-warn" />
        <span className="text-text">{t('caseClaimUnit')}</span>
        <Button type="submit" variant="primary" disabled={state.kind === 'checking' || !runId}>
          {t(state.kind === 'checking' ? 'caseChecking' : 'caseCheck')}
        </Button>
      </form>

      <div id="case-result" aria-live="polite" className="mt-4 min-h-[5rem]">
        {state.kind === 'invalid' && <p id={`${valueInput}-error`} className="text-warn">{t('caseInvalid')}</p>}
        {state.kind === 'error' && <p role="status" className="text-warn">{state.message}</p>}
        {state.kind === 'done' && <Verdict state={state} />}
      </div>
      <p className="mt-2 text-sm text-text">{t('caseSameCheck')}</p>
      <p className="text-sm text-dim">{t('caseNoAi')}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <a className={buttonClass('primary', 'md')} href={`/?specimen=${encodeURIComponent(checked.id)}#evidence-map`}>
          {format('caseLocate', { run: checked.test_id.replace(/^BASS(?:-II)?\s+/, '') })}
        </a>
        {t7 && t8 && <a className={buttonClass('secondary', 'md')} href={`/compare?ids=${t7.id},${t8.id}`}>{t('caseCompare')}</a>}
      </div>
      <p className="mt-3 text-sm text-dim">{t('caseLimitation')}</p>
    </Panel>
  );
}

function Verdict({ state }: { state: Extract<CheckState, { kind: 'done' }> }) {
  const { card, value, result } = state;
  const withheld = result.verdict === 'withheld';
  const recorded = withheld ? result.source.value : result.value;
  return (
    <div className={`rounded-xl border p-4 ${withheld ? 'border-warn/40 bg-warn/[0.06]' : 'border-success/40 bg-success/[0.06]'}`}>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={withheld ? 'warn' : 'success'}>{t(withheld ? 'caseWithheld' : 'caseAccepted')}</Badge>
        <span className="text-sm text-dim">{format('caseYouChecked', { run: card.test_id, value })}</span>
      </div>
      <p className="mt-2 text-lg text-text">{withheld ? result.message : result.text}</p>
      {recorded != null && <p className="mt-3 text-sm font-medium text-text">{format('caseFieldProof', { value: recorded })}</p>}
      <div className="mt-2"><SourceRow card={card} /></div>
    </div>
  );
}

