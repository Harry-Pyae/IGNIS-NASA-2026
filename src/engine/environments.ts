/**
 * Environment context presets (DECISIONS-ROUND5 #1). OWNER: Coder A. A second preset row, distinct from the material
 * presets in aliases.ts: each sets ONLY o2_pct and pressure_kpa (airflow, material and form stay untouched).
 *
 * These are scenario INPUTS, not evidence. Most verified experiments ran near Earth-normal air, so the elevated-O₂ /
 * low-pressure settings land outside the catalog's range; the console then shows the approved outside-range / gap
 * copy. That is the point of these presets ("see where verified evidence ends"), not a malfunction.
 *
 * Verification gate: a preset renders only after R1 checks its figures and context note against the named NASA source
 * and signs it (verified_by = R1's own name, then Coder A updates this file). Until then `status: 'placeholder'`.
 * The exploration and EVA figures came from a teammate's unsourced practice build and are placeholders by rule.
 * Checklist: docs/FACT-CHECK-QUEUE.md.
 */
import { verifierNameProblem } from '../lib/verifier.js';

/** 1 psi in kPa (exact to the precision stored). */
export const KPA_PER_PSI = 6.894757;

export interface EnvironmentPreset {
  id: 'iss-baseline' | 'exploration-atmosphere' | 'eva-suit';
  label: string;
  o2_pct: number;
  /** Normalized value the engine uses. */
  pressure_kpa: number;
  /** The pressure as the source states it (original units preserved, Core Principle 5). */
  pressure_original: { value: number; unit: 'psi' | 'kPa' };
  /** One-line context note; shown only once verified. */
  context: string;
  verification: {
    status: 'placeholder' | 'verified';
    /** What R1 must confirm before this preset can render. */
    check: string;
    /** The NASA source R1 checks against. */
    source_to_confirm: string;
    /** The exact source page R1 used (null until verified). */
    source_url: string | null;
    /** R1's own full name (null until verified). Publication is a named human. */
    verified_by: string | null;
  };
}

export const ENVIRONMENT_PRESETS: readonly EnvironmentPreset[] = [
  {
    id: 'iss-baseline',
    label: 'ISS baseline',
    o2_pct: 21,
    pressure_kpa: 101.325,
    pressure_original: { value: 101.325, unit: 'kPa' },
    context: 'The ISS cabin is kept at Earth-normal air: about 21% oxygen at sea-level pressure.',
    verification: {
      status: 'placeholder',
      check: '21% O₂ and 101.3 kPa (14.7 psi) as the nominal ISS cabin atmosphere; the context sentence.',
      source_to_confirm: 'NASA ISS environmental control and life support (ECLSS) documentation for the nominal cabin atmosphere.',
      source_url: null,
      verified_by: null,
    },
  },
  {
    id: 'exploration-atmosphere',
    // Source-specific label (Round 6 #3): a proposed habitat atmosphere, not an established operating environment.
    label: 'Proposed exploration atmosphere (Moon base)',
    // Prepared 2026-11-15 from NTRS 20180004258 (FISO deck), slide 4: "Future exploration atmospheres extend to 34% O2,
    // 8.2 psia". The former 30 % / 10.2 psi is the Shuttle pre-EVA atmosphere per the same slide. Hidden until R1 signs.
    o2_pct: 34,
    pressure_kpa: 56.5, // 8.2 psia × 6.89476 = 56.54 kPa
    pressure_original: { value: 8.2, unit: 'psi' },
    context: 'Future exploration cabins may run at up to 34% oxygen at 8.2 psia, beyond the conditions in the verified catalog.',
    verification: {
      status: 'placeholder',
      check:
        '34% O₂ at 8.2 psia (56.5 kPa) and the context sentence, against slide 4 of NTRS 20180004258: "Future exploration ' +
        'atmospheres extend to 34% O2, 8.2 psia" (the same slide: "This has historically been 30% O2, 10.2 psia (shuttle pre-EVA ' +
        'atm)"). NASA/TP-2010-216134 is the Working Group report behind it. To sign: status verified, source_url, your full name.',
      source_to_confirm:
        'NTRS 20180004258, "Spacecraft Fire Safety: Protecting Vehicles and Crews on Long-Duration Exploration Missions" (FISO), ' +
        'slide 4; NASA/TP-2010-216134 (Exploration Atmospheres Working Group final report).',
      source_url: null,
      verified_by: null,
    },
  },
  {
    id: 'eva-suit',
    label: 'Spacesuit EVA',
    o2_pct: 100, // PLACEHOLDER (unsourced practice-build figure)
    pressure_kpa: 29.6, // PLACEHOLDER: 4.3 psi
    pressure_original: { value: 4.3, unit: 'psi' },
    context: 'The spacesuit runs on pure oxygen at low pressure, which keeps the suit flexible.',
    verification: {
      status: 'placeholder',
      check: '100% O₂ and 4.3 psi (29.6 kPa) as the EMU operating pressure; the context sentence (suit flexibility).',
      source_to_confirm: 'NASA Extravehicular Mobility Unit (EMU) documentation for the suit operating pressure and atmosphere.',
      source_url: null,
      verified_by: null,
    },
  },
];

/** Only signed presets reach the UI: verified status, a real reviewer name, and a source URL. */
export const visibleEnvironmentPresets = (presets: readonly EnvironmentPreset[] = ENVIRONMENT_PRESETS) =>
  presets.filter(
    ({ verification: v }) => v.status === 'verified' && !verifierNameProblem(v.verified_by) && !!v.source_url,
  );

/** Applies a preset: oxygen and pressure only. Airflow, material, form and thickness are left untouched. */
export function applyEnvironment<T extends { o2_pct: number | null; pressure_kpa: number | null }>(
  scenario: T,
  preset: Pick<EnvironmentPreset, 'o2_pct' | 'pressure_kpa'>,
): T {
  return { ...scenario, o2_pct: preset.o2_pct, pressure_kpa: preset.pressure_kpa };
}

/** True when the preset's oxygen is above Earth-normal air (21%). Drives the elevated-O₂ note. */
export const isElevatedO2 = (preset: Pick<EnvironmentPreset, 'o2_pct'>) => preset.o2_pct > 21;
