import { expect, it } from 'vitest';
import { plainClaimText } from '../src/lib/claimText';

it('shows plain outcome labels in claim text, never stored codes', () => {
  expect(plainClaimText('BASS GMT175-T9: outcome no_ignition, O₂ 16.4 %, airflow 10 cm/s.')).toBe('BASS GMT175-T9: outcome: Did not ignite, O₂ 16.4 %, airflow 10 cm/s.');
  expect(plainClaimText('X: outcome sustained. Y: outcome extinguished.')).toBe('X: outcome: Sustained. Y: outcome: Extinguished.');
  expect(plainClaimText('The outcome was observed directly.')).toBe('The outcome was observed directly.');
});

it('shows stored material identifiers as words', () => {
  expect(plainClaimText('X: outcome sustained, material cotton_fiberglass, form fabric.')).toBe('X: outcome: Sustained, material cotton fiberglass, form fabric.');
  expect(plainClaimText('flow speeds of 5 cm/s (E2), 10 cm/s (E1) under O2 of 21% (E1-E4)')).toBe('flow speeds of 5 cm/s (E2), 10 cm/s (E1) under O2 of 21% (E1-E4)');
});
