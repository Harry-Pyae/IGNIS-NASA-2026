// Read-only live verification (docs/DEPLOY-RUNBOOK.md). Usage: npm run verify:live [-- https://<deployment>]
// Writes nothing to the catalog or the briefing cache; the only side effect is the public per-IP rate-limit counter.
const base = (process.argv[2] ?? 'https://ignis-nasa-2026.vercel.app').replace(/\/$/, '');
const T7 = 'ec0cf0b6-c415-4495-966f-0a0a3e7667d1'; // BASS GMT96-T7, a published card (10 cm/s, p.3)
let failed = 0;
const check = async (name, fn) => {
  try {
    const detail = await fn();
    console.log(`PASS  ${name}${detail ? `  (${detail})` : ''}`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${name}  ${e instanceof Error ? e.message : e}`);
  }
};
const expect = (ok, message) => { if (!ok) throw new Error(message); };
const claim = (value) => fetch(`${base}/api/check-claim`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ experiment_id: T7, field: 'flow_cm_s', value }),
});

for (const path of ['/', '/case', '/help', '/library', '/methods', '/sources']) {
  await check(`GET ${path}`, async () => {
    const res = await fetch(base + path);
    expect(res.ok && (res.headers.get('content-type') ?? '').includes('text/html'), `HTTP ${res.status}`);
  });
}
await check('GET /api/export (verified cards only)', async () => {
  const res = await fetch(`${base}/api/export`);
  const body = await res.json();
  expect(res.ok && typeof body.count === 'number', `HTTP ${res.status}`);
  return `${body.count} verified cards, revision ${String(body.catalog_revision).slice(0, 8)}`;
});
await check('POST /api/check-claim: 12 cm/s on GMT96-T7 is withheld, naming the card value', async () => {
  const body = await (await claim(12)).json();
  expect(body.verdict === 'withheld' && body.source?.value === 10 && /10 cm\/s/.test(body.message), JSON.stringify(body).slice(0, 160));
  return body.message;
});
await check('POST /api/check-claim: 10 cm/s on GMT96-T7 is accepted with its quote', async () => {
  const body = await (await claim(10)).json();
  expect(body.verdict === 'accepted' && body.value === 10 && body.quote?.length > 0 && body.locator?.page === 3, JSON.stringify(body).slice(0, 160));
  return body.text;
});
await check('POST /api/check-claim: a malformed request is rejected', async () => {
  const res = await fetch(`${base}/api/check-claim`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"experiment_id":"nope"}' });
  expect(res.status === 400, `HTTP ${res.status}`);
});

console.log(failed ? `\n${failed} check(s) failed on ${base}` : `\nAll checks passed on ${base}`);
process.exit(failed ? 1 : 0);
