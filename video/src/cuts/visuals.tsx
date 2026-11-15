import type { ReactNode } from 'react';
import { AbsoluteFill, Freeze, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COPY } from '../../../src/lib/copy.ts';
import { Rise } from '../components/common';
import { C, easeInOut, MONO, monoLabel, SANS } from '../theme';
import { CHALLENGE, CREDITS, LIVE_URL, TEAM, TEAM_NAME } from './cuts.data.ts';
import { SHOTS } from './shots.ts';
import type { Manifest } from './timing.ts';
import type { Visual } from './types';

const TODO_MARK = '__TODO__';
/** A TODO left in the data shows as an amber [bracket] in a placeholder render, never as raw marker text. */
const shown = (s: string) => (s.startsWith(TODO_MARK) ? `[${s.slice(TODO_MARK.length).trim()}]` : s);
const isTodo = (s: string) => s.startsWith(TODO_MARK);

const center = { justifyContent: 'center', alignItems: 'center' } as const;

export function VisualFor({ v, manifest }: { v: Visual; manifest: Manifest }) {
  switch (v.kind) {
    case 'title': return <Title />;
    case 'statement': return <Statement text={v.text} sub={v.sub} />;
    case 'history': return <History year={v.year} name={v.name} fact={v.fact} />;
    case 'ui': return <Ui v={v} manifest={manifest} />;
    case 'team': return <Team />;
    case 'physics': return <Physics />;
    case 'catalog': return <Catalog manifest={manifest} />;
    case 'list': return <List heading={v.heading} items={v.items} />;
    case 'end': return <EndCard />;
    case 'close': return <Close manifest={manifest} />;
  }
}

function Title() {
  return (
    <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 36 }}>
      <Rise><Img src={staticFile('art/logo-flame.webp')} style={{ width: 230, height: 230, borderRadius: '50%' }} /></Rise>
      <Rise at={4}><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 230, letterSpacing: '0.16em', color: C.text, lineHeight: 1 }}>IGNIS</div></Rise>
      <Rise at={9}><div style={{ fontFamily: SANS, fontSize: 70, color: C.text }}>{TEAM_NAME}</div></Rise>
      <Rise at={13}><div style={{ ...monoLabel, fontSize: 44, color: C.amber }}>{CHALLENGE}</div></Rise>
    </AbsoluteFill>
  );
}

function Statement({ text, sub }: { text: string; sub?: string }) {
  return (
    <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 48, padding: '0 260px 200px', textAlign: 'center' }}>
      <Rise><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 132, lineHeight: 1.08, color: C.text }}>{text}</div></Rise>
      {sub && <Rise at={8}><div style={{ fontFamily: SANS, fontSize: 64, lineHeight: 1.3, color: isTodo(sub) ? C.amber : C.dim }}>{shown(sub)}</div></Rise>}
    </AbsoluteFill>
  );
}

/** Text only: no ledgered NASA image exists for these moments, and the art pack never stands in for history. */
function History({ year, name, fact }: { year: string; name: string; fact: string }) {
  return (
    <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 30, padding: '0 300px 220px', textAlign: 'center' }}>
      <Rise><div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 300, lineHeight: 1, color: C.amber }}>{year}</div></Rise>
      <Rise at={6}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 120, color: C.text }}>{name}</div></Rise>
      <Rise at={12}><div style={{ fontFamily: SANS, fontSize: 60, lineHeight: 1.3, color: C.dim, maxWidth: 1900 }}>{fact}</div></Rise>
    </AbsoluteFill>
  );
}

