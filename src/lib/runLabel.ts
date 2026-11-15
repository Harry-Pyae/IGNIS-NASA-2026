import type { Experiment } from './types';

/**
 * A run's display label: its test ID, with the campaign in front only when the ID doesn't already name it. Compared on
 * letters and digits, so campaign "Saffire-II" + run "Saffire II-6" reads "Saffire II-6", never "Saffire-II Saffire II-6".
 */
export function experimentLabel(experiment: Pick<Experiment, 'campaign' | 'test_id'>): string {
  const key = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return key(experiment.test_id).startsWith(key(experiment.campaign)) ? experiment.test_id : `${experiment.campaign} ${experiment.test_id}`;
}
