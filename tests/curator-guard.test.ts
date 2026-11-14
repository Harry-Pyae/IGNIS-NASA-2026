/** Round 8 · A1: the public local default never works on a deployment; curator routes are throttled before the secret. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { forcedProvider, isCurator, LOCAL_CURATOR_SECRET, requireCurator } from '../src/server/http';

const limiter = vi.hoisted(() => ({ allowed: true }));
vi.mock('../src/server/db.js', () => ({
  serviceClient: () => ({
    rpc: () => ({ abortSignal: async () => ({ data: { allowed: limiter.allowed, retry_after_s: 30 }, error: null }) }),
  }),
}));

const req = (headers: Record<string, string> = {}) => new Request('http://x/api', { headers: { 'x-forwarded-for': '198.51.100.9', ...headers } });
const ENV = ['CURATOR_SECRET', 'VERCEL', 'VERCEL_ENV'] as const;
const saved = Object.fromEntries(ENV.map((k) => [k, process.env[k]]));
beforeEach(() => { for (const k of ENV) delete process.env[k]; limiter.allowed = true; });
afterEach(() => { for (const k of ENV) if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; });

describe('A1(b) · the documented local secret', () => {
  it('works locally (dev server, tests, disposable DB)', () => {
    process.env.CURATOR_SECRET = LOCAL_CURATOR_SECRET;
    expect(requireCurator(req({ 'x-curator-secret': LOCAL_CURATOR_SECRET }))).toBeNull();
  });

  it.each([['VERCEL', '1'], ['VERCEL_ENV', 'production'], ['VERCEL_ENV', 'preview']] as const)(
    'is refused on a deployment (%s=%s), including the provider-override header', (key, value) => {
      process.env.CURATOR_SECRET = LOCAL_CURATOR_SECRET;
      process.env[key] = value;
      const r = req({ 'x-curator-secret': LOCAL_CURATOR_SECRET, 'x-ignis-provider': 'gemini' });
      expect(requireCurator(r)?.status).toBe(503);
      expect(isCurator(r)).toBe(false);
      expect(forcedProvider(r)).toEqual({ provider: null });
    });

  it('a private secret still works on a deployment', () => {
    process.env.CURATOR_SECRET = 'a-long-private-value';
    process.env.VERCEL = '1';
    expect(requireCurator(req({ 'x-curator-secret': 'a-long-private-value' }))).toBeNull();
    expect(requireCurator(req({ 'x-curator-secret': LOCAL_CURATOR_SECRET }))?.status).toBe(401);
  });
});

describe('A1(c) · curator routes are throttled before the secret is checked', () => {
  it.each([
    ['curate-write', async () => (await import('../api/curate-write')).POST(new Request('http://x/api/curate-write', { method: 'POST', headers: { 'x-forwarded-for': '198.51.100.9' }, body: '{}' }))],
    ['curate-cards', async () => (await import('../api/curate-cards')).GET(req())],
    ['extract', async () => (await import('../api/extract')).POST(new Request('http://x/api/extract', { method: 'POST', headers: { 'x-forwarded-for': '198.51.100.9' }, body: '{}' }))],
  ])('%s: over budget → 429 even with no secret; under budget → the normal 401', async (_name, call) => {
    process.env.CURATOR_SECRET = 'a-long-private-value';
    limiter.allowed = false;
    expect((await call()).status).toBe(429);
    limiter.allowed = true;
    expect((await call()).status).toBe(401);
  });
});
