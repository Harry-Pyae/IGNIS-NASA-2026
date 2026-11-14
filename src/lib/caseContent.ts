/**
 * The 60-second case (/case). OWNER: Coder A (shape and data); R1 signs, R2 ledgers.
 *
 * 1. The BASS two-run question (always on): verified cards GMT96-T7 and GMT96-T8 plus their appendix rows from
 *    NTRS 20150008962 p.9, transcribed verbatim. A row is shown only while the live card still records the same
 *    airflow as the row (sourceRowFor), so a later R1 correction withdraws the row instead of contradicting it.
 *
 * 2. Beat 1, the green flash (optional opener). RENDERS ONLY WHEN BOTH GATES PASS (renderableGreenFlash;
 *    tests/case-content.test.ts also checks, once filled, that the still exists and its ledger row is in
 *    docs/media-ledger.md):
 *     • R1: `verified_by` is the real full name of the person who checked `quote` word for word against NASA's own
 *       page at `source_url` (the same name rule as publishing a card);
 *     • R2: `ledger_id` is the still's row in docs/media-ledger.md (real NASA public-domain material only).
 *    Until then the case opens on the BASS question. Never fill this with a placeholder, a paraphrase or an
 *    unledgered image. The request to R1/R2 is in docs/FACT-CHECK-QUEUE.md section D.
 */
import { verifierNameProblem } from './verifier.js';
import type { Experiment } from './types.js';

// ---------------------------------------------------------------------------
// 1. The BASS two-run question
// ---------------------------------------------------------------------------
export const CASE_SOURCE = {
  title: 'Concurrent flame growth, spread and extinction over composite fabric samples in low speed purely forced flow in microgravity',
  ntrs_id: '20150008962',
  table: 'Appendix: Test summary of flat SIBAL fabrics in concurrent flow in BASS and BASS II',
  page: 9,
  pdf_url: 'https://ntrs.nasa.gov/api/citations/20150008962/downloads/20150008962.pdf#page=9',
  /** Column headings as printed. */
  columns: ['Test No.', 'Sample width (cm)', 'Flow (cm/s)', 'O2 % by Vol.', 'Comments'],
} as const;

export interface CaseRun {
  /** Verified card id (production). */
  id: string;
  test_id: string;
  /** The appendix row, verbatim, split into the printed columns. */
  row: readonly [string, string, string, string, string];
}

export const CASE_RUNS: readonly CaseRun[] = [
  { id: 'ec0cf0b6-c415-4495-966f-0a0a3e7667d1', test_id: 'BASS GMT96-T7', row: ['GMT96-T7', '2.2', '10', '21', 'BASS'] },
  { id: '6ce7fe58-631f-4dfa-a8f4-14914d580675', test_id: 'BASS GMT96-T8', row: ['GMT96-T8', '2.2', '5', '21', 'BASS'] },
];

/** The printed airflow of a run's appendix row, in cm/s. */
export const rowFlow = (run: CaseRun) => Number(run.row[2]);

/** The source row to show for a card: only when the live card still records the row's airflow. */
export function sourceRowFor(card: Pick<Experiment, 'id' | 'flow_cm_s'>): CaseRun | null {
  const run = CASE_RUNS.find((r) => r.id === card.id);
  return run && card.flow_cm_s === rowFlow(run) ? run : null;
}

// ---------------------------------------------------------------------------
// 2. Beat 1: the green flash
// ---------------------------------------------------------------------------
export interface GreenFlashBeat {
  /** Same-origin path under /public (e.g. /media/saffire-1-green-flash.webp). */
  still_url: string;
  still_alt: string;
  /** e.g. "NASA, Saffire-I flight video (public domain)". */
  still_credit: string;
  /** Row id in docs/media-ledger.md. */
  ledger_id: string;
  /** NASA's explanation, verbatim. */
  quote: string;
  source_title: string;
  source_url: string;
  /** Page, timestamp or section of the quote. */
  locator: string;
  verified_by: string;
}

export const GREEN_FLASH: GreenFlashBeat | null = null;

/** A same-origin still under /public: one leading slash (never protocol-relative "//"), an image extension. */
export const STILL_PATH = /^\/(?!\/)[\w-]+(?:\/[\w.-]+)*\.(?:webp|avif|jpe?g|png)$/;

export function renderableGreenFlash(entry: GreenFlashBeat | null = GREEN_FLASH): GreenFlashBeat | null {
  if (!entry) return null;
  if (verifierNameProblem(entry.verified_by)) return null;
  if (!entry.ledger_id.trim() || !entry.quote.trim() || !entry.locator.trim() || !entry.source_title.trim()) return null;
  if (!/^https:\/\//.test(entry.source_url)) return null;
  if (!STILL_PATH.test(entry.still_url) || entry.still_url.includes('..') || !entry.still_alt.trim() || !entry.still_credit.trim()) return null;
  return entry;
}
