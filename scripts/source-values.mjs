// Source-value guard (2026-11-15 data restore): published cards must equal the source-true values in
// tests/fixtures/source-values.json, built from the signing checklists and re-read against the NASA PDFs.
// Used by scripts/verify-live.mjs (live catalog) and tests/source-values.test.ts (the fixture itself).
import { readFileSync } from 'node:fs';

export const SOURCE_VALUES = JSON.parse(readFileSync(new URL('../tests/fixtures/source-values.json', import.meta.url), 'utf8'));

/** Every field where a card differs from its source value, plus every card that has no source entry at all. */
export function sourceMismatches(cards, fixture = SOURCE_VALUES) {
  const out = [];
  for (const card of cards) {
    const want = fixture.cards[card.test_id];
    if (!want) {
      out.push(`${card.test_id}: no entry in tests/fixtures/source-values.json (add its source values with the quote first)`);
      continue;
    }
    for (const field of fixture.fields) {
      if (!(field in want)) continue;
      const a = want[field];
      const b = card[field] ?? null;
      const same = typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-9 : a === b;
      if (!same) out.push(`${card.test_id}: ${field} is ${JSON.stringify(b)}, source says ${JSON.stringify(a)} (${want.source})`);
    }
  }
  return out;
}

/** "GMT178-T14 2.2 4→2.8 16.9 Quenched" → { flow: 2.8 (final), o2: 16.9, comment: 'Quenched' } */
export function parseAppendixRow(row) {
  const m = row.match(/^GMT\d+-T\d+[ab]?\s+([\d.]+)\s+(?:([\d.]+)→)?([\d.]+)\s+([\d.]+)\s+(.+)$/);
  return m ? { width: Number(m[1]), flowFrom: m[2] ? Number(m[2]) : null, flow: Number(m[3]), o2: Number(m[4]), comment: m[5] } : null;
}
