/** 0005 dataset provenance: optional fields, the second citation line, and the export shape. */
import { describe, expect, it } from 'vitest';
import { datasetCitation } from '../src/lib/evidenceSource';
import { ExperimentSchema } from '../src/lib/types';
import { buildExport, EXPORT_README } from '../src/server/export';
import { card } from './helpers';

const DATASET = ['psi_investigation_id', 'dataset_doi', 'dataset_version', 'dataset_file', 'dataset_row_or_time'] as const;

describe('dataset provenance (0005)', () => {
  it('a row read before 0005 (no dataset columns) still validates, with every dataset field null', () => {
    const row: Record<string, unknown> = { ...card() };
    for (const k of DATASET) delete row[k];
    const parsed = ExperimentSchema.parse(row);
    for (const k of DATASET) expect(parsed[k]).toBeNull();
  });

  it('the citation line appears only when something is recorded, and never invents parts', () => {
    expect(datasetCitation(card())).toBeNull();
    expect(datasetCitation(card({ psi_investigation_id: 'PSI-25', dataset_version: 'v4', dataset_doi: '10.1/x' })))
      .toBe('Dataset: PSI-25 v4 · DOI 10.1/x');
    expect(datasetCitation(card({ dataset_file: 'run3.csv', dataset_row_or_time: 't = 12 s' })))
      .toBe('Dataset: run3.csv · t = 12 s');
  });

  it('export carries the dataset fields as recorded, and the README documents each one', () => {
    const out = buildExport([card({ test_id: 'A', psi_investigation_id: 'PSI-26', dataset_version: 'v2' }), card({ test_id: 'B' })], 'r');
    expect(out.experiments.map((e) => [e.psi_investigation_id, e.dataset_version, e.dataset_doi]))
      .toEqual([['PSI-26', 'v2', null], [null, null, null]]);
    for (const k of DATASET) expect(EXPORT_README.fields[k]).toBeTruthy();
  });
});
