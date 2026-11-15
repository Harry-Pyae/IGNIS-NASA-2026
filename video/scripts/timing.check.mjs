// Self-check for the voice-fit maths (node scripts/timing.check.mjs). Fails loudly if a rule breaks.
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { layoutCut, captionChunks, wordCount, LEAD_SEC, TAIL_SEC } = await import(pathToFileURL(join(root, 'src/cuts/timing.ts')).href);

const beat = (id, vo, targetSec, minSec, maxSec, extra = {}) => ({ id, vo, visual: { kind: 'title' }, targetSec, minSec, maxSec, ...extra });
const cut = (beats, min = 20, max = 30) => ({ id: 'demo', composition: 'X', title: 'T', lengthSec: { min, max }, music: null, beats });
const manifest = (vo) => ({ generatedAt: '', vo, music: {}, capture: null, catalog: null, qr: null });

assert.equal(wordCount('This is *IGNIS*, from Team AstroFlare.'), 6);
assert.equal(wordCount('[Name A] led it.'), 4);

// Recorded VO drives the beat: lead + clip + tail, clamped to [min, max]; the end card fills a 30 s cut to the cap.
{
  const c = cut([beat('demo-01', 'a b c', 3, 2, 5), beat('demo-02', 'end', 5, 4, 30)]);
  const l = layoutCut(c, manifest({ 'demo-01': { file: 'x', sec: 2.0 } }));
  assert.equal(l.beats[0].sec, Math.round((LEAD_SEC + 2.0 + TAIL_SEC) * 30) / 30);
  assert.equal(l.totalSec, Math.round((30 - 1 / 30) * 30) / 30); // one frame under the cap (container ≤ 30.0 s)
  assert.equal(l.overBudget.length, 0);
}
// A long line is never cut: the beat grows past maxSec, the cut runs over, and the line is reported with its rewrite.
{
  const c = cut([beat('demo-01', 'x', 3, 2, 3.5, { shorter: 'short' }), beat('demo-02', 'y', 26, 26, 26)]);
  const l = layoutCut(c, manifest({ 'demo-01': { file: 'x', sec: 6 } }));
  assert.ok(l.beats[0].sec >= 6 + LEAD_SEC + TAIL_SEC - 0.04, 'voice must not be cut');
  assert.ok(l.beats[0].overMax);
  assert.ok(l.totalSec > 30);
  assert.equal(l.overBudget[0].id, 'demo-01');
  assert.equal(l.overBudget[0].shorter, 'short');
  assert.match(l.lengthProblem, /over the 30\.0s cap/);
}
// A short window cut stretches beats toward their maxSec to reach its minimum.
{
  const c = cut([beat('pitch-01', 'a', 5, 4, 100), beat('pitch-02', 'b', 5, 4, 100)], 180, 240);
  assert.ok(layoutCut(c, manifest({})).totalSec >= 180 - 0.05);
}
// Captions: chunks cover the clip exactly, in order, none longer than maxChars.
{
  const chunks = captionChunks('In orbit, there is no *up* for hot air to rise to. A flame depends on the air that moves around it.', 6);
  assert.ok(chunks.every((c) => c.text.replace(/\*/g, '').length <= 40));
  assert.equal(chunks[0].fromSec, 0);
  assert.ok(Math.abs(chunks.at(-1).toSec - 6) < 1e-9);
}
console.log('timing.check: OK');
