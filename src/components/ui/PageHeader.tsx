import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

/**
 * One page shell for every route (Round 3 consistency pass). Content pages use the default width; tool pages that
 * need room (curation, the design kit) pass `wide`. Same gutters and vertical rhythm everywhere.
 */
export function Page({ wide = false, className, children }: { wide?: boolean; className?: string; children: ReactNode }) {
  return <main className={cx('mx-auto w-full px-4 py-12 sm:px-6', wide ? 'max-w-7xl' : 'max-w-5xl', className)}>{children}</main>;
}

/** Eyebrow (mono, amber) → display h1 → optional intro. `aside` sits beside the title block (e.g. curator secret). */
export function PageHeader({ eyebrow, title, intro, aside }: { eyebrow: string; title: string; intro?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="console-label text-amber">{eyebrow}</p>
        <h1 className="display mt-3 text-4xl text-text">{title}</h1>
        {intro && <div className="mt-4 max-w-2xl text-lg text-dim">{intro}</div>}
      </div>
      {aside}
    </header>
  );
}
