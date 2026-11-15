/** Smallest tap target on the map, in CSS px (WCAG 2.2 target size, minimum). The plot's viewBox matches its CSS width. */
export const MAP_TARGET = 24;

/**
 * Runs drawn closer than `radius` px to ANY run of a stack join it (single linkage), so two tap areas never overlap:
 * a stack is one tap target (a tap or Enter opens its first run, the detail card lists every run as a switcher, a badge
 * shows the count). Every run is still DRAWN at its own stored position: nothing is jittered or moved. Pixel-based on
 * purpose, so a phone (narrower plot) groups what it can't separate.
 * ponytail: O(n²) linkage, fine for catalogs of hundreds of plotted runs.
 */
export function stackPoints<T>(points: readonly T[], at: (point: T) => readonly [number, number], radius = MAP_TARGET): T[][] {
  const stacks: { xy: (readonly [number, number])[]; members: T[] }[] = [];
  for (const point of points) {
    const [x, y] = at(point);
    const near = stacks.filter((stack) => stack.xy.some(([sx, sy]) => Math.hypot(sx - x, sy - y) < radius));
    const into = near[0] ?? { xy: [], members: [] };
    for (const other of near.slice(1)) {
      into.xy.push(...other.xy);
      into.members.push(...other.members);
      stacks.splice(stacks.indexOf(other), 1);
    }
    into.xy.push([x, y]);
    into.members.push(point);
    if (!near.length) stacks.push(into);
  }
  return stacks.map((stack) => stack.members);
}

/** Tap radius around one drawn run: half the gap to the nearest run of ANOTHER stack, between 12 and 18 px. */
export function tapRadius(xy: readonly [number, number], others: readonly (readonly [number, number])[]): number {
  const gap = Math.min(Infinity, ...others.map(([x, y]) => Math.hypot(x - xy[0], y - xy[1])));
  return Math.max(MAP_TARGET / 2, Math.min(18, gap / 2));
}

/** What a tap on a stack selects: its first run, or nothing when one of its runs is already open (a second tap clears,
 * like a single dot). The detail card's switcher reaches every other run directly, so nobody cycles blind. */
export function stackTap<T extends { id: string }>(stack: readonly T[], selectedId: string | null): T | null {
  return stack.some((item) => item.id === selectedId) ? null : (stack[0] ?? null);
}

/** The short name a stack switcher chip shows: the test id without its campaign ("Saffire II-3" → "II-3"). */
export function stackChipLabel(testId: string): string {
  return testId.trim().split(/\s+/).at(-1) ?? testId;
}
