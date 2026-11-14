import { glossary, t } from '../i18n';
import { Page, PageHeader, Panel, textLink } from '../components/ui';
import { useLocale } from '../context/LocaleContext';
import {
  BURMESE_METHODS_STAGES,
  BURMESE_METHODS_PRINCIPLES,
  BURMESE_GLOSSARY,
} from '../i18n/burmese';

const stagesEn = [
  [t('methodsStages0'), t('methodsStages1')],
  [t('methodsStages2'), t('methodsStages3')],
  [t('methodsStages4'), t('methodsStages5')],
  [t('methodsStages6'), t('methodsStages7')],
] as const;

const principlesEn = [
  [t('methodsPrinciples0'), t('methodsPrinciples1')],
  [t('methodsPrinciples2'), t('methodsClaimsGuarantee')],
  [t('methodsPrinciples3'), t('methodsPrinciples4')],
  [t('methodsPrinciples5'), t('methodsPrinciples6')],
  [t('methodsPrinciples7'), t('methodsPrinciples8')],
] as const;

export function Methods() {
  const { locale } = useLocale();
  const isMy = locale === 'my';

  const stages = isMy ? BURMESE_METHODS_STAGES : stagesEn;
  const principles = isMy ? BURMESE_METHODS_PRINCIPLES : principlesEn;
  const glossaryList = isMy ? BURMESE_GLOSSARY : glossary();

  return (
    <Page>
      <PageHeader
        help="helpMethods"
        eyebrow={isMy ? 'နည်းလမ်းများ / အထောက်အထား ရှာဖွေရယူမှု' : t('methodsEyebrow')}
        title={isMy ? 'ဇာတ်လမ်းအခြေအနေမှ မူရင်းရင်းမြစ်အထိ' : t('methodsTitle')}
        intro={
          isMy
            ? 'မစ်ရှင်မေးခွန်းတစ်ခုကို IGNIS ဖြင့် လိုက်လံကြည့်ရှုပြီး အဆိုတစ်ခုကို မဖတ်ရှုမီ စနစ်က မည်သည့်နေရာတွင် စစ်ဆေးသည်ကို လေ့လာပါ။'
            : t('methodsIntro')
        }
      />
      <section
        id="pipeline"
        aria-labelledby="pipeline"
        className="my-10 grid items-start gap-6 scroll-mt-[calc(var(--header-h,6.5rem)+1.25rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
      >
        <Panel>
          <h2 id="pipeline" className="scroll-mt-[calc(var(--header-h,6.5rem)+1.25rem)] text-xl font-semibold">
            {isMy ? 'အထောက်အထား စစ်ဆေးပုံ အဆင့်ဆင့်' : t('methodsPipeline')}
          </h2>
          <svg className="mx-auto mt-5 block w-full max-w-xs" viewBox="0 0 264 322" role="img" aria-labelledby="diagram-title diagram-desc">
            <title id="diagram-title">{isMy ? 'မစ်ရှင် ကွန်ဆိုးလ်က အနှစ်ချုပ်ကို မည်သို့တည်ဆောက်ပုံ' : t('methodsDiagramTitle')}</title>
            <desc id="diagram-desc">{isMy ? 'အတည်ပြုထားသော အချက်အလက်များနှင့် မှတ်တမ်းကတ်များမှ အချက်အလက်များကို ရှာဖွေစစ်ဆေးသည်။' : t('methodsDiagramDesc')}</desc>
            <g fill="none" stroke="var(--color-amber)" strokeWidth="2">
              <path d="M66 59v14h64m64-14v14h-64v22m-5-6 5 6 5-6 M130 143v27m-5-6 5 6 5-6 M130 220v27m-5-6 5 6 5-6" />
            </g>
            {/* Top row dual boxes: widened to 124px each with comfortable vertical height (54px) for 2-line rendering */}
            <g>
              <rect x="4" y="5" width="124" height="54" rx="8" fill="var(--color-bg)" stroke="var(--color-raised)" />
              <text x="66" y="27" textAnchor="middle" fill="var(--color-text)" fontSize={isMy ? "12" : "13"} fontWeight="500">
                <tspan x="66" dy="0">{isMy ? 'ထည့်ထားသည့်' : 'Your'}</tspan>
                <tspan x="66" dy="16">{isMy ? 'အချက်များ' : 'inputs'}</tspan>
              </text>
            </g>
            <g>
              <rect x="136" y="5" width="124" height="54" rx="8" fill="var(--color-bg)" stroke="var(--color-raised)" />
              <text x="198" y="27" textAnchor="middle" fill="var(--color-text)" fontSize={isMy ? "12" : "13"} fontWeight="500">
                <tspan x="198" dy="0">{isMy ? 'အတည်ပြု' : 'Verified'}</tspan>
                <tspan x="198" dy="16">{isMy ? 'မှတ်တမ်းများ' : 'cards'}</tspan>
              </text>
            </g>
            {/* Lower 3 full-width boxes */}
            {([
              [20, 95, 224, 48, isMy ? 'ရှာဖွေမှုနှင့် လွှမ်းခြုံမှု' : t('methodsDiagramRetrieval')],
              [20, 172, 224, 48, isMy ? 'အဆို စစ်ဆေးမှု' : t('methodsDiagramValidation')],
              [20, 249, 224, 48, isMy ? 'အနှစ်ချုပ်နှင့် ကိုးကားချက်' : t('methodsDiagramBrief')],
            ] as const).map(([x, y, w, h, label]) => (
              <g key={label}>
                <rect x={x} y={y} width={w} height={h} rx="8" fill="var(--color-bg)" stroke="var(--color-raised)" />
                <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill="var(--color-text)" fontSize={isMy ? "13" : "14"} fontWeight="500">
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </Panel>
        <ol className="space-y-5">
          {stages.map(([title, body], i) => (
            <li key={title} className="border-l border-raised pl-5">
              <h3 className="font-semibold">
                <span className="mr-3 font-mono text-amber">0{i + 1}</span>
                {title}
              </h3>
              <p className="mt-1 text-dim leading-relaxed">{body}</p>
            </li>
          ))}
        </ol>
      </section>
      <h2 className="scroll-mt-[calc(var(--header-h,6.5rem)+1.25rem)] text-2xl font-semibold">
        {isMy ? 'အနှစ်ချုပ်၏ အခြေခံမူ ၅ ချက်' : t('methodsPrinciples')}
      </h2>
      <dl className="mt-5 divide-y divide-border">
        {principles.map(([title, body]) => (
          <div key={title} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]">
            <dt className="font-semibold">{title}</dt>
            <dd className="text-dim leading-relaxed">{body}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 border-l-2 border-raised pl-4 text-dim leading-relaxed">
        {isMy
          ? 'ကိုးကားထားသော စမ်းသပ်ချက်များအပေါ် ကောက်ယူချက်ဖြစ်ပြီး တိုက်ရိုက်တိုင်းတာတွေ့ရှိချက် မဟုတ်ပါ။ စစ်ဆေးထားသော ကိုးကားချက်များသည် စမ်းသပ်မှုများအကြား အကြောင်းရင်း-ရလဒ် သို့မဟုတ် တူညီမှုကို အတည်ပြုခြင်း မဟုတ်ပါ။'
          : t('methodsInterpretationLimit')}
      </p>
      <section id="plain-words" aria-labelledby="plain-words" className="mt-10 scroll-mt-[calc(var(--header-h,6.5rem)+1.25rem)]">
        <h2 id="plain-words" className="scroll-mt-[calc(var(--header-h,6.5rem)+1.25rem)] text-2xl font-semibold">
          {isMy ? 'ရိုးရှင်းသော ဝေါဟာရများ' : t('plainWords')}
        </h2>
        <dl className="mt-5 divide-y divide-border">
          {glossaryList.map(({ term, plain }) => (
            <div key={term} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]">
              <dt className="font-semibold">{term}</dt>
              <dd className="text-dim leading-relaxed">{plain}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="mt-8 border-l-2 border-raised pl-4 text-dim leading-relaxed">
        {isMy
          ? 'အသုံးပြုသူမြင်ကွင်း စာသားတိုင်းကို စိစစ်ပြီး i18n စနစ်တွင် ထည့်သွင်းထားသည်။ ဘာသာစကားအသစ် ထည့်သွင်းခြင်းသည် အင်ဂျင်နီယာပိုင်းဆိုင်ရာ လုပ်ငန်းမဟုတ်ဘဲ ဘာသာပြန်ခြင်းဆိုင်ရာ လုပ်ငန်းဖြစ်ပြီး အသိုင်းအဝိုင်း၏ ဘာသာပြန်ဆိုမှုများကို ကြိုဆိုပါသည်။'
          : t('methodsLanguages')}
      </p>
      <a className={`mt-6 inline-block ${textLink}`} href="/sources">
        {isMy ? 'မူရင်း အကိုးအကား ရင်းမြစ်များကို ကြည့်ရှုပါ' : t('methodsSources')}
      </a>
    </Page>
  );
}
