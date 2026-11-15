import { useCallback, useRef } from 'react';

/**
 * One pattern for every internal scroll box (with the `.scroll-area` class in index.css): a thin designed bar, and an
 * edge fade only where content continues. Attach the returned callback ref to the scrolling element.
 *
 * - `data-more="start end"`: which edges have more content, recomputed from the scroll position on every scroll and
 *   resize (no timers). Nothing is set while the element doesn't actually overflow (e.g. the rail below 1280px).
 * - `data-scrolling`: set on scroll, cleared on `scrollend`, so the idle bar can dim and return while moving.
 * - `tabindex="0"` while it overflows, so keyboard users can focus it and scroll with the arrow keys; removed when
 *   there is nothing to scroll (no dead tab stop).
 * - `peek` (vertical only): shrinks the viewport by `--peek` px so the fold cuts through a `[data-peek]` block
 *   instead of landing in the gap between two, which reads as "finished". Use `var(--peek, 0px)` in its max-height.
 */
export function useScrollArea(axis: 'x' | 'y' = 'y', { peek = false } = {}) {
  const cleanup = useRef<(() => void) | null>(null);
  return useCallback((el: HTMLElement | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!el) return;
    const update = () => {
      const style = getComputedStyle(el);
      const overflow = axis === 'y' ? style.overflowY : style.overflowX;
      if (overflow !== 'auto' && overflow !== 'scroll') {
        delete el.dataset.more;
        el.style.removeProperty('--peek');
        el.removeAttribute('tabindex');
        return;
      }
      if (peek) setPeek(el);
      const position = axis === 'y' ? el.scrollTop : Math.abs(el.scrollLeft);
      const size = axis === 'y' ? el.clientHeight : el.clientWidth;
      const total = axis === 'y' ? el.scrollHeight : el.scrollWidth;
      const more = moreEdges(position, size, total);
      if (more) el.dataset.more = more;
      else delete el.dataset.more;
      if (total > size + 1) el.tabIndex = 0;
      else el.removeAttribute('tabindex');
    };
    // Chromium repaints a ::-webkit-scrollbar only when the box scrolls or lays out, so a :hover / :focus-within /
    // [data-scrolling] change alone never shows on the thumb. Flipping scrollbar-gutter for one synchronous layout
    // repaints it without moving anything (the bar is already there).
    const repaintBar = () => {
      if (!el.dataset.more) return;
      el.style.scrollbarGutter = getComputedStyle(el).scrollbarGutter === 'auto' ? 'stable' : 'auto';
      void el.offsetWidth;
      el.style.removeProperty('scrollbar-gutter');
    };
    const onScroll = () => {
      el.dataset.scrolling = '';
      update();
    };
    const onScrollEnd = () => {
      delete el.dataset.scrolling;
      repaintBar();
    };
    const hoverOrFocus = ['pointerenter', 'pointerleave', 'focusin', 'focusout'] as const;
    // Content can grow inside a fixed-height box (a <details> opening), so watch the children as well as the box.
    const resize = new ResizeObserver(update);
    const watch = () => {
      resize.disconnect();
      resize.observe(el);
      for (const child of el.children) resize.observe(child);
    };
    const children = new MutationObserver(() => {
      watch();
      update();
    });
    watch();
    children.observe(el, { childList: true });
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('scrollend', onScrollEnd);
    // After the event, so :hover / :focus-within already match when the bar repaints.
    const repaintSoon = () => requestAnimationFrame(repaintBar);
    for (const type of hoverOrFocus) el.addEventListener(type, repaintSoon);
    update();
    cleanup.current = () => {
      resize.disconnect();
      children.disconnect();
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('scrollend', onScrollEnd);
      for (const type of hoverOrFocus) el.removeEventListener(type, repaintSoon);
    };
  }, [axis, peek]);
}

/** Which edges have more content: "start", "end", both, or "" (1px tolerance for fractional scroll positions). */
export function moreEdges(position: number, size: number, total: number): string {
  return [position > 1 && 'start', position + size < total - 1 && 'end'].filter(Boolean).join(' ');
}

const MAX_PEEK = 160;

/**
 * How many px to shrink a scroll box (fold = its height without a peek) so the fold cuts a block, showing about half of
 * it (at most 56px), instead of landing in the gap between blocks. 0 when it already cuts one or nothing overflows.
 * Blocks are `{ top, height }` in content coordinates.
 */
export function peekOffset(fold: number, contentHeight: number, blocks: { top: number; height: number }[]): number {
  if (contentHeight <= fold + 1) return 0;
  const above = blocks.filter((block) => block.height > 0 && block.top < fold).sort((a, b) => b.top - a.top); // nearest first
  for (const block of above) {
    const shown = fold - block.top;
    if (shown >= 24 && shown <= block.height - 24) return 0; // already cut mid-block: a natural peek
    const target = block.top + Math.min(56, block.height / 2);
    if (target <= fold) return Math.min(MAX_PEEK, Math.round(fold - target));
  }
  return 0;
}

function setPeek(el: HTMLElement) {
  const current = parseFloat(el.style.getPropertyValue('--peek')) || 0;
  const fold = el.clientHeight + current; // where the fold would be without a peek, in content coordinates
  const origin = el.getBoundingClientRect().top + el.clientTop - el.scrollTop;
  const blocks = [...el.querySelectorAll<HTMLElement>('[data-peek]')].map((block) => {
    const box = block.getBoundingClientRect();
    return { top: box.top - origin, height: box.height };
  });
  const next = peekOffset(fold, el.scrollHeight, blocks);
  if (next !== current) el.style.setProperty('--peek', `${next}px`);
}
