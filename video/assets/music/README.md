# Music drop folder

Instrumental tracks for the three cuts. Which cut uses which track is the `music` field of each cut in
`video/src/cuts/cuts.data.ts` (null = VO only).

Every track needs a row in `docs/media-ledger.md` → **Audio** with its origin and licence, marked **Yes**, before a
final render (`npm run cuts:render -- --final` checks). Team-made: say so. Downloaded: name the source and licence.

`npm run cuts:prep` normalises each track to −16 LUFS; the cut then keeps it at −8 dB, ducks it to −18 dB under the
voice, loops it with a 2 s crossfade if it's shorter than the cut, and fades it out across the end card.

Audio files here are gitignored: they travel via the team drive.
