import path from 'node:path';
import { Config } from '@remotion/cli/config';

/**
 * IGNIS_VIDEO_DATA picks the data file and its media folder (scripts/run.mjs sets it):
 *   real (default)  src/data/video.data.ts          + public/
 *   dummy           dummy/video.data.dummy.ts       + dummy/public/   (local only, gitignored)
 *   stress          dummy/video.data.stress.ts      + dummy/public/   (2x-length text, local only)
 */
const mode = process.env.IGNIS_VIDEO_DATA ?? 'real';
const DATA: Record<string, string> = {
  real: 'src/data/video.data.ts',
  dummy: 'dummy/video.data.dummy.ts',
  stress: 'dummy/video.data.stress.ts',
};
if (!DATA[mode]) throw new Error(`Unknown IGNIS_VIDEO_DATA "${mode}" (real | dummy | stress)`);

// Optional: use an installed Chromium (e.g. Edge) when Remotion can't download its own headless shell.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);

Config.setPublicDir(mode === 'real' ? 'public' : 'dummy/public');
Config.setVideoImageFormat('jpeg');
// WebGL for the @remotion/three transitions: ANGLE uses the GPU through Direct3D/Metal/GL.
Config.setChromiumOpenGlRenderer('angle');
Config.setCrf(22);
Config.overrideWebpackConfig((c) => ({
  ...c,
  resolve: { ...c.resolve, alias: { ...(c.resolve?.alias as object), '@data': path.resolve(DATA[mode]!) } },
}));
