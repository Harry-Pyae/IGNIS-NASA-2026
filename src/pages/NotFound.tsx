import { t } from '../i18n';
import { Page, PageHeader } from '../components/ui';
export function NotFound() {
  return <Page>
    <PageHeader eyebrow={t('notFoundEyebrow')} title={t('notFoundTitle')} intro={t('notFoundIntro')} />
    <a href="/" className="inline-flex min-h-6 items-center text-amber underline underline-offset-4">{t('notFoundHome')}</a>
  </Page>;
}
