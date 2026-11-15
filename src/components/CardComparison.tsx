import { t } from '../i18n';
import { useState } from 'react';
import type { Experiment, ContinuousParam } from '../lib/types';
import { FIELD_UNITS, PARAM_LABELS } from '../lib/types';
import { evidenceLocator, evidenceSource } from '../lib/evidenceSource';
import { COPY } from '../lib/copy';
import { buttonClass, textLink } from './ui';
import { useScrollArea } from '../lib/scrollArea';
import { cx } from '../lib/cx';

const label = (c: Experiment) => c.test_id.startsWith(c.campaign) ? c.test_id : c.campaign+' '+c.test_id;
const parameters: ContinuousParam[] = ['o2_pct','flow_cm_s','thickness_mm','pressure_kpa'];
const fields = [
  [t('material'), (c: Experiment) => c.fuel_material.replace(/_/g,' ')],
  [t('form'), (c: Experiment) => c.fuel_form.replace(/_/g,' ')],
  ...parameters.map(p => [PARAM_LABELS[p], (c: Experiment) => [
    c[p] == null ? t('notReported') : c[p]+' '+FIELD_UNITS[p],
    ...(c.condition_changes ?? []).filter(change => change.parameter === p).map(change => COPY.changingConditions+': '+change.note),
  ].join(' · ')] as const),
  [t('libraryOutcome'), (c: Experiment) => t(c.outcome)],
] as const;

/** Compare only the current matches; a changed selection can never revive an old card. */
export function CardComparison({cards, standalone = false}: {cards: Experiment[]; standalone?: boolean}) {
  const [pair, setPair] = useState<[string,string]>(['','']);
  // ≥ sm: the table (scrolls sideways inside its own box if it must). Phones get the stacked two-column view.
  const tableScroll = useScrollArea('x');
  const eligible = cards.filter(c => c.verified_by && c.domain === 'solid_flammability');
  const left = eligible.find(c => c.id === pair[0]) ?? eligible[0];
  const others = eligible.filter(c => c.id !== left?.id);
  const right = others.find(c => c.id === pair[1]) ?? others[0];
  if (!left || !right) return null;
  const two = [left,right] as const;
  return <details open={standalone || undefined} className="motion-still mt-5 rounded-xl border border-border p-4">
    <summary className="cursor-pointer font-semibold">{t(standalone ? 'compareVerified' : 'compareMatched')}</summary>
    <p className="my-3 text-sm text-dim">{t('compareDescription')}</p>
    {!standalone && <div className="mb-4 grid gap-3 sm:grid-cols-2">{two.map((c,i) =>
      <label key={i} className="min-w-0 text-sm">Experiment {i+1}
        <select className="mt-1 h-10 w-full rounded-xl border border-border bg-bg/70 px-3 text-sm text-text" value={c.id} onChange={e => setPair(i === 0 ? [e.target.value,right.id] : [left.id,e.target.value])}>
          {(i === 0 ? eligible : others).map(item => <option key={item.id} value={item.id}>{label(item)}</option>)}
        </select>
      </label>)}</div>}
    {!standalone && <a className={buttonClass('secondary', 'sm', 'mb-4')} href={`/compare?ids=${two.map((card) => encodeURIComponent(card.id)).join(',')}`}>{t('compareOpen')}</a>}
    {/* Phones: the two runs side by side in two half-width columns, one field per row (no hidden sideways column). */}
    <div role="group" aria-label={t(standalone ? 'compareVerifiedCaption' : 'compareMatchedCaption')} className="text-sm sm:hidden">
      <div className="grid grid-cols-2 gap-3 pb-2 font-semibold">{two.map(c => <p key={c.id} className="min-w-0 [overflow-wrap:anywhere]">{label(c)}</p>)}</div>
      {fields.map(([name, read]) => {
        const values = two.map(read);
        const different = values[0] !== values[1];
        return <div key={name} className={cx('border-t border-border py-2', different && 'bg-raised/20 -mx-2 px-2')}>
          <p className="text-xs font-medium text-dim">{name}{different && <span className="ml-2 text-amber">{t('compareDifference')}</span>}</p>
          <div className="mt-1 grid grid-cols-2 gap-3 tabular-nums">{values.map((v, i) => <p key={i} className="min-w-0 [overflow-wrap:anywhere]">{v}</p>)}</div>
        </div>;
      })}
      <div className="border-t border-border py-2">
        <p className="text-xs font-medium text-dim">{t('source')}</p>
        <div className="mt-1 grid grid-cols-2 gap-3">{two.map(c => {
          const src = evidenceSource(c);
          return <div key={c.id} className="min-w-0 [overflow-wrap:anywhere]">{src ? <a className={cx(textLink, 'line-clamp-3')} title={c.source_title} href={src.url} target="_blank" rel="noopener noreferrer">{c.source_title}</a> : c.source_title}<small className="mt-1 block text-dim">{evidenceLocator(c)}</small></div>;
        })}</div>
      </div>
    </div>
    <div ref={tableScroll} data-axis="x" role="group" aria-label={t(standalone ? 'compareVerifiedCaption' : 'compareMatchedCaption')} className="scroll-area hidden overflow-x-auto sm:block">
    <table className="w-full min-w-[30rem] table-fixed border-collapse text-left text-sm break-words">
      <caption className="sr-only">{t(standalone ? 'compareVerifiedCaption' : 'compareMatchedCaption')}</caption>
      <thead><tr><th scope="col">{t('compareField')}</th>{two.map(c => <th scope="col" className="p-2" key={c.id}>{label(c)}</th>)}</tr></thead>
      <tbody>{fields.map(([name,read]) => {
        const values = two.map(read);
        const different = values[0] !== values[1];
        return <tr key={name} className={'border-t border-border '+(different ? 'bg-raised/20' : '')}><th scope="row" className="py-2 font-medium">{name}{different && <small className="block text-dim">{t('compareDifference')}</small>}</th>{values.map((v,i) => <td key={i} className="p-2 tabular-nums">{v}</td>)}</tr>;
      })}<tr className="border-t border-border"><th scope="row">{t('source')}</th>{two.map(c => {
        const src = evidenceSource(c);
        return <td key={c.id} className="p-2">{src ? <a className={cx(textLink, 'line-clamp-2')} title={c.source_title} href={src.url} target="_blank" rel="noopener noreferrer">{c.source_title}</a> : c.source_title}<small className="block">{evidenceLocator(c)}</small></td>;
      })}</tr></tbody>
    </table>
    </div>
  </details>;
}
