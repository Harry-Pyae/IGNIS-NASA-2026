/**
 * THE four cuts: every spoken line, caption, on-screen word and planned timing. docs/video-scripts.md (the recording
 * sheet) is generated from this file (`npm run cuts:doc`), so edit here, then regenerate.
 *
 * Rules (AGENTS.md): no "predict" except the approved spoken line "IGNIS never predicts" (DECISIONS-ROUND3 #2);
 * absence is bounded to the current IGNIS catalog; no science numbers in VO (numbers on screen come from
 * /api/export at prep time); a line with a pending `signOff` keeps the render a watermarked placeholder.
 */
import { COPY } from '../../../src/lib/copy.ts';
import { TODO } from '../validate.ts';
import type { CutDef, TeamMember } from './types';

export const LIVE_URL = 'ignis-nasa-2026.vercel.app';
export const TEAM_NAME = 'Team AstroFlare';
export const CHALLENGE = 'NASA Space Apps Challenge 2026 · Flame in Freefall';
/** Speech rate used to plan a line before its VO exists (words per second). The real file always wins. */
export const PLAN_WPS = 2.6;

/** Roles from IGNIS_TEAM_PLAN.md; each member fills in their own name exactly as they want it shown and spoken. */
export const TEAM: TeamMember[] = [
  { name: TODO('Coder A name (team lead)'), role: 'Team lead · engine & integration' },
  { name: TODO('Coder B name'), role: 'Mission console' },
  { name: TODO('Coder C name'), role: 'Evidence features' },
  { name: TODO('R1 name'), role: 'Data & science research' },
  { name: TODO('R2 name'), role: 'Media research' },
  { name: TODO('R3 name'), role: 'Testing & judge experience' },
];

/** On both end cards and the pitch close. Wording from the app (src/i18n nasaDisclaimer, CREDITS.md). */
export const CREDITS = {
  data: 'Data: NASA Technical Reports Server (NTRS) · NASA Physical Sciences Informatics (PSI)',
  disclaimer: 'IGNIS is an independent NASA Space Apps project. Not affiliated with or endorsed by NASA.',
  ai: 'Built with AI coding assistants (Claude Code, OpenAI Codex) under the team lead’s review. In the product, LLMs only parse scenarios and narrate retrieved evidence; the server validates every claim, and a named human verifies every card.',
  art: 'Backgrounds and the flame artwork are AI-generated illustration, not NASA imagery. Music: AI-generated (Google Gemini), used with permission.',
} as const;

const HERITAGE_SIGNOFF = 'R1: sign the heritage entry (docs/FACT-CHECK-QUEUE.md) before this line ships';
const PHYSICS_SIGNOFF = 'R1: confirm this plain-language description of buoyancy in microgravity';

