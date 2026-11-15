# VO drop folder

One file per numbered script line, named exactly as in `docs/video-scripts.md`:
`vo-demo-03.wav`, `vo-story-01.m4a`, `vo-pitch-17.wav` (`.wav`, `.m4a`, `.mp3`, `.aac`, `.ogg`).

Leave ~0.5 s of silence at each end; don't trim, normalise or speed anything up. `npm run cuts:prep` trims the silence,
normalises every clip to −16 LUFS, measures it and re-times the edit to it, and `out/cuts-report.txt` names any line
that pushes a 30-second cut past 30.0 s (with a shorter wording to re-record). Replace one file to re-record one line.

Audio files here are gitignored: they travel via the team drive.
