import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../../components/ui';

/**
 * The "?" pattern: a short explanation one tap away, so dense sections show results first. Static (no motion), so it
 * is safe inside the Brief and map. It opens towards the roomier side of the screen (`align` is only the initial guess).
 * Never put a disclaimer behind it: state and limitation lines stay visible.
 */
export function InfoHint({ id, label, children, align = 'start' }: {
  id: string;
  label: string;
  children: ReactNode;
  align?: 'start' | 'end';
}) {
  const [open, setOpen] = useState(false);
  // Open towards the roomier side: decided from where the "?" actually sits (rows wrap differently at 390px).
  const [side, setSide] = useState(align);
  // Wider than the room on either side (narrow phones): nudge it back inside the screen with an 8px margin.
  const panel = useRef<HTMLSpanElement>(null);
  const [nudge, setNudge] = useState(0);
  useLayoutEffect(() => {
    if (!open || !panel.current) return setNudge(0);
    const box = panel.current.getBoundingClientRect();
    const left = box.left - nudge;
    const right = box.right - nudge;
    setNudge(left < 8 ? 8 - left : right > window.innerWidth - 8 ? window.innerWidth - 8 - right : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- measure once per open/side change, not per nudge
  }, [open, side]);

  return <span className="relative inline-flex">
    <Button type="button" size="sm" className="!size-6 !rounded-full !px-0 !text-[11px] !transition-none !transform-none"
      aria-label={label} aria-expanded={open} aria-controls={id}
      onBlur={() => setOpen(false)}
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        setSide(box.left + box.width / 2 > window.innerWidth / 2 ? 'end' : 'start');
        setOpen((value) => !value);
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}>?</Button>
    <span id={id} ref={panel} hidden={!open} style={nudge ? { translate: `${nudge}px 0` } : undefined}
      className={`absolute top-full z-30 mt-2 w-max max-w-[min(20rem,calc(100vw-3rem))] rounded-lg border border-border bg-bg p-3 text-left text-sm font-normal normal-case leading-relaxed tracking-normal text-text shadow-lg ${side === 'end' ? 'right-0' : 'left-0'}`}>
      {children}
    </span>
  </span>;
}
