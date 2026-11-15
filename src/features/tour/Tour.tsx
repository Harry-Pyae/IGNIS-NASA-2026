import { useLayoutEffect, useRef, useState } from 'react';
import { Button, buttonClass } from '../../components/ui';
import { COPY } from '../../lib/copy';
import { format, t, type TranslationKey } from '../../i18n';
import { WalkthroughButton } from '../walkthrough/Walkthrough';
import { WIDE_QUERY } from '../../lib/layout';

const section = (id: string) => document.getElementById(id)?.closest('section') ?? null;

/** One coach mark per console section, in page order. The map step spotlights the plot itself (the dots). */
/** The biggest stack on the map (runs that share one tap target), else the plot itself. */
const biggestStack = () => [...document.querySelectorAll<HTMLElement>('[id^="map-point-"][data-stack]')]
  .sort((a, b) => Number(b.dataset.stack) - Number(a.dataset.stack))[0] ?? document.getElementById('evidence-plot');
/** A tab in the sticky header: spotlit where it is (no scroll, no clamp below the header). */
const tab = (href: string) => document.querySelector<HTMLElement>(`header a.project-tab[href="${href}"]`);

// Every step is prewritten copy over a real element (no LLM). `heading` = where focus lands if the tour ends there.
const STEPS: { title: TranslationKey; body: TranslationKey; target: () => HTMLElement | null; heading: string; inHeader?: true }[] = [
  { title: 'missionScenario', body: 'tourDescribe', target: () => section('s1'), heading: 's1' },
  { title: 'evidenceMap', body: 'tourMap', target: () => document.getElementById('evidence-plot') ?? section('s2'), heading: 's2' },
  { title: 'tourStacksTitle', body: 'tourStacks', target: biggestStack, heading: 's2' },
  { title: 'matchPanel', body: 'tourMatches', target: () => section('s3'), heading: 's3' },
  { title: 'missionBrief', body: 'tourBrief', target: () => section('s4'), heading: 's4' },
  { title: 'evidenceGapRadar', body: 'tourGaps', target: () => section('s5'), heading: 's5' },
  { title: 'tourLibraryTitle', body: 'tourLibrary', target: () => tab('/library'), heading: 's5', inHeader: true },
  { title: 'tourCaseTitle', body: 'tourCase', target: () => tab('/case'), heading: 's5', inHeader: true },
];
const END = STEPS.length;
const MARGIN = 16;
const GAP = 12;
const PAD = 8;

const reducedMotion = () => !window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const headerHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));
/** The heading of a step's section (focus lands there when the tour ends mid-way). */
const headingFor = (step: number) => document.getElementById(STEPS[Math.min(step, END - 1)]!.heading);

/**
 * The guided tour: a native modal <dialog> over the real console (the page stays visible but inert, Tab stays inside,
 * Escape exits). A spotlight box follows its section; its huge box-shadow dims everything else. The coach mark sits
 * beside, below or above the section, or over the bottom of the screen when the section is taller than it.
 * Reduced motion: instant scroll, no spotlight glide, no fade.
 */
