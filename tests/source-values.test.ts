import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs shared with scripts/verify-live.mjs
import { parseAppendixRow, SOURCE_VALUES, sourceMismatches } from '../scripts/source-values.mjs';

type Entry = Record<string, unknown> & { source: string; appendix_row?: string; o2_pct?: number | null; flow_cm_s?: number | null; outcome?: string };
const cards = SOURCE_VALUES.cards as Record<string, Entry>;
const OUTCOME: Record<string, string> = { Quenched: 'extinguished', 'Blow-off': 'extinguished', 'No ignition': 'no_ignition' };

describe('source-values fixture (the guard against editing cards away from their sources)', () => {
  it('covers the whole catalog, each entry with a source locator', () => {
    expect(Object.keys(cards)).toHaveLength(31);
    for (const [test, e] of Object.entries(cards)) expect(e.source, test).toMatch(/NTRS \d{11}/);
  });

  it('every BASS entry equals its appendix row as printed in NTRS 20150008962 p.9', () => {
    const rows = Object.entries(cards).filter(([, e]) => e.appendix_row);
    expect(rows.length).toBe(12);
    for (const [test, e] of rows) {
      const row = parseAppendixRow(e.appendix_row!);
      expect(row, test).not.toBeNull();
      expect(e.o2_pct, `${test} O₂`).toBe(row.o2);
      expect(e.flow_cm_s, `${test} flow (final value of the row)`).toBe(row.flow);
      if (OUTCOME[row.comment]) expect(e.outcome, `${test} outcome`).toBe(OUTCOME[row.comment]);
    }
  });

  it('the seed cards match it', () => {
    const seed = readFileSync(new URL('../supabase/seed.sql', import.meta.url), 'utf8');
    for (const test of ['BASS GMT96-T7', 'BASS GMT96-T8', 'BASS-II GMT45-T4']) {
      const e = cards[test]!;
      const values = new RegExp(`'${test}'[^)]*?\\n\\s*${e.thickness_mm}, ${e.o2_pct}, ${e.flow_cm_s}, ${e.pressure_kpa},`);
      expect(seed, test).toMatch(values);
    }
  });

  it('flags a card moved off its source value, and a card with no source entry', () => {
    const t14 = { test_id: 'BASS-II GMT178-T14', ...cards['BASS-II GMT178-T14'] };
    expect(sourceMismatches([t14])).toEqual([]);
    expect(sourceMismatches([{ ...t14, flow_cm_s: 7 }])[0]).toMatch(/GMT178-T14: flow_cm_s is 7, source says 2.8/);
    expect(sourceMismatches([{ ...t14, o2_pct: 20, fuel_form: 'rod' }])).toHaveLength(2);
    expect(sourceMismatches([{ test_id: 'Made-up X-1' }])[0]).toMatch(/no entry/);
  });
});
