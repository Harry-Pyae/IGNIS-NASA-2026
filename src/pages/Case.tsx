import { useId, useState, type FormEvent } from 'react';
import { Badge, Button, buttonClass, Page, PageHeader, Panel, textLink } from '../components/ui';
import { format, t } from '../i18n';
import { renderableGreenFlash, type GreenFlashBeat } from '../lib/caseContent';
import { useVerifiedCatalog } from '../lib/catalog';
import { CASE_CARD_ID } from '../lib/fixtures';
import { ClaimCheckResponseSchema, FIELD_UNITS, type ClaimCheckResponse, type Experiment } from '../lib/types';

/**
 * The 60-second case (/case/green-flash). Beat 1: NASA's green flash, only once R1 has signed the explanation and R2
 * has ledgered the still (renderableGreenFlash). Beat 2: one real claim about BASS GMT96-T7, checked by the
 * production validator (/api/check-claim → checkClaim in src/server/claims.ts). Static: no motion, works silent,
 * keyboard operable.
 */
export function Case() {
  const beat1 = renderableGreenFlash();
  const { catalog } = useVerifiedCatalog();
  const card = catalog.state === 'ready' ? catalog.experiments.find((e) => e.id === CASE_CARD_ID) ?? null : null;
  return (
    <Page>
      <PageHeader eyebrow={t('caseEyebrow')} title={t('caseTitle')} intro={t('caseIntro')} />
      <div className="grid gap-6">
        {beat1 && <GreenFlash beat={beat1} />}
        <ClaimCheck card={card} loading={catalog.state === 'loading'} />
        <div className="flex flex-wrap items-center gap-4">
          <a className={buttonClass('primary', 'lg')} href="/#evidence-map">{t('caseExplore')}</a>
        </div>
        <footer className="border-t border-border pt-4 text-sm text-dim">
          {card && <p>{format('caseCreditData', { campaign: card.campaign, source: card.ntrs_id ? `NTRS ${card.ntrs_id}` : card.source_title })}</p>}
          {beat1 && <p>{beat1.still_credit}</p>}
          <p className="mt-1">{t('nasaDisclaimer')}</p>
        </footer>
      </div>
    </Page>
  );
}

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

type CheckState = { kind: 'idle' } | { kind: 'checking' } | { kind: 'done'; result: ClaimCheckResponse } | { kind: 'error'; message: string };

function ClaimCheck({ card, loading }: { card: Experiment | null; loading: boolean }) {
  const [value, setValue] = useState('12'); // starts tampered: the first check shows a withheld claim
  const [state, setState] = useState<CheckState>({ kind: 'idle' });
  const inputId = useId();
  const unit = FIELD_UNITS.flow_cm_s;

  async function check(event: FormEvent) {
    event.preventDefault();
    const number = Number(value);
    if (!card || value.trim() === '' || !Number.isFinite(number)) return;
    setState({ kind: 'checking' });
    try {
      const response = await fetch('/api/check-claim', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ experiment_id: card.id, field: 'flow_cm_s', value: number }),
      });
      if (response.status === 429) return setState({ kind: 'error', message: t('caseRateLimited') });
      const parsed = ClaimCheckResponseSchema.safeParse(await response.json());
      setState(parsed.success ? { kind: 'done', result: parsed.data } : { kind: 'error', message: t('caseError') });
    } catch {
      setState({ kind: 'error', message: t('caseError') });
    }
  }

  return (
    <Panel as="section" aria-labelledby="case-beat2" className="motion-still">
      <h2 id="case-beat2" className="console-label mb-2 text-amber">{t('caseBeat2')}</h2>
      {loading ? <p role="status" className="text-dim">{t('caseCardLoading')}</p>
        : !card ? <p role="status" className="text-dim">{t('caseCardMissing')}</p>
        : <>
          <p className="text-dim">{t('caseClaimIntro')}</p>
          <form onSubmit={check} className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-3 text-lg">
            <span className="text-text">{format('caseClaimLead', { test: card.test_id })}</span>
            <label htmlFor={inputId} className="sr-only">{t('caseClaimLabel')}</label>
            <input id={inputId} type="number" inputMode="decimal" step="any" min="0" value={value}
              onChange={(event) => { setValue(event.target.value); setState({ kind: 'idle' }); }}
              className="h-11 w-24 rounded-xl border border-border bg-bg/70 px-3 text-center font-mono text-lg text-text tabular-nums focus:border-amber" />
            <span className="text-text">{t('caseClaimUnit')}</span>
            <Button type="submit" variant="primary" disabled={state.kind === 'checking' || value.trim() === ''}>
              {t(state.kind === 'checking' ? 'caseChecking' : 'caseCheck')}
            </Button>
          </form>
          <div id="case-result" aria-live="polite" className="mt-4 min-h-[5rem]">
            {state.kind === 'error' && <p role="status" className="text-warn">{state.message}</p>}
            {state.kind === 'done' && (state.result.verdict === 'withheld' ? (
              <div className="rounded-xl border border-warn/40 bg-warn/[0.06] p-4">
                <Badge variant="warn">{t('caseWithheld')}</Badge>
                <p className="mt-2 text-lg text-text">{state.result.message}</p>
                {state.result.source.value != null && <p className="mt-1 text-sm text-dim">{format('caseClaimedVsCard', {
                  claimed: `${state.result.claimed.value} ${unit}`, source: `${state.result.source.value} ${unit}` })}</p>}
              </div>
            ) : (
              <div className="rounded-xl border border-success/40 bg-success/[0.06] p-4">
                <Badge variant="success">{t('caseAccepted')}</Badge>
                <p className="mt-2 text-lg text-text">{state.result.text}</p>
                <p className="mt-3 text-sm text-dim">{t('caseAcceptedLead')}</p>
                <blockquote className="mt-1 border-l-2 border-border pl-3 text-text">“{state.result.quote}”</blockquote>
                <p className="mt-2 text-sm text-dim">
                  {[state.result.locator.page && `p.${state.result.locator.page}`, state.result.locator.figure, state.result.locator.ntrs_id && `NTRS ${state.result.locator.ntrs_id}`].filter(Boolean).join(' · ')}
                  {' · '}<a className={textLink} href={state.result.locator.source_url} target="_blank" rel="noopener noreferrer">{t('source')}</a>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-text">{t('caseSameCheck')}</p>
          <p className="text-sm text-dim">{t('caseNoAi')}</p>
        </>}
    </Panel>
  );
}
