import { describe, expect, it } from 'vitest';
import { moreEdges, peekOffset } from '../src/lib/scrollArea';

describe('scroll area: edge fades and the fold peek', () => {
  it('fades only the edges where content continues', () => {
    expect(moreEdges(0, 700, 1000)).toBe('end');
    expect(moreEdges(150, 700, 1000)).toBe('start end');
    expect(moreEdges(300, 700, 1000)).toBe('start');
    expect(moreEdges(299.5, 700, 1000)).toBe('start'); // fractional end position counts as the end
    expect(moreEdges(0, 700, 700)).toBe('');
  });

  it('shrinks the box so the fold cuts the nearest block instead of a gap', () => {
    // Fold at 700 lands in the 12px gap after a block that ends at 688.
    const blocks = [{ top: 600, height: 88 }, { top: 400, height: 180 }];
    expect(peekOffset(700, 1100, blocks)).toBe(700 - (600 + 44)); // half of the 88px block shows
  });

  it('keeps a fold that already cuts a block mid-way, and never peeks when nothing overflows', () => {
    expect(peekOffset(700, 1100, [{ top: 640, height: 120 }])).toBe(0); // 60px shown, 60px hidden
    expect(peekOffset(700, 700, [{ top: 600, height: 88 }])).toBe(0);
  });

  it('skips a block barely under the fold and cuts the one above it, capped at 160px', () => {
    // Only 10px of the lower block shows: too little to read as a peek, so the block above is cut instead.
    expect(peekOffset(700, 1100, [{ top: 690, height: 100 }, { top: 560, height: 120 }])).toBe(700 - (560 + 56));
    expect(peekOffset(900, 1400, [{ top: 300, height: 300 }])).toBe(160);
  });
});
