/** Round 3 plain-language copy: short, never predictive, absence always bounded to the current catalog. */
import { describe, expect, it } from 'vitest';
import { CHIP_STATUS } from '../src/components/ui/Chip';
import { COPY } from '../src/lib/copy';

const { plain, glossary } = COPY;
const lines = [
  ...Object.values(plain.hints), ...Object.values(plain.chips), ...Object.values(plain.outcomes),
  ...Object.values(plain.brief), ...Object.values(plain.map), plain.compared,
  plain.firstVisit.mission, plain.firstVisit.explore,
  ...Object.values(plain.collapsed), ...Object.values(plain.gapScope), plain.regionCells,
];
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe('plain-language copy', () => {
  it('every hint stays under ~25 words; glossary entries stay short too', () => {
    for (const line of lines) expect(words(line), line).toBeLessThanOrEqual(25);
    for (const { plain: text } of glossary) expect(words(text), text).toBeLessThanOrEqual(25);
  });

  it('never predicts and never claims absence beyond the current IGNIS catalog', () => {
    for (const text of [...lines, ...glossary.map((g) => g.plain)]) {
      expect(text).not.toMatch(/predict|will burn|would burn|safe|never tested/i);
      if (/catalog/i.test(text) && /\bno\b|outside|beyond/i.test(text)) expect(text).toMatch(/current IGNIS catalog|catalog’s range/);
    }
  });

  it('explains every chip status the Match Panel can show', () => {
    expect(Object.keys(plain.chips).sort()).toEqual(Object.keys(CHIP_STATUS).sort());
  });
});
