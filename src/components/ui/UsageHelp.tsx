import { t, type TranslationKey } from '../../i18n';
import { Icon } from './Icon';
import { textLink } from './buttonStyles';

/**
 * Round 9 (Help migration): a task-named link into /help, never an identical "How to use this" disclosure.
 * Micro-facts needed at the moment of use (units, "Not specified", hatched cells, withheld claims, recovery
 * actions) stay inline beside the task; orientation and walkthroughs live on /help.
 */
const TOPICS = {
  helpHome: { label: 'helpLinkHome', anchor: 'start' },
  helpScenario: { label: 'helpLinkScenario', anchor: 'describe' },
  helpMap: { label: 'helpLinkMap', anchor: 'read-the-map' },
  helpMatches: { label: 'helpLinkMatches', anchor: 'matches' },
  helpBrief: { label: 'helpLinkBrief', anchor: 'trace-a-source' },
  helpGaps: { label: 'helpLinkGaps', anchor: 'gaps' },
  helpMethods: { label: 'helpLinkMethods', anchor: 'trace-a-source' },
  helpSources: { label: 'helpLinkSources', anchor: 'trace-a-source' },
  helpLibrary: { label: 'helpLinkLibrary', anchor: 'find-and-compare' },
  helpDetail: { label: 'helpLinkDetail', anchor: 'trace-a-source' },
  helpCompare: { label: 'helpLinkCompare', anchor: 'find-and-compare' },
  helpCurate: { label: 'helpLinkCurate', anchor: 'curate' },
} as const satisfies Record<string, { label: TranslationKey; anchor: string }>;

export type UsageHelpKey = keyof typeof TOPICS;

export function UsageHelp({ topic }: { topic: UsageHelpKey }) {
  const { label, anchor } = TOPICS[topic];
  return (
    <a href={`/help#${anchor}`} className={`${textLink} mt-2 inline-flex w-fit items-center gap-1.5 text-sm`}>
      <Icon name="info" size={15} className="shrink-0" />{t(label)}
    </a>
  );
}
