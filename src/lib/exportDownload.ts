/**
 * Client side of GET /api/export (§8.1 item 6). OWNER: Coder A.
 * Fetches rather than navigating, so a 429/503 never replaces the page with raw JSON. The file is
 * whatever the server exports for the current verified revision; with zero verified cards that is
 * the honest README + `count: 0` file, never fixtures.
 */
import { catalogCsv } from './exportCsv';

export type ExportResult = { ok: true; filename: string } | { ok: false; reason: 'rate_limited' | 'unavailable' | 'network' };

/** Saves a Blob as a download in the browser. */
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

/** JSON is the canonical file; 'csv' flattens the same export (same revision and timestamp) for spreadsheets. */
export async function downloadCatalogExport(fetchFn: typeof fetch = fetch, save = saveBlob, format: 'json' | 'csv' = 'json'): Promise<ExportResult> {
  let res: Response;
  try {
    res = await fetchFn('/api/export');
  } catch {
    return { ok: false, reason: 'network' };
  }
  if (!res.ok) return { ok: false, reason: res.status === 429 ? 'rate_limited' : 'unavailable' };
  const filename = /filename="([^"]+)"/.exec(res.headers.get('content-disposition') ?? '')?.[1] ?? 'ignis-catalog.json';
  if (format === 'json') {
    save(await res.blob(), filename);
    return { ok: true, filename };
  }
  const csvName = filename.replace(/\.json$/, '') + '.csv';
  save(new Blob([catalogCsv(await res.json())], { type: 'text/csv;charset=utf-8' }), csvName);
  return { ok: true, filename: csvName };
}
