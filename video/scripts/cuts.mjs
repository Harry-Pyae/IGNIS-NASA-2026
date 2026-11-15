// The submission/pitch cuts + the in-app walkthrough. Usage: node scripts/cuts.mjs <prep|doc|render|studio> [--final] [--offline]
//   prep    VO + music → public/ (trimmed, loudness-normalised), capture marks, live catalog numbers, QR → manifest;
//           prints each cut's voice-fit layout and every line over budget.
//   doc     regenerates docs/video-scripts.md (recording sheet + shot list) from src/cuts/cuts.data.ts.
//   render  prep, then renders every cut to out/ and checks each file's real length. --final refuses to render
//           anything still a placeholder (missing VO/shots, pending sign-offs, TODOs, uncleared music).
// Uses Remotion's bundled ffmpeg/ffprobe (silencedetect, atrim, loudnorm); no other audio tools needed.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const [cmd = 'prep', ...flags] = process.argv.slice(2);
const FINAL = flags.includes('--final');
const OFFLINE = flags.includes('--offline');
const FPS = 30;
const LUFS = -16;
const REMOTION = join(root, 'node_modules/@remotion/cli/remotion-cli.js');
const MANIFEST = 'public/cuts-manifest.json';

const { CUTS, LIVE_URL } = await import(pathToFileURL(join(root, 'src/cuts/cuts.data.ts')).href);
const timing = await import(pathToFileURL(join(root, 'src/cuts/timing.ts')).href);
const { SHOTS } = await import(pathToFileURL(join(root, 'src/cuts/shots.ts')).href);

