// One capture session for all three cuts: records the LIVE app (read-only use) as one continuous take at a 1440×810
// viewport at 2× (2880×1620 frames, never upscaled), with a drawn pointer that follows the real mouse events, and marks
// where each shot in src/cuts/shots.ts begins. Output: public/capture/take.mp4 + take.json (gitignored).
//
//   node scripts/capture.mjs            (IGNIS_CAPTURE_URL overrides the default production URL)
//
// Safety: no catalog writes. The first /api/synthesize (the Crew clothing preset, warmed in the briefing cache) is
// allowed; every later synthesize and every parse-scenario call is blocked, so recording spends no LLM generations.
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const BASE = process.env.IGNIS_CAPTURE_URL ?? 'https://ignis-nasa-2026.vercel.app';
const OUT = 'public/capture';
const FRAMES = join(OUT, 'frames');
const W = 1440;
const H = 810;
const SCALE = 2;
const { SHOTS } = await import(pathToFileURL(join(root, 'src/cuts/shots.ts')).href);

rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });

// Card ids for compare / case from the public export (read-only GET).
const exported = await (await fetch(`${BASE}/api/export`)).json();
const byTest = (needle) => exported.experiments.find((e) => e.test_id.includes(needle));
const t7 = byTest('GMT96-T7');
const t8 = byTest('GMT96-T8');
if (!t7 || !t8) throw new Error('GMT96-T7 / GMT96-T8 are not in the verified catalog: the case and compare shots need them.');

