import { z } from 'zod';
import { retrieve } from '../../engine/match';
import type { VerifiedCatalog } from '../../lib/catalog';
import { ResolvedScenarioSchema, type ResolvedScenario } from '../../lib/types';

// Bump when retrieval semantics change and earlier links should be retired.
const ENGINE_VERSION = 1;
export const SHARE_PARAM = 'share';

function normalized(scenario: ResolvedScenario): ResolvedScenario {
  const material = { ...scenario.material, raw: null };
  if (material.status === 'unresolved') material.candidates = [];
  return ResolvedScenarioSchema.parse({ ...scenario, material });
}

const ShareSchema = z.strictObject({
  engine_version: z.literal(ENGINE_VERSION),
  catalog_revision: z.string().min(1).max(128),
  ranked_ids: z.array(z.uuid()).max(5),
  scenario: ResolvedScenarioSchema,
});

export function encodeShare(scenario: ResolvedScenario, revision: string, rankedIds: string[]): string {
  return JSON.stringify(ShareSchema.parse({
    engine_version: ENGINE_VERSION,
    catalog_revision: revision,
    ranked_ids: rankedIds,
    scenario: normalized(scenario),
  }));
}

export function decodeShare(value: string) {
  if (value.length > 4096) return null;
  try {
    const parsed = ShareSchema.safeParse(JSON.parse(value));
    if (!parsed.success) return null;
    return { ...parsed.data, scenario: normalized(parsed.data.scenario) };
  } catch {
    return null;
  }
}

export function shareCatalogStatus(link: NonNullable<ReturnType<typeof decodeShare>>, catalog: VerifiedCatalog) {
  if (catalog.state === 'loading' || catalog.state === 'unavailable') return { state: catalog.state };
  const rankedIds = retrieve(link.scenario, catalog.state === 'ready' ? catalog.experiments : [], catalog.revision)
    .matches.map(({ experiment }) => experiment.id);
  if (link.catalog_revision === catalog.revision) return { state: 'current' as const };
  return {
    state: 'updated' as const,
    added: rankedIds.filter((id) => !link.ranked_ids.includes(id)),
    dropped: link.ranked_ids.filter((id) => !rankedIds.includes(id)),
  };
}