const tool = (name, args) => spawnSync(process.execPath, [REMOTION, name, ...args], { encoding: 'utf8', maxBuffer: 64 << 20 });
const duration = (file) => Number(tool('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).stdout.trim());
const fresh = (out, src) => existsSync(out) && statSync(out).mtimeMs > statSync(src).mtimeMs;
const fail = (msg) => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

/** Two-pass loudnorm to −16 LUFS (linear, so dynamics are kept), optionally after trimming [start, end]. */
function normalise(src, out, { start, end, mono }) {
  const trim = start != null ? `atrim=start=${start.toFixed(3)}:end=${end.toFixed(3)},asetpts=PTS-STARTPTS,` : '';
  const target = `I=${LUFS}:TP=-1.5:LRA=11`;
  const pass1 = tool('ffmpeg', ['-hide_banner', '-nostats', '-i', src, '-af', `${trim}loudnorm=${target}:print_format=json`, '-f', 'null', '-']);
  const json = pass1.stderr.slice(pass1.stderr.lastIndexOf('{'), pass1.stderr.lastIndexOf('}') + 1);
  const m = JSON.parse(json);
  const measured = `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  const r = tool('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', src, '-af', `${trim}loudnorm=${target}:${measured}`, '-ar', '48000', '-ac', mono ? '1' : '2', out]);
  if (r.status !== 0) fail(`ffmpeg failed on ${src}:\n${r.stderr}`);
  return Number(m.input_i);
}

/** Leading/trailing silence of a recording (the spec asks for ~0.5 s at each end); keeps 80 ms of air. */
function speechSpan(src) {
  const total = duration(src);
  const r = tool('ffmpeg', ['-hide_banner', '-nostats', '-i', src, '-af', 'silencedetect=noise=-42dB:d=0.12', '-f', 'null', '-']);
  const starts = [...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((x) => Number(x[1]));
  const ends = [...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map((x) => Number(x[1]));
  let start = 0;
  let end = total;
  if (starts.length && starts[0] <= 0.05 && ends.length) start = ends[0];
  const lastStart = starts.at(-1);
  if (lastStart != null && (ends.length < starts.length || ends.at(-1) >= total - 0.05) && lastStart > start) end = lastStart;
  return { start: Math.max(0, start - 0.08), end: Math.min(total, end + 0.08), total };
}

async function prep() {
  for (const dir of ['art', 'fonts']) cpSync(join('..', 'public', dir), join('public', dir), { recursive: true });
  const old = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
  const manifest = { generatedAt: new Date().toISOString(), vo: {}, music: {}, capture: null, catalog: old.catalog ?? null, qr: null };
  const notes = [];

  // VO: assets/vo/vo-<cut>-<nn>.(wav|m4a|mp3|aac|ogg) → public/vo/<cut>-<nn>.wav
  mkdirSync('assets/vo', { recursive: true });
  mkdirSync('public/vo', { recursive: true });
  const known = new Set(CUTS.flatMap((c) => c.beats.map((b) => b.id)));
  for (const file of readdirSync('assets/vo')) {
    const m = file.match(/^vo-(demo|story|pitch)-(\d{2})\.(wav|m4a|mp3|aac|ogg)$/i);
    if (!m) {
      if (!/^readme/i.test(file)) notes.push(`ignored assets/vo/${file} (name it vo-<demo|story|pitch>-<nn>.wav)`);
      continue;
    }
    const id = `${m[1].toLowerCase()}-${m[2]}`;
    if (!known.has(id)) {
      notes.push(`assets/vo/${file}: no line ${id} in the script`);
      continue;
    }
    const src = join('assets/vo', file);
    const out = `public/vo/${id}.wav`;
    if (!fresh(out, src)) {
      const span = speechSpan(src);
      const loud = normalise(src, out, { ...span, mono: true });
      notes.push(`VO ${id}: trimmed ${span.start.toFixed(2)}s / ${(span.total - span.end).toFixed(2)}s of silence, ${loud.toFixed(1)} → ${LUFS} LUFS`);
    }
    manifest.vo[id] = { file: `vo/${id}.wav`, sec: duration(out) };
  }

  // Music: assets/music/* → public/music/<name>.wav at −16 LUFS; licence state from docs/media-ledger.md (Approved? = Yes).
  mkdirSync('assets/music', { recursive: true });
  mkdirSync('public/music', { recursive: true });
  const ledger = existsSync('../docs/media-ledger.md') ? readFileSync('../docs/media-ledger.md', 'utf8').split('\n') : [];
  for (const file of readdirSync('assets/music').filter((f) => /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(f))) {
    const src = join('assets/music', file);
    const out = `public/music/${file.replace(/\.[^.]+$/, '')}.wav`;
    if (!fresh(out, src)) normalise(src, out, { mono: false });
    const row = ledger.find((l) => l.includes(file)) ?? '';
    const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
    manifest.music[file] = { file: out.slice('public/'.length), sec: duration(out), cleared: /^yes$/i.test(cells.at(-1) ?? ''), ledger: row ? cells.join(' | ') : 'no ledger row' };
  }

  // Capture take (scripts/capture.mjs).
  if (existsSync('public/capture/take.json')) manifest.capture = JSON.parse(readFileSync('public/capture/take.json', 'utf8'));

  // Live catalog numbers (read-only GET), so on-screen counts match the catalog at render time.
  const range = (values) => { const v = values.filter((x) => x != null); return v.length ? [Math.min(...v), Math.max(...v)] : null; };
  if (!OFFLINE) {
    try {
      const res = await fetch(`https://${LIVE_URL}/api/export`, { signal: AbortSignal.timeout(20000) });
      const body = await res.json();
      const rows = body.experiments ?? [];
      manifest.catalog = {
        cards: body.count ?? rows.length,
        campaigns: new Set(rows.map((e) => e.campaign)).size,
        sources: new Set(rows.map((e) => e.ntrs_id ?? e.source_url ?? e.source_title)).size,
        o2: range(rows.map((e) => e.o2_pct)),
        kpa: range(rows.map((e) => e.pressure_kpa)),
        revision: body.catalog_revision ?? 'unknown',
        fetchedAt: new Date().toISOString(),
      };
    } catch (e) {
      notes.push(`catalog fetch failed (${e.message}); keeping ${manifest.catalog ? `the ${manifest.catalog.fetchedAt} numbers` : 'no numbers'}`);
    }
  }

  const qr = QRCode.create(`https://${LIVE_URL}`, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size;
  manifest.qr = Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => (qr.modules.get(r, c) ? '1' : '0')).join(''));

  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
  return { manifest, notes };
}

