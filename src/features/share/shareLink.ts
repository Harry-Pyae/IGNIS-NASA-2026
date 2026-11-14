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
  /**
   * Round 8 · A8: the version (`updated_at`) of each ranked card when the link was made, so a reopened link can tell
   * "a cited card was updated" apart from "records added/dropped". Optional: older links stay readable.
   */
  versions: z.record(z.uuid(), z.string().min(1).max(64)).optional(),
  scenario: ResolvedScenarioSchema,
});

export function encodeShare(scenario: ResolvedScenario, revision: string, rankedIds: string[], versions?: Record<string, string>): string {
  return JSON.stringify(ShareSchema.parse({
    engine_version: ENGINE_VERSION,
    catalog_revision: revision,
    ranked_ids: rankedIds,
    // Only the ranked (verified) cards' versions travel: never drafts, notes or the visitor's free text.
    ...(versions && { versions: Object.fromEntries(rankedIds.filter((id) => versions[id]).map((id) => [id, versions[id]!])) }),
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

/**
 * What a reopened link can honestly say (A8):
 *   current  same catalog revision → the same deterministic result.
 *   updated  the catalog changed: records added / dropped, cited cards updated since (when the link recorded
 *            versions), and `exact: false` — the earlier catalog can't be rebuilt, so this is today's answer.
 */
export function shareCatalogStatus(link: NonNullable<ReturnType<typeof decodeShare>>, catalog: VerifiedCatalog) {
  if (catalog.state === 'loading' || catalog.state === 'unavailable') return { state: catalog.state };
  const experiments = catalog.state === 'ready' ? catalog.experiments : [];
  const rankedIds = retrieve(link.scenario, experiments, catalog.revision).matches.map(({ experiment }) => experiment.id);
  if (link.catalog_revision === catalog.revision) return { state: 'current' as const };
  const now = new Map(experiments.filter((e) => e.verified_by != null).map((e) => [e.id, e.updated_at]));
  return {
    state: 'updated' as const,
    added: rankedIds.filter((id) => !link.ranked_ids.includes(id)),
    dropped: link.ranked_ids.filter((id) => !rankedIds.includes(id)),
    /** cited cards still in the catalog whose content changed since the link was made; null = link predates versions */
    changed: link.versions ? link.ranked_ids.filter((id) => now.has(id) && link.versions![id] !== now.get(id)) : null,
    exact: false as const,
  };
}
