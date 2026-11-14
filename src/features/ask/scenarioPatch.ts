import type { ParsedScenario } from '../../lib/types';

export const SCENARIO_PATCH_FIELDS = [
  'fuel_material_raw',
  'fuel_form',
  'thickness_mm',
  'o2_pct',
  'flow_cm_s',
  'pressure_kpa',
] as const satisfies readonly (keyof ParsedScenario)[];

export type ScenarioPatch = Partial<Pick<ParsedScenario, (typeof SCENARIO_PATCH_FIELDS)[number]>>;
export type AskIntent =
  | { kind: 'scenario' }
  | { kind: 'evidence' }
  | { kind: 'view'; destination: 'scenario' | 'map' | 'methods' }
  | { kind: 'unknown-view' }
  | { kind: 'unsupported' };

const FIELD_MENTIONS: Record<(typeof SCENARIO_PATCH_FIELDS)[number], RegExp> = {
  fuel_material_raw: /\b(?:material|made of|fuel|pmma|acrylic|plexiglas|nomex|cotton|fabric|cable|insulation|packaging|clothing|flight suit)\b/i,
  fuel_form: /\b(?:form|shape|flat sheet|sheet|rod|fabric|thick slab|slab)\b/i,
  thickness_mm: /\b(?:thickness|thick(?:ness)?)\b/i,
  o2_pct: /\b(?:oxygen|o2)\b|o₂/i,
  flow_cm_s: /\b(?:airflow|air flow|flow|velocity)\b|cm\s*\/\s*s/i,
  pressure_kpa: /\b(?:pressure|kpa|atm)\b/i,
};

const EXPLICIT_CLEAR = /\b(?:clear|remove|unset|erase|reset|not specified|unspecified|unknown|null|none|blank)\b|\bno\s+(?:oxygen|o2|airflow|flow|pressure|thickness|material|form)\b|\bleave\b.{0,24}\b(?:empty|unspecified|blank)\b/i;

/**
 * The parser returns a complete object with nulls for omitted fields. Apply only values
 * whose field is mentioned in the user's request; explicit zero remains an ordinary value.
 * A field is cleared only when the user names it and explicitly asks to clear it.
 */
export function explicitScenarioPatch(parsed: ParsedScenario, request: string): ScenarioPatch {
  const patch: ScenarioPatch = {};
  const clearRequested = EXPLICIT_CLEAR.test(request);
  for (const field of SCENARIO_PATCH_FIELDS) {
    if (!FIELD_MENTIONS[field].test(request)) continue;
    const value = parsed[field];
    if (value !== null) patch[field] = value as never;
    else if (clearRequested) patch[field] = null as never;
  }
  return patch;
}

export function classifyAskIntent(request: string): AskIntent {
  const text = request.trim();
  if (!text) return { kind: 'unsupported' };

  const asksToOpen = /\b(?:open|show|go to|take me to|navigate to|jump to)\b/i.test(text);
  if (asksToOpen) {
    if (/\b(?:methods|how matching works)\b/i.test(text)) return { kind: 'view', destination: 'methods' };
    if (/\b(?:evidence map|map)\b/i.test(text)) return { kind: 'view', destination: 'map' };
    if (/\b(?:scenario builder|scenario|inputs)\b/i.test(text)) return { kind: 'view', destination: 'scenario' };
    return { kind: 'unknown-view' };
  }

  if (/\b(?:what did|what do|explain|summari[sz]e|tell me about|observed|observations|these experiments|the evidence|the brief)\b/i.test(text)) {
    return { kind: 'evidence' };
  }

  const mentionsScenarioField = SCENARIO_PATCH_FIELDS.some((field) => FIELD_MENTIONS[field].test(text));
  if (mentionsScenarioField && /\b(?:set|change|update|adjust|use|make|clear|remove|unset|leave)\b/i.test(text)) {
    return { kind: 'scenario' };
  }
  return { kind: 'unsupported' };
}
