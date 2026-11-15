import { expect, it } from 'vitest';
import { plainClaimText } from '../src/lib/claimText';

it('shows plain outcome labels in claim text, never stored codes', () => {
  expect(plainClaimText('BASS GMT175-T9: outcome no_ignition, O₂ 16.4 %, airflow 10 cm/s.')).toBe('BASS GMT175-T9: outcome: Did not ignite, O₂ 16.4 %, airflow 10 cm/s.');
  expect(plainClaimText('X: outcome sustained. Y: outcome extinguished.')).toBe('X: outcome: Sustained. Y: outcome: Extinguished.');
  expect(plainClaimText('The outcome was observed directly.')).toBe('The outcome was observed directly.');
});
