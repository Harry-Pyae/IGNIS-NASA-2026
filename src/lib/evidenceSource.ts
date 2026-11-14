import type { Experiment } from './types.js';

/** Use only recorded locators; a section-only source remains traceable without inventing a page. */
export function evidenceLocator(experiment: Pick<Experiment, 'source_page' | 'source_figure' | 'source_table' | 'source_section'>): string {
  return [
    experiment.source_page != null ? `p. ${experiment.source_page}` : null,
    experiment.source_figure, experiment.source_table, experiment.source_section,
  ].filter(Boolean).join(' · ');
}

/** Second citation line, e.g. "Dataset: PSI-25 v4 · run3.csv · row 12 · DOI 10.x/y"; null when nothing is recorded. */
export function datasetCitation(experiment: Pick<Experiment,
  'psi_investigation_id' | 'dataset_doi' | 'dataset_version' | 'dataset_file' | 'dataset_row_or_time'>): string | null {
  const id = [experiment.psi_investigation_id, experiment.dataset_version].filter(Boolean).join(' ');
  const parts = [id, experiment.dataset_file, experiment.dataset_row_or_time,
    experiment.dataset_doi && `DOI ${experiment.dataset_doi}`].filter(Boolean);
  return parts.length ? `Dataset: ${parts.join(' · ')}` : null;
}

/** Preserve the reviewed destination: NTRS downloads do not share a uniform filename. */
export function evidenceSource(experiment: Pick<Experiment, 'source_url'>): { url: string; pdf: boolean } | null {
  try {
    const url = new URL(experiment.source_url);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return { url: experiment.source_url, pdf: /\.pdf$/i.test(url.pathname) };
  } catch {
    return null;
  }
}
