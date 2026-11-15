import { t } from '../i18n';

const OUTCOME = /\boutcome (sustained|extinguished|transition|partial|no_ignition)\b/g;

/**
 * Display-only: validated OBSERVED text spells outcomes as stored codes ("outcome no_ignition"). Show the app-wide
 * plain label instead ("outcome: Did not ignite"). The claim and its validated refs are unchanged.
 */
export const plainClaimText = (text: string) =>
  text
    .replace(OUTCOME, (_, code: 'sustained' | 'extinguished' | 'transition' | 'partial' | 'no_ignition') => `outcome: ${t(code)}`)
    // Stored identifiers such as cotton_fiberglass read as words ("cotton fiberglass"); values and IDs are untouched.
    .replace(/\b[a-z]+(?:_[a-z]+)+\b/g, (word) => word.replace(/_/g, ' '));
