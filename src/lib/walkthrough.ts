/**
 * The in-app walkthrough video (public/media/). Content gate: while this is null, every "Watch the walkthrough"
 * control is absent (never a broken player). Set it only for a FINAL render cut from a capture of the live product
 * on the current catalog (`npm run cuts:render -- --final --only=walkthrough` in video/ writes this file); CI checks
 * that the file exists and stays ≤ 30 MB.
 */
export interface Walkthrough {
  /** Served from public/: '/media/walkthrough.mp4' (1080p, burned-in captions). */
  src: string;
  /** First-frame still shown before play. */
  poster: string;
  seconds: number;
  /** The catalog revision the capture was recorded on. */
  catalogRevision: string;
  /** One entry per caption line, in order (Help shows it as the transcript). */
  transcript: string[];
}

export const WALKTHROUGH: Walkthrough | null = null;

/** The length in the label, to the nearest 5 s: an honest invitation, never rounded down to sound shorter. */
export const walkthroughLabelSeconds = (w: Pick<Walkthrough, 'seconds'>) => Math.ceil(w.seconds / 5) * 5;
