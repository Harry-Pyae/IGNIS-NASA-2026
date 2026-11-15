import { describe, expect, it } from 'vitest';
import { catalogCsv, conditionText } from '../src/lib/exportCsv';
import { buildExport } from '../src/server/export';
import { card } from './helpers';

// GMT45-T4 as published: ignited at 10 cm/s, flow reduced to 2.2 cm/s and held (p.5).
const t4 = card({
  campaign: 'BASS-II', test_id: 'BASS-II GMT45-T4', o2_pct: 18.7, flow_cm_s: 2.2, pressure_kpa: 101.325, outcome: 'extinguished',
  source_page: 5, source_figure: 'Figures 5 and 6', source_table: null, source_section: null,
  condition_changes: [{ parameter: 'flow_cm_s', from: 10, to: 2.2, stored: 'final_held', note: 'reduced after ignition to 2.2 cm/s and held (p.5)' }],
});
const noPressure = card({ campaign: 'Saffire-II', test_id: 'Saffire II-1', pressure_kpa: null, outcome: 'no_ignition', key_observation_quote: 'did not ignite', source_figure: null, source_table: null, source_section: null, source_page: null });
const draft = card({ test_id: 'BASS GMT96-T9', verified_by: null });
const file = buildExport([t4, noPressure, draft, card({ test_id: 'BASS GMT96-T8' })], 'rev123', new Date('2026-11-15T13:20:00Z'));
const csv = catalogCsv(file);
const lines = csv.slice(1).trimEnd().split('\r\n');
const header = lines[0]!.split(',');
const row = (testId: string) => lines.find((l) => l.includes(testId))!;
// Rows here hold no quoted commas except the qualifier/quote cells, so a plain split is enough for the simple rows.
const col = (line: string, name: string) => line.split(',')[header.indexOf(name)];

describe('CSV export (flattened view of /api/export; JSON stays canonical)', () => {
  it('has one row per PUBLISHED run (drafts never appear), plus the header', () => {
    expect(file.count).toBe(3);
    expect(lines).toHaveLength(1 + file.count);
    expect(csv).not.toContain('GMT96-T9');
  });

  it('starts with a UTF-8 BOM, uses CRLF, and names the agreed columns', () => {
    expect(csv.charCodeAt(0)).toBe(0xfeff); // the BOM, so Excel reads UTF-8 (→, O₂)
    expect(header).toEqual(['campaign', 'run_id', 'material', 'material_class', 'fuel_form', 'o2_pct', 'pressure_kpa', 'flow_cm_s', 'outcome',
      'condition_changes', 'quote', 'locator', 'source_url', 'verified_by', 'dataset_doi', 'dataset_version', 'dataset_file',
      'dataset_row_or_time', 'catalog_revision', 'exported_at']);
  });

  it('keeps nulls as EMPTY cells, never 0 or N/A', () => {
    const line = row('Saffire II-1');
    expect(col(line, 'pressure_kpa')).toBe('');
    expect(col(line, 'condition_changes')).toBe('');
    expect(col(line, 'locator')).toBe('');
    expect(line).not.toMatch(/N\/A|null/);
  });

  it('writes the GMT45-T4 qualifier as text, not a single number', () => {
    expect(conditionText(t4.condition_changes)).toBe('10→2.2, final held');
    expect(row('GMT45-T4')).toContain(',"10→2.2, final held",');
  });

  it('uses plain-language outcomes and stamps every row with the revision and export time', () => {
    expect(col(row('Saffire II-1'), 'outcome')).toBe('Did not ignite');
    expect(col(row('GMT96-T8'), 'outcome')).toBe('Sustained');
    for (const line of lines.slice(1)) expect(line.endsWith(',rev123,2026-11-15T13:20:00.000Z')).toBe(true);
  });

  it('never lets a cell run as a spreadsheet formula', () => {
    const risky = catalogCsv(buildExport([card({ key_observation_quote: '=HYPERLINK("x")' })], 'r'));
    expect(risky).toContain(`"'=HYPERLINK(""x"")"`);
  });
});
