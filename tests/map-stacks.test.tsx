import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { nextInStack, stackPoints } from '../src/lib/mapStacks';
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

  it('steps through a stack and clears after the last run', () => {
    expect(nextInStack(silicone, null)?.id).toBe('si-1');
    expect(nextInStack(silicone, 'si-2')?.id).toBe('si-3');
    expect(nextInStack(silicone, 'si-4')).toBeNull();
    expect(nextInStack(silicone, 'elsewhere')?.id).toBe('si-1');
  });

  it('renders one tap target with a count badge, every mark at its own stored position', () => {
    const html = renderToStaticMarkup(<EvidenceMap experiments={[...silicone, alone]} scenario={null} matches={[]} status="connected" selectedId="si-3" onSelect={() => {}} />);
    expect(html.match(/id="map-point-/g)).toHaveLength(2); // the stack + the lone run
    expect(html).toContain('id="map-point-si-1"');
    expect(html).toContain('data-stack="4"');
    expect(html).toContain('4 runs at this point: Saffire II-1, Saffire II-2, Saffire II-3, Saffire II-4. Press to step through them.');
    expect(html).toContain('>4</text>');
    expect(html).toContain('Run 3 of 4 at this point. Tap the point again for the next.');
    expect(html.match(/<path d="M /g)!.length).toBeGreaterThanOrEqual(4); // four hexagons drawn, none moved or hidden from the DOM
  });

  it('draws no decorative radar wedge inside the plot', () => {
    const html = renderToStaticMarkup(<EvidenceMap experiments={[alone]} scenario={null} matches={[]} status="connected" selectedId={null} onSelect={() => {}} />);
    expect(html).not.toContain('map-radar');
    expect(html).not.toContain('<foreignObject');
  });
});
