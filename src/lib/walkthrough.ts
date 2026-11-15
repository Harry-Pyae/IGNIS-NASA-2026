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

export const WALKTHROUGH: Walkthrough | null = {
  "src": "/media/walkthrough.mp4",
  "poster": "/media/walkthrough-poster.jpg",
  "seconds": 104,
  "catalogRevision": "75f01fc13a13b15d38e3f1b5eed63d86",
  "transcript": [
    "Here is how IGNIS answers a question, using only verified NASA experiments.",
    "Pick a preset, or describe a scenario. Nothing runs until you confirm it.",
    "Each dot on the evidence map is a real NASA test, placed by oxygen and airflow.",
    "Runs too close to tap apart share one point. Pick any of them from the list.",
    "Move a slider and the matches update right away.",
    "Matches are ranked by how close their conditions are, never by how safe a material is.",
    "Open any experiment in the library.",
    "Its source row shows the verbatim quote, the page, and who verified it. One click opens the NASA report.",
    "Compare puts two runs side by side. A difference between records does not explain a difference in outcomes.",
    "The 60-second case: claim a wrong airflow, and IGNIS checks the source row and withholds it.",
    "Give the value on the card, and it is accepted, with the same source row.",
    "Hatched cells show where the evidence runs out.",
    "The gap radar lists every region with no verified run yet.",
    "Every card is open: export the dataset, or check each NASA source.",
    "What NASA saw. Nothing it didn’t."
  ]
};

/** The length in the label, to the nearest 5 s: an honest invitation, never rounded down to sound shorter. */
export const walkthroughLabelSeconds = (w: Pick<Walkthrough, 'seconds'>) => Math.ceil(w.seconds / 5) * 5;
