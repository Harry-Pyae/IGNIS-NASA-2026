import { cancelRender, Composition, continueRender, delayRender, Folder, staticFile } from 'remotion';
import { data, Film, layout, transitionWindows } from './Film';
import { JOURNEY } from './transitions/journey';
import { REGISTRY } from './transitions/registry';
import { type Cut, mediaPaths, problems } from './validate';

// Fonts are the app's own self-hosted files (synced into public/fonts by scripts/run.mjs).
const fontsReady = delayRender('fonts');
Promise.all(
  [
    ['Space Grotesk', 'fonts/space-grotesk-latin.woff2', '300 700'],
    ['IBM Plex Mono', 'fonts/ibm-plex-mono-400-latin.woff2', '400'],
    ['IBM Plex Mono', 'fonts/ibm-plex-mono-500-latin.woff2', '500'],
  ].map(async ([family, file, weight]) => {
    const face = new FontFace(family!, `url(${staticFile(file!)}) format('woff2')`, { weight });
    document.fonts.add(await face.load());
  }),
).then(() => continueRender(fontsReady), cancelRender);

/** Refuse to render bad data, and fail loudly on any missing media file (never a silent fallback). */
async function metadata(cut: Cut) {
  const errors = problems(data, !data.isDummy);
  const missing: string[] = [];
  await Promise.all(
    [...new Set(mediaPaths(data))].map(async (p) => {
      const r = await fetch(staticFile(p), { method: 'HEAD' }).catch(() => null);
      if (!r?.ok) missing.push(p);
    }),
  );
  if (missing.length) errors.push(...missing.map((p) => `missing media file: ${p}`));
  if (errors.length) throw new Error(`IGNIS video data is not renderable:\n- ${errors.join('\n- ')}`);
  return { durationInFrames: layout(cut).total, fps: data.fps };
}

export function Root() {
  return (
    <>
      <Composition id="IgnisFilm" component={Film} defaultProps={{ cut: 'film' as Cut }} width={1920} height={1080} fps={30} durationInFrames={1} calculateMetadata={() => metadata('film')} />
      <Composition id="TrailerCut" component={Film} defaultProps={{ cut: 'trailer' as Cut }} width={1920} height={1080} fps={30} durationInFrames={1} calculateMetadata={() => metadata('trailer')} />
      {/* Each transition alone, per implementation (+ 'none' = plain cut), for previewing and the cost benchmark. */}
      <Folder name="transitions">
        {transitionWindows('film').flatMap((w) =>
          (['2.5d', '3d', 'none'] as const)
            .filter((impl) => impl !== '3d' || REGISTRY[JOURNEY[w.into].type]['3d'])
            .map((impl) => (
              <Composition
                key={`${w.into}-${impl}`}
                id={`T-${JOURNEY[w.into].type}-${impl.replace('.', '')}`}
                component={Film}
                defaultProps={{ cut: 'film' as Cut, impl, window: w }}
                width={1920}
                height={1080}
                fps={30}
                durationInFrames={w.frames}
              />
            )),
        )}
      </Folder>
    </>
  );
}