export const CUTS: CutDef[] = [
  {
    id: 'demo',
    composition: 'CutDemo',
    title: 'The Demo (final submission, ≤30 s, casual VO)',
    lengthSec: { min: 20, max: 30 },
    music: 'Orbit_Flame_30sec.mp3',
    beats: [
      // Final submission cut (team lead, 2026-11-15): casual lines, no spoken numbers (the stats line renders on the end
      // card from /api/export). Scenes are the raw clips (scripts/clips.mjs), which must be re-captured after the data
      // restore: the clip-revision gate blocks --final until they are.
      { id: 'demo-01', vo: 'This is *IGNIS*, from Team AstroFlare.', shorter: 'This is *IGNIS*.', visual: { kind: 'title' }, targetSec: 3, minSec: 2.5, maxSec: 3.5 },
      { id: 'demo-02', vo: 'In orbit, fire behaves *differently* — and NASA’s evidence is buried in reports.', shorter: 'Fire acts *differently* in orbit. The evidence is buried.', visual: { kind: 'statement', text: 'Fire behaves differently in orbit.', sub: 'NASA’s evidence is scattered across decades of reports.' }, targetSec: 4.5, minSec: 4, maxSec: 5.4 },
      { id: 'demo-03', vo: 'Describe your scenario… and *confirm* it.', shorter: 'Describe it. *Confirm* it.', visual: { kind: 'clip', clip: '03-confirm-flow', at: 3.5, rate: 1.5 }, targetSec: 3, minSec: 2.6, maxSec: 3.4 },
      { id: 'demo-04', vo: 'IGNIS finds the closest *verified* NASA experiments.', shorter: 'The closest *verified* NASA runs.', visual: { kind: 'clip', clip: '06-evidence-chain', at: 12.5, rate: 1.8 }, targetSec: 3.5, minSec: 3, maxSec: 3.8 },
      { id: 'demo-05', vo: 'Every claim cites its *NASA* source.', shorter: 'Every claim is *sourced*.', visual: { kind: 'clip', clip: '06-evidence-chain', at: -0.05, floor: 18, hold: 1.2, rate: 1.5 }, targetSec: 3, minSec: 2.6, maxSec: 3.4 },
      { id: 'demo-06', vo: 'Move a slider — the evidence *updates*. The gaps stay *visible*.', shorter: 'Move a slider. Gaps stay *visible*.', visual: { kind: 'clip', clip: '04-slider-gap', at: 11.5, rate: 2 }, targetSec: 4, minSec: 3.5, maxSec: 4.4 },
      { id: 'demo-07', vo: 'Try a wrong number? *Withheld*.', shorter: 'Wrong number? *Withheld*.', visual: { kind: 'clip', clip: '13-case-withheld', at: 7, rate: 1.5 }, targetSec: 3.5, minSec: 2.5, maxSec: 3.8 },
      { id: 'demo-08', vo: 'IGNIS never predicts. It shows what *NASA saw*.', shorter: 'It shows what *NASA saw*.', visual: { kind: 'endStats' }, targetSec: 5.5, minSec: 4.2, maxSec: 6 },
    ],
  },
  {
    id: 'story',
    composition: 'CutStory',
    title: 'The Story (stakes-first, ≤30 s)',
    lengthSec: { min: 20, max: 30 },
    music: 'Sleeping_Giants_Breath_30sec.mp3',
    beats: [
      {
        id: 'story-01',
        vo: '*1967*. Apollo 1. Fire in a pure-oxygen cabin.',
        shorter: '*1967*. Apollo 1.',
        visual: { kind: 'history', year: '1967', name: 'Apollo 1', fact: 'Fire swept the command module during a ground test in a pure-oxygen cabin atmosphere.', factId: 'heritage-apollo-1' },
        targetSec: 3, minSec: 2.6, maxSec: 3.6, signOff: HERITAGE_SIGNOFF,
      },
      {
        id: 'story-02',
        vo: '*1997*. Mir. Fire in orbit.',
        visual: { kind: 'history', year: '1997', name: 'Mir', fact: 'A fire broke out aboard the Mir space station.', factId: TODO('heritage-mir: R1 adds and signs this entry in context-content.ts') },
        targetSec: 3, minSec: 2.6, maxSec: 3.6, signOff: 'R1: add and sign a heritage-mir entry (date, what burned, source)',
      },
      {
        id: 'story-03',
        vo: 'The evidence exists, scattered across *decades* of NASA papers.',
        shorter: 'The evidence exists. It’s *scattered*.',
        visual: { kind: 'statement', text: 'The evidence exists.', sub: 'Scattered across decades of NASA papers.' },
        targetSec: 4, minSec: 3.4, maxSec: 4.6,
      },
      {
        id: 'story-04',
        vo: 'IGNIS turns a cabin scenario into the closest *verified* NASA experiments.',
        shorter: 'IGNIS finds the closest *verified* NASA runs.',
        visual: { kind: 'clip', clip: '03-confirm-flow', at: 3.5, rate: 1.5 },
        targetSec: 4.5, minSec: 4, maxSec: 5,
      },
      { id: 'story-05', vo: 'Every value traces to its source. Every *gap* stays visible.', shorter: 'Every value is sourced. Every *gap* shows.', visual: { kind: 'clip', clip: '06-evidence-chain', at: -0.05, floor: 14, hold: 1.2, rate: 2 }, targetSec: 4.5, minSec: 4, maxSec: 5 },
      { id: 'story-06', vo: 'Claims that don’t match the record are *withheld*.', shorter: 'Wrong claims are *withheld*.', visual: { kind: 'clip', clip: '13-case-withheld', at: 7, rate: 1.5 }, targetSec: 4, minSec: 3.4, maxSec: 4.6 },
      { id: 'story-07', vo: 'What NASA saw. *Nothing it didn’t.*', visual: { kind: 'endStats' }, targetSec: 6, minSec: 5, maxSec: 8 },
    ],
  },
  {
    id: 'pitch',
    composition: 'CutPitch',
    title: 'Team pitch (3:00–4:00)',
    lengthSec: { min: 180, max: 240 },
    music: 'the_sleeping_giant_s_breath.mp3',
    beats: [
      // 01 · Team (0:00–0:25)
      { id: 'pitch-01', chapter: '01 · Team', vo: 'Hi, we’re *Team AstroFlare*, and this is IGNIS, our answer to NASA’s Flame in Freefall challenge.', visual: { kind: 'title' }, targetSec: 7, minSec: 6, maxSec: 9 },
      { id: 'pitch-02', chapter: '01 · Team', vo: '[Name A] led the engine and integration. [Name B] built the mission console, and [Name C] the evidence features.', visual: { kind: 'team' }, targetSec: 8, minSec: 7, maxSec: 10 },
      { id: 'pitch-03', chapter: '01 · Team', vo: '[Name R1] verified every card against NASA’s reports, [Name R2] researched the media, and [Name R3] *tested* it with real people.', visual: { kind: 'team' }, targetSec: 9, minSec: 8, maxSec: 11 },
      // 02 · The problem (0:25–1:00)
      { id: 'pitch-04', chapter: '02 · Why fire is different in orbit', vo: 'On Earth, a flame heats the air around it. Hot air *rises*, fresh air flows in, and the flame stands tall.', visual: { kind: 'physics' }, targetSec: 8, minSec: 7, maxSec: 10, signOff: PHYSICS_SIGNOFF },
      { id: 'pitch-05', chapter: '02 · Why fire is different in orbit', vo: 'In orbit, there is no *up* for hot air to rise to. A flame depends on the air that moves around it, like a cabin’s ventilation.', visual: { kind: 'physics' }, targetSec: 10, minSec: 9, maxSec: 12, signOff: PHYSICS_SIGNOFF },
      { id: 'pitch-06', chapter: '02 · Why fire is different in orbit', vo: 'NASA has tested this in orbit for years, in campaigns like BASS and Saffire. But the results sit in technical reports, tables and figures.', visual: { kind: 'statement', text: 'The evidence exists.', sub: 'In technical reports, tables and figures, across campaigns like BASS and Saffire.' }, targetSec: 9, minSec: 8, maxSec: 11 },
      { id: 'pitch-07', chapter: '02 · Why fire is different in orbit', vo: 'Finding what was *actually observed*, for one material and one airflow, takes careful reading. IGNIS puts it one question away.', visual: { kind: 'statement', text: 'What was actually observed?', sub: 'For one material, at one oxygen level and one airflow.' }, targetSec: 8, minSec: 7, maxSec: 10 },
      // 03 · The product (1:00–2:20), real cursor capture
      { id: 'pitch-08', chapter: '03 · The product', vo: 'Here is IGNIS, live. I start from a preset, *crew clothing*, or describe a scenario in plain words.', visual: { kind: 'ui', shots: ['landing', 'preset'] }, targetSec: 10, minSec: 9, maxSec: 12 },
      { id: 'pitch-09', chapter: '03 · The product', vo: 'IGNIS shows what it understood, and nothing runs until I *confirm* the inputs.', visual: { kind: 'ui', shots: ['confirm'] }, targetSec: 8, minSec: 7, maxSec: 10 },
      { id: 'pitch-10', chapter: '03 · The product', vo: 'The evidence map plots every verified experiment by oxygen and airflow. Each *shape* is an observed outcome.', visual: { kind: 'ui', shots: ['map'], zoom: { x: 0.62, y: 0.55, scale: 1.25 } }, targetSec: 10, minSec: 9, maxSec: 12 },
      { id: 'pitch-11', chapter: '03 · The product', vo: 'I tap a point, and its record opens right here: the conditions, a *verbatim* quote, and the page it came from.', visual: { kind: 'ui', shots: ['dotTap'] }, targetSec: 10, minSec: 9, maxSec: 12 },
      { id: 'pitch-12', chapter: '03 · The product', vo: 'The match panel ranks the closest runs by similarity of reported conditions, *not* by material safety. Each chip says why it matched.', visual: { kind: 'ui', shots: ['match'] }, targetSec: 11, minSec: 10, maxSec: 13 },
      { id: 'pitch-13', chapter: '03 · The product', vo: 'The mission brief narrates only what was retrieved. Every citation opens its card, and every card opens the *NASA report*.', visual: { kind: 'ui', shots: ['brief', 'citation', 'nasaPage'] }, targetSec: 12, minSec: 11, maxSec: 14 },
      { id: 'pitch-14', chapter: '03 · The product', vo: 'When I move the airflow slider, retrieval updates *instantly*.', visual: { kind: 'ui', shots: ['slider'] }, targetSec: 8, minSec: 8, maxSec: 10 },
      { id: 'pitch-15', chapter: '03 · The product', vo: `Hatched cells mean *no matching verified evidence* in the current IGNIS catalog. The gap radar ranks the largest regions.`, visual: { kind: 'ui', shots: ['gap'] }, targetSec: 10, minSec: 9, maxSec: 12 },
      { id: 'pitch-16', chapter: '03 · The product', vo: 'The library lets anyone browse, compare and cite every verified run.', visual: { kind: 'ui', shots: ['library', 'compare'] }, targetSec: 9, minSec: 8, maxSec: 11 },
      // 04 · Keeping it honest (2:20–2:50)
      { id: 'pitch-17', chapter: '04 · Keeping it honest', vo: 'How do we keep it honest? First, a *validator*. I claim this run used ten centimetres per second.', visual: { kind: 'ui', shots: ['caseWithheld'] }, targetSec: 8, minSec: 7, maxSec: 10, signOff: 'Check at render: GMT96-T8’s verified airflow is still 5 cm/s (the line says the card says five)' },
      { id: 'pitch-18', chapter: '04 · Keeping it honest', vo: 'The card says five. *Withheld*, and IGNIS shows the source row.', visual: { kind: 'ui', shots: ['caseWithheld'], at: 3 }, targetSec: 6, minSec: 5, maxSec: 8 },
      { id: 'pitch-19', chapter: '04 · Keeping it honest', vo: 'Second, every card is published by a *named* human reviewer, after checking it against its source.', visual: { kind: 'ui', shots: ['verifiedBy'] }, targetSec: 8, minSec: 7, maxSec: 10 },
      { id: 'pitch-20', chapter: '04 · Keeping it honest', vo: 'Third, we never claim more than the catalog holds. Where no verified flight test exists, like cargo packaging, IGNIS *says so* instead of guessing.', visual: { kind: 'statement', text: COPY.absence, sub: 'Never “NASA has never tested this.”' }, note: 'We had a way to fill Cable insulation with silicone sheets and declined — the geometry didn’t match a cable jacket. It now holds real USML-1 wire runs (1992), labelled as older; cargo packaging has none, so it sits on the gap line.', targetSec: 8, minSec: 7, maxSec: 10 },
      // 05 · Data, Earth, what's next (2:50–3:30)
      { id: 'pitch-21', chapter: '05 · Data and what’s next', vo: 'Thirty-one verified runs from eight NASA campaigns, from 16.4 to 31 percent oxygen and 54 to 101 kilopascals. Each traces to its report, page and quote, and the dataset is *open*.', visual: { kind: 'catalog' }, live: { cards: 31, campaigns: 8, o2: [16.4, 31], kpa: [54.1, 101.325] }, targetSec: 13, minSec: 11, maxSec: 16 },
      {
        id: 'pitch-22', chapter: '05 · Data and what’s next',
        vo: 'Flame research in microgravity matters on Earth, too: [R1: one sourced example, one sentence].',
        visual: { kind: 'statement', text: 'It matters on Earth, too.', sub: TODO('R1: one sourced Earth benefit of microgravity flame research, with its NASA source') },
        targetSec: 9, minSec: 8, maxSec: 12, signOff: 'R1: supply one sourced Earth-benefit sentence and its NASA source',
      },
      {
        id: 'pitch-23', chapter: '05 · Data and what’s next',
        vo: 'Next: more campaigns, and *partial gravity*, with lunar flammability data from programs like FM2 and LUCI, so the same questions work for the Moon.',
        visual: { kind: 'list', heading: 'What’s next', items: ['More verified campaigns: Saffire, SoFIE / MIST', 'Cargo packaging materials: no verified flight test in the catalog yet','Partial-gravity data: FM2 and LUCI (R1 to confirm)', 'A reviewed Burmese interface'] },
        targetSec: 11, minSec: 10, maxSec: 13, signOff: 'R1: confirm FM2 and LUCI are the right partial-gravity programs and describe them correctly',
      },
      // 06 · Thank you (3:30–4:00)
      { id: 'pitch-24', chapter: '06 · Thank you', vo: 'Thank you. Try IGNIS at the link on screen. The code and the data are *open*.', visual: { kind: 'close' }, targetSec: 12, minSec: 10, maxSec: 16 },
      { id: 'pitch-25', chapter: '06 · Thank you', vo: 'IGNIS never predicts. It shows what NASA saw, and *where the evidence stops*.', visual: { kind: 'close' }, targetSec: 14, minSec: 12, maxSec: 20 },
    ],
  },
  {
    // The in-app walkthrough (Help + hero "Watch the N-second walkthrough"): 1080p, VO + burned captions, no music, so it
    // reads without sound. Same capture take as the other cuts. A FINAL render lands in the app's public/media/ and
    // switches the button on (src/lib/walkthrough.ts); placeholders stay in out/.
    id: 'walkthrough',
    composition: 'CutWalkthrough',
    title: 'In-app walkthrough (Help, 90–120 s, 1080p, team-lead voice + captions)',
    lengthSec: { min: 90, max: 120 },
    music: null,
    captionBand: true,
    balancedCaptions: true,
    // Approved 2026-11-15 (team lead): one line per feature. Stage 2: team lead's voice (take 6), captions unchanged. All clips are the post-restore capture
    // at catalog revision 75f01fc1 with today's UI. GMT96-T8 (line 10) checked live at render: verified airflow 5 cm/s.
    beats: [
      { id: 'walkthrough-01', vo: 'Here is how IGNIS answers a question, using only verified NASA experiments.', visual: { kind: 'statement', text: 'How IGNIS answers a question', sub: 'Every value traces to a verified NASA card.' }, targetSec: 5, minSec: 5, maxSec: 5 },
      { id: 'walkthrough-02', vo: 'Pick a preset, or describe a scenario. Nothing runs until you confirm it.', visual: { kind: 'clip', clip: '03-confirm-flow', at: 1.4, rate: 1.2 }, targetSec: 8, minSec: 8, maxSec: 8 },
      { id: 'walkthrough-03', vo: 'Each dot on the evidence map is a real NASA test, placed by oxygen and airflow.', visual: { kind: 'clip', clip: '19-run-switcher', at: 3, rate: 0.6 }, targetSec: 7, minSec: 7, maxSec: 7 },
      { id: 'walkthrough-04', vo: 'Runs too close to tap apart share one point. Pick any of them from the list.', visual: { kind: 'clip', clip: '19-run-switcher', at: 6.5, rate: 1.3 }, targetSec: 7, minSec: 7, maxSec: 7 },
      { id: 'walkthrough-05', vo: 'Move a slider and the matches update right away.', visual: { kind: 'clip', clip: '04-slider-gap', at: 11.5, rate: 1.2 }, targetSec: 6, minSec: 6, maxSec: 6 },
      { id: 'walkthrough-06', vo: 'Matches are ranked by how close their conditions are, never by how safe a material is.', visual: { kind: 'clip', clip: '05-match-why', at: -0.6 }, targetSec: 8, minSec: 8, maxSec: 8 },
      { id: 'walkthrough-07', vo: 'Open any experiment in the library.', visual: { kind: 'clip', clip: '10-library', at: 1.4 }, targetSec: 5, minSec: 5, maxSec: 5 },
      { id: 'walkthrough-08', vo: 'Its source row shows the verbatim quote, the page, and who verified it. One click opens the NASA report.', visual: { kind: 'clip', clip: '06-evidence-chain', at: -0.05, hold: 1.5, rate: 1.3 }, targetSec: 10, minSec: 10, maxSec: 10 },
      { id: 'walkthrough-09', vo: 'Compare puts two runs side by side. A difference between records does not explain a difference in outcomes.', visual: { kind: 'clip', clip: '11-compare', at: 1.2 }, targetSec: 9, minSec: 9, maxSec: 9 },
      { id: 'walkthrough-10', vo: 'The 60-second case: claim a wrong airflow, and IGNIS checks the source row and withholds it.', visual: { kind: 'clip', clip: '13-case-withheld', at: -0.6 }, targetSec: 9, minSec: 9, maxSec: 9 },
      { id: 'walkthrough-11', vo: 'Give the value on the card, and it is accepted, with the same source row.', visual: { kind: 'clip', clip: '14-case-accepted', at: -0.6 }, targetSec: 6, minSec: 6, maxSec: 6 },
      { id: 'walkthrough-12', vo: 'Hatched cells show where the evidence runs out.', visual: { kind: 'clip', clip: '04-slider-gap', at: 19.5 }, targetSec: 6, minSec: 6, maxSec: 6 },
      { id: 'walkthrough-13', vo: 'The gap radar lists every region with no verified run yet.', visual: { kind: 'clip', clip: '08-gap-radar', at: 4.5 }, targetSec: 6, minSec: 6, maxSec: 6 },
      { id: 'walkthrough-14', vo: 'Every card is open: export the dataset, or check each NASA source.', visual: { kind: 'clip', clip: '16-methods-sources', at: 9.5 }, targetSec: 7, minSec: 7, maxSec: 7 },
      { id: 'walkthrough-15', vo: 'What NASA saw. Nothing it didn’t.', visual: { kind: 'end' }, targetSec: 5, minSec: 5, maxSec: 5 },
    ],
  },
  // Final 30 s cuts, silent-first (team lead, 2026-11-15): no voice; captions carry it; the music sits low and dips
  // 6 dB under each caption. Built from the raw capture clips (assets/real/captures/, catalog revision a0363adf).
  // The on-screen close is the approved "What NASA saw. Nothing it didn’t." (DECISIONS-ROUND3 #2 keeps "predicts"
  // spoken-only.) The Story keeps its heritage sign-offs: a placeholder until R1 signs them.
  {
    id: "demo30",
    composition: "CutDemo30",
    title: "The Demo, final 30 s (silent-first: captions + low music)",
    lengthSec: {
      min: 20,
      max: 30
    },
    music: "Orbit_Flame_30sec.mp3",
    silent: true,
    captionBand: true,
    beats: [
      {
        id: "demo30-01",
        vo: "",
        visual: {
          kind: "title"
        },
        targetSec: 3,
        minSec: 3,
        maxSec: 3
      },
      {
        id: "demo30-02",
        vo: "",
        visual: {
          kind: "statement",
          text: "Fire behaves differently in orbit.",
          sub: "NASA’s evidence is scattered across decades of reports."
        },
        targetSec: 5,
        minSec: 5,
        maxSec: 5
      },
      {
        id: "demo30-03",
        vo: "Describe the cabin scenario. *Confirm* the inputs.",
        visual: {
          kind: "clip",
          clip: "03-confirm-flow",
          at: 3.5,
          rate: 1.5
        },
        targetSec: 3,
        minSec: 3,
        maxSec: 3
      },
      {
        id: "demo30-04",
        vo: "The closest *verified* NASA runs. Every claim cites its *NASA* source.",
        visual: {
          kind: "clip",
          clip: "06-evidence-chain",
          at: -0.05,
          floor: 11,
          hold: 1.2,
          rate: 2.2
        },
        targetSec: 5.5,
        minSec: 5.5,
        maxSec: 5.5
      },
      {
        id: "demo30-05",
        vo: "Move a condition, and the evidence *updates*. Gaps stay *visible*.",
        visual: {
          kind: "clip",
          clip: "04-slider-gap",
          at: 11.5,
          rate: 2
        },
        targetSec: 4,
        minSec: 4,
        maxSec: 4
      },
      {
        id: "demo30-06",
        vo: "A claim that doesn’t match the record? *Withheld*.",
        visual: {
          kind: "clip",
          clip: "13-case-withheld",
          at: 7,
          rate: 1.5
        },
        targetSec: 3.5,
        minSec: 3.5,
        maxSec: 3.5
      },
      {
        id: "demo30-07",
        vo: "What NASA saw. *Nothing it didn’t.*",
        visual: {
          kind: "endStats"
        },
        targetSec: 5.9,
        minSec: 5.9,
        maxSec: 5.9
      }
    ]
  },
  {
    id: "story30",
    composition: "CutStory30",
    title: "The Story, final 30 s (silent-first: captions + low music)",
    lengthSec: {
      min: 20,
      max: 30
    },
    music: "Sleeping_Giants_Breath_30sec.mp3",
    silent: true,
    captionBand: true,
    beats: [
      {
        id: "story30-01",
        vo: "",
        visual: {
          kind: "history",
          year: "1967",
          name: "Apollo 1",
          fact: "Fire swept the command module during a ground test in a pure-oxygen cabin atmosphere.",
          factId: "heritage-apollo-1"
        },
        targetSec: 3,
        minSec: 3,
        maxSec: 3,
        signOff: HERITAGE_SIGNOFF
      },
      {
        id: "story30-02",
        vo: "",
        visual: {
          kind: "history",
          year: "1997",
          name: "Mir",
          fact: "A fire broke out aboard the Mir space station.",
          factId: TODO('heritage-mir: R1 adds and signs this entry in context-content.ts')
        },
        targetSec: 3,
        minSec: 3,
        maxSec: 3,
        signOff: "R1: add and sign a heritage-mir entry (date, what burned, source)"
      },
      {
        id: "story30-03",
        vo: "",
        visual: {
          kind: "statement",
          text: "The evidence exists.",
          sub: "Scattered across decades of NASA papers."
        },
        targetSec: 4,
        minSec: 4,
        maxSec: 4
      },
      {
        id: "story30-04",
        vo: "IGNIS turns a cabin scenario into the closest *verified* NASA experiments.",
        visual: {
          kind: "clip",
          clip: "03-confirm-flow",
          at: 3.5,
          rate: 1.5
        },
        targetSec: 4.5,
        minSec: 4.5,
        maxSec: 4.5
      },
      {
        id: "story30-05",
        vo: "Every value traces to its *source*.",
        visual: {
          kind: "clip",
          clip: "06-evidence-chain",
          at: -0.05,
          floor: 11,
          hold: 1.2,
          rate: 2.2
        },
        targetSec: 4.5,
        minSec: 4.5,
        maxSec: 4.5
      },
      {
        id: "story30-06",
        vo: "Every *gap* stays visible.",
        visual: {
          kind: "clip",
          clip: "04-slider-gap",
          at: 11.5,
          rate: 2.5
        },
        targetSec: 3,
        minSec: 3,
        maxSec: 3
      },
      {
        id: "story30-07",
        vo: "Claims that don’t match the record are *withheld*.",
        visual: {
          kind: "clip",
          clip: "13-case-withheld",
          at: 7.5,
          rate: 1.5
        },
        targetSec: 3.5,
        minSec: 3.5,
        maxSec: 3.5
      },
      {
        id: "story30-08",
        vo: "What NASA saw. *Nothing it didn’t.*",
        visual: {
          kind: "endStats"
        },
        targetSec: 4.4,
        minSec: 4.4,
        maxSec: 4.4
      }
    ]
  },
  {
    // The voiced walkthrough for the presentation's demo slot: the silent walkthrough's scenes and order (03 → 04 → 06 →
    // 09 → 13 → 14 → 10 → 11 → end card), voiced. Each beat fits its recorded line (never sped up); captions sit in a
    // band below the picture so they never cover verdicts or data. Plays alongside, not instead of, the silent loop.
    id: 'walk',
    composition: 'CutWalkVoiced',
    title: 'Voiced walkthrough (presentation demo slot, ~1:40, no cap)',
    lengthSec: { min: 60, max: 120 },
    music: 'the_sleeping_giant_s_breath.mp3',
    captionBand: true,
    beats: [
      { id: 'walk-01', vo: 'So here’s how it works. You describe your scenario — or just grab a preset — and nothing happens until you hit confirm. Then IGNIS pulls up the real NASA experiments, each one placed by its oxygen and airflow.', visual: { kind: 'clip', clip: '03-confirm-flow', at: 1.4 }, targetSec: 14, minSec: 11, maxSec: 17 },
      { id: 'walk-02', vo: 'Watch what happens when I move the airflow slider — the matches update right away. See those hatched cells? That means we have no verified evidence there. We show you that, instead of hiding it.', visual: { kind: 'clip', clip: '04-slider-gap', at: -0.6, floor: 13 }, targetSec: 13, minSec: 10, maxSec: 16 },
      { id: 'walk-03', vo: 'The closest runs get ranked by how similar their conditions are — we never rank materials by “safety.” Every run cites its source, and one click takes you to the actual NASA report.', visual: { kind: 'clip', clip: '06-evidence-chain', at: -0.05, floor: 9, hold: 2 }, targetSec: 13, minSec: 10, maxSec: 16 },
      { id: 'walk-04', vo: 'Outcomes are exactly what NASA observed. “Did not ignite” means they tried to light it — and it just wouldn’t catch.', visual: { kind: 'clip', clip: '09-no-ignition', at: -0.6, floor: 4 }, targetSec: 8, minSec: 5, maxSec: 11 },
      { id: 'walk-05', vo: 'Now here’s my favorite part. Let’s lie to it. I’ll claim this run used a different airflow than it really did… and IGNIS checks the source row and refuses — withheld.', visual: { kind: 'clip', clip: '13-case-withheld', at: -0.6, floor: 6 }, targetSec: 13, minSec: 10, maxSec: 16 },
      { id: 'walk-06', vo: 'Give it the real value, and it’s accepted — with the same source row right there, so you can check it yourself.', visual: { kind: 'clip', clip: '14-case-accepted', at: -0.6, floor: 8 }, targetSec: 9, minSec: 6, maxSec: 12 },
      { id: 'walk-07', vo: 'Anyone can dig into any experiment in the library — the conditions, the exact quote from the paper, and the page it came from.', visual: { kind: 'clip', clip: '10-library', at: 1.4 }, targetSec: 9, minSec: 6, maxSec: 12 },
      { id: 'walk-08', vo: 'You can put two runs side by side too. And we’re careful here — a difference between two records doesn’t explain a difference in outcomes.', visual: { kind: 'clip', clip: '11-compare', at: 1.4 }, targetSec: 10, minSec: 7, maxSec: 13 },
      { id: 'walk-09', vo: 'Thirty-one verified runs from eight NASA campaigns, from 16.4 to 31 percent oxygen and 54 to 101 kilopascals. Each traces to its report, page and quote, and the dataset is open.', visual: { kind: 'endStats' }, live: { cards: 31, campaigns: 8, o2: [16.4, 31], kpa: [54.1, 101.325] }, targetSec: 13, minSec: 10, maxSec: 16 },
    ],
  },
];
