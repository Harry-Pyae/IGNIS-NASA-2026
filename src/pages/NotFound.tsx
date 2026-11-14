import { t } from '../i18n';
import { Page, PageHeader } from '../components/ui';
export function NotFound() {
  return <Page>
    <PageHeader eyebrow={t('notFoundEyebrow')} title={t('notFoundTitle')} intro={t('notFoundIntro')} />
    <a href="/" className="text-amber underline underline-offset-4">{t('notFoundHome')}</a>
  </Page>;
}
