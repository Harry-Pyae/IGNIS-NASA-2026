/** The 60-second case: source rows agree with the verified cards; the green-flash beat ships only signed + ledgered. */
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CASE_RUNS, GREEN_FLASH, renderableGreenFlash, rowFlow, sourceRowFor, type GreenFlashBeat } from '../src/lib/caseContent';
import { CASE_CARD_ID, SEED_CARDS } from '../src/lib/fixtures';

const signed: GreenFlashBeat = {
  still_url: '/media/saffire-1-green-flash.webp',
  still_alt: 'Saffire-I sample with a green glow at the flame front',
  still_credit: 'NASA, Saffire-I flight video (public domain)',
  ledger_id: 'R2-014',
  quote: 'A verbatim sentence from the NASA page.',
  source_title: 'A NASA page',
  source_url: 'https://www.nasa.gov/example',
  locator: '0:42',
  verified_by: 'Aung Kyaw',
};

describe('BASS two-run question', () => {
  it('rows are the p.9 appendix rows of the two verified runs and agree with their cards', () => {
    expect(CASE_RUNS.map((r) => r.row.join(' '))).toEqual(['GMT96-T7 2.2 10 21 BASS', 'GMT96-T8 2.2 5 21 BASS']);
    expect(CASE_RUNS[0]!.id).toBe(CASE_CARD_ID);
    for (const run of CASE_RUNS) {
      const seed = SEED_CARDS.find((c) => c.test_id === run.test_id)!;
      expect(rowFlow(run)).toBe(seed.flow_cm_s);
    }
  });
  it('withdraws a row the moment its card stops agreeing (an R1 correction)', () => {
    const t7 = CASE_RUNS[0]!;
    expect(sourceRowFor({ id: t7.id, flow_cm_s: 10 })).toBe(t7);
    expect(sourceRowFor({ id: t7.id, flow_cm_s: 9.5 })).toBeNull();
    expect(sourceRowFor({ id: 'not-a-case-run', flow_cm_s: 10 })).toBeNull();
  });
});

describe('green-flash beat gate', () => {
  it('renders a signed, ledgered entry', () => {
    expect(renderableGreenFlash(signed)).toEqual(signed);
  });
  it('withholds without a real reviewer name, a ledger row, a quote or an https NASA source', () => {
    for (const verified_by of ['', 'R1', 'TBD', 'placeholder']) expect(renderableGreenFlash({ ...signed, verified_by })).toBeNull();
    expect(renderableGreenFlash({ ...signed, ledger_id: ' ' })).toBeNull();
    expect(renderableGreenFlash({ ...signed, quote: '' })).toBeNull();
    expect(renderableGreenFlash({ ...signed, source_url: 'http://www.nasa.gov/example' })).toBeNull();
  });
  it('accepts only a same-origin still path: no protocol-relative, absolute, traversal or non-image paths', () => {
    for (const still_url of ['//evil.example/flash.webp', 'https://elsewhere.example/flash.jpg', '/media/../secret.webp', 'media/flash.webp', '/media/flash.svg', '/'])
      expect(renderableGreenFlash({ ...signed, still_url })).toBeNull();
  });
  // Build-time check of the real entry. While it is empty this passes trivially, so signing it never fails CI for
  // the wrong reason; once filled, the still must exist and its ledger row must be in the media ledger.
  it('the shipped entry, once filled, is renderable, its still exists and its ledger row is recorded', () => {
    if (!GREEN_FLASH) return;
    expect(renderableGreenFlash(GREEN_FLASH)).toEqual(GREEN_FLASH);
    expect(existsSync(`public${GREEN_FLASH.still_url}`)).toBe(true);
    expect(readFileSync('docs/media-ledger.md', 'utf8')).toContain(GREEN_FLASH.ledger_id);
  });
});