function report(manifest, notes) {
  const lines = [`Voice-fit report · ${manifest.generatedAt}`, ''];
  for (const n of notes) lines.push(`· ${n}`);
  if (manifest.catalog) lines.push(`· catalog: ${manifest.catalog.cards} verified cards, ${manifest.catalog.campaigns} campaigns, ${manifest.catalog.sources} sources (revision ${manifest.catalog.revision})`);
  for (const cut of CUTS) {
    const l = timing.layoutCut(cut, manifest, FPS);
    const recorded = l.beats.filter((b) => b.recorded).length;
    lines.push('', `${cut.title}: ${l.totalSec.toFixed(2)}s · VO ${recorded}/${l.beats.length} recorded${recorded < l.beats.length ? ' (the rest planned at the script’s words-per-second)' : ''}`);
    for (const b of l.beats) {
      const flag = b.overMax ? `  ⚠ needs ${b.needSec.toFixed(2)}s, max ${b.beat.maxSec}s` : '';
      lines.push(`  ${b.beat.id}  ${b.fromSec.toFixed(2).padStart(6)}s  ${b.sec.toFixed(2).padStart(5)}s  ${b.recorded ? 'VO' : 'plan'} ${b.voSec.toFixed(2)}s${flag}`);
    }
    if (l.lengthProblem) lines.push(`  ✖ ${l.lengthProblem}`);
    for (const o of l.overBudget) lines.push(`  ↳ ${o.id} runs ${o.overSec.toFixed(2)}s over its target. Now: “${o.vo}”${o.shorter ? ` → re-record as: “${o.shorter}”` : ''}`);
    const reasons = timing.placeholderReasons(cut, manifest);
    lines.push(reasons.length ? `  placeholder (watermarked) because:\n${reasons.map((r) => `    - ${r}`).join('\n')}` : '  ready for a final render');
  }
  const text = lines.join('\n');
  console.log(text);
  mkdirSync('out', { recursive: true });
  writeFileSync('out/cuts-report.txt', text + '\n');
}

