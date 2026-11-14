import { glossary, t } from '../i18n';
import { Page, PageHeader, Panel, textLink } from '../components/ui';

const stages = [
  [t('methodsStages0'), t('methodsStages1')],
  [t('methodsStages2'), t('methodsStages3')],
  [t('methodsStages4'), t('methodsStages5')],
  [t('methodsStages6'), t('methodsStages7')],
] as const;

const principles = [
  [t('methodsPrinciples0'), t('methodsPrinciples1')],
  [t('methodsPrinciples2'), t('methodsClaimsGuarantee')],
  [t('methodsPrinciples3'), t('methodsPrinciples4')],
  [t('methodsPrinciples5'), t('methodsPrinciples6')],
  [t('methodsPrinciples7'), t('methodsPrinciples8')],
] as const;

export function Methods() {
  return <Page>
    <PageHeader help="helpMethods" eyebrow={t('methodsEyebrow')} title={t('methodsTitle')}
      intro={t('methodsIntro')} />
    <section aria-labelledby="pipeline" className="my-10 grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <Panel>
        <h2 id="pipeline" className="text-xl font-semibold">{t('methodsPipeline')}</h2>
        <svg className="mx-auto mt-5 block w-full max-w-xs" viewBox="0 0 260 318" role="img" aria-labelledby="diagram-title diagram-desc">
          <title id="diagram-title">{t('methodsDiagramTitle')}</title>
          <desc id="diagram-desc">{t('methodsDiagramDesc')}</desc>
          <g fill="none" stroke="var(--color-amber)" strokeWidth="2">
            <path d="M64 47v26h66m66-26v26h-66v20m-5-6 5 6 5-6 M130 143v27m-5-6 5 6 5-6 M130 220v27m-5-6 5 6 5-6"/>
          </g>
          {([[4,5,120,42,t('methodsDiagramInputs')],[136,5,120,42,t('methodsDiagramCards')],[20,95,220,48,t('methodsDiagramRetrieval')],[20,172,220,48,t('methodsDiagramValidation')],[20,249,220,48,t('methodsDiagramBrief')]] as const).map(([x,y,w,h,label]) =>
            <g key={label}><rect x={x} y={y} width={w} height={h} rx="8" fill="var(--color-bg)" stroke="var(--color-raised)"/><text x={x+w/2} y={y+h/2+5} textAnchor="middle" fill="var(--color-text)" fontSize="14">{label}</text></g>)}
        </svg>
      </Panel>
      <ol className="space-y-5">{stages.map(([title, body], i) => <li key={title} className="border-l border-raised pl-5">
        <h3 className="font-semibold"><span className="mr-3 font-mono text-amber">0{i+1}</span>{title}</h3><p className="mt-1 text-dim">{body}</p>
      </li>)}</ol>
    </section>
    <h2 className="text-2xl font-semibold">{t('methodsPrinciples')}</h2>
    <dl className="mt-5 divide-y divide-border">{principles.map(([title, body]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]"><dt className="font-semibold">{title}</dt><dd className="text-dim">{body}</dd></div>)}</dl>
    <p className="mt-6 border-l-2 border-raised pl-4 text-dim">{t('methodsInterpretationLimit')}</p>
    <section className="mt-10" aria-labelledby="plain-words">
      <h2 id="plain-words" className="text-2xl font-semibold">{t('plainWords')}</h2>
      <dl className="mt-5 divide-y divide-border">{glossary().map(({ term, plain }) =>
        <div key={term} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]"><dt className="font-semibold">{term}</dt><dd className="text-dim">{plain}</dd></div>
      )}</dl>
    </section>
    <a className={`mt-8 inline-block ${textLink}`} href="/sources">{t('methodsSources')}</a>
  </Page>;
}
