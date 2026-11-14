import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { C, easeInOut, easeOut } from '../theme';
import { Grain } from './Grain';
import { type TransitionDef, type TransitionProps } from './types';

/** 05→06 ORBITAL SWING: the camera arcs around a small satellite with the Earth's limb below, into the mission. */
function useSwing({ pre, gap, post }: TransitionProps) {
  const f = useCurrentFrame();
  const total = pre + gap + post;
  const k = interpolate(f, [0, total], [0, 1], { easing: easeInOut });
  const opacity = interpolate(f, [0, pre, pre + gap, total], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  return { k, opacity };
}

// ---------------------------------------------------------------- 2.5D
function Orbital25(props: TransitionProps) {
  const { width, height } = useVideoConfig();
  const { k, opacity } = useSwing(props);
  const angle = interpolate(k, [0, 1], [-1.1, 1.25]); // camera azimuth around the satellite (rad)
  const cos = Math.cos(angle);
  const panelW = 300 * Math.abs(cos) + 24;
  const x = width / 2 - Math.sin(angle) * 260;
  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Earth limb: a huge disc below the frame; its tilt sells the arc. */}
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0, transform: `rotate(${(k - 0.5) * -14}deg)`, transformOrigin: '50% 160%' }}>
        <defs>
          <radialGradient id="earth" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor="#123466" />
            <stop offset="45%" stopColor="#0a1c3d" />
            <stop offset="100%" stopColor="#060d1c" />
          </radialGradient>
        </defs>
        <circle cx={width / 2} cy={height + 2200} r={2580} fill={`${C.blue}1f`} />
        <circle cx={width / 2} cy={height + 2200} r={2540} fill="url(#earth)" />
        <circle cx={width / 2} cy={height + 2200} r={2546} fill="none" stroke={`${C.blue}77`} strokeWidth="3" />
      </svg>
      {/* Satellite: body + two panels, foreshortened by the camera angle. */}
      <div style={{ position: 'absolute', left: x, top: height * 0.42, transform: `translate(-50%, -50%) rotate(${angle * 6}deg)` }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: panelW, height: 92, background: `repeating-linear-gradient(90deg, #1f3f86 0 34px, #0d1f45 34px 37px)`, border: `2px solid ${C.raised}`, boxShadow: `0 0 30px ${C.blue}44` }} />
          <div style={{ width: 26, height: 6, background: '#3a4663' }} />
          <div style={{ width: 70 + 50 * Math.abs(Math.sin(angle)), height: 110, background: 'linear-gradient(90deg, #8a6a2a, #d9b45a 50%, #7a5b20)', borderRadius: 8, boxShadow: `0 0 18px ${C.amber}55` }} />
          <div style={{ width: 26, height: 6, background: '#3a4663' }} />
          <div style={{ width: panelW, height: 92, background: `repeating-linear-gradient(90deg, #1f3f86 0 34px, #0d1f45 34px 37px)`, border: `2px solid ${C.raised}`, boxShadow: `0 0 30px ${C.blue}44` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- 3D
function panelTexture() {
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 160;
  const g = cv.getContext('2d')!;
  g.fillStyle = '#0d1f45';
  g.fillRect(0, 0, 512, 160);
  g.fillStyle = '#1f3f86';
  for (let x = 4; x < 512; x += 40) for (let y = 4; y < 160; y += 40) g.fillRect(x, y, 36, 36);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function OrbitScene({ k }: { k: number }) {
  const { camera } = useThree();
  const a = interpolate(k, [0, 1], [-1.1, 1.25]);
  camera.position.set(Math.sin(a) * 5, 0.9 + k * 0.4, Math.cos(a) * 5);
  camera.lookAt(0, -0.2, 0);
  const tex = useMemo(panelTexture, []);
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 4, 6]} intensity={2.4} color="#fff3df" />
      <directionalLight position={[-6, -3, -4]} intensity={0.4} color={C.blue} />
      <group rotation={[0.15, k * 0.6, 0.08]}>
        <mesh>
          <boxGeometry args={[0.7, 0.7, 1.0]} />
          <meshStandardMaterial color="#c9a14a" metalness={0.9} roughness={0.35} emissive={C.amber} emissiveIntensity={0.08} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.55, 0, 0]}>
              <boxGeometry args={[0.4, 0.04, 0.04]} />
              <meshStandardMaterial color="#3a4663" metalness={0.8} roughness={0.4} />
            </mesh>
            <mesh position={[s * 1.95, 0, 0]}>
              <boxGeometry args={[2.4, 0.03, 0.8]} />
              <meshStandardMaterial map={tex} metalness={0.4} roughness={0.5} emissive={C.blue} emissiveIntensity={0.12} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
          <meshStandardMaterial color="#9aa3b5" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.82, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.2, 0.12, 16, 1, true]} />
          <meshStandardMaterial color="#d6dbe6" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.3, 0.51]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={C.amber} emissive={C.amber} emissiveIntensity={3} />
        </mesh>
      </group>
      {/* Earth and its atmosphere rim, far below. */}
      <mesh position={[0, -24, -8]}>
        <sphereGeometry args={[20, 64, 48]} />
        <meshStandardMaterial color="#0d2a57" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, -24, -8]}>
        <sphereGeometry args={[20.5, 64, 48]} />
        <meshBasicMaterial color={C.blue} transparent opacity={0.22} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

function Orbital3D(props: TransitionProps) {
  const { width, height } = useVideoConfig();
  const { k, opacity } = useSwing(props);
  return (
    <AbsoluteFill style={{ opacity }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 45, near: 0.05, far: 200 }} gl={{ alpha: true, antialias: true }}>
        <OrbitScene k={k} />
      </ThreeCanvas>
      <Grain />
    </AbsoluteFill>
  );
}

// The gap scene leaves by fading only (it never moves); the mission eases in behind the satellite.
const outgoing = (p: number) => ({ opacity: 1 - easeInOut(p) });
const incoming = (p: number) => ({ opacity: easeOut(p), transform: `scale(${1.03 - 0.03 * easeOut(p)})` });
export const orbital25: TransitionDef = { Overlay: Orbital25, out: outgoing, in: incoming };
export const orbital3d: TransitionDef = { Overlay: Orbital3D, out: outgoing, in: incoming };
