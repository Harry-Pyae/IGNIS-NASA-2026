import { renderToStaticMarkup as render } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Slider } from '../src/components/ui/Slider';

it('an unspecified slider is never disabled: it stays draggable and says it is unset', () => {
  const html = render(<Slider label="Airflow" value={null} min={0} max={30} unit="cm/s" onChange={() => {}} allowUnspecified unspecifiedLabel="Not specified" />);
  expect(html).not.toMatch(/<input[^>]*\sdisabled/);
  expect(html).toContain('data-unset=""');
  expect(html).toContain('aria-valuetext="Not specified"');
});

it('a set slider looks and reads like O₂: no unset marker', () => {
  const html = render(<Slider label="O₂" value={21} min={14} max={32} unit="%" onChange={() => {}} allowUnspecified />);
  expect(html).not.toMatch(/<input[^>]*\sdisabled/);
  expect(html).not.toContain('data-unset');
  expect(html).not.toContain('aria-valuetext');
});
