import { t, type TranslationKey } from '../../i18n';

export type UsageHelpKey = Exclude<Extract<TranslationKey, `help${string}`>, 'helpLabel'>;

export function UsageHelp({ topic }: { topic: UsageHelpKey }) {
  return <details className="mt-2 max-w-prose text-sm leading-relaxed text-dim">
    <summary className="w-fit cursor-pointer py-2 text-amber underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-amber">{t('helpLabel')}</summary>
    <p className="mt-1">{t(topic)}</p>
  </details>;
}
