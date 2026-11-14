import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../components/ui';

const MARGIN = 16;
const MAX_WIDTH = 320;

type Placement = { top: number; left?: number; right?: number; maxWidth: number };

/**
 * The "?" pattern for form labels: a short explanation one tap away. Static (no motion).
 * Open, the panel is a fixed overlay on <body>, positioned from the "?" itself: no scroll container (the desktop
 * control rail scrolls vertically) can clip it or grow a sideways scrollbar for it, and it always stays on screen.
 * Closed, the text stays in place as the hidden aria-describedby target.
 */
export function InfoHint({ id, label, children, align = 'start' }: {
  id: string;
  label: string;
  children: ReactNode;
  align?: 'start' | 'end';
}) {
  const trigger = useRef<HTMLElement | null>(null); // set on click (Button doesn't forward refs)
  const panel = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement | null>(null);

  // Below the "?" (above when there's no room), towards the roomier side, clamped inside the viewport.
  // Follows the "?" while the page or the rail scrolls.
  useLayoutEffect(() => {
    if (!open) return; // a stale placement is recomputed before paint on the next open
    const place = () => {
      if (!trigger.current || !panel.current) return;
      const box = trigger.current.getBoundingClientRect();
      const height = panel.current.offsetHeight;
      const maxWidth = Math.min(MAX_WIDTH, window.innerWidth - MARGIN * 2);
      const below = box.bottom + 8;
      const top = below + height > window.innerHeight - MARGIN && box.top - height - 8 >= MARGIN ? box.top - height - 8 : below;
      const towardsLeft = align === 'end' || box.left + box.width / 2 > window.innerWidth / 2;
      setPlacement(towardsLeft
        ? { top, right: Math.min(Math.max(MARGIN, window.innerWidth - box.right), window.innerWidth - MARGIN - maxWidth), maxWidth }
        : { top, left: Math.min(Math.max(MARGIN, box.left), window.innerWidth - MARGIN - maxWidth), maxWidth });
    };
    place();
    window.addEventListener('scroll', place, true); // capture: the rail's own scroll too
    window.addEventListener('resize', place);
    return () => { window.removeEventListener('scroll', place, true); window.removeEventListener('resize', place); };
  }, [open, align]);

  const text = 'rounded-lg border border-border bg-bg p-3 text-left text-sm font-normal normal-case leading-relaxed tracking-normal text-text shadow-lg';
  return <span className="inline-flex">
    <Button type="button" size="sm" className="!size-6 !rounded-full !px-0 !text-[11px] !transition-none !transform-none"
      aria-label={label} aria-expanded={open} aria-controls={id}
      onBlur={() => setOpen(false)}
      onClick={(event) => {
        trigger.current = event.currentTarget;
        setOpen((value) => !value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}>?</Button>
    {open
      ? createPortal(
        <span id={id} ref={panel} role="note" className={`fixed z-50 w-max ${text}`}
          style={placement ? { top: placement.top, left: placement.left, right: placement.right, maxWidth: placement.maxWidth }
            : { top: 0, left: 0, maxWidth: Math.min(MAX_WIDTH, window.innerWidth - MARGIN * 2), visibility: 'hidden' }}>{children}</span>,
        document.body)
      : <span id={id} hidden>{children}</span>}
  </span>;
}
