import type { Experiment } from '../../lib/types';

export function compareSelection(search: string, experiments: Experiment[]) {
  const ids = [...new Set((new URLSearchParams(search).get('ids') ?? '').split(',').map((id) => id.trim()).filter(Boolean))];
  const eligible = new Map(experiments.filter((card) => card.verified_by && card.domain === 'solid_flammability')
    .map((card) => [card.id, card]));
  return {
    cards: ids.flatMap((id) => eligible.get(id) ?? []),
    missing: ids.filter((id) => !eligible.has(id)),
  };
}
