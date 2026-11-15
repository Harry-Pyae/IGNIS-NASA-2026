import { useEffect, useState } from 'react';
import { Page, PageHeader, Panel, tapLink, textLink } from '../components/ui';
import { t, type TranslationKey } from '../i18n';
import { WalkthroughButton, WalkthroughTranscript } from '../features/walkthrough/Walkthrough';

/**
 * /help (Round 9): every former "How to use this" disclosure, as task walkthroughs with stable anchors. In-app
 * links are task-named ("How to read this map" → #read-the-map). Definitions live once, in the Methods glossary.
 * The way back returns to the page the visitor came from; console drafts and Library filters are kept per tab.
 */
const SECTIONS: { id: string; title: TranslationKey; body: TranslationKey[] }[] = [
  { id: 'start', title: 'helpPageStart', body: ['helpStart1', 'helpStart2'] },
  { id: 'describe', title: 'helpPageDescribe', body: ['helpDescribe1', 'helpDescribe2'] },
  { id: 'read-the-map', title: 'helpPageMap', body: ['helpMap1', 'helpMap2'] },
  { id: 'matches', title: 'helpPageMatches', body: ['helpMatches1', 'helpMatches2'] },
  { id: 'trace-a-source', title: 'helpPageTrace', body: ['helpTrace1', 'helpTrace2'] },
  { id: 'find-and-compare', title: 'helpPageFind', body: ['helpFind1', 'helpFind2'] },
  { id: 'gaps', title: 'helpPageGaps', body: ['helpGaps1'] },
  { id: 'curate', title: 'helpPageCurate', body: ['helpCurate1'] },
];

/** The same-origin page the visitor came from (not /help itself); the home page otherwise. */
function backHref() {
  try {
    const from = new URL(document.referrer);
    if (from.origin === window.location.origin && from.pathname !== '/help') return from.pathname + from.search + from.hash;
  } catch { /* no or foreign referrer */ }
  return '/';
}

export function Help() {
  const [back] = useState(backHref);
  // The route loads lazily, so the browser's own jump to #anchor happens before the section exists: land on it now.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, []);
  return (
    <Page>
      <a className={`${textLink} ${tapLink} text-sm`} href={back}>← {t('helpBack')}</a>
      <div className="mt-4"><PageHeader eyebrow={t('helpEyebrow')} title={t('helpTitle')} intro={t('helpIntro')} /></div>
      <nav aria-label={t('helpContents')} className="mb-8">
        <p className="console-label mb-2 text-dim">{t('helpContents')}</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {/* The public learning path only; curator notes stay last and apart (their #curate anchor still works). */}
          {SECTIONS.filter((s) => s.id !== 'curate').map((s) => <li key={s.id}><a className={textLink} href={`#${s.id}`}>{t(s.title)}</a></li>)}
        </ul>
      </nav>
      {/* With the global 6.5rem scroll-padding, this lands each section 1rem under the live header at any width. */}
      <div className="grid gap-4">
        {SECTIONS.map((s) => (
          <Panel as="section" key={s.id} aria-labelledby={`help-${s.id}`} id={s.id} className={`scroll-mt-[calc(var(--header-h,6.5rem)-6.5rem+1rem)] ${s.id === 'curate' ? 'mt-8 border-dashed bg-transparent' : ''}`}>
            <h2 id={`help-${s.id}`} className="text-xl font-semibold text-text">{t(s.title)}</h2>
            {s.body.map((key) => <p key={key} className="mt-2 max-w-3xl text-dim">{t(key)}</p>)}
            {s.id === 'start' && <div className="mt-3 flex flex-wrap items-center gap-3">
              <a className={textLink} href="/?tour=1#console">{t('tourReplay')}</a>
              <WalkthroughButton size="sm" />
            </div>}
            {s.id === 'start' && <WalkthroughTranscript />}
            {s.id === 'trace-a-source' && <a className={`${textLink} mt-3 inline-block`} href="/case">{t('caseEyebrow')}</a>}
          </Panel>
        ))}
        <p className="text-dim">{t('helpGlossary')} <a className={textLink} href="/methods#plain-words">{t('helpGlossaryLink')}</a></p>
      </div>
    </Page>
  );
}
