/**
 * Beat 1 of the 60-second case (/case/green-flash): a green-flash still from Saffire-I footage and NASA's own
 * explanation of it. OWNER: Coder A (shape); R1 signs the explanation, R2 ledgers the still.
 *
 * RENDERS ONLY WHEN BOTH GATES PASS (renderableGreenFlash, tests/case-content.test.ts):
 *  • R1: `verified_by` is the real full name of the person who checked `quote` word for word against NASA's own
 *    page at `source_url` (the same name rule as publishing a card);
 *  • R2: `ledger_id` is the still's row in docs/media-ledger.md (real NASA public-domain material only).
 * Until then the page opens at Beat 2. Never fill this with a placeholder, a paraphrase or an unledgered image.
 * The request to R1/R2 is in docs/FACT-CHECK-QUEUE.md (section D).
 */
import { verifierNameProblem } from './verifier.js';

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

export function renderableGreenFlash(entry: GreenFlashBeat | null = GREEN_FLASH): GreenFlashBeat | null {
  if (!entry) return null;
  if (verifierNameProblem(entry.verified_by)) return null;
  if (!entry.ledger_id.trim() || !entry.quote.trim() || !entry.locator.trim() || !entry.source_title.trim()) return null;
  if (!/^https:\/\//.test(entry.source_url)) return null;
  if (!entry.still_url.startsWith('/') || !entry.still_alt.trim() || !entry.still_credit.trim()) return null;
  return entry;
}
