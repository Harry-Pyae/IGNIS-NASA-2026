/** Beat 2 · "Check against source": one claim vs one verified card, through the PRODUCTION validator (claims.ts). */
import { readFileSync, readdirSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CLAIM_CHECK_FIXTURES, SEED_CARDS } from '../src/lib/fixtures';
import { ClaimCheckRequestSchema, ClaimCheckResponseSchema } from '../src/lib/types';
import { checkClaim, claimProblem, VALIDATOR_VERSION } from '../src/server/claims';

const h = vi.hoisted(() => ({ rows: [] as unknown[], completeJson: vi.fn() }));
vi.mock('../src/server/llm.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/server/llm')>()),
  completeJson: h.completeJson,
}));
vi.mock('../src/server/db.js', () => ({
  serviceClient: () => null,
  anonClient: () => ({
    from: () => ({ select: async () => ({ data: h.rows, error: null }) }),
    rpc: async () => ({
      data: { verified: h.rows.length, in_review: 0, campaigns: ['BASS'], last_updated: null, revision: 'rev-x' },
      error: null,
    }),
  }),
}));
const { POST } = await import('../api/check-claim');

const t7 = SEED_CARDS[0]!; // BASS GMT96-T7: 10 cm/s, p.3
let ip = 0;
const call = async (body: unknown) => {
  const res = await POST(new Request('http://x/api/check-claim', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.1.0.${++ip}` },
    body: JSON.stringify(body),
  }));
  return { status: res.status, body: await res.json() };
};

beforeEach(() => {
  h.rows = [...SEED_CARDS];
  h.completeJson.mockReset();
});

describe('checkClaim (the production validator)', () => {
  it('withholds the 12-vs-10 cm/s tamper, naming the field and the source value', () => {
    const r = checkClaim(t7, 'flow_cm_s', 12);
    expect(r).toMatchObject({ verdict: 'withheld', field: 'flow_cm_s', problem: 'ref_mismatch', claimed: { value: 12 }, source: { value: 10, unit: 'cm/s' } });
    expect(r.verdict === 'withheld' && r.message).toBe('This claim is WITHHELD — the cited card says 10 cm/s (p.3).');
  });

  it('accepts the true value with the verbatim quote and locator', () => {
    expect(checkClaim(t7, 'flow_cm_s', 10)).toMatchObject({
      verdict: 'accepted', value: 10, unit: 'cm/s', quote: t7.key_observation_quote,
      locator: { page: 3, figure: 'Figure 2', ntrs_id: '20150008962' }, validator_version: VALIDATOR_VERSION,
    });
  });

  it('runs the same checks as a brief: outcome, empty field, wording', () => {
    expect(checkClaim(t7, 'outcome', 'extinguished')).toMatchObject({ verdict: 'withheld', source: { value: 'sustained' } });
    expect(checkClaim(t7, 'outcome', 'sustained').verdict).toBe('accepted');
    const empty = checkClaim(t7, 'spread_rate_mm_s', 3);
    expect(empty.verdict === 'withheld' && empty.message).toBe('This claim is WITHHELD — the cited card records no spread rate (p.3).');
    expect(checkClaim(t7, 'fuel_material', 'will burn')).toMatchObject({ verdict: 'withheld', problem: 'forbidden_wording' });
  });

  it('agrees with claimProblem() on the claim a brief would make', () => {
    const cards = new Map([['E1', t7]]);
    for (const value of [10, 12, 9.99]) {
      const claim = { classification: 'OBSERVED' as const, text: `${t7.test_id}: Airflow ${value} cm/s.`, evidence_ids: ['E1'], refs: [{ evidence_id: 'E1', field: 'flow_cm_s' as const, value, unit: 'cm/s' }], gap_ids: [] };
      expect(checkClaim(t7, 'flow_cm_s', value).verdict).toBe(claimProblem(claim, { cards, gaps: new Map() }) ? 'withheld' : 'accepted');
    }
  });

  it('fixtures are the real outputs and match the contract', () => {
    for (const { request, response } of Object.values(CLAIM_CHECK_FIXTURES)) {
      ClaimCheckRequestSchema.parse(request);
      ClaimCheckResponseSchema.parse(response);
      expect(checkClaim(t7, request.field, request.value)).toEqual(response);
    }
  });

  it('is the same module, not a copy: one validator, imported by the endpoint', () => {
    expect(readFileSync('api/check-claim.ts', 'utf8')).toMatch(/import \{ checkClaim \} from '\.\.\/src\/server\/claims\.js'/);
    const files = [...readdirSync('api').map((f) => `api/${f}`), ...readdirSync('src', { recursive: true }).map((f) => `src/${f}`)]
      .filter((f) => /\.tsx?$/.test(f));
    const defines = files.filter((f) => /function (claimProblem|refProblem)\b/.test(readFileSync(f, 'utf8')));
    expect(defines.map((f) => f.replace(/\\/g, '/'))).toEqual(['src/server/claims.ts']);
  });
});

describe('POST /api/check-claim', () => {
  it('withholds 12 cm/s and accepts 10 cm/s for the verified card, with no LLM call', async () => {
    expect(await call(CLAIM_CHECK_FIXTURES.tampered.request)).toEqual({ status: 200, body: CLAIM_CHECK_FIXTURES.tampered.response });
    expect(await call(CLAIM_CHECK_FIXTURES.accepted.request)).toEqual({ status: 200, body: CLAIM_CHECK_FIXTURES.accepted.response });
    expect(h.completeJson).not.toHaveBeenCalled();
  });

  it('only checks against verified cards (unknown or draft id → 404)', async () => {
    h.rows = SEED_CARDS.slice(1); // RLS hides the card
    const r = await call(CLAIM_CHECK_FIXTURES.accepted.request);
    expect(r.status).toBe(404);
    expect(r.body.error.code).toBe('not_found');
  });

  it('rejects a malformed request', async () => {
    expect((await call({ experiment_id: t7.id, field: 'notes', value: 1 })).status).toBe(400);
    expect((await call({ experiment_id: 'nope', field: 'flow_cm_s', value: 12 })).status).toBe(400);
  });
});
