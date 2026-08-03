'use client'

import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Effects from '@/components/three/Effects'
import { NodeField } from '@/components/three/Node'
import { useTier } from '@/components/three/tier'
import { useReducedMotion } from '@/lib/motion'
import { pipeline } from '@/config/pipeline'
import { three as threeTokens } from '@/lib/tokens'

/**
 * CI/CD — a pipe you travel down as you scroll.
 *
 * Scroll maps to camera X. Nothing here animates on a timer except the packets;
 * the sense of progression is entirely the user's scroll, which is the point —
 * the section is a journey through a build, not a video of one.
 */

/** World units between stage nodes. */
const SPACING = 9
const PIPE_RADIUS = 1.15

export const STAGE_POSITIONS = pipeline.map((_, index) => index * SPACING)
export const PIPE_LENGTH = (pipeline.length - 1) * SPACING

/* ────────────────────────────────────────────────────────────────── pipe ── */

/**
 * The pipe itself: a translucent tube plus evenly spaced rings.
 *
 * The rings do the real work. A bare cylinder gives the eye nothing to measure
 * motion against, so travelling down it feels static; ribs passing the camera
 * are what create the sense of speed.
 */
function Pipe({ ribCount }: { ribCount: number }) {
  const ribs = useMemo(() => {
    const spacing = PIPE_LENGTH / ribCount
    return Array.from({ length: ribCount + 1 }, (_, index) => index * spacing - SPACING * 0.5)
  }, [ribCount])

  return (
    <group>
      {/* Outer shell. Rendered back-face-only so the camera inside the tube
          sees the far wall rather than a solid surface in its face. */}
      <mesh position={[PIPE_LENGTH / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[PIPE_RADIUS, PIPE_RADIUS, PIPE_LENGTH + SPACING * 2, 24, 1, true]} />
        <meshBasicMaterial
          color={threeTokens.accentDeep}
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {ribs.map((x, index) => (
        <mesh key={index} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[PIPE_RADIUS, 0.012, 6, 32]} />
          <meshBasicMaterial color={threeTokens.accent} transparent opacity={0.24} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────── packets ── */

/**
 * Light travelling down the pipe.
 *
 * Position combines a constant drift with scroll progress, so packets keep
 * moving when the page is still (the pipeline is always running) but surge
 * ahead as you scroll (you're following a build through it).
 */
function Packets({
  count,
  progress,
}: {
  count: number
  progress: MutableRefObject<number>
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const hash = Math.sin(index * 41.7) * 43758.5453
        const fraction = hash - Math.floor(hash)
        const angle = fraction * Math.PI * 2
        return {
          offset: fraction,
          speed: 0.06 + fraction * 0.09,
          // Ride just inside the pipe wall rather than dead centre.
          y: Math.sin(angle) * PIPE_RADIUS * 0.55,
          z: Math.cos(angle) * PIPE_RADIUS * 0.55,
        }
      }),
    [count],
  )

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return

    const time = state.clock.elapsedTime
    const travel = PIPE_LENGTH + SPACING

    seeds.forEach((seed, index) => {
      const t = (time * seed.speed + seed.offset + progress.current * 0.85) % 1
      dummy.position.set(t * travel - SPACING * 0.5, seed.y, seed.z)
      // Stretched along X — a moving light should smear in its direction of
      // travel, the same reason motion blur reads as speed.
      dummy.scale.set(0.5, 0.06, 0.06)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={threeTokens.accentHot} toneMapped={false} />
    </instancedMesh>
  )
}

/* ───────────────────────────────────────────────────────────────── stage ── */

/** A stage gate: a ring the pipe passes through, brightening when active. */
function StageGate({ x, active }: { x: number; active: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const intensity = useRef(0)

  useFrame((_, delta) => {
    const ring = ringRef.current
    if (!ring) return

    const target = active ? 1 : 0
    intensity.current += (target - intensity.current) * (1 - Math.exp(-6 * delta))

    const material = ring.material as THREE.MeshBasicMaterial
    material.opacity = 0.3 + intensity.current * 0.7
    ring.scale.setScalar(1 + intensity.current * 0.14)
  })

  return (
    <group position={[x, 0, 0]}>
      <mesh ref={ringRef} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[PIPE_RADIUS * 1.35, 0.045, 8, 48]} />
        <meshBasicMaterial color={threeTokens.accent} transparent opacity={0.3} toneMapped={false} />
      </mesh>

      {/* Four struts anchoring the gate — reads as hardware, not decoration. */}
      {[0, 1, 2, 3].map((index) => {
        const angle = (index / 4) * Math.PI * 2 + Math.PI / 4
        return (
          <mesh
            key={index}
            position={[0, Math.sin(angle) * PIPE_RADIUS * 1.7, Math.cos(angle) * PIPE_RADIUS * 1.7]}
          >
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial color={threeTokens.accent} toneMapped={false} />
          </mesh>
        )
      })}
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────── rig ── */

/**
 * Camera travel.
 *
 * The camera runs alongside the pipe rather than through it — inside, the walls
 * fill the frame and the stage gates arrive with no warning. Offset out and up,
 * you can see the next gate coming, which is what makes the section legible.
 */
function TravelRig({ progress }: { progress: MutableRefObject<number> }) {
  const reduced = useReducedMotion()
  const lookTarget = useMemo(() => new THREE.Vector3(), [])
  const current = useRef(0)

  useFrame((state, delta) => {
    const camera = state.camera
    const target = progress.current * PIPE_LENGTH

    // Damped rather than snapped to scroll: with Lenis already smoothing input,
    // this second stage removes the last of the step quantisation.
    current.current += (target - current.current) * (1 - Math.exp(-(reduced ? 60 : 5) * delta))

    camera.position.set(current.current - 1.5, 2.6, 8.4)
    lookTarget.set(current.current + 4, 0, 0)
    camera.lookAt(lookTarget)
  })

  return null
}

/* ──────────────────────────────────────────────────────────────── scene ── */

export function PipelineScene({
  progress,
  activeIndex,
}: {
  progress: MutableRefObject<number>
  activeIndex: number
}) {
  const { tier } = useTier()
  const reduced = useReducedMotion()

  // Grid of faint markers on the "floor", parallax reference for the travel.
  const floor = useMemo(() => {
    const points: [number, number, number][] = []
    for (let x = -1; x <= pipeline.length * 2; x++) {
      for (let z = -3; z <= 3; z++) {
        points.push([x * (SPACING / 2), -3.2, z * 3])
      }
    }
    return points
  }, [])

  return (
    <>
      <TravelRig progress={progress} />
      <Pipe ribCount={tier === 'low' ? 20 : 56} />

      {STAGE_POSITIONS.map((x, index) => (
        <StageGate key={pipeline[index].id} x={x} active={index === activeIndex} />
      ))}

      {!reduced ? <Packets count={tier === 'high' ? 40 : 16} progress={progress} /> : null}

      <NodeField positions={floor} radius={0.035} color={threeTokens.accentDeep} opacity={0.4} />

      <Effects bloomScale={1.15} />
    </>
  )
}

export default PipelineScene
