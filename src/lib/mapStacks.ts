/**
 * Runs drawn within `radius` px of each other on the Evidence Map share one tap target (a "stack"): one tap or Enter
 * steps through them, a badge shows how many there are. Every run is still DRAWN at its own stored position: nothing
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

/** The next run to select in a stack: the first, then each in turn, then none (a last tap clears, like a single dot). */
export function nextInStack<T extends { id: string }>(stack: readonly T[], selectedId: string | null): T | null {
  const index = stack.findIndex((item) => item.id === selectedId);
  if (index < 0) return stack[0] ?? null;
  return stack[index + 1] ?? null;
}
