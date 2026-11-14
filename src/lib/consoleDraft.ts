/**
 * Per-tab drafts (sessionStorage): leaving the Console or Library for another page, or reloading, keeps what the
 * visitor typed and chose. Read leniently: anything missing, stale or malformed is ignored, never thrown.
 */
import { z } from 'zod';
import { ParsedScenarioSchema, ResolvedScenarioSchema } from './types.js';

export const CONSOLE_DRAFT_KEY = 'ignis-console-draft';
export const LIBRARY_QUERY_KEY = 'ignis-library-query';

const ConsoleDraftSchema = z.object({
  presetId: z.string().nullable(),
  scenario: ParsedScenarioSchema,
  materialChoice: z.string().nullable(),
  description: z.string().max(5000),
  appliedEnvironmentId: z.string().nullable(),
  confirmed: ResolvedScenarioSchema.nullable(),
  inputsChanged: z.boolean(),
});
export type ConsoleDraft = z.infer<typeof ConsoleDraftSchema>;

export function parseConsoleDraft(raw: string | null): ConsoleDraft | null {
  if (!raw) return null;
  try {
    const parsed = ConsoleDraftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null; // storage disabled: the page still works, it just doesn't remember
  }
}

export function writeSession(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // storage disabled or full: nothing to keep
  }
}
