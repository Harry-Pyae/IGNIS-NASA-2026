// The deck/video screen-recording session as SEPARATE raw clips (01-landing.mp4 … 18-light-theme.mp4) + deck PNGs.
// Run only after the team lead says "catalog final": every number on screen comes from the live catalog.
//
//   node scripts/clips.mjs [--out=<dir>] [--only=03,13]      (IGNIS_CAPTURE_URL overrides the production URL)
//
// Each clip: its own tab, recorded at 1280×720 CSS px × 2 = 2560×1440 native (never upscaled), dark theme unless the
// clip says otherwise, a drawn pointer moving at half speed, 2 s of still padding at both ends, constant 30 fps.
// Public pages only (never /curate, never a secret). Read-only: no catalog writes; parse-scenario is blocked;
// synthesize calls are allowed but counted per provider (a warmed cache answers them without a generation).
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const args = process.argv.slice(2);
const BASE = process.env.IGNIS_CAPTURE_URL ?? 'https://ignis-nasa-2026.vercel.app';
const OUT = resolve(args.find((a) => a.startsWith('--out='))?.slice(6) ?? 'assets/real/captures');
const ONLY = args.find((a) => a.startsWith('--only='))?.slice(7).split(',');
const REMOTION = join(root, 'node_modules/@remotion/cli/remotion-cli.js');
const PAD = 2000;
mkdirSync(join(OUT, 'screenshots'), { recursive: true });

const exported = await (await fetch(`${BASE}/api/export`)).json();
const byTest = (needle) => exported.experiments.find((e) => e.test_id.includes(needle));
const t7 = byTest('GMT96-T7');
const t8 = byTest('GMT96-T8');
const log = { url: BASE, catalogRevision: exported.catalog_revision, count: exported.count, startedAt: new Date().toISOString(), clips: {}, notes: [], synthesize: {} };

const browser = await chromium.launch({ channel: 'msedge' });

