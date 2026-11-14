/**
 * Per-tab drafts (sessionStorage). The Console writes its scenario draft under CONSOLE_DRAFT_KEY (Coder B's
 * readDraft/write, Console.tsx); Home lands a returning visitor who has one on the console; the Library keeps its
 * last search and filters. Storage failures are ignored: the page works, it just doesn't remember.
 */
export const CONSOLE_DRAFT_KEY = 'ignis-console-draft';
export const LIBRARY_QUERY_KEY = 'ignis-library-query';

export function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // storage disabled or full: nothing to keep
  }
}
