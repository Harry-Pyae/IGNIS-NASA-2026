import { Page, PageHeader, Panel, textLink } from '../components/ui';
import { COPY } from '../lib/copy';
import { useLocale } from '../context/LocaleContext';
import {
  BURMESE_METHODS_STAGES,
  BURMESE_METHODS_PRINCIPLES,
  BURMESE_GLOSSARY,
} from '../i18n/burmese';

const stages = [
  ['Confirm the scenario', 'Free text becomes editable conditions. A material alias resolves to a catalog name, or you choose the material yourself. Unspecified inputs stay blank.'],
  ['Retrieve verified experiments', 'Only cards published by a named reviewer enter the catalog. Domain, material and form gates run before ranking. Oxygen, airflow, thickness and pressure are compared where reported; the match chips explain which conditions contributed.'],
  ['Check each statement', 'The server checks the structure of the proposed Brief, its experiment IDs, and each cited field, value and unit against the retrieved cards. Observed sentences use checked facts; gaps come from the coverage check.'],
  ['Follow the evidence', 'Read the observation or labelled interpretation, select its citation, then open the source at the location recorded on the card. Invalid statements are withheld. If narration fails, the matched evidence remains available.'],
] as const;

const principles = [
  ['Report observations', 'A recorded outcome describes the experiment in which it was observed. It is not a verdict on a new scenario.'],
  ['Check every claim', COPY.claimsGuarantee],
  ['Retrieve before narrating', 'Material resolution, eligibility, ranking and coverage follow fixed rules. The language model parses the scenario and narrates retrieved evidence; it does not choose the matches.'],
  ['Keep scientific domains separate', 'Solid-material matches exclude smoke detection and liquid-droplet combustion. Research context is labelled separately.'],
  ['Show the limits', 'Missing measurements stay missing. Source quotations retain the original units. An uncovered combination and a value outside the current catalog range are different findings.'],
] as const;

