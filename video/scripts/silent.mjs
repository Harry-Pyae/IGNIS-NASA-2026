// The silent walkthrough for the live presentation, built from the raw clips (scripts/clips.mjs) + the live export.
//   node scripts/silent.mjs        → assets/real/captures/ignis-silent-walkthrough.mp4 (2560×1440, no audio, loops)
// A hand-recorded 06-evidence-chain-manual.mp4 in the captures folder (the real NASA PDF on screen) replaces the
// automated 06 automatically: drop it in and run this again.
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const CAPTURES = 'assets/real/captures';
const PUB = 'public/silent';
const OUT = join(CAPTURES, 'ignis-silent-walkthrough.mp4');
const REMOTION = join(root, 'node_modules/@remotion/cli/remotion-cli.js');
const tool = (name, args) => spawnSync(process.execPath, [REMOTION, name, ...args], { encoding: 'utf8', maxBuffer: 256 << 20 });
const duration = (file) => Number(tool('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).stdout.trim());
const fail = (m) => { console.error(`✖ ${m}`); process.exit(1); };

// Sequence (team lead): 03 → 04 → 06 → 09 → 13/14 → 10/11 → end card. One caption per scene, approved script text
// (src/cuts/cuts.data.ts walkthrough lines, the map legend copy, the Compare page copy). No numbers in captions.
// 'head' clips start with the action; 'tail' clips first repeat the confirm flow, so the cut takes their end.
const SCENES = [
  { clip: '03-confirm-flow', take: 'head', sec: 11, caption: 'Pick a preset, or describe a scenario. Nothing runs until you confirm it.' },
  { clip: '04-slider-gap', take: 'tail', sec: 11, caption: 'Hatched cells have no verified card yet.' },
  // 06: the NASA page appears only in the clip's last frames: play to the very end and hold it 2 s.
  { clip: '06-evidence-chain', manual: '06-evidence-chain-manual', take: 'tail', sec: 12, hold: 2, pad: 0.05, caption: 'One click opens the NASA report it came from.' },
  { clip: '09-no-ignition', take: 'tail', sec: 8, caption: 'Did not ignite — ignition was attempted and the sample never caught.' },
  { clip: '13-case-withheld', take: 'tail', sec: 9, caption: 'A claim that misstates the record: IGNIS checks the source row and withholds it.' },
  { clip: '14-case-accepted', take: 'tail', sec: 7, caption: 'A value that matches its card is accepted, with the same source row.' },
  { clip: '10-library', take: 'head', sec: 9, caption: 'Open a documented experiment from the library.' },
  { clip: '11-compare', take: 'head', sec: 6, caption: 'Compare reported conditions side by side. A difference between records does not explain a difference in outcomes.' },
];

rmSync(PUB, { recursive: true, force: true });
mkdirSync(PUB, { recursive: true });
const segments = [];
const used = [];
for (const s of SCENES) {
  const name = s.manual && existsSync(join(CAPTURES, `${s.manual}.mp4`)) ? s.manual : s.clip;
  const src = join(CAPTURES, `${name}.mp4`);
  if (!existsSync(src)) fail(`missing clip ${src} (run npm run cuts:clips first)`);
  const dur = duration(src);
  const sec = Math.min(s.sec, Math.max(3, dur - 1.4));
  // head: skip most of the 2 s still pad; tail: end 0.6 s before the clip ends (a little of the closing pad).
  const fromSec = s.take === 'head' ? 1.4 : Math.max(0, dur - (sec - (s.hold ?? 0)) - (s.pad ?? 0.6));
  copyFileSync(src, join(PUB, `${name}.mp4`));
  segments.push({ file: `silent/${name}.mp4`, fromSec: Math.round(fromSec * 100) / 100, sec, caption: s.caption, ...(s.hold ? { hold: s.hold } : {}) });
  used.push(`${name} [${fromSec.toFixed(1)}–${(fromSec + sec).toFixed(1)} s of ${dur.toFixed(1)}]`);
}

const exp = await (await fetch('https://ignis-nasa-2026.vercel.app/api/export')).json();
const range = (k) => { const v = exp.experiments.map((e) => e[k]).filter((x) => x != null); return [Math.min(...v), Math.max(...v)]; };
const plan = {
  segments,
  stats: { cards: exp.count, campaigns: new Set(exp.experiments.map((e) => e.campaign)).size, o2: range('o2_pct'), kpa: range('pressure_kpa'), revision: exp.catalog_revision },
  openSec: 1,
  endSec: 6,
};
const total = plan.openSec + segments.reduce((t, s) => t + s.sec, 0) + plan.endSec;
if (total < 60 || total > 90) fail(`planned ${total.toFixed(1)} s is outside 60–90 s`);
writeFileSync(join(PUB, 'plan.json'), JSON.stringify(plan, null, 1));
console.log(`plan: ${total.toFixed(1)} s · ${plan.stats.cards} runs · revision ${plan.stats.revision.slice(0, 8)}\n  ${used.join('\n  ')}`);

const args = ['render', 'src/index.ts', 'SilentWalkthrough', OUT, '--codec=h264', '--crf=18', '--muted', `--concurrency=${process.env.CUTS_CONCURRENCY ?? '4'}`];
if (process.env.REMOTION_BROWSER) args.push(`--browser-executable=${process.env.REMOTION_BROWSER}`);
const r = spawnSync(process.execPath, [REMOTION, ...args], { stdio: 'inherit' });
if (r.status !== 0) fail('render failed');

// Verify: length, size, no audio stream, and a seamless loop (first frame == last frame, byte for byte when decoded).
const info = JSON.parse(tool('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height', '-of', 'json', OUT]).stdout);
const v = info.streams.find((x) => x.codec_type === 'video');
const audio = info.streams.some((x) => x.codec_type === 'audio');
const frameHash = (args) => tool('ffmpeg', ['-v', 'error', ...args, '-i', OUT, '-frames:v', '1', '-f', 'md5', '-']).stdout.trim();
const first = frameHash([]);
const last = frameHash(['-sseof', '-0.05']);
console.log(`${Number(info.format.duration).toFixed(2)} s · ${v.width}×${v.height} · audio track: ${audio ? 'YES (unexpected)' : 'none'} · loop: first ${first === last ? '=' : '≠'} last frame · ${(statSync(OUT).size / 2 ** 20).toFixed(1)} MB`);
rmSync(PUB, { recursive: true, force: true });