function doc() {
  const L = [];
  const p = (s = '') => L.push(s);
  p('# Video scripts — recording sheet, voice-fit spec and shot list');
  p();
  p('Generated from `video/src/cuts/cuts.data.ts` by `npm run cuts:doc` in `video/`. Edit the data file, then regenerate.');
  p('Four cuts: **The Demo** (≤30.0 s, submission candidate A), **The Story** (≤30.0 s, candidate B), the **Team pitch** (3:00–4:00) and the **In-app walkthrough** (60–90 s, 1080p, no music: the app’s “Watch the walkthrough” button). The walkthrough reaches the app only from a final render (`npm run cuts:render -- --final --only=walkthrough`), which writes `public/media/walkthrough.mp4` + poster and switches the button on in `src/lib/walkthrough.ts`.');
  p('Both 30-second cuts end on the same end card, frame for frame, so swapping the submission is a file swap.');
  p();
  p('**How to read a line:** say it plainly at a normal pace. *Italic* words carry the stress. `[Name A]` = say your own name.');
  p('“IGNIS” is said **IG-niss**. “Saffire” is said like “sapphire”. Catalog numbers are spoken only in lines marked **[LIVE]**: record those last, after “catalog final”. `npm run cuts:prep` checks every [LIVE] line against the live catalog and keeps the render a placeholder on any mismatch.');
  p();
  for (const cut of CUTS) {
    const words = cut.beats.reduce((s, b) => s + timing.wordCount(b.vo), 0);
    const planned = cut.beats.reduce((s, b) => s + b.targetSec, 0);
    p(`## ${cut.title}`);
    p();
    p(`File prefix \`vo-${cut.id}-\` · ${cut.beats.length} lines · **${words} words** · planned ${planned.toFixed(1)} s · music: ${cut.music ? `\`${cut.music}\`` : 'none (VO only)'}`);
    p();
    p('| # | File | Line (read this) | Words | Target s | Shown while it plays |');
    p('|---|---|---|---|---|---|');
    for (const b of cut.beats) {
      const n = b.id.split('-')[1];
      const v = b.visual;
      const shown = v.kind === 'ui' ? `Product: ${v.shots.join(' → ')}` : v.kind === 'statement' ? `“${v.text}”` : v.kind === 'history' ? `${v.year} · ${v.name}` : v.kind === 'list' ? v.heading : { title: 'Title card', team: 'Team names + roles', physics: 'Earth vs orbit flame (illustration)', catalog: 'Live catalog numbers', end: 'Shared end card', close: 'URL + QR, credits, AI use, not affiliated' }[v.kind];
      const line = b.vo.replace(/\*([^*]+)\*/g, '*$1*').replace(/\|/g, '\\|');
      const notes = [b.chapter && `**${b.chapter}**`, b.live && '**[LIVE] catalog numbers: record this line LAST**', b.signOff && `⚠ ${b.signOff}`, b.note && `Presenter note: ${b.note}`].filter(Boolean).join('<br>');
      p(`| ${n} | \`vo-${cut.id}-${n}.wav\` | ${line}${notes ? `<br><sub>${notes}</sub>` : ''} | ${timing.wordCount(b.vo)} | ${b.targetSec} | ${shown} |`);
    }
    if (cut.beats.some((b) => b.shorter)) {
      p();
      p('Shorter wordings, used only if the voice-fit report says that line is over budget:');
      p();
      for (const b of cut.beats.filter((x) => x.shorter)) p(`- \`${b.id}\`: ${b.shorter}`);
    }
    p();
  }
  p('## Recording spec');
  p();
  p('- **One file per numbered line**, named exactly as in the tables: `vo-demo-03.wav`, `vo-story-01.m4a`, `vo-pitch-17.wav`. `.wav`, `.m4a`, `.mp3`, `.aac` or `.ogg` all work.');
  p('- **Drop folder:** `video/assets/vo/`. Re-record any single line by replacing its file; nothing else changes.');
  p('- Quiet room, soft furnishings, no fan or music. A phone is fine: hold it 20–30 cm away, slightly to the side of your mouth.');
  p('- Leave **about half a second of silence** before and after each line. Don’t trim it: the prep step trims it.');
  p('- Same voice, same room, same distance for every line in one cut. Three takes of a line is fine; keep the best and delete the rest.');
  p('- **Never speed up a line to fit.** If a 30-second cut runs long, the report names the line and a shorter wording to re-record.');
  p();
  p('### What happens to the files (voice-fit)');
  p();
  p('`npm run cuts:prep` in `video/`:');
  p();
  p('1. Trims leading/trailing silence (`silencedetect`, keeping 80 ms of air), then normalises each clip to −16 LUFS with two-pass `loudnorm` (linear: no compression, no speed or pitch change).');
  p('2. Measures each clip. Each beat lasts **lead 0.15 s + the clip + tail 0.35 s**, clamped to the line’s min/max so visuals never flash or drag; a voice is never cut, so a line longer than its max grows its beat and is reported.');
  p('3. Captions come from these exact lines, split into short phone-readable chunks timed across the clip.');
  p('4. 30-second cuts: if the total passes 30.0 s, `out/cuts-report.txt` lists each line over its target, by how much, with the shorter wording above. Re-record those lines; nothing is compressed.');
  p('5. Lines not yet recorded are planned from their word count (2.6 words/s) and the render stays a watermarked placeholder.');
  p();
  p('## Music');
  p();
  p('Drop folder: `video/assets/music/`. Each track is normalised to −16 LUFS, then sits at −8 dB with no voice and **dips to −18 dB under the voice** (150 ms attack, 450 ms release), fades in over 0.5 s and fades out across the end card. A track shorter than its cut loops with a 2 s crossfade.');
  p();
  p('| Cut | Track | Why |');
  p('|---|---|---|');
  p('| The Demo | `Orbit_Flame_30sec.mp3` | Most driving (assigned by title: the tracks are not auditioned by the build) |');
  p('| The Story | `Sleeping_Giants_Breath_30sec.mp3` | The 30-second edit of the slower piece |');
  p('| Team pitch | `the_sleeping_giant_s_breath.mp3` | Calmest, and the only full-length track (121.7 s, looped to length) |');
  p();
  p('To swap, change `music` on the cut in `cuts.data.ts`. **No final render until each track has an Approved row in `docs/media-ledger.md`** (Audio section): team-made says so; a downloaded track names its source and licence. A track that can’t be cleared is swapped, or that cut ships VO-only (`music: null`).');
  p();
  p('## Re-capture shot list (one session, in this order)');
  p();
  p('Run `node scripts/capture.mjs` in `video/` once the catalog has grown and the latest `main` is deployed. It records the **live production app** at a **1440×810 viewport at 2× (2880×1620)**, never upscaled, as one continuous take with a visible pointer, and marks where each shot begins. Every cut picks its moments from this one take.');
  p();
  p('| # | Shot id | What must be on screen | Used by |');
  p('|---|---|---|---|');
  SHOTS.forEach((s, i) => p(`| ${i + 1} | \`${s.id}\` | ${s.what} | ${s.cuts.join(', ')} |`));
  p();
  p('Before the session: catalog grown and published; `MISSION_CASE` set if the guided mission should appear; the *Crew clothing* briefing warmed (one unforced run) so the Brief comes from the cache. The script allows one synthesize call and blocks the rest, so no extra generations run while recording. GMT96-T8 must still read 5 cm/s for the WITHHELD shot (`pitch-17/18` say “ten” and “five”).');
  p();
  p('## Standing rules');
  p();
  p('- Real product UI and ledgered NASA footage only. The AI art pack is branding and background; wherever the flame artwork appears it carries “Illustration — not NASA experiment imagery.” No NASA insignia.');
  p('- “Predict” appears only in the approved spoken line “IGNIS never predicts” (DECISIONS-ROUND3 #2), never in captions-only text or on screen elsewhere.');
  p('- On-screen numbers come from `/api/export` at prep time; the VO never reads a count.');
  p('- Burned-in English captions on every frame with speech; every cut works with the sound off.');
  p('- A render is watermarked **PREVIEW — PLACEHOLDER** while anything is pending; `npm run cuts:render -- --final` refuses to render until nothing is.');
  writeFileSync('../docs/video-scripts.md', L.join('\n') + '\n');
  console.log('wrote docs/video-scripts.md');
}