/** One clip in its own context + tab: record, run the actions between two 2 s pads, encode a constant-30 fps MP4. */
async function clip(name, actions, { width = 1280, height = 720, scale = 2, theme = 'dark', mobile = false } = {}) {
  if (ONLY && !ONLY.some((n) => name.startsWith(n))) return;
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile, colorScheme: theme, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] });
  await context.addInitScript((t) => {
    try { localStorage.setItem('ignis-theme', t); localStorage.setItem('ignis-tour-offered', '1'); } catch { /* private mode */ }
    addEventListener('DOMContentLoaded', () => {
      const p = document.createElement('div');
      p.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M3 2l7.5 19 2.6-7.6L21 10.8z" fill="#fff" stroke="#0c0f16" stroke-width="1.6" stroke-linejoin="round"/></svg>';
      Object.assign(p.style, { position: 'fixed', left: '0', top: '0', zIndex: '2147483647', pointerEvents: 'none', transform: 'translate(-100px,-100px)', transition: 'scale 120ms ease-out', filter: 'drop-shadow(0 2px 3px rgb(0 0 0 / .5))' });
      document.documentElement.appendChild(p);
      addEventListener('mousemove', (e) => (p.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 2}px)`), true);
      addEventListener('mousedown', () => (p.style.scale = '0.85'), true);
      addEventListener('mouseup', () => (p.style.scale = '1'), true);
    });
  }, theme);
  await context.route('**/api/parse-scenario', (r) => r.abort());
  await context.route('**/curate**', (r) => r.abort()); // never on camera
  context.on('response', async (r) => {
    if (!r.url().includes('/api/synthesize')) return;
    const provider = (await r.json().catch(() => ({}))).provider ?? 'error';
    log.synthesize[provider] = (log.synthesize[provider] ?? 0) + 1;
  });
  const page = await context.newPage();
  const frames = [];
  const pending = [];
  const dir = join(OUT, `.frames-${name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  let n = 0;
  let cdp;
  const record = async () => {
    cdp = await context.newCDPSession(page);
    cdp.on('Page.screencastFrame', async ({ data, sessionId }) => {
      const file = join(dir, `f${String(n++).padStart(5, '0')}.jpg`);
      frames.push({ file, t: Date.now() / 1000 });
      pending.push(writeFile(file, Buffer.from(data, 'base64')));
      await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    });
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: width * scale, maxHeight: height * scale, everyNthFrame: 1 });
  };
  const h = helpers(page, { width, height, record });
  const t0 = Date.now();
  try {
    await actions(h);
    await page.waitForTimeout(PAD);
  } catch (e) {
    log.notes.push(`${name}: stopped early — ${e.message.split('\n')[0]}`);
    console.error(`✖ ${name}: ${e.message.split('\n')[0]}`);
  }
  await cdp?.send('Page.stopScreencast').catch(() => {});
  await Promise.all(pending);
  await context.close();
  if (frames.length < 2) { log.notes.push(`${name}: no frames`); return; }
  let list = '';
  frames.forEach((f, i) => {
    const next = frames[i + 1]?.t ?? f.t + 1 / 30;
    list += `file '${resolve(f.file).split('\\').join('/')}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}\n`;
  });
  list += `file '${resolve(frames.at(-1).file).split('\\').join('/')}'\n`;
  writeFileSync(join(dir, 'frames.txt'), list);
  const mp4 = join(OUT, `${name}.mp4`);
  const r = spawnSync(process.execPath, [REMOTION, 'ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(dir, 'frames.txt'),
    '-fps_mode', 'cfr', '-r', '30', '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
  rmSync(dir, { recursive: true, force: true });
  const sec = Math.round((frames.at(-1).t - frames[0].t) * 10) / 10;
  log.clips[name] = { ok: r.status === 0, sec, size: `${width * scale}×${height * scale}`, wallSec: Math.round((Date.now() - t0) / 100) / 10 };
  console.log(`${r.status === 0 ? '✓' : '✖'} ${name}.mp4  ${sec}s  ${width * scale}×${height * scale}`);
}

/** Half-speed pointer, padded starts, smooth scrolls. */
function helpers(page, { width, height, record }) {
  let pointer = { x: width / 2, y: height / 2 };
  const wait = (ms) => page.waitForTimeout(ms);
  const moveTo = async (x, y, steps = 48) => { await page.mouse.move(x, y, { steps }); pointer = { x, y }; };
  const box = async (loc) => { await loc.scrollIntoViewIfNeeded(); const b = await loc.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const hover = async (loc, dwell = 900) => { const c = await box(loc); await moveTo(c.x, c.y); await wait(dwell); };
  const click = async (loc) => { const c = await box(loc); await moveTo(c.x, c.y); await wait(350); await page.mouse.down(); await wait(110); await page.mouse.up(); };
  const glide = (y, ms = 2200) => page.evaluate(([y, ms]) => new Promise((done) => {
    const from = scrollY, t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); scrollTo(0, from + (y - from) * ease(k)); k < 1 ? requestAnimationFrame(step) : done(); };
    requestAnimationFrame(step);
  }), [y, ms]);
  const glideTo = async (loc, offset = 110, ms) => glide(await loc.evaluate((e, o) => e.getBoundingClientRect().top + scrollY - o, offset), ms);
  /** Load, settle, then start recording on a still frame and hold the 2 s pad. */
  const open = async (path, ready) => {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    if (ready) await ready();
    await wait(600);
    await record();
    await page.mouse.move(pointer.x, pointer.y);
    await wait(PAD);
  };
  const consoleReady = async () => page.locator('[id^="map-point-"]').first().waitFor({ state: 'attached', timeout: 30000 });
  const confirmCrew = async () => {
    await click(page.getByRole('button', { name: /Crew clothing/ }).first());
    await wait(1200);
    await click(page.locator('#confirm-scenario'));
    await wait(3000);
  };
  const shot = (file) => page.screenshot({ path: join(OUT, 'screenshots', file) });
  return { page, wait, moveTo, hover, click, glide, glideTo, open, consoleReady, confirmCrew, shot };
}

// ---------------------------------------------------------------- the clips (sheet order) ---------------------------
await clip('01-landing', async ({ open, glideTo, page, wait }) => {
  await open('/');
  await glideTo(page.locator('#how-it-works'), 40, 3500);
  await wait(1500);
  await glideTo(page.locator('#catalog'), 60, 3000);
  await wait(2500);
});

await clip('02-presets', async ({ open, consoleReady, page, glideTo, hover, shot, wait }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#s1'), 120, 1200);
  for (const name of [/Cabin wall panel/, /Cable insulation/, /Crew clothing/, /Silicone sheet|Cargo packaging/]) {
    await hover(page.getByRole('button', { name }).first(), 1600);
  }
  await wait(800);
  await shot('preset-tiles.png');
});

await clip('03-confirm-flow', async ({ open, consoleReady, page, glideTo, confirmCrew, wait, shot }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#s1'), 120, 1200);
  await confirmCrew();
  await wait(2500);
  await shot('map-confirmed.png');
});

await clip('04-slider-gap', async ({ open, consoleReady, page, glideTo, confirmCrew, moveTo, wait, shot }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#s1'), 120, 1000);
  await confirmCrew();
  const o2 = page.locator('input[type=range]').first();
  await o2.scrollIntoViewIfNeeded();
  const b = await o2.boundingBox();
  const at = (v) => b.x + ((v - 14) / (32 - 14)) * b.width; // the O₂ slider spans the shared GRID (14–32 %)
  await moveTo(at(21), b.y + b.height / 2);
  await wait(600);
  await page.mouse.down();
  for (const v of [20, 19, 18, 17]) { await page.mouse.move(at(v), b.y + b.height / 2, { steps: 30 }); await wait(1200); }
  await page.mouse.up();
  await wait(1500);
  await glideTo(page.locator('#evidence-map'), 120, 1600);
  await wait(3000);
  await shot('map-gap-cells.png');
});

await clip('05-match-why', async ({ open, consoleReady, page, glideTo, confirmCrew, hover, wait }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#s1'), 120, 1000);
  await confirmCrew();
  await glideTo(page.locator('#s3'), 110, 1800);
  await wait(1200);
  const card = page.locator('article[id^="experiment-"]').first();
  const chips = card.locator('[class*="chip"], [data-chip], li span[title]');
  const count = Math.min(await chips.count(), 5);
  if (count) for (let i = 0; i < count; i++) await hover(chips.nth(i), 1300);
  else await hover(card, 3000);
});

await clip('06-evidence-chain', async ({ open, consoleReady, page, glideTo, confirmCrew, click, wait, shot }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#s1'), 120, 1000);
  await confirmCrew();
  await glideTo(page.locator('#s4'), 110, 1800);
  await page.getByRole('button', { name: /^Evidence E\d+/ }).first().waitFor({ timeout: 30000 });
  await click(page.getByRole('button', { name: /^Evidence E\d+/ }).first());
  await wait(3000);
  await shot('evidence-chain.png');
  const source = page.locator('article[id^="experiment-"] a[target="_blank"]').first();
  await glideTo(source, 300, 1200);
  await source.evaluate((a) => a.removeAttribute('target'));
  const before = page.url();
  const ntrs = await source.evaluate((a) => a.href.match(/citations\/(\d+)/)?.[1] ?? null);
  await click(source);
  await page.waitForURL((u) => u.href !== before, { timeout: 3000 }).catch(() => {});
  if (page.url() === before && ntrs) {
    // The headless recorder downloads PDFs instead of showing them: show the same report's NASA NTRS record page.
    log.notes.push(`06-evidence-chain: the source is a PDF (downloaded by the recorder); the clip lingers on its NTRS record page, citations/${ntrs}`);
    await page.goto(`https://ntrs.nasa.gov/citations/${ntrs}`, { waitUntil: 'load' });
  }
  await wait(3500);
});

await clip('07-brief', async ({ open, consoleReady, page, glideTo, confirmCrew, glide, wait }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#s1'), 120, 1000);
  await confirmCrew();
  await glideTo(page.locator('#s4'), 110, 2000);
  await page.getByRole('button', { name: /^Evidence E\d+/ }).first().waitFor({ timeout: 30000 }).catch(() => {});
  await wait(1500);
  await glide(await page.evaluate(() => scrollY + 420), 3500);
  await wait(2000);
});

await clip('08-gap-radar', async ({ open, consoleReady, page, glideTo, click, wait }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#s5'), 110, 2200);
  await wait(1500);
  await click(page.locator('section:has(#s5) li button').first());
  await wait(3500);
});

await clip('09-no-ignition', async ({ open, consoleReady, page, glideTo, click, wait, shot }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#evidence-map'), 120, 1800);
  const point = page.locator('[id^="map-point-"][aria-label*="no_ignition"], [id^="map-point-"][aria-label*="runs at this point"]').first();
  if (!(await point.count())) throw new Error('no plotted no_ignition run yet (publish one with O₂ and airflow)');
  await click(point);
  await wait(3000);
  await click(page.getByRole('button', { name: 'Did not ignite' }));
  await wait(2500);
  await shot('no-ignition.png');
});

await clip('10-library', async ({ open, page, click, wait, glide, shot }) => {
  await open('/library');
  const search = page.getByRole('searchbox').first();
  await click(search);
  await page.keyboard.type('PMMA', { delay: 220 });
  await wait(1500);
  await page.keyboard.press('Escape');
  const outcome = page.locator('select').filter({ has: page.locator('option[value="sustained"]') }).first();
  if (await outcome.count()) { await click(outcome); await outcome.selectOption('sustained'); }
  await wait(2000);
  await shot('library-grid.png');
  await click(page.locator('a[href^="/library/"]').first());
  await wait(2500);
  await glide(await page.evaluate(() => document.body.scrollHeight * 0.55), 3500);
  await wait(2500);
});

await clip('11-compare', async ({ open, page, hover, wait }) => {
  if (!t7 || !t8) throw new Error('GMT96-T7 / T8 missing from the catalog');
  await open(`/compare?ids=${encodeURIComponent(t7.id)},${encodeURIComponent(t8.id)}`);
  await wait(1200);
  const differ = page.getByText(/Entries differ/).first();
  if (await differ.count()) await hover(differ, 3000);
  await wait(1500);
});

await clip('12-share', async ({ open, consoleReady, page, glideTo, confirmCrew, click, wait }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#s1'), 120, 1000);
  await confirmCrew();
  const share = page.getByRole('button', { name: /share link/i }).first();
  await glideTo(share, 200, 1400);
  await click(share);
  await wait(2000);
  const link = await page.evaluate(() => navigator.clipboard.readText()).catch(() => '');
  if (!link.startsWith('http')) throw new Error('share link not on the clipboard');
  log.notes.push('12-share: the link opens in the same tab (one tab per clip), showing the scenario restored');
  await page.goto(link, { waitUntil: 'networkidle' });
  await wait(4000);
});

const caseClip = (value, png) => async ({ open, page, glideTo, click, wait, shot }) => {
  await open('/case');
  await glideTo(page.locator('#case-step2'), 160, 1600);
  const run = page.locator('section:has(#case-step2) select');
  await run.selectOption(await run.evaluate((s) => [...s.options].find((o) => o.textContent.includes('GMT96-T8'))?.value));
  await wait(900);
  const claim = page.locator('section:has(#case-step2) input[type=number]');
  await click(claim);
  await claim.fill('');
  await claim.pressSequentially(value, { delay: 260 });
  await wait(800);
  await click(page.getByRole('button', { name: 'Check against the record' }));
  await page.locator('#case-result').waitFor({ timeout: 15000 });
  await wait(1500);
  await glideTo(page.locator('#case-result'), 220, 1600);
  await wait(4000);
  await shot(png);
};
await clip('13-case-withheld', caseClip('10', 'case-withheld.png'));
await clip('14-case-accepted', caseClip('5', 'case-accepted.png'));

await clip('15-export', async ({ open, page, click, wait }) => {
  await open('/sources');
  const button = page.getByRole('button', { name: /Export/ }).or(page.getByRole('link', { name: /Export/ })).first();
  const download = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
  await click(button);
  const file = await download;
  if (file) { await file.saveAs(join(OUT, 'screenshots', `export-${file.suggestedFilename()}`)); log.notes.push(`15-export: downloaded ${file.suggestedFilename()} (saved beside the screenshots; the recorder has no download shelf to film)`); }
  await wait(2500);
});

await clip('16-methods-sources', async ({ open, page, glide, wait }) => {
  await open('/methods');
  await glide(await page.evaluate(() => document.body.scrollHeight * 0.6), 4000);
  await wait(1200);
  await page.goto(BASE + '/sources', { waitUntil: 'networkidle' });
  await wait(1200);
  await glide(await page.evaluate(() => document.body.scrollHeight * 0.6), 4000);
  await wait(1500);
});

await clip('17-mobile', async ({ open, consoleReady, page, glideTo, confirmCrew, wait }) => {
  await open('/#console', consoleReady);
  await glideTo(page.locator('#s1'), 120, 1200);
  await confirmCrew();
  await glideTo(page.locator('#evidence-map'), 130, 1800);
  await wait(4000);
}, { width: 390, height: 844, scale: 3, mobile: true });

await clip('18-light-theme', async ({ open, consoleReady, page, glide, wait }) => {
  await open('/#console', consoleReady);
  await glide(await page.evaluate(() => scrollY + 1800), 6000);
  await wait(1500);
}, { theme: 'light' });

await browser.close();
log.finishedAt = new Date().toISOString();
writeFileSync(join(OUT, 'session.json'), JSON.stringify(log, null, 1));
console.log(`catalog ${log.count} cards, revision ${String(log.catalogRevision).slice(0, 8)} · synthesize ${JSON.stringify(log.synthesize)}`);
for (const n of log.notes) console.log(`  · ${n}`);