export function Tour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [step, setStep] = useState(0);

  // Layout effect, declared first: the dialog is open before the step effect below focuses the card.
  useLayoutEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open]);

  /** Close, then put focus back where the visitor was (or on the section they were looking at). */
  const finish = (focus: HTMLElement | null = null) => {
    dialog.current?.close();
    setStep(0); // a replay starts from the top
    const back = focus ?? (opener.current?.isConnected && opener.current.offsetParent !== null ? opener.current : headingFor(step));
    if (back) {
      if (!back.hasAttribute('tabindex') && back.tabIndex < 0) back.setAttribute('tabindex', '-1');
      back.focus({ preventScroll: true });
    }
    onClose();
  };
  const exploreFreely = () => {
    const heading = headingFor(0);
    document.getElementById('console')?.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'instant' : 'smooth' });
    finish(heading);
  };

  // Each step: scroll its section under the header, hide the card until the scroll settles, focus the card.
  useLayoutEffect(() => {
    if (!open) return;
    // The card's fade is written straight to the DOM (data-ready), like its position: no extra render per step.
    const setReady = (on: boolean) => card.current?.toggleAttribute('data-ready', on);
    setReady(false);
    card.current?.focus({ preventScroll: true });
    const target = STEPS[step]?.target();
    if (!target || STEPS[step]?.inHeader) { setReady(true); return; }
    const wide = window.matchMedia(WIDE_QUERY).matches;
    // Below xl the condition bar can pin itself under the header: leave room for it.
    const top = window.scrollY + target.getBoundingClientRect().top - headerHeight() - (wide ? MARGIN : 64);
    if (Math.abs(top - window.scrollY) < 2) { setReady(true); return; }
    const settle = () => setReady(true);
    window.addEventListener('scrollend', settle, { once: true });
    const fallback = window.setTimeout(settle, 900); // no scrollend (older Safari) or the page can't scroll that far
    window.scrollTo({ top, behavior: reducedMotion() ? 'instant' : 'smooth' });
    return () => { window.removeEventListener('scrollend', settle); window.clearTimeout(fallback); };
  }, [open, step]);

  // ponytail: one rAF loop while the tour is open (≈30 s), writing styles directly, no re-render per frame.
  useLayoutEffect(() => {
    if (!open) return;
    let frame = 0;
    const place = () => {
      frame = requestAnimationFrame(place);
      const s = spot.current;
      const c = card.current;
      if (!s || !c) return;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const target = STEPS[step]?.target();
      if (!target) { // end card: no spotlight, the card centred
        s.style.transform = `translate(${vw / 2}px, ${vh / 2}px)`;
        s.style.width = s.style.height = '0px';
        c.style.transform = `translate(${(vw - c.offsetWidth) / 2}px, ${(vh - c.offsetHeight) / 2}px)`;
        return;
      }
      const r = target.getBoundingClientRect();
      const left = Math.max(r.left - PAD, 4);
      const right = Math.min(r.right + PAD, vw - 4);
      const top = Math.max(r.top - PAD, STEPS[step]?.inHeader ? 4 : headerHeight() + 4);
      const bottom = Math.min(r.bottom + PAD, vh - 4);
      s.style.transform = `translate(${left}px, ${top}px)`;
      s.style.width = `${Math.max(0, right - left)}px`;
      s.style.height = `${Math.max(0, bottom - top)}px`;
      const w = c.offsetWidth;
      const h = c.offsetHeight;
      // A header tab's card goes below the pinned condition bar (phones), never over it.
      const bar = STEPS[step]?.inHeader ? document.querySelector<HTMLElement>('[role="region"].fixed') : null;
      const below = Math.max(bottom, bar && bar.offsetHeight > 0 ? bar.getBoundingClientRect().bottom : 0);
      let x: number;
      let y: number;
      if (vw - right >= w + GAP + MARGIN) { x = right + GAP; y = clamp(top, MARGIN, vh - h - MARGIN); }
      else if (vh - below >= h + GAP + MARGIN) { x = clamp(left, MARGIN, vw - w - MARGIN); y = below + GAP; }
      else if (top - headerHeight() >= h + GAP + MARGIN) { x = clamp(left, MARGIN, vw - w - MARGIN); y = top - GAP - h; }
      else { x = clamp(left, MARGIN, vw - w - MARGIN); y = vh - h - MARGIN; } // over the bottom of a tall section
      c.style.transform = `translate(${x}px, ${y}px)`;
    };
    place();
    return () => cancelAnimationFrame(frame);
  }, [open, step]);

  const current = STEPS[step];
  return (
    <dialog ref={dialog} aria-labelledby="tour-title" aria-describedby="tour-body" className="tour-dialog"
      onCancel={(event) => { event.preventDefault(); finish(); }}
      onKeyDown={(event) => {
        // A modal dialog lets Tab leave for the browser's own UI; keep it cycling through this step's controls.
        if (event.key !== 'Tab' || !card.current) return;
        const items = [...card.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')];
        const edge = event.shiftKey ? [items[0], card.current] : [items.at(-1)];
        if (edge.includes(document.activeElement as HTMLElement)) {
          event.preventDefault();
          (event.shiftKey ? items.at(-1) : items[0])?.focus();
        }
      }}>
      <div ref={spot} aria-hidden className="tour-spot" data-end={current ? undefined : ''} />
      <div ref={card} tabIndex={-1} role="group" aria-labelledby="tour-title" aria-describedby="tour-body"
        className="tour-card w-[min(360px,calc(100vw-32px))] rounded-panel border border-border bg-bg p-4 text-text shadow-lg outline-none">
        <p className="console-label text-amber">{current ? format('tourStepOf', { n: step + 1, total: END }) : t('tourEndTitle')}</p>
        <h2 id="tour-title" className="mt-1 text-base font-semibold">{current ? t(current.title) : t('tourEndBody')}</h2>
        {current && <p id="tour-body" className="mt-1 text-sm leading-relaxed text-dim">{t(current.body)}</p>}
        {current ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button variant="tertiary" onClick={() => finish()}>{t('tourSkip')}</Button>
            <span className="flex-1" />
            {step > 0 && <Button size="sm" onClick={() => setStep(step - 1)}>{t('missionBack')}</Button>}
            <Button size="sm" variant="primary" onClick={() => setStep(step + 1)}>{t('missionNext')}</Button>
          </div>
        ) : (
          <div id="tour-body" className="mt-4 flex flex-col items-stretch gap-2">
            <a className={buttonClass('primary', 'md')} href="/case">{COPY.landingCta.case}</a>
            <WalkthroughButton short onOpen={() => finish(headingFor(0))} returnFocus={() => headingFor(0)} />
            <Button onClick={exploreFreely}>{t('tourExplore')}</Button>
            <Button variant="tertiary" className="self-start" onClick={() => setStep(step - 1)}>{t('missionBack')}</Button>
          </div>
        )}
      </div>
    </dialog>
  );
}
