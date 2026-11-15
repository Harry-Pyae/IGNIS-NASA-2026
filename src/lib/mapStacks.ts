/**
 * Runs drawn within `radius` px of each other on the Evidence Map share one tap target (a "stack"): a tap or Enter opens
 * the first run, the detail card lists every run in the stack as a switcher, and a badge shows how many there are. Every run is still DRAWN at its own stored position: nothing
 * is jittered or moved. Pixel-based on purpose, so a phone (narrower plot) groups what it can't separate.
 * ponytail: greedy O(n²) grouping, fine for catalogs of hundreds of plotted runs.
 */
export function stackPoints<T>(points: readonly T[], at: (point: T) => readonly [number, number], radius = 8): T[][] {
  const stacks: { x: number; y: number; members: T[] }[] = [];
  for (const point of points) {
    const [x, y] = at(point);
    const near = stacks.find((stack) => Math.hypot(stack.x - x, stack.y - y) < radius);
    if (near) near.members.push(point);
    else stacks.push({ x, y, members: [point] });
  }
  return stacks.map((stack) => stack.members);
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