function render() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  mkdirSync('out', { recursive: true });
  const only = flags.find((f) => /^--only=/.test(f))?.slice(7);
  const cuts = CUTS.filter((c) => !only || c.id === only);
  const blocked = cuts.map((c) => [c, timing.placeholderReasons(c, manifest)]).filter(([, r]) => r.length);
  if (FINAL && blocked.length) fail(`--final: still placeholders:\n${blocked.map(([c, r]) => `  ${c.title}\n${r.map((x) => `    - ${x}`).join('\n')}`).join('\n')}`);
  for (const cut of cuts) {
    // The in-app walkthrough: 1080p (scale 0.75), sized for the web (≤ 30 MB). A FINAL render goes straight into the
    // app's public/media/ and switches its button on; a placeholder never leaves out/.
    const inApp = cut.id === 'walkthrough';
    const out = inApp && FINAL ? '../public/media/walkthrough.mp4' : `out/ignis-${cut.id}${FINAL ? '' : '-PLACEHOLDER'}.mp4`;
    mkdirSync(dirname(out), { recursive: true });
    const args = ['render', 'src/index.ts', cut.composition, out, '--codec=h264', `--crf=${inApp ? 23 : 18}`, '--audio-codec=aac', `--concurrency=${process.env.CUTS_CONCURRENCY ?? '50%'}`];
    if (inApp) args.push('--scale=0.75');
    if (process.env.REMOTION_BROWSER) args.push(`--browser-executable=${process.env.REMOTION_BROWSER}`);
    const r = spawnSync(process.execPath, [REMOTION, ...args], { stdio: 'inherit' });
    if (r.status !== 0) fail(`render failed: ${cut.composition}`);
    const probe = tool('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate,duration', '-of', 'json', out]).stdout;
    const info = JSON.parse(probe);
    const v = info.streams.find((s) => s.codec_type === 'video');
    const len = Number(info.format.duration);
    const ok = len <= cut.lengthSec.max + 1e-3 && len >= cut.lengthSec.min - 1e-3;
    console.log(`${ok ? '✓' : '✖'} ${out}: ${len.toFixed(3)}s (container), video ${Number(v.duration).toFixed(3)}s, ${v.width}×${v.height} @ ${v.r_frame_rate}`);
    if (!ok) fail(`${out} is outside ${cut.lengthSec.min}–${cut.lengthSec.max}s`);
    if (inApp) {
      const mb = statSync(out).size / 2 ** 20;
      console.log(`  ${mb.toFixed(1)} MB`);
      if (mb > 30) fail(`${out} is ${mb.toFixed(1)} MB: over the 30 MB in-app budget (raise --crf)`);
      if (FINAL) publishWalkthrough(cut, manifest, len);
    }
  }
}

