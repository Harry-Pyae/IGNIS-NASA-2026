import { describe, expect, it } from 'vitest';
import { decodeShare, encodeShare, shareCatalogStatus } from '../src/features/share/shareLink';
import { compareSelection } from '../src/features/compare/compareSelection';
import { card, scenario } from './helpers';

describe('scenario share links', () => {
  it('keeps normalized values and rank order without publishing the material phrase', () => {
    const ids = [card().id, card().id];
    const encoded = encodeShare(scenario({ o2_pct: 0 }), 'r1', ids);
    expect(encoded).not.toContain('crew clothing');
    expect(decodeShare(encoded)).toMatchObject({
      catalog_revision: 'r1',
      ranked_ids: ids,
      scenario: { o2_pct: 0, thickness_mm: null, material: { raw: null, fuel_material: 'cotton_fiberglass' } },
    });
  });

  it('rejects malformed, old and incomplete links', () => {
    expect(decodeShare('{')).toBeNull();
    const encoded = encodeShare(scenario(), 'r1', []);
    const payload = JSON.parse(encoded);
    expect(decodeShare(JSON.stringify({ ...payload, engine_version: 0 }))).toBeNull();
    expect(decodeShare(JSON.stringify({ ...payload, scenario: { domain: 'solid_flammability' } }))).toBeNull();
  });

  it('reruns retrieval and reports added and dropped IDs from the current snapshot', () => {
    const prior = card();
    const current = card();
    const draft = card({ verified_by: null });
    const link = decodeShare(encodeShare(scenario(), 'r1', [prior.id]));
    if (!link) throw new Error('Expected a valid share link');
    expect(shareCatalogStatus(link, { state: 'ready', revision: 'r2', invalid: 0, experiments: [draft, current] }))
      .toEqual({ state: 'updated', added: [current.id], dropped: [prior.id] });
    expect(shareCatalogStatus(link, { state: 'empty', revision: 'r2', invalid: 0 }))
      .toEqual({ state: 'updated', added: [], dropped: [prior.id] });
    expect(shareCatalogStatus(link, { state: 'ready', revision: 'r1', invalid: 0, experiments: [prior] }))
      .toEqual({ state: 'current' });
  });
});

it('compares distinct verified solid cards in URL order and reports the unavailable IDs', () => {
  const a = card();
  const b = card();
  const draft = card({ verified_by: null });
  const smoke = card({ domain: 'smoke_detection' });
  expect(compareSelection(`?ids=${b.id},${a.id},${b.id},${draft.id},${smoke.id},typo`, [a, b, draft, smoke]))
    .toEqual({ cards: [b, a], missing: [draft.id, smoke.id, 'typo'] });
});
