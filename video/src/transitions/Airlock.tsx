import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { C, easeInOut } from '../theme';
import { Grain } from './Grain';
import { phases, type TransitionDef, type TransitionProps } from './types';

/**
 * 02→03 AIRLOCK DOCK: approach a station porthole, the iris opens, and the camera passes through: the product
 * screen first fills the porthole, then the frame. Both versions share one porthole-radius curve (px), so the
 * incoming screen is revealed through exactly the same circle whichever renderer draws the hull.
 */
function useAirlock(props: TransitionProps) {
  const f = useCurrentFrame();
  const { pre, gap, post } = props;
  const p = phases(f, props);
  const R = interpolate(f, [0, pre, pre + gap, pre + gap + post], [96, 110, 470, 1300], { easing: easeInOut, extrapolateRight: 'clamp' });
  const open = interpolate(p.gap, [0.3, 0.85], [0, 1], { easing: easeInOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeIn = interpolate(f, [0, pre], [0, 1], { extrapolateRight: 'clamp' });
  return { f, p, R, open, fadeIn, inPost: f >= pre + gap };
}

/** The incoming screen, frozen on its first frame, seen only through the porthole (before it actually starts). */
function ThroughPorthole({ R, show, renderNext }: { R: number; show: boolean; renderNext: () => React.ReactNode }) {
  if (!show) return null;
  return <AbsoluteFill style={{ clipPath: `circle(${R}px at 50% 50%)` }}>{renderNext()}</AbsoluteFill>;
}

// ---------------------------------------------------------------- 2.5D
function Airlock25(props: TransitionProps) {
  const { R, open, fadeIn, inPost } = useAirlock(props);
  const blades = 8;
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <ThroughPorthole R={R} show={!inPost} renderNext={props.renderNext} />
      {/* Iris: eight half-plane blades that slide outward and twist as it opens. */}
      <AbsoluteFill style={{ clipPath: `circle(${R}px at 50% 50%)` }}>
        {Array.from({ length: blades }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: R * 2.4,
              height: R * 1.2,
              marginLeft: -R * 1.2,
              marginTop: -R * 1.2,
              transformOrigin: '50% 100%',
              transform: `rotate(${(360 / blades) * i + open * 34}deg) translateY(${-open * R * 1.25}px)`,
              background: `linear-gradient(180deg, #232b3a, #161c28)`,
              borderBottom: `2px solid ${C.amber}88`,
            }}
          />
        ))}
      </AbsoluteFill>
      {/* Hull: brushed panels with a hole cut at the porthole. */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(90deg, transparent 0 238px, #0b0e15 238px 242px), repeating-linear-gradient(0deg, transparent 0 158px, #0b0e15 158px 162px), linear-gradient(160deg, #222a3a, #121722 60%, #0e121b)`,
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${R}px, #000 ${R + 1}px)`,
          transform: `scale(${1 + (R - 110) / 1400})`,
        }}
      />
      {/* Rim: a heavy ring with a token-amber light strip. */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: (R + 18) * 2,
          height: (R + 18) * 2,
          marginLeft: -(R + 18),
          marginTop: -(R + 18),
          borderRadius: '50%',
          border: `${18 + R * 0.05}px solid #2a3346`,
          boxShadow: `inset 0 0 0 2px ${C.amber}, 0 0 ${R * 0.4}px ${C.amber}55, inset 0 0 ${R * 0.3}px ${C.amber}33`,
          boxSizing: 'border-box',
        }}
      />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- 3D
const FOV = 50;

function AirlockScene({ R, open, height }: { R: number; open: number; height: number }) {
  const { camera } = useThree();
  // Camera distance chosen so the 1-unit hole projects to exactly R px (same curve as the 2.5D mask).
  const z = height / 2 / Math.tan(((FOV / 2) * Math.PI) / 180) / R;
  camera.position.set(0, 0, z);
  camera.lookAt(0, 0, 0);
  const hull = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-40, -40).lineTo(40, -40).lineTo(40, 40).lineTo(-40, 40).lineTo(-40, -40);
    const hole = new THREE.Path();
    hole.absarc(0, 0, 1, 0, Math.PI * 2, true);
    s.holes.push(hole);
    return new THREE.ShapeGeometry(s, 48);
  }, []);
  const plates = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const r = 2.2 + (i % 3) * 1.1;
        return { x: Math.cos(a) * r, y: Math.sin(a) * r, w: 0.9 + (i % 2) * 0.5, h: 0.5 + (i % 4) * 0.2, rot: a };
      }),
    [],
  );
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[-4, 6, 6]} intensity={2.6} color="#dfe8ff" />
      <directionalLight position={[5, -3, 4]} intensity={0.8} color={C.blue} />
      <pointLight position={[0, 0, 1.2]} intensity={4} distance={6} color={C.amber} />
      <mesh geometry={hull}>
        <meshStandardMaterial color="#323c52" metalness={0.55} roughness={0.5} />
      </mesh>
      {plates.map((pl, i) => (
        <mesh key={i} position={[pl.x, pl.y, 0.06]} rotation={[0, 0, pl.rot]}>
          <boxGeometry args={[pl.w, pl.h, 0.12]} />
          <meshStandardMaterial color="#3d4862" metalness={0.6} roughness={0.42} />
        </mesh>
      ))}
      {/* Rim and its amber light strip. */}
      <mesh position={[0, 0, 0.08]}>
        <torusGeometry args={[1.08, 0.08, 16, 72]} />
        <meshStandardMaterial color="#2a3346" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.2]}>
        <torusGeometry args={[1.0, 0.014, 8, 96]} />
        <meshStandardMaterial color={C.amber} emissive={C.amber} emissiveIntensity={2.5} />
      </mesh>
      {/* Iris blades sit just behind the hull plane, so the hull hides everything outside the hole. */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} rotation={[0, 0, (i / 8) * Math.PI * 2 + open * 0.6]}>
          <mesh position={[0, 0.55 + open * 1.2, -0.05 - i * 0.002]}>
            <boxGeometry args={[2.2, 1.1, 0.02]} />
            <meshStandardMaterial color="#1f2636" metalness={0.6} roughness={0.5} emissive={C.amber} emissiveIntensity={0.04} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Airlock3D(props: TransitionProps) {
  const { width, height } = useVideoConfig();
  const { R, open, fadeIn, inPost } = useAirlock(props);
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <ThroughPorthole R={R} show={!inPost} renderNext={props.renderNext} />
      <ThreeCanvas width={width} height={height} camera={{ fov: FOV, near: 0.05, far: 200 }} gl={{ alpha: true, antialias: true }}>
        <AirlockScene R={R} open={open} height={height} />
      </ThreeCanvas>
      <Grain />
    </AbsoluteFill>
  );
}

// The incoming screen is revealed by the porthole itself, so it cuts in (no fade) underneath.
const outgoing = (p: number) => ({ opacity: 1 - easeInOut(p) * 0.5 });
export const airlock25: TransitionDef = { Overlay: Airlock25, out: outgoing };
export const airlock3d: TransitionDef = { Overlay: Airlock3D, out: outgoing };
