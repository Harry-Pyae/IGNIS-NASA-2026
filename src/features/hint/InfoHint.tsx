import { useState } from 'react';
import { Button } from '../../components/ui';

export function InfoHint({ id, label, children }: {
  id: string;
  label: string;
  children: string;
}) {
  const [open, setOpen] = useState(false);

  return <span className="relative inline-flex">
    <Button type="button" size="sm" className="min-h-11 min-w-11 !transition-none !transform-none"
      aria-label={label} aria-expanded={open} aria-controls={id}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
      onClick={() => setOpen(true)}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}>?</Button>
    <span id={id} hidden={!open}
      className="absolute top-full left-0 z-10 w-48 rounded-lg border border-border bg-bg p-3 text-sm text-text shadow-lg">
      {children}
    </span>
  </span>;
}