/** The capture take from each shot's mark in turn; holds the last frame if the take runs out (never a blank frame). */
function Ui({ v, manifest }: { v: Extract<Visual, { kind: 'ui' }>; manifest: Manifest }) {
  const { durationInFrames, fps } = useVideoConfig();
  const f = useCurrentFrame();
  const take = manifest.capture;
  const seg = Math.ceil(durationInFrames / v.shots.length);
  const rate = v.rate ?? 1;
  const zoom = v.zoom ? interpolate(f, [0, durationInFrames], [1, v.zoom.scale], { extrapolateRight: 'clamp', easing: easeInOut }) : 1;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {v.shots.map((shot, i) => {
        const mark = take?.marks[shot];
        const frames = Math.min(seg, durationInFrames - i * seg);
        if (!take || mark == null) return <Sequence key={shot} from={i * seg} durationInFrames={frames}><Awaiting shot={shot} /></Sequence>;
        const startSec = mark + (i === 0 ? v.at ?? 0 : 0);
        const startFrame = Math.round(startSec * fps);
        const playable = Math.max(1, Math.floor(((take.sec - startSec) * fps) / rate));
        const video = <OffthreadVideo src={staticFile(take.file)} trimBefore={startFrame} playbackRate={rate} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
        return (
          <Sequence key={shot} from={i * seg} durationInFrames={frames}>
            <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: v.zoom ? `${v.zoom.x * 100}% ${v.zoom.y * 100}%` : 'center' }}>
              {frames <= playable ? video : (
                <>
                  <Sequence durationInFrames={playable}>{video}</Sequence>
                  <Sequence from={playable}><Freeze frame={playable - 1}>{video}</Freeze></Sequence>
                </>
              )}
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <div style={{ position: 'absolute', top: 40, right: 48, ...monoLabel, fontSize: 30, color: C.text, background: `${C.bg}cc`, padding: '10px 20px', borderRadius: 10 }}>
        Live product · {LIVE_URL}
      </div>
    </AbsoluteFill>
  );
}

function Awaiting({ shot }: { shot: string }) {
  const what = SHOTS.find((s) => s.id === shot)?.what ?? '';
  return (
    <AbsoluteFill style={{ ...center, padding: 200 }}>
      <div style={{ border: `4px dashed ${C.amber}`, borderRadius: 32, padding: '70px 90px', maxWidth: 1900, textAlign: 'center', background: `${C.bg}cc` }}>
        <div style={{ ...monoLabel, fontSize: 44, color: C.amber }}>Awaiting re-capture · {shot}</div>
        <div style={{ fontFamily: SANS, fontSize: 60, color: C.text, marginTop: 28, lineHeight: 1.3 }}>{what}</div>
      </div>
    </AbsoluteFill>
  );
}

function Team() {
  return (
    <AbsoluteFill style={{ ...center, padding: '0 220px 220px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, width: '100%' }}>
        {TEAM.map((m, i) => (
          <Rise key={m.role} at={i * 3}>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 24, padding: '44px 48px', minHeight: 230 }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 64, color: isTodo(m.name) ? C.amber : C.text }}>{isTodo(m.name) ? '[Name]' : m.name}</div>
              <div style={{ ...monoLabel, fontSize: 34, color: C.dim, marginTop: 18 }}>{m.role}</div>
            </div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/** Plain explanatory drawing (not data, not NASA imagery): buoyant teardrop on Earth vs a rounder flame fed by airflow. */
function Physics() {
  const f = useCurrentFrame();
  const breathe = 1 + 0.025 * Math.sin((f / 30) * Math.PI * 0.8); // one cycle per 2.5 s, well over the 1.2 s floor
  const panel = (title: string, children: ReactNode, note: string) => (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 28, width: 940, height: 860, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 48 }}>
      <div style={{ ...monoLabel, fontSize: 44, color: C.amber }}>{title}</div>
      <svg viewBox="0 0 400 400" width={560} height={560}>{children}</svg>
      <div style={{ fontFamily: SANS, fontSize: 46, color: C.dim, textAlign: 'center', lineHeight: 1.3 }}>{note}</div>
    </div>
  );
  const arrow = (x: number, y: number, dx: number, dy: number, k: string) => (
    <g key={k} stroke={C.blue} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.85}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy} />
      <path d={`M ${x + dx} ${y + dy} l ${dy === 0 ? -14 * Math.sign(dx) : -10} ${dy === 0 ? -10 : -14 * Math.sign(dy)} M ${x + dx} ${y + dy} l ${dy === 0 ? -14 * Math.sign(dx) : 10} ${dy === 0 ? 10 : -14 * Math.sign(dy)}`} />
    </g>
  );
  return (
    <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 30, paddingBottom: 200 }}>
      <div style={{ display: 'flex', gap: 80 }}>
        {panel('On Earth', (
          <>
            <defs>
              <radialGradient id="tear" cx="50%" cy="72%" r="60%"><stop offset="0%" stopColor="#fff3c4" /><stop offset="35%" stopColor={C.amber} /><stop offset="100%" stopColor={C.flame} stopOpacity="0" /></radialGradient>
            </defs>
            <g transform={`translate(200 300) scale(1 ${breathe}) translate(-200 -300)`}>
              <path d="M200 70 C 250 170 275 240 260 290 C 248 330 152 330 140 290 C 125 240 150 170 200 70 Z" fill="url(#tear)" />
            </g>
            <rect x="185" y="300" width="30" height="70" rx="6" fill={C.raised} />
            {arrow(90, 330, 0, -110, 'a')}{arrow(310, 330, 0, -110, 'b')}{arrow(200, 60, 0, -45, 'c')}
          </>
        ), 'Hot air rises; fresh air flows in from below.')}
        {panel('In orbit', (
          <>
            <defs>
              <radialGradient id="ball" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#dfe9ff" /><stop offset="45%" stopColor={C.blue} stopOpacity="0.9" /><stop offset="100%" stopColor={C.blue} stopOpacity="0" /></radialGradient>
            </defs>
            <circle cx="215" cy="200" r={110 * breathe} fill="url(#ball)" />
            <rect x="170" y="185" width="60" height="30" rx="6" fill={C.raised} />
            {arrow(30, 140, 90, 0, 'd')}{arrow(30, 200, 90, 0, 'e')}{arrow(30, 260, 90, 0, 'f')}
          </>
        ), 'No “up”: the flame depends on the air moving past it.')}
      </div>
      <div style={{ ...monoLabel, fontSize: 30, color: C.dim }}>{COPY.illustration}</div>
    </AbsoluteFill>
  );
}

