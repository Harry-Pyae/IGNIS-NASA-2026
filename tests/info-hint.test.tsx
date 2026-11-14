import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { InfoHint } from '../src/features/hint/InfoHint';

it('provides a description target for the field and an initially collapsed control', () => {
  const html = renderToStaticMarkup(<>
    <label htmlFor="airflow" aria-describedby="airflow-hint">Airflow</label>
    <InfoHint id="airflow-hint" label="About airflow">Airflow help</InfoHint>
    <input id="airflow" />
  </>);
  expect(html).toContain('aria-describedby="airflow-hint"');
  expect(html).toContain('aria-expanded="false" aria-controls="airflow-hint"');
  expect(html).toContain('id="airflow-hint" hidden');
  expect(html).not.toContain('anim-');
});
