import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { stackChipLabel, stackPoints, stackTap, tapRadius } from '../src/lib/mapStacks';
import { EvidenceMap } from '../src/pages/Console';
import { card } from './helpers';

// The four Saffire-II silicone samples share 22.1 % O₂ and 20 cm/s: one point on the map.
const silicone = [1, 2, 3, 4].map((n) => card({ id: `si-${n}`, campaign: 'Saffire-II', test_id: `Saffire II-${n}`, outcome: 'no_ignition', o2_pct: 22.1, flow_cm_s: 20 }));
const alone = card({ id: 'alone', test_id: 'GMT96-T8', o2_pct: 21, flow_cm_s: 5 });

describe('co-located runs on the Evidence Map', () => {
  it('groups points closer than the radius and keeps the rest apart', () => {
    const at = (p: { x: number; y: number }) => [p.x, p.y] as const;
    expect(stackPoints([{ x: 0, y: 0 }, { x: 3, y: 4 }, { x: 40, y: 0 }], at).map((s) => s.length)).toEqual([2, 1]);
  });

  it('chains runs whose tap areas would overlap into one stack, so no two targets ever overlap', () => {
    const at = (p: { x: number; y: number }) => [p.x, p.y] as const;
    // 0 and 40 are 40 px apart, but 20 sits within 24 px of both: one stack of three.
    expect(stackPoints([{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 20, y: 0 }], at).map((s) => s.length)).toEqual([3]);
    expect(stackPoints([{ x: 0, y: 0 }, { x: 30, y: 0 }], at).map((s) => s.length)).toEqual([1, 1]);
    // Tap radius: half the gap to the nearest other stack, never under 12 px (a 24 px target) or over 18 px.
    expect(tapRadius([0, 0], [[30, 0]])).toBe(15);
    expect(tapRadius([0, 0], [[24, 0]])).toBe(12);
    expect(tapRadius([0, 0], [])).toBe(18);
  });

  it('a tap opens the first run of a stack, and a second tap clears it (no blind cycling)', () => {
    expect(stackTap(silicone, null)?.id).toBe('si-1');
    expect(stackTap(silicone, 'elsewhere')?.id).toBe('si-1');
    expect(stackTap(silicone, 'si-3')).toBeNull();
    expect(stackChipLabel('Saffire II-7')).toBe('II-7');
    expect(stackChipLabel('BASS-II GMT175-T9')).toBe('GMT175-T9');
  });

  it('renders one tap target with a count badge, every mark at its own stored position', () => {
    const html = renderToStaticMarkup(<EvidenceMap experiments={[...silicone, alone]} scenario={null} matches={[]} status="connected" selectedId="si-3" onSelect={() => {}} />);
    expect(html.match(/id="map-point-/g)).toHaveLength(2); // the stack + the lone run
    expect(html).toContain('id="map-point-si-1"');
    expect(html).toContain('data-stack="4"');
    expect(html).toContain('4 runs at or near this point: Saffire II-1, Saffire II-2, Saffire II-3, Saffire II-4. Press to open them.');
    expect(html).toContain('>4</text>');
    // The detail card lists every co-located run as a switcher: one chip per run, the open one pressed.
    expect(html).toContain('4 runs at or near this point — pick one:');
    expect(html.match(/data-hit="true"/g)).toHaveLength(5); // one tap area per drawn run, all inside its stack's button
    for (const n of [1, 2, 3, 4]) expect(html).toMatch(new RegExp(`aria-pressed="${n === 3}" aria-label="Saffire II-${n}"`));
    expect(html).not.toContain('Tap the point again');
    expect(html.match(/<path d="M /g)!.length).toBeGreaterThanOrEqual(4); // four hexagons drawn, none moved or hidden from the DOM
  });

  it('draws the untested hatch as one continuous masked layer, not one box per cell', () => {
    const html = renderToStaticMarkup(<EvidenceMap experiments={[...silicone, alone]} scenario={null} matches={[]} status="connected" selectedId={null} onSelect={() => {}} />);
    expect(html.split('fill="url(#ignis-untested-hatch)"')).toHaveLength(2); // exactly one hatched layer
    expect(html).toContain('mask="url(#ignis-untested-mask)"');
    expect(html).toContain('<feGaussianBlur');
    expect(html).not.toContain('stroke-dasharray="2 3"'); // no dashed per-cell boxes for out-of-range cells
  });

  it('draws no decorative radar wedge inside the plot', () => {
    const html = renderToStaticMarkup(<EvidenceMap experiments={[alone]} scenario={null} matches={[]} status="connected" selectedId={null} onSelect={() => {}} />);
    expect(html).not.toContain('map-radar');
    expect(html).not.toContain('<foreignObject');
  });
});