export function Methods() {
  const { locale } = useLocale();
  const isMy = locale === 'my';

  const currentStages = isMy ? BURMESE_METHODS_STAGES : stages;
  const currentPrinciples = isMy ? BURMESE_METHODS_PRINCIPLES : principles;
  const currentGlossary = isMy ? BURMESE_GLOSSARY : COPY.glossary;

  const diagramBoxes = [
    {
      x: 6,
      y: 6,
      w: 124,
      h: 54,
      lines: isMy ? ['ထည့်ထားသည့်', 'အချက်များ'] : ['Your inputs'],
    },
    {
      x: 140,
      y: 6,
      w: 124,
      h: 54,
      lines: isMy ? ['အတည်ပြု', 'မှတ်တမ်းများ'] : ['Verified cards'],
    },
    {
      x: 15,
      y: 104,
      w: 240,
      h: 52,
      lines: [isMy ? 'ရှာဖွေမှုနှင့် လွှမ်းခြုံမှု' : 'Retrieval + coverage'],
    },
    {
      x: 15,
      y: 180,
      w: 240,
      h: 52,
      lines: [isMy ? 'အဆို စစ်ဆေးမှု' : 'Claim validation'],
    },
    {
      x: 15,
      y: 256,
      w: 240,
      h: 52,
      lines: [isMy ? 'အနှစ်ချုပ်နှင့် ကိုးကားချက်' : 'Brief + citations'],
    },
  ];

  return (
    <Page>
      <PageHeader
        eyebrow={isMy ? 'နည်းလမ်းများ / အထောက်အထား ရှာဖွေရယူမှု' : 'Methods / evidence retrieval'}
        title={isMy ? 'ဇာတ်လမ်းအခြေအနေမှ မူရင်းရင်းမြစ်အထိ' : 'From scenario to source'}
        intro={
          isMy
            ? 'မစ်ရှင်မေးခွန်းတစ်ခုကို IGNIS ဖြင့် လိုက်လံကြည့်ရှုပြီး အဆိုတစ်ခုကို မဖတ်ရှုမီ စနစ်က မည်သည့်နေရာတွင် စစ်ဆေးသည်ကို လေ့လာပါ။'
            : 'Follow a mission question through IGNIS and see where the software checks a statement before you read it.'
        }
      />

      <section
        id="pipeline"
        aria-labelledby="pipeline-heading"
        className="my-10 grid items-start gap-6 scroll-mt-[calc(var(--header-h,7rem)+1.5rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
      >
        <Panel>
          <h2 id="pipeline-heading" className="scroll-mt-[calc(var(--header-h,7rem)+1.5rem)] text-xl font-semibold">
            {isMy ? 'အထောက်အထား စစ်ဆေးပုံ အဆင့်ဆင့်' : 'Evidence pipeline'}
          </h2>
          <svg
            className="mx-auto mt-5 block w-full max-w-xs"
            viewBox="0 0 270 326"
            role="img"
            aria-labelledby="diagram-title diagram-desc"
          >
            <title id="diagram-title">
              {isMy ? 'မစ်ရှင်အနှစ်ချုပ်ကို ကွန်ဆိုးလ်က မည်သို့ တည်ဆောက်ပုံ' : 'How the mission console builds a Brief'}
            </title>
            <desc id="diagram-desc">
              {isMy
                ? 'အတည်ပြုထားသော အချက်အလက်များနှင့် မှတ်တမ်းကတ်များသည် တိကျသော ရှာဖွေရယူမှုသို့ စီးဝင်သည်။ ရရှိသော ကတ်များနှင့် လွှမ်းခြုံမှုတို့က အဆိုစစ်ဆေးမှုကို ထောက်ပံ့ပြီး စစ်ဆေးပြီးသောအဆိုများ သို့မဟုတ် အထောက်အထားသီးသန့် အခြေအနေကို ဖော်ပြသည်။'
                : 'Confirmed inputs and verified catalog cards feed deterministic retrieval. Retrieved cards and coverage feed claim validation. The console displays checked claims or the evidence-only fallback.'}
            </desc>

            {/* Connecting arrows */}
            <g fill="none" stroke="var(--color-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Convergence from Box 1 and Box 2 into Box 3 */}
              <path d="M68 60v22h67m67-22v22h-67v20m-5-6 5 6 5-6" />
              {/* Arrow from Box 3 to Box 4 */}
              <path d="M135 156v22m-5-6 5 6 5-6" />
              {/* Arrow from Box 4 to Box 5 */}
              <path d="M135 232v22m-5-6 5 6 5-6" />
            </g>

            {/* Boxes and labels */}
            {diagramBoxes.map(({ x, y, w, h, lines }) => (
              <g key={lines.join('-')}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="8"
                  fill="var(--color-bg)"
                  stroke="var(--color-raised)"
                  strokeWidth="1.5"
                />
                <text
                  x={x + w / 2}
                  textAnchor="middle"
                  fill="var(--color-text)"
                  fontSize={lines.length > 1 ? '12.5' : '13'}
                  fontWeight="500"
                >
                  {lines.length === 1 ? (
                    <tspan x={x + w / 2} y={y + h / 2 + 5}>
                      {lines[0]}
                    </tspan>
                  ) : (
                    <>
                      <tspan x={x + w / 2} y={y + 24}>
                        {lines[0]}
                      </tspan>
                      <tspan x={x + w / 2} y={y + 43}>
                        {lines[1]}
                      </tspan>
                    </>
                  )}
                </text>
              </g>
            ))}
          </svg>
        </Panel>

        <ol className="space-y-5">
          {currentStages.map(([title, body], i) => (
            <li key={title} className="border-l border-raised pl-5 scroll-mt-[calc(var(--header-h,7rem)+1.5rem)]">
              <h3 className="font-semibold text-text">
                <span className="mr-3 font-mono text-amber">0{i + 1}</span>
                {title}
              </h3>
              <p className="mt-1 text-dim leading-relaxed">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <h2
        id="five-principles"
        className="scroll-mt-[calc(var(--header-h,7rem)+1.5rem)] text-2xl font-semibold text-text"
      >
        {isMy ? 'အနှစ်ချုပ်၏ နောက်ကွယ်မှ အခြေခံမူ ၅ ချက်' : 'Five principles behind the Brief'}
      </h2>

      <dl className="mt-5 divide-y divide-border">
        {currentPrinciples.map(([title, body]) => (
          <div key={title} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]">
            <dt className="font-semibold text-text">{title}</dt>
            <dd className="text-dim leading-relaxed">{body}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 border-l-2 border-raised pl-4 text-dim leading-relaxed">
        {isMy
          ? 'ကိုးကားထားသော စမ်းသပ်ချက်များအပေါ် ကောက်ယူချက်ဖြစ်ပြီး တိုက်ရိုက်တိုင်းတာတွေ့ရှိချက် မဟုတ်ပါ။ စစ်ဆေးထားသော ကိုးကားချက်များသည် စမ်းသပ်မှုများအကြား အကြောင်းရင်း-ရလဒ် သို့မဟုတ် တူညီမှုကို အတည်ပြုခြင်း မဟုတ်ပါ။'
          : COPY.interpretationLimit}
      </p>

      <section
        id="plain-words"
        aria-labelledby="plain-words-heading"
        className="mt-10 scroll-mt-[calc(var(--header-h,7rem)+1.5rem)]"
      >
        <h2 id="plain-words-heading" className="scroll-mt-[calc(var(--header-h,7rem)+1.5rem)] text-2xl font-semibold text-text">
          {isMy ? 'ရိုးရှင်းသော ဝေါဟာရများ' : 'Plain words'}
        </h2>
        <dl className="mt-5 divide-y divide-border">
          {currentGlossary.map(({ term, plain }) => (
            <div key={term} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]">
              <dt className="font-semibold text-text">{term}</dt>
              <dd className="text-dim leading-relaxed">{plain}</dd>
            </div>
          ))}
        </dl>
      </section>

      <a className={`mt-8 inline-block ${textLink}`} href="/sources">
        {isMy ? 'မူရင်း အကိုးအကား ရင်းမြစ်များကို ကြည့်ရှုပါ' : 'Browse the source bibliography'}
      </a>
    </Page>
  );
}
