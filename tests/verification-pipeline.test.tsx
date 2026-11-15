import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup as render } from 'react-dom/server';
import { expect, it } from 'vitest';
import { t } from '../src/i18n';
import { Methods } from '../src/pages/Methods';

it('Methods explains how records are published: four rules, then the curator line', () => {
  const html = render(<Methods />);
  expect(html).toContain('id="publishing"');
  expect(html).toContain('How records are published');
  for (const k of ['methodsPublish0', 'methodsPublish2', 'methodsPublish4', 'methodsPublish6'] as const) expect(html).toContain(t(k));
  expect(html.indexOf(t('methodsPublishCurate'))).toBeGreaterThan(html.indexOf(t('methodsPublish7').slice(0, 30)));
});

it('the copy stays catalog-bounded (no guarantees)', () => {
  const copy = (['methodsPublishIntro', 'methodsPublish1', 'methodsPublish3', 'methodsPublish5', 'methodsPublish7', 'methodsPublishCurate', 'verificationLink'] as const).map((k) => t(k)).join(' ');
  expect(copy).not.toMatch(/guarantee|always correct|never wrong|predict/i);
});

it('/curate is named, never linked: no page, nav or footer points at it', () => {
  const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? files(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []);
  const linking = files('src').filter((f) => !f.endsWith(join('pages', 'Curate.tsx')) && /href=\{?["'`]\/curate/.test(readFileSync(f, 'utf8')));
  expect(linking).toEqual([]);
  expect(render(<Methods />)).not.toMatch(/href="\/curate/);
  if (existsSync('public/sitemap.xml')) expect(readFileSync('public/sitemap.xml', 'utf8')).not.toContain('/curate');
});
