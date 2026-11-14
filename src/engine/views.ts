/**
 * The four populations the console renders, from one catalog snapshot (round 3, item 1). OWNER: Coder A.
 * Coder B renders these counts and lists; it never recomputes eligibility or plotting rules.
 *
 *   all_verified  every verified card in the snapshot (any domain)
 *   eligible      solid-flammability cards that pass the scenario's gates (all solid cards when
 *                 no scenario is active). SAME never enters.
 *   plotted       eligible cards DRAWN on the map: both o2_pct and flow_cm_s, inside the map's axes.
 *   off_axis      eligible cards with both coordinates but beyond the displayed axes (measured, not drawn).
 *   not_plotted   eligible cards missing o2_pct or flow_cm_s. They stay in `eligible` and the table; null never
 *                 becomes zero. Round 8 · A4: all three come from mapCoordinates(), the SVG's own partition, so a
 *                 summary count can never disagree with what the map draws.
 *   top_k         retrieve()'s ranked matches (k ≤ 5), with chips; empty without a scenario.
 */
import { eligibleCards } from '../lib/gates.js';
import type { CoverageResult, Experiment, MatchResult, ResolvedScenario } from '../lib/types.js';
import { retrieve } from './match.js';
import { GRID } from './gaps.js';
import { presetScenario, SCENARIO_PRESETS, type ScenarioPreset } from './aliases.js';

/** The Evidence Map's axes are exactly the gap GRID. */
export const onMapAxes = (o2: number, flow: number) =>
  o2 >= GRID.o2.min && o2 <= GRID.o2.max && flow >= GRID.flow.min && flow <= GRID.flow.max;

/** Separate missing coordinates from measured points beyond the displayed axes. */
export function mapCoordinates(experiments: Experiment[]) {
  const coordinates = experiments.filter((e) => e.o2_pct != null && e.flow_cm_s != null);
  const onAxes = (e: Experiment) => onMapAxes(e.o2_pct!, e.flow_cm_s!);
  return {
    coordinates,
    visible: coordinates.filter(onAxes),
    outside: coordinates.filter((e) => !onAxes(e)),
    missing: experiments.filter((e) => e.o2_pct == null || e.flow_cm_s == null),
  };
}

export interface EvidenceViews {
  revision: string;
  all_verified: Experiment[];
  eligible: Experiment[];
  plotted: Experiment[];
  /** eligible cards with both coordinates but outside the displayed axes. */
  off_axis: Experiment[];
  /** eligible cards that cannot be plotted, with the axis they lack. */
  not_plotted: { experiment: Experiment; missing: ('o2_pct' | 'flow_cm_s')[] }[];
  top_k: MatchResult[];
  /** Per-parameter coverage for the active scenario; null without one. */
  coverage: CoverageResult | null;
}

/**
 * Revision binding (round 3; reused by the Round 6 summary strip). A Brief is current only for the exact confirmed
 * scenario, catalog revision and matched ids it was requested for: change any of them and the old Brief is not shown.
 */
export const briefingKey = (scenario: ResolvedScenario, catalog_revision: string, experiment_ids: string[]) =>
  JSON.stringify({ scenario, catalog_revision, experiment_ids });

export const currentBriefing = <T>(result: { key: string; data: T } | null, requestKey: string | null): T | null =>
  requestKey != null && result?.key === requestKey ? result.data : null;

/**
 * Current-investigation summary (DECISIONS-ROUND6 #2): which scenario the displayed counts belong to. Until a
 * scenario is confirmed the counts are whole-catalog counts, flagged as such, with no top-match count.
 */
export function investigationSummary(draft: ResolvedScenario, confirmed: ResolvedScenario | null, views: EvidenceViews | null) {
  return {
    scenario: confirmed ?? draft,
    confirmed: confirmed != null,
    counts: views && {
      eligible: views.eligible.length,
      plotted: views.plotted.length,
      off_axis: views.off_axis.length,
      not_plotted: views.not_plotted.length,
      top_k: confirmed ? views.top_k.length : null,
    },
  };
}

export function evidenceViews(
  catalog: Experiment[],
  scenario: ResolvedScenario | null,
  revision: string,
  k = 5,
): EvidenceViews {
  const all_verified = catalog.filter((c) => c.verified_by != null);
  const solid = all_verified.filter((c) => c.domain === 'solid_flammability');
  const eligible = scenario ? eligibleCards(scenario, solid) : solid;
  const map = mapCoordinates(eligible);
  const plotted = map.visible;
  const off_axis = map.outside;
  const not_plotted = map.missing
    .map((experiment) => ({
      experiment,
      missing: (['o2_pct', 'flow_cm_s'] as const).filter((p) => experiment[p] == null),
    }));
  const r = scenario ? retrieve(scenario, all_verified, revision, k) : null;
  return { revision, all_verified, eligible, plotted, off_axis, not_plotted, top_k: r?.matches ?? [], coverage: r?.coverage ?? null };
}

/**
 * Round 8 · A3 — zero vs unknown. ONE settled answer for every section: only a successful catalog read may assert
 * a count (or a gap). While loading it says loading; after a failed read it says unavailable (the inputs are kept and
 * Retry re-reads). `matches: 0` therefore always means "the catalog was read and nothing matched".
 */
export type RetrievalState =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'unavailable' }
  | { state: 'settled'; revision: string; matches: number };

export function retrievalState(
  status: 'connected' | 'loading' | 'unavailable',
  confirmed: ResolvedScenario | null,
  views: EvidenceViews | null,
): RetrievalState {
  if (!confirmed) return { state: 'idle' };
  if (status === 'unavailable') return { state: 'unavailable' };
  if (status === 'loading' || !views) return { state: 'loading' };
  return { state: 'settled', revision: views.revision, matches: views.top_k.length };
}

/**
 * Round 8 · A7 — what each scenario preset can actually show, computed from the verified catalog with the same
 * resolver, gates and map partition the console uses. Data only: Coder B renders the labels (B4). Never a promise of
 * a fixed number of results. A preset with no catalog material opens the picker (`needs_material`).
 */
export type PresetAvailability =
  | { preset_id: string; state: 'needs_material' }
  | {
      preset_id: string;
      state: 'ready';
      /** verified solid runs passing the preset scenario's gates (material, form, domain) */
      eligible: number;
      /** …of which report the preset's own material */
      exact: number;
      /** …of which only share its material class (a different material) */
      class_only: number;
      /** map partition of the eligible runs (A4) */
      visible: number;
      off_axis: number;
      missing_coordinates: number;
    };

export function presetAvailability(catalog: Experiment[], presets: readonly ScenarioPreset[] = SCENARIO_PRESETS): PresetAvailability[] {
  const solid = catalog.filter((c) => c.verified_by != null && c.domain === 'solid_flammability');
  return presets.map((preset) => {
    if (!preset.material) return { preset_id: preset.id, state: 'needs_material' as const };
    const scenario = presetScenario(preset, solid);
    if (scenario.material.status !== 'resolved') return { preset_id: preset.id, state: 'needs_material' as const };
    const eligible = eligibleCards(scenario, solid);
    const exact = eligible.filter((c) => c.fuel_material === preset.material!.fuel_material).length;
    const map = mapCoordinates(eligible);
    return {
      preset_id: preset.id,
      state: 'ready' as const,
      eligible: eligible.length,
      exact,
      class_only: eligible.length - exact,
      visible: map.visible.length,
      off_axis: map.outside.length,
      missing_coordinates: map.missing.length,
    };
  });
}
