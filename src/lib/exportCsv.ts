/**
 * CSV view of the open dataset (/api/export). OWNER: Coder A. The JSON stays canonical: this flattens the SAME
 * export (same revision, same timestamp) into one row per published run for spreadsheets.
 * Rules: nulls stay empty cells (never 0 or "N/A"); condition_changes keep their qualifier text ("10→2.2, final held");
 * outcome is the plain-language label; every row carries catalog_revision + exported_at; UTF-8 with a BOM so Excel
 * renders → and O₂ correctly.
 */
import { t } from '../i18n';
import type { Experiment } from './types';

/** UTF-8 byte-order mark: Excel reads the file as UTF-8 only when it is there. */
const BOM = String.fromCharCode(0xfeff);

type ExportFile = { catalog_revision: string; exported_at: string; experiments: Experiment[] };

const COLUMNS = [
  'campaign', 'run_id', 'material', 'material_class', 'fuel_form', 'o2_pct', 'pressure_kpa', 'flow_cm_s', 'outcome',
  'condition_changes', 'quote', 'locator', 'source_url', 'verified_by',
  'dataset_doi', 'dataset_version', 'dataset_file', 'dataset_row_or_time', 'catalog_revision', 'exported_at',
] as const;

/** "10→2.2, final held"; a run with changes on several parameters names each ("flow_cm_s 10→2.2, final held; …"). */
export function conditionText(changes: Experiment['condition_changes']): string | null {
  if (!changes?.length) return null;
  const named = new Set(changes.map((c) => c.parameter)).size > 1;
  return changes.map((c) => `${named ? `${c.parameter} ` : ''}${c.from}→${c.to}, ${c.stored.replace(/_/g, ' ')}`).join('; ');
}

/** Where the quote is in the source, from the provenance fields that were actually recorded. */
function locator(e: Experiment): string | null {
  const parts = [e.source_page != null ? `p.${e.source_page}` : null, e.source_figure, e.source_table, e.source_section].filter(Boolean);
  return parts.length ? parts.join('; ') : null;
}

/** RFC 4180 cell. Text that a spreadsheet would run as a formula (=, +, -, @) gets a leading apostrophe. */
function cell(value: string | number | null | undefined): string {
  if (value == null) return '';
  if (typeof value === 'number') return String(value);
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function catalogCsv(file: ExportFile): string {
  const rows = file.experiments.map((e) => [
    e.campaign, e.test_id, e.fuel_material, e.material_class, e.fuel_form, e.o2_pct, e.pressure_kpa, e.flow_cm_s,
    e.outcome ? t(e.outcome) : null, conditionText(e.condition_changes), e.key_observation_quote, locator(e), e.source_url,
    e.verified_by, e.dataset_doi, e.dataset_version, e.dataset_file, e.dataset_row_or_time, file.catalog_revision, file.exported_at,
  ]);
  return BOM + [COLUMNS, ...rows].map((row) => row.map(cell).join(',')).join('\r\n') + '\r\n';
}
