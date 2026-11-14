import { cx } from '../../lib/cx';

/**
 * Three tiers, one rule set (see /kit "Button hierarchy"):
 *   primary   — filled amber. The one main action of a section: Confirm scenario, Run guided mission, Export dataset.
 *   secondary — outlined. Real actions people must not miss: Cite this, Compare, Edit scenario, Copy share link, Retry.
 *   tertiary  — text link. Inline utilities only: Clear oxygen, Set airflow to 0, Back to library, source links.
 * `ghost` is kept for the internal curation tool only; public pages use the three tiers.
 * Every size gets a ≥44px hit area (an invisible ::after), so small buttons stay touch-safe without growing.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
type Variant = ButtonVariant;
type Size = ButtonSize;

const VARIANTS: Record<Variant, string> = {
  primary: 'btn-primary text-on-action font-semibold',
  secondary:
    'border border-raised bg-panel/70 text-text shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-text)_6%,transparent)] can-hover:hover:border-amber/60 can-hover:hover:bg-panel',
  tertiary: 'text-amber underline decoration-amber/45 underline-offset-4 can-hover:hover:decoration-amber',
  ghost: 'text-dim can-hover:hover:text-text can-hover:hover:bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)]',
};
const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-5 text-[15px] gap-2.5 rounded-xl',
};
/** Tertiary is inline text: no box height, its own hit area. */
const TERTIARY_SIZE = 'h-auto px-0 text-sm gap-1.5 rounded-sm';

/** Tertiary look for links inside prose and long titles (wraps; no button box). */
export const textLink = 'text-amber underline decoration-amber/45 underline-offset-4 can-hover:hover:decoration-amber [overflow-wrap:anywhere]';

/** Class string for a button tier — use it on `<a>` when a link must look like a button (e.g. Compare). */
export function buttonClass(variant: Variant = 'secondary', size: Size = 'md', className?: string) {
  return cx(
    'pressable relative inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium tracking-[-0.005em] transition-[color,background-color,border-color,box-shadow,filter,transform,text-decoration-color] duration-[180ms] ease-[var(--ease-out)]',
    "after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:min-h-full after:-translate-y-1/2 after:content-['']",
    'disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45',
    VARIANTS[variant],
    variant === 'tertiary' ? TERTIARY_SIZE : SIZES[size],
    className,
  );
}
