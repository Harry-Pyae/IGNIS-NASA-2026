import { Page, PageHeader } from '../components/ui';
export function NotFound() {
  return <Page>
    <PageHeader eyebrow="404 / Navigation" title="Page not found" intro="This address does not lead to an IGNIS page." />
    <a href="/" className="text-amber underline underline-offset-4">Return to the mission console</a>
  </Page>;
}
