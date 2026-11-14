import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { videoData as data } from '@data';
import { C, easeInOut, easeOut, MONO, OUTCOME, SANS } from '../theme';
import type { EvidenceCard } from '../types';
import { Grain } from './Grain';
import { type TransitionDef, type TransitionProps } from './types';

/**
 * 03→04 CORRIDOR DOLLY: fly down the satellite corridor past glowing panels; the panels tease the evidence cards
 * (from the data file) before the camera arrives at the end panel and the evidence scene opens.
 */
function useDolly({ pre, gap, post }: TransitionProps, length: number) {
  const f = useCurrentFrame();
  const total = pre + gap + post;
  const cam = interpolate(f, [0, total], [0, length], { easing: easeInOut });
  const opacity = interpolate(f, [0, pre, pre + gap, total], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  return { f, total, cam, opacity };
}

const cards = data.evidence.cards;
const teaserFor = (i: number): EvidenceCard | null => (i % 2 === 1 ? cards[Math.floor(i / 2) % cards.length]! : null);

// ---------------------------------------------------------------- 2.5D (CSS 3D)
const W = 1500;
const H = 900;
const S = 520;
const N = 12;
const L = S * N;

function Plane({ w, h, transform, z, cam, style, fog = true, children }: { w: number; h: number; transform: string; z: number; cam: number; style: CSSProperties; fog?: boolean; children?: React.ReactNode }) {
  const dist = -z - cam;
  const light = fog ? interpolate(dist, [-200, 400, 4200], [0, 1, 0.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  return (
    <div style={{ position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, transform, opacity: light, backfaceVisibility: 'hidden', boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  );
}

function Teaser25({ c }: { c: EvidenceCard }) {
  return (
    <div style={{ position: 'absolute', inset: '150px 60px', background: C.panel, border: `2px solid ${C.amber}aa`, borderRadius: 14, padding: 26, boxShadow: `0 0 50px ${C.amber}44`, overflow: 'hidden' }}>
      <div style={{ fontFamily: MONO, fontSize: 26, color: C.amber, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.id}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.text, marginTop: 12, lineHeight: 1.15, maxHeight: 96, overflow: 'hidden' }}>{c.material}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, fontFamily: MONO, fontSize: 24, color: C.dim }}>
        <span style={{ width: 16, height: 16, borderRadius: 8, background: OUTCOME[c.outcome] }} />
        {c.outcomeLabel}
      </div>
    </div>
  );
}

function Corridor25(props: TransitionProps) {
  const { f, total, cam: t, opacity } = useDolly(props, 1);
  const cam = t * (L - 260);
  const sway = Math.sin((f / total) * Math.PI) * 40;
  const wall: CSSProperties = { background: 'linear-gradient(180deg, #161c29, #10141d)', border: `2px solid ${C.border}` };
  const planes = [];
  for (let i = 0; i < N; i++) {
    const z = -(i + 0.5) * S;
    const teaser = teaserFor(i);
    const glow: CSSProperties = { boxShadow: `inset 0 0 0 3px ${C.blue}55, inset 0 -6px 30px ${C.blue}33` };
    planes.push(
      <Plane key={`l${i}`} w={S} h={H} z={z} cam={cam} transform={`translate3d(${-W / 2}px,0,${z}px) rotateY(90deg)`} style={{ ...wall, ...(i % 2 ? glow : {}) }}>
        {teaser && i % 4 === 1 && <Teaser25 c={teaser} />}
      </Plane>,
      <Plane key={`r${i}`} w={S} h={H} z={z} cam={cam} transform={`translate3d(${W / 2}px,0,${z}px) rotateY(-90deg)`} style={{ ...wall, ...(i % 2 ? glow : {}) }}>
        {teaser && i % 4 === 3 && <Teaser25 c={teaser} />}
      </Plane>,
      <Plane key={`c${i}`} w={W} h={S} z={z} cam={cam} transform={`translate3d(0,${-H / 2}px,${z}px) rotateX(-90deg)`} style={{ ...wall, background: 'linear-gradient(90deg, #0e121a, #151b27 50%, #0e121a)' }} />,
      <Plane key={`f${i}`} w={W} h={S} z={z} cam={cam} transform={`translate3d(0,${H / 2}px,${z}px) rotateX(90deg)`} style={{ ...wall, background: `linear-gradient(90deg, #0b0e15 0 46%, ${C.amber}55 46% 46.6%, #0b0e15 46.6% 53.4%, ${C.amber}55 53.4% 54%, #0b0e15 54%)` }} />,
      <Plane key={`k${i}`} w={W} h={H} z={-i * S} cam={cam} transform={`translate3d(0,0,${-i * S}px)`} style={{ border: '14px solid #1a2130', boxShadow: `inset 0 0 0 2px ${C.raised}` }} />,
    );
  }
  return (
    <AbsoluteFill style={{ background: C.bg, perspective: 800, overflow: 'hidden', opacity }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transformStyle: 'preserve-3d', transform: `translate3d(${sway}px,0,${cam}px)` }}>
        {planes}
        <Plane w={W - 260} h={H - 220} z={-L} cam={cam} fog={false} transform={`translate3d(0,0,${-L}px)`} style={{ background: C.panel, border: `3px solid ${C.amber}`, borderRadius: 16, boxShadow: `0 0 120px ${C.amber}55` }} />
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- 3D
const SEG = 4;
const SEGS = 10;
const CW = 6;
const CH = 3.6;
const CL = SEG * SEGS;

function teaserTexture(c: EvidenceCard) {
  const cv = document.createElement('canvas');
  cv.width = 640;
  cv.height = 400;
  const g = cv.getContext('2d')!;
  g.fillStyle = C.panel;
  g.fillRect(0, 0, 640, 400);
  g.strokeStyle = C.amber;
  g.lineWidth = 6;
  g.strokeRect(6, 6, 628, 388);
  g.fillStyle = C.amber;
  g.font = `500 32px 'IBM Plex Mono'`;
  g.fillText(c.id.slice(0, 30), 34, 70);
  g.fillStyle = C.text;
  g.font = `600 48px 'Space Grotesk'`;
  const words = c.material.split(' ');
  let line = '';
  let y = 150;
  for (const w of words) {
    if (g.measureText(`${line}${w} `).width > 570 && line) {
      g.fillText(line, 34, y);
      line = '';
      y += 56;
      if (y > 260) break;
    }
    line += `${w} `;
  }
  if (y <= 260) g.fillText(line, 34, y);
  g.fillStyle = OUTCOME[c.outcome];
  g.beginPath();
  g.arc(48, 340, 12, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = C.dim;
  g.font = `400 28px 'IBM Plex Mono'`;
  g.fillText(c.outcomeLabel.slice(0, 34), 74, 350);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function CorridorScene({ t, sway }: { t: number; sway: number }) {
  const { camera } = useThree();
  camera.position.set(sway, 0.1, 2 - t * (CL - 3.5));
  camera.lookAt(sway * 0.3, 0, camera.position.z - 10);
  const textures = useMemo(() => cards.map(teaserTexture), []);
  const segs = [];
  for (let i = 0; i < SEGS; i++) {
    const z = -i * SEG - SEG / 2;
    const teaser = teaserFor(i);
    const tex = teaser ? textures[cards.indexOf(teaser)] : null;
    const left = i % 4 === 1;
    segs.push(
      <group key={i} position={[0, 0, z]}>
        {/* walls, floor, ceiling */}
        <mesh position={[-CW / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[SEG, CH]} />
          <meshStandardMaterial color="#141a26" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[CW / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[SEG, CH]} />
          <meshStandardMaterial color="#141a26" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[0, -CH / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[CW, SEG]} />
          <meshStandardMaterial color="#0d1119" metalness={0.4} roughness={0.7} />
        </mesh>
        <mesh position={[0, CH / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[CW, SEG]} />
          <meshStandardMaterial color="#10141d" metalness={0.4} roughness={0.7} />
        </mesh>
        {/* rib frame where segments meet */}
        {[
          [0, CH / 2 - 0.12, CW, 0.24],
          [0, -CH / 2 + 0.12, CW, 0.24],
          [-CW / 2 + 0.12, 0, 0.24, CH],
          [CW / 2 - 0.12, 0, 0.24, CH],
        ].map(([x, y, w, h], k) => (
          <mesh key={k} position={[x!, y!, SEG / 2]}>
            <boxGeometry args={[w!, h!, 0.3]} />
            <meshStandardMaterial color="#232b3a" metalness={0.8} roughness={0.35} />
          </mesh>
        ))}
        {/* light strips: amber floor rails, blue ceiling line */}
        {[-0.5, 0.5].map((x) => (
          <mesh key={x} position={[x, -CH / 2 + 0.01, 0]}>
            <boxGeometry args={[0.04, 0.02, SEG * 0.9]} />
            <meshStandardMaterial color={C.amber} emissive={C.amber} emissiveIntensity={2} />
          </mesh>
        ))}
        <mesh position={[0, CH / 2 - 0.01, 0]}>
          <boxGeometry args={[0.06, 0.02, SEG * 0.9]} />
          <meshStandardMaterial color={C.blue} emissive={C.blue} emissiveIntensity={0.7} />
        </mesh>
        <pointLight position={[0, CH / 2 - 0.4, 0]} intensity={3} distance={6} color="#9fbfff" />
        {/* glowing panel; every other one teases an evidence card */}
        <mesh position={[left ? -CW / 2 + 0.03 : CW / 2 - 0.03, 0.1, 0]} rotation={[0, left ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <planeGeometry args={[2.6, 1.62]} />
          {tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : <meshStandardMaterial color="#141b29" emissive={C.blue} emissiveIntensity={0.04} metalness={0.5} roughness={0.5} />}
        </mesh>
      </group>,
    );
  }
  return (
    <>
      <color attach="background" args={[C.bg]} />
      <fog attach="fog" args={[C.bg, 3, 24]} />
      <ambientLight intensity={0.35} />
      {segs}
      {/* the end panel the camera arrives at */}
      <mesh position={[0, 0, -CL - 0.2]}>
        <planeGeometry args={[CW - 1, CH - 0.8]} />
        <meshStandardMaterial color={C.panel} emissive={C.amber} emissiveIntensity={0.12} />
      </mesh>
      {[
        [0, (CH - 0.8) / 2, CW - 1, 0.04],
        [0, -(CH - 0.8) / 2, CW - 1, 0.04],
        [-(CW - 1) / 2, 0, 0.04, CH - 0.8],
        [(CW - 1) / 2, 0, 0.04, CH - 0.8],
      ].map(([x, y, w, h], k) => (
        <mesh key={k} position={[x!, y!, -CL - 0.15]}>
          <boxGeometry args={[w!, h!, 0.02]} />
          <meshStandardMaterial color={C.amber} emissive={C.amber} emissiveIntensity={2.5} />
        </mesh>
      ))}
    </>
  );
}

function Corridor3D(props: TransitionProps) {
  const { width, height } = useVideoConfig();
  const { f, total, cam, opacity } = useDolly(props, 1);
  const sway = Math.sin((f / total) * Math.PI) * 0.25;
  return (
    <AbsoluteFill style={{ opacity }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 62, near: 0.05, far: 80 }} gl={{ antialias: true }}>
        <CorridorScene t={cam} sway={sway} />
      </ThreeCanvas>
      <Grain />
    </AbsoluteFill>
  );
}

const outgoing = (p: number) => ({ opacity: 1 - easeInOut(p), transform: `scale(${1 - easeInOut(p) * 0.06})` });
// Arriving at the end panel: the evidence scene opens from it.
const incoming = (p: number) => ({ opacity: easeOut(p), transform: `scale(${1.04 - 0.04 * easeOut(p)})` });
export const corridor25: TransitionDef = { Overlay: Corridor25, out: outgoing, in: incoming };
export const corridor3d: TransitionDef = { Overlay: Corridor3D, out: outgoing, in: incoming };