/** Poster still + src/lib/walkthrough.ts: the app shows the button only once this has run on a final render. */
function publishWalkthrough(cut, manifest, len) {
  const poster = '../public/media/walkthrough-poster.jpg';
  const frame = Math.round(1.5 * FPS); // the opening statement card, settled
  const r = spawnSync(process.execPath, [REMOTION, 'still', 'src/index.ts', cut.composition, poster, `--frame=${frame}`, '--scale=0.75', '--image-format=jpeg', '--jpeg-quality=82'], { stdio: 'inherit' });
  if (r.status !== 0) fail('poster still failed');
  const video = {
    src: '/media/walkthrough.mp4',
    poster: '/media/walkthrough-poster.jpg',
    seconds: Math.round(len * 10) / 10,
    catalogRevision: manifest.catalog.revision,
    transcript: cut.beats.map((b) => timing.withNames(b.vo).replace(/\*/g, '')),
  };
  const file = '../src/lib/walkthrough.ts';
  const src = readFileSync(file, 'utf8');
  const next = src.replace(/export const WALKTHROUGH: Walkthrough \| null = [\s\S]*?;\n/, `export const WALKTHROUGH: Walkthrough | null = ${JSON.stringify(video, null, 2)};\n`);
  if (next === src && !src.includes(JSON.stringify(video, null, 2))) fail(`could not update ${file}`);
  writeFileSync(file, next);
  console.log(`✓ walkthrough published: ${video.src} (${video.seconds}s, revision ${video.catalogRevision.slice(0, 8)}) → ${file}`);
}

if (cmd === 'prep' || cmd === 'render') {
  const { manifest, notes } = await prep();
  report(manifest, notes);
  if (cmd === 'render') render();
} else if (cmd === 'doc') doc();
else if (cmd === 'studio') spawnSync(process.execPath, [REMOTION, 'studio', 'src/index.ts'], { stdio: 'inherit' });
else fail(`unknown command "${cmd}" (prep | doc | render | studio)`);