function Catalog({ manifest }: { manifest: Manifest }) {
  const c = manifest.catalog;
  const stat = (value: number | undefined, label: string, at: number) => (
    <Rise at={at}>
      <div style={{ textAlign: 'center', minWidth: 520 }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 230, color: C.amber, lineHeight: 1 }}>{value ?? '—'}</div>
        <div style={{ ...monoLabel, fontSize: 44, color: C.text, marginTop: 20 }}>{label}</div>
      </div>
    </Rise>
  );
  return (
    <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 80, paddingBottom: 200 }}>
      <div style={{ display: 'flex', gap: 120 }}>
        {stat(c?.cards, 'verified runs', 0)}
        {stat(c?.campaigns, 'NASA campaigns', 4)}
        {stat(c?.sources, 'source reports', 8)}
      </div>
      {c?.o2 && c.kpa && <Rise at={10}><div style={{ fontFamily: SANS, fontSize: 64, color: C.text }}>Verified evidence from {c.o2[0]}% to {c.o2[1]}% O₂ · {Math.round(c.kpa[0])}–{Math.round(c.kpa[1])} kPa</div></Rise>}
      <Rise at={12}><div style={{ fontFamily: SANS, fontSize: 56, color: C.dim }}>Open dataset: {LIVE_URL}/api/export</div></Rise>
      {c && <div style={{ ...monoLabel, fontSize: 28, color: C.faint }}>Live catalog · revision {c.revision.slice(0, 8)} · read {c.fetchedAt.slice(0, 10)}</div>}
    </AbsoluteFill>
  );
}

function List({ heading, items }: { heading: string; items: string[] }) {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 320px 220px' }}>
      <Rise><div style={{ ...monoLabel, fontSize: 52, color: C.amber, marginBottom: 50 }}>{heading}</div></Rise>
      {items.map((item, i) => (
        <Rise key={item} at={6 + i * 5}>
          <div style={{ fontFamily: SANS, fontSize: 76, color: C.text, lineHeight: 1.25, margin: '18px 0', display: 'flex', gap: 36 }}>
            <span style={{ color: C.amber }}>›</span>{shown(item)}
          </div>
        </Rise>
      ))}
    </AbsoluteFill>
  );
}

/** Shared, frame for frame, by both 30-second cuts: nothing in here may depend on the cut. */
export function EndCard() {
  return (
    <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 34, paddingBottom: 230 }}>
      <Rise><Img src={staticFile('art/logo-flame.webp')} style={{ width: 170, height: 170, borderRadius: '50%' }} /></Rise>
      <Rise at={3}><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 150, letterSpacing: '0.16em', color: C.text, lineHeight: 1 }}>IGNIS</div></Rise>
      <Rise at={6}><div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 84, color: C.amber }}>{LIVE_URL}</div></Rise>
      <Rise at={9}><div style={{ fontFamily: SANS, fontSize: 50, color: C.text }}>{TEAM_NAME} · {CHALLENGE}</div></Rise>
      <Rise at={12}>
        <div style={{ fontFamily: SANS, fontSize: 38, color: C.dim, textAlign: 'center', lineHeight: 1.45 }}>
          {CREDITS.data}<br />{CREDITS.disclaimer}
        </div>
      </Rise>
    </AbsoluteFill>
  );
}

function Qr({ rows, size }: { rows: string[]; size: number }) {
  const n = rows.length + 8; // 4-module quiet zone on each side
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} shapeRendering="crispEdges" style={{ background: '#ffffff', borderRadius: 16 }}>
      {rows.flatMap((row, y) => [...row].map((bit, x) => (bit === '1' ? <rect key={`${x}-${y}`} x={x + 4} y={y + 4} width={1} height={1} fill="#0c0f16" /> : null)))}
    </svg>
  );
}

function Close({ manifest }: { manifest: Manifest }) {
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', gap: 120, padding: '0 200px 240px' }}>
      <Rise>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
          {manifest.qr && <Qr rows={manifest.qr} size={560} />}
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 60, color: C.amber }}>{LIVE_URL}</div>
        </div>
      </Rise>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, flex: 1 }}>
        <Rise at={4}><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 120, color: C.text }}>Thank you.</div></Rise>
        <Rise at={8}><div style={{ fontFamily: SANS, fontSize: 52, color: C.text }}>{TEAM_NAME} · {CHALLENGE}</div></Rise>
        <Rise at={12}>
          <div style={{ fontFamily: SANS, fontSize: 36, lineHeight: 1.45, color: C.dim }}>
            <p style={{ margin: '0 0 16px' }}>{CREDITS.data}</p>
            <p style={{ margin: '0 0 16px' }}><span style={{ color: C.text }}>AI use: </span>{CREDITS.ai}</p>
            <p style={{ margin: '0 0 16px' }}>{CREDITS.art}</p>
            <p style={{ margin: 0, color: C.text }}>{CREDITS.disclaimer}</p>
          </div>
        </Rise>
      </div>
    </AbsoluteFill>
  );
}
