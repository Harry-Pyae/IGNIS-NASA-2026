import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { MonoLabel } from '../components/common';
import { C, MONO, OUTCOME, SANS } from '../theme';
import type { VideoData } from '../types';

/**
 * The emotional peak, kept still and quiet. The gap and the UNTESTED block cut in (no motion at all) and stay
 * motionless, like the app's .motion-still blocks. Nothing in this scene moves.
 */
export function Limit({ d }: { d: VideoData['limit'] }) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const gapVisible = f >= Math.round(durationInFrames * 0.22);
  const { map } = d;
  const PW = 760;
  const PH = 640;
  const cw = PW / map.columns;
  const ch = PH / map.rows;
  const x = (c: number) => 110 + c * cw;
  const y = (r: number) => 30 + PH - (r + 1) * ch;
  const tick = (i: number, n: number, len: number) => (n <= 1 ? 0 : (i / (n - 1)) * len);

  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', padding: '0 90px 150px', gap: 70 }}>
      <svg width={900} height={760} style={{ flex: 'none' }}>
        <defs>
          <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="10" fill={C.bg} fillOpacity=".45" />
            <line x1="0" y1="0" x2="0" y2="10" stroke={C.faint} strokeOpacity=".55" strokeWidth="2.4" />
          </pattern>
        </defs>
        <rect x={110} y={30} width={PW} height={PH} fill={C.panel} stroke={C.border} />
        {gapVisible && map.gap.map(([c, r], i) => <rect key={i} x={x(c)} y={y(r)} width={cw} height={ch} fill="url(#hatch)" />)}
        {map.tested.map((t, i) => (
          <circle key={i} cx={x(t.cell[0]) + cw / 2} cy={y(t.cell[1]) + ch / 2} r={Math.min(cw, ch) * 0.3} fill={OUTCOME[t.outcome]} />
        ))}
        <circle cx={x(map.scenario[0]) + cw / 2} cy={y(map.scenario[1]) + ch / 2} r={Math.min(cw, ch) * 0.55} fill="none" stroke={C.amber} strokeWidth="3" />
        {map.xTicks.map((t, i) => (
          <text key={i} x={110 + tick(i, map.xTicks.length, PW)} y={30 + PH + 34} fill={C.dim} fontFamily={MONO} fontSize="20" textAnchor="middle">{t}</text>
        ))}
        {map.yTicks.map((t, i) => (
          <text key={i} x={96} y={30 + PH - tick(i, map.yTicks.length, PH) + 7} fill={C.dim} fontFamily={MONO} fontSize="20" textAnchor="end">{t}</text>
        ))}
        <text x={110 + PW / 2} y={30 + PH + 74} fill={C.dim} fontFamily={MONO} fontSize="20" textAnchor="middle">{map.xLabel}</text>
        <text transform={`translate(28 ${30 + PH / 2}) rotate(-90)`} fill={C.dim} fontFamily={MONO} fontSize="20" textAnchor="middle">{map.yLabel}</text>
      </svg>

      {gapVisible && (
        <div style={{ background: C.untestedBg, border: `1px solid ${C.untestedBorder}`, borderRadius: 16, padding: '40px 46px', maxWidth: 780 }}>
          <MonoLabel size={26} color={C.amber}>{d.untestedLabel}</MonoLabel>
          <div style={{ fontFamily: SANS, fontSize: 40, lineHeight: 1.4, color: C.text, marginTop: 20 }}>{d.honestyLine}</div>
        </div>
      )}
    </AbsoluteFill>
  );
}