const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE, reducedMotion: 'no-preference', colorScheme: 'dark' });
// The pointer: drawn in the page from real mousemove/mousedown events, so the take shows the actual pointer path.
await context.addInitScript(() => {
  localStorage.setItem('ignis-scenario-intro-dismissed', '1');
  addEventListener('DOMContentLoaded', () => {
    const p = document.createElement('div');
    p.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M3 2l7.5 19 2.6-7.6L21 10.8z" fill="#fff" stroke="#0c0f16" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    Object.assign(p.style, { position: 'fixed', left: '0', top: '0', zIndex: '2147483647', pointerEvents: 'none', transform: 'translate(-100px,-100px)', transition: 'scale 120ms ease-out', filter: 'drop-shadow(0 2px 3px rgb(0 0 0 / .5))' });
    document.documentElement.appendChild(p);
    addEventListener('mousemove', (e) => (p.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 2}px)`), true);
    addEventListener('mousedown', () => (p.style.scale = '0.85'), true);
    addEventListener('mouseup', () => (p.style.scale = '1'), true);
  });
});
let synth = 0;
await context.route('**/api/synthesize', (r) => (synth++ === 0 ? r.continue() : r.abort()));
await context.route('**/api/parse-scenario', (r) => r.abort());

const frames = [];
const marks = {};
const notes = [];
let n = 0;
let page;
let cdp;
const pending = [];
const screencast = () => cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: W * SCALE, maxHeight: H * SCALE, everyNthFrame: 1 }).catch(() => {});
/** A fresh tab with its own screencast session (also the recovery path when a long 2× session crashes a tab). */
async function openPage() {
  await page?.close().catch(() => {});
  page = await context.newPage();
  cdp = await context.newCDPSession(page);
  const session = cdp;
  session.on('Page.screencastFrame', async ({ data, sessionId }) => {
    const file = join(FRAMES, `f${String(n++).padStart(5, '0')}.jpg`);
    frames.push({ file, t: Date.now() / 1000 });
    pending.push(writeFile(file, Buffer.from(data, 'base64')));
    await session.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
}
await openPage();
const wait = (ms) => page.waitForTimeout(ms);
const mark = (id) => {
  if (!SHOTS.some((s) => s.id === id)) throw new Error(`unknown shot ${id}`);
  marks[id] = Date.now() / 1000;
  // On disk at once (absolute times + the first frame's), so a killed session never loses its marks.
  writeFileSync(join(OUT, 'marks.partial.json'), JSON.stringify({ firstFrame: frames[0]?.t ?? null, marks }, null, 1));
  console.log(`· ${id}`);
};
let pointer = { x: W / 2, y: H / 2 };
const moveTo = async (x, y, steps = 24) => {
  await page.mouse.move(x, y, { steps });
  pointer = { x, y };
};
const centerOf = async (locator) => {
  await locator.scrollIntoViewIfNeeded();
  const b = await locator.boundingBox();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
};
const clickOn = async (locator) => {
  const c = await centerOf(locator);
  await moveTo(c.x, c.y);
  await wait(250);
  await page.mouse.down();
  await wait(90);
  await page.mouse.up();
};
const glide = (y, ms = 1400) =>
  page.evaluate(([y, ms]) => new Promise((done) => {
    const from = scrollY, t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); scrollTo(0, from + (y - from) * ease(k)); k < 1 ? requestAnimationFrame(step) : done(); };
    requestAnimationFrame(step);
  }), [y, ms]);
const glideTo = async (locator, offset = 110, ms) => glide(await locator.evaluate((e, o) => e.getBoundingClientRect().top + scrollY - o, offset), ms);
const go = async (path) => {
  try {
    await page.goto(BASE + path, { waitUntil: 'load' });
  } catch (e) {
    if (!/crash|closed/i.test(e.message)) throw e;
    notes.push(`tab crashed before ${path}; continued in a fresh tab`);
    await openPage();
    await page.goto(BASE + path, { waitUntil: 'load' });
  }
  await screencast();
  await page.mouse.move(pointer.x + 1, pointer.y); // re-show the pointer on the new document
};

try {
await go('/');
await wait(1200);

// --- landing
mark('landing');
await wait(1500);
await moveTo(W * 0.32, H * 0.62, 30);
await wait(800);

// --- preset (console)
await clickOn(page.getByRole('button', { name: 'Explore the evidence' }).first());
await page.locator('#confirm-scenario').waitFor({ timeout: 20000 });
await wait(1400);
mark('preset');
await clickOn(page.getByRole('button', { name: /Crew clothing/ }).first());
await wait(1500);

// --- confirm
mark('confirm');
await clickOn(page.locator('#confirm-scenario'));
await wait(3200);

// --- map
mark('map');
await glideTo(page.locator('#evidence-map'), 120);
await wait(1200);
const dots = page.locator('[id^="map-point-"]');
for (let i = 0; i < Math.min(3, await dots.count()); i++) {
  const c = await centerOf(dots.nth(i));
  await moveTo(c.x, c.y, 18);
  await wait(500);
}
await wait(800);

// --- dotTap
mark('dotTap');
await clickOn(dots.first());
await wait(2600);

// --- match
mark('match');
await glideTo(page.locator('#s3'), 110, 1600);
await wait(1800);
await glide(await page.evaluate(() => scrollY + 380), 1600);
await wait(1800);

// --- brief
mark('brief');
await glideTo(page.locator('#s4'), 110, 1600);
await wait(2500);

// --- citation
mark('citation');
await clickOn(page.getByRole('button', { name: /^Evidence E\d+/ }).first());
await wait(2800);

// --- slider (rail stays in view at ≥1280px; the map sits beside it)
await glideTo(page.locator('#evidence-map'), 120, 1400);
await wait(600);
const setFlow = page.getByRole('button', { name: 'Set airflow to 0 cm/s' });
if (await setFlow.count()) {
  await clickOn(setFlow.first());
  await wait(800);
}
const flow = page.locator('input[type=range]').nth(1);
const fb = await flow.boundingBox();
await moveTo(fb.x + 4, fb.y + fb.height / 2);
mark('slider');
await page.mouse.down();
await page.mouse.move(fb.x + fb.width * 0.34, fb.y + fb.height / 2, { steps: 14 });
await page.mouse.up();
await wait(2400);

// --- gap
await glideTo(page.locator('#s5'), 110, 1800);
await wait(800);
mark('gap');
await wait(400);
const region = page.locator('section:has(#s5) li').first();
if (await region.count()) await clickOn(region.locator('button').first().or(region));
await wait(2600);

// --- nasaPage: the card's own source link, opened in this tab so the take stays continuous
const source = page.locator('article[id^="experiment-"] a[target="_blank"]').first();
await glideTo(source, 300, 1200);
await source.evaluate((a) => a.removeAttribute('target'));
const consoleUrl = page.url();
mark('nasaPage');
await clickOn(source);
await page.waitForURL((u) => u.href !== consoleUrl, { timeout: 2500 }).catch(() => {});
await page.waitForLoadState('load').catch(() => {});
await screencast();
const isPdf = page.url() === consoleUrl || (await page.evaluate(() => document.contentType === 'application/pdf').catch(() => true));
if (isPdf && t8.ntrs_id) {
  notes.push(`nasaPage: the card's source is the report PDF, which the capture browser downloads instead of showing; the take shows the same report's NTRS record page (citations/${t8.ntrs_id})`);
  await page.goto(`https://ntrs.nasa.gov/citations/${t8.ntrs_id}`, { waitUntil: 'load' }).catch(() => {});
  await screencast();
  await page.mouse.move(pointer.x + 1, pointer.y);
}
await wait(3500);

// --- library → detail (verified by)
await page.goto(`${BASE}/library`, { waitUntil: 'load' });
await screencast();
mark('library');
await wait(1200);
const search = page.locator('input[type=search]');
await clickOn(search);
await search.pressSequentially('GMT96', { delay: 140 });
await wait(1500);
await clickOn(page.locator('main h2 a').first());
await page.waitForURL(/\/library\/.+/);
await screencast();
mark('verifiedBy');
await wait(2500);
await glide(await page.evaluate(() => scrollY + 420), 1600);
await wait(2000);

// --- compare
await go(`/compare?ids=${encodeURIComponent(t7.id)},${encodeURIComponent(t8.id)}`);
mark('compare');
await page.locator('table').first().waitFor({ timeout: 20000 });
await wait(1500);
await glide(await page.evaluate(() => scrollY + 420), 1800);
await wait(2000);

// --- caseWithheld: claim T8 used 10 cm/s
await go('/case');
await glideTo(page.locator('#case-step2'), 160, 1400);
await wait(600);
const run = page.locator('section:has(#case-step2) select');
const value = await run.evaluate((s) => [...s.options].find((o) => o.textContent.includes('GMT96-T8'))?.value);
{ const c = await centerOf(run); await moveTo(c.x, c.y); }
await run.selectOption(value);
await wait(700);
const claim = page.locator('section:has(#case-step2) input[type=number]');
await clickOn(claim);
await claim.fill('');
await claim.pressSequentially('10', { delay: 220 });
await wait(500);
mark('caseWithheld');
await clickOn(page.getByRole('button', { name: 'Check against the record' }));
await page.locator('#case-result :text("Withheld")').first().waitFor({ timeout: 15000 });
await wait(2600);
await glideTo(page.locator('#case-result'), 220, 1400);
await wait(3200);

// --- caseAccepted: the same run, claimed at the card's own value (5 cm/s)
await glideTo(page.locator('#case-step2'), 160, 1000);
await clickOn(claim);
await claim.fill('');
await claim.pressSequentially('5', { delay: 220 });
await wait(500);
mark('caseAccepted');
await clickOn(page.getByRole('button', { name: 'Check against the record' }));
await page.locator('#case-result :text("Accepted")').first().waitFor({ timeout: 15000 });
await wait(2600);
await glideTo(page.locator('#case-result'), 220, 1400);
await wait(3200);

// --- export (Sources: the open dataset)
await go('/sources');
mark('export');
await wait(1500);
const exportButton = page.getByRole('button', { name: /Export/ }).or(page.getByRole('link', { name: /Export/ })).first();
if (await exportButton.count()) {
  const c = await centerOf(exportButton);
  await moveTo(c.x, c.y);
}
await wait(2500);
} catch (e) {
  // Keep what was recorded: a partial take still serves every shot it reached.
  notes.push(`capture stopped early: ${e.message.split('\n')[0]}`);
  console.error(e);
}

await cdp.send('Page.stopScreencast').catch(() => {});
await browser.close();
await Promise.all(pending);

// --- assemble one constant-30fps MP4 (each JPEG held until the next one arrived)
const t0 = frames[0].t;
const relMarks = Object.fromEntries(Object.entries(marks).map(([k, t]) => [k, Math.round((t - t0) * 100) / 100]));
writeFileSync(join(OUT, 'take.pending.json'), JSON.stringify({ marks: relMarks, frames: frames.length, notes }, null, 1));
console.log(`encoding ${frames.length} frames…`);
let list = '';
frames.forEach((f, i) => {
  const next = frames[i + 1]?.t ?? f.t + 1 / 30;
  list += `file '${resolve(f.file).split('\\').join('/')}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}\n`;
});
list += `file '${resolve(frames.at(-1).file).split('\\').join('/')}'\n`;
writeFileSync(join(OUT, 'frames.txt'), list);
const REMOTION = join(root, 'node_modules/@remotion/cli/remotion-cli.js');
const r = spawnSync(process.execPath, [REMOTION, 'ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(OUT, 'frames.txt'),
  '-fps_mode', 'cfr', '-r', '30', '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-movflags', '+faststart', join(OUT, 'take.mp4')], { stdio: 'inherit' });
if (r.status !== 0) process.exit(1);
const sec = frames.at(-1).t - t0;
const take = {
  file: 'capture/take.mp4',
  sec: Math.round(sec * 100) / 100,
  width: W * SCALE,
  height: H * SCALE,
  marks: relMarks,
  capturedAt: new Date().toISOString(),
  url: BASE,
  catalogRevision: exported.catalog_revision,
  synthesize: { allowed: Math.min(1, synth), blocked: Math.max(0, synth - 1) },
  notes,
};
writeFileSync(join(OUT, 'take.json'), JSON.stringify(take, null, 1));
rmSync(join(OUT, 'take.pending.json'), { force: true });
rmSync(FRAMES, { recursive: true, force: true });
console.log(`take: ${take.sec}s, ${frames.length} frames, ${Object.keys(marks).length}/${SHOTS.length} shots, synthesize: 1 allowed, ${Math.max(0, synth - 1)} blocked`);
for (const s of SHOTS) if (take.marks[s.id] == null) console.log(`  ✖ missing shot ${s.id}`);
for (const note of notes) console.log(`  · ${note}`);
