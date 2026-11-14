import { useState } from 'react';
import { Button } from '../../components/ui';

export function InfoHint({ id, label, children }: {
  id: string;
  label: string;
  children: string;
}) {
  const [open, setOpen] = useState(false);

  return <span className="relative inline-flex">
    <Button type="button" size="sm" className="!size-6 !rounded-full !px-0 !text-[11px] !transition-none !transform-none"
      aria-label={label} aria-expanded={open} aria-controls={id}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((value) => !value)}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}>?</Button>
    <span id={id} hidden={!open}
      className="absolute top-full left-0 z-10 mt-2 w-max max-w-[min(16rem,calc(100vw-3rem))] rounded-lg border border-border bg-bg p-3 text-sm text-text shadow-lg">
      {children}
    </span>
  </span>;
}
