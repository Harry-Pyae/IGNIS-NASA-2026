/** Beat 1 gate: the green-flash beat shows only with an R1 signature and an R2 ledger row. */
import { describe, expect, it } from 'vitest';
import { GREEN_FLASH, renderableGreenFlash, type GreenFlashBeat } from '../src/lib/caseContent';

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

describe('green-flash beat gate', () => {
  it('ships empty: nothing renders until R1 and R2 fill it', () => {
    expect(GREEN_FLASH).toBeNull();
    expect(renderableGreenFlash()).toBeNull();
  });
  it('renders a signed, ledgered entry', () => {
    expect(renderableGreenFlash(signed)).toEqual(signed);
  });
  it('withholds without a real reviewer name, a ledger row, a quote or an https NASA source', () => {
    for (const verified_by of ['', 'R1', 'TBD', 'placeholder']) expect(renderableGreenFlash({ ...signed, verified_by })).toBeNull();
    expect(renderableGreenFlash({ ...signed, ledger_id: ' ' })).toBeNull();
    expect(renderableGreenFlash({ ...signed, quote: '' })).toBeNull();
    expect(renderableGreenFlash({ ...signed, source_url: 'http://www.nasa.gov/example' })).toBeNull();
    expect(renderableGreenFlash({ ...signed, still_url: 'https://elsewhere.example/flash.jpg' })).toBeNull();
  });
});
