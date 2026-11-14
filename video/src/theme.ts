import { Easing } from 'remotion';
import type { EvidenceCard } from './types';

/** Mirror of src/styles/tokens.css (the app's tokens). Change them there first, then here. */
export const C = {
  bg: '#0c0f16',
  panel: '#131824',
  border: '#232b3a',
  raised: '#3a4663',
  text: '#e8eaf0',
  dim: '#9aa3b5',
  faint: '#6e7891',
  amber: '#f5a623',
  flame: '#f97316',
  blue: '#4c8dff',
  violet: '#a78bfa',
  success: '#7fd08a',
  untestedBg: '#241d10',
  untestedBorder: '#6b5620',
} as const;

export const SANS = "'Space Grotesk', system-ui, sans-serif";
export const MONO = "'IBM Plex Mono', ui-monospace, monospace";

/** Token curves (--ease-out, --ease-in-out). Never ease-in. */
export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);
export const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);

/** Same mapping as the app's map legend (Console.tsx outcomeColor). */
export const OUTCOME: Record<EvidenceCard['outcome'], string> = {
  sustained: C.flame,
  extinguished: C.blue,
  transition: C.violet,
  partial: C.success,
};

export const monoLabel = {
  fontFamily: MONO,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
} as const;
