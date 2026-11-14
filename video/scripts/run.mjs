// Usage: node scripts/run.mjs <real|dummy|stress> <check|studio|render|still> [extra remotion args]
// Syncs the app's art + fonts into the active public dir, checks the data, then runs Remotion with that data file.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);

const [mode = 'real', cmd = 'check', ...rest] = process.argv.slice(2);
const DATA = { real: 'src/data/video.data.ts', dummy: 'dummy/video.data.dummy.ts', stress: 'dummy/video.data.stress.ts' };
if (!DATA[mode]) fail(`unknown mode "${mode}" (real | dummy | stress)`);
if (!existsSync(DATA[mode])) fail(`${DATA[mode]} not found${mode === 'real' ? '' : ' — the dummy folder is local-only (see REUSE.md)'}`);
const pub = mode === 'real' ? 'public' : 'dummy/public';

// Single source for branding: the app's own public/art and public/fonts.
for (const dir of ['art', 'fonts']) cpSync(join('..', 'public', dir), join(pub, dir), { recursive: true });

// --- check (check:no-dummy for real) --------------------------------------------------------------
const { videoData } = await import(pathToFileURL(join(root, DATA[mode])).href);
const v = await import(pathToFileURL(join(root, 'src/validate.ts')).href);
const errors = v.problems(videoData, mode === 'real');
for (const p of new Set(v.mediaPaths(videoData))) if (!existsSync(join(pub, p))) errors.push(`missing media file: ${pub}/${p}`);
for (const cut of ['film', 'trailer']) {
  const total = v.totalSec(videoData, cut);
  console.log(`${cut}: ${total.toFixed(1)}s, product UI ${Math.round((v.productUiSec(videoData, cut) / total) * 100)}%`);
}
if (errors.length) fail(`${errors.length} problem(s) with ${DATA[mode]}:\n  - ${errors.join('\n  - ')}`);
console.log(`${DATA[mode]}: OK${videoData.isDummy ? ' (DUMMY — preview only, watermarked)' : ''}`);
if (cmd === 'check') process.exit(0);

// --- remotion ----------------------------------------------------------------------------------
const env = { ...process.env, IGNIS_VIDEO_DATA: mode };
const remotion = (args) => {
  const r = spawnSync('npx', ['remotion', ...args], { stdio: 'inherit', env, shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
const out = mode === 'real' ? 'out' : 'dummy/out';
mkdirSync(out, { recursive: true });
const tag = mode === 'real' ? '' : `-PREVIEW-${mode}`;

if (cmd === 'studio') remotion(['studio', 'src/index.ts', ...rest]);
else if (cmd === 'render') {
  remotion(['render', 'src/index.ts', 'IgnisFilm', `${out}/ignis-film${tag}.mp4`, ...rest]);
  remotion(['render', 'src/index.ts', 'TrailerCut', `${out}/ignis-trailer${tag}.mp4`, ...rest]);
} else if (cmd === 'still') remotion(['still', 'src/index.ts', ...rest]);
else fail(`unknown command "${cmd}"`);

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}
