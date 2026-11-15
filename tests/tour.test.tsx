import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Tour } from '../src/features/tour/Tour';
import { markTourOffered, shouldOfferTour, TOUR_OFFER_KEY } from '../src/features/tour/tourOffer';
import { WalkthroughButton } from '../src/features/walkthrough/Walkthrough';
import { COPY } from '../src/lib/copy';
import { WALKTHROUGH, walkthroughLabelSeconds } from '../src/lib/walkthrough';

const memory = (seed: Record<string, string> = {}) => {
  const data = new Map(Object.entries(seed));
  const store = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
  return () => store;
};

describe('tour offer: shown once, never forced', () => {
  it('a first visit is offered the tour; never again once it was shown', () => {
    const store = memory();
    expect(shouldOfferTour(store)).toBe(true);
    markTourOffered(store);
    expect(shouldOfferTour(store)).toBe(false);
    expect(store().getItem(TOUR_OFFER_KEY)).toBe('1');
  });
  it('a returning visitor (dismissed the older first-visit note) is not offered it', () => {
    expect(shouldOfferTour(memory({ 'ignis-scenario-intro-dismissed': '1' }))).toBe(false);
  });
  it('blocked storage means no offer, so it cannot reappear on every visit', () => {
    expect(shouldOfferTour(() => { throw new Error('SecurityError'); })).toBe(false);
    expect(() => markTourOffered(() => { throw new Error('SecurityError'); })).not.toThrow();
  });
});

describe('tour content', () => {
  it('every coach mark stays within 20 words', () => {
    for (const line of Object.values(COPY.plain.tour.steps)) expect(line.split(/\s+/).filter((w) => /\w/.test(w)).length, line).toBeLessThanOrEqual(20);
  });
  it('opens on step 1 of 8 with Skip and Next, no Back', () => {
    const html = renderToStaticMarkup(<Tour open={false} onClose={() => {}} />);
    expect(html).toContain('<dialog');
    expect(html).toContain('Step 1 of 8');
    expect(html).toContain('Mission scenario');
    expect(html).toContain('Skip tour');
    expect(html).toContain('>Next<');
    expect(html).not.toContain('>Back<');
  });
});

describe('walkthrough content gate', () => {
  it('no video: the button is absent, not broken', () => {
    expect(renderToStaticMarkup(<WalkthroughButton video={null} />)).toBe('');
  });
  it('the label states the real length, rounded up to 5 s', () => {
    expect(walkthroughLabelSeconds({ seconds: 78.4 })).toBe(80);
    expect(walkthroughLabelSeconds({ seconds: 90 })).toBe(90);
  });
  it('a shipped video exists in public/ and stays ≤ 30 MB', () => {
    if (!WALKTHROUGH) return;
    for (const file of [WALKTHROUGH.src, WALKTHROUGH.poster]) expect(existsSync(join('public', file)), file).toBe(true);
    expect(statSync(join('public', WALKTHROUGH.src)).size).toBeLessThanOrEqual(30 * 1024 * 1024);
    expect(WALKTHROUGH.transcript.length).toBeGreaterThan(0);
  });
});
