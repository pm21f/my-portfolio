'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Effects from '@/components/three/Effects'
import { EdgeField } from '@/components/three/Node'
import GlassPanel from '@/components/three/GlassPanel'
import { useTier } from '@/components/three/tier'
import { cursorHandlers } from '@/lib/cursor'
import { usePointerParallax, useReducedMotion } from '@/lib/motion'
import { spring as springTokens, three as threeTokens } from '@/lib/tokens'
import { workers } from '@/config/cluster'

/**
 * KUBERNETES — control plane at the centre, workers in orbit, pods as cubes.
 *
 * The scale-up interaction is the point of the section. Clicking the button
 * schedules pods and they SPRING into existence on whichever node has room,
 * which is a more honest picture of what an autoscaler does than any diagram.
 */

const ORBIT_RADIUS = 6.2
const POD_SIZE = 0.3

export type PodInstance = {
  id: number
  worker: number
  slot: number
}

/** Where a pod sits in its worker's local 3×N stack. */
function podOffset(slot: number): THREE.Vector3 {
  const perRow = 3
  const row = Math.floor(slot / perRow)
  const column = slot % perRow
  return new THREE.Vector3(
    (column - 1) * (POD_SIZE * 1.5),
    1.0 + row * (POD_SIZE * 1.5),
    0,
  )
}

function workerPosition(index: number, count: number): THREE.Vector3 {
  const angle = (index / count) * Math.PI * 2
  return new THREE.Vector3(
    Math.cos(angle) * ORBIT_RADIUS,
    // Gentle vertical stagger so the ring doesn't read as a flat disc.
    Math.sin(angle * 2) * 0.8,
    Math.sin(angle) * ORBIT_RADIUS,
  )
}

/* ────────────────────────────────────────────────────────────────── pods ── */

/**
 * All pods, one instanced mesh, each with its own spring.
 *
 * The spring is integrated by hand rather than pulled from a library: it has to
 * run per-instance inside useFrame, where there is no React component to hang a
 * `useSpring` on. It's a standard damped harmonic oscillator —
 * `a = -k·x - c·v` — which is exactly what a spring animation library would do,
 * minus the per-pod React overhead.
 */
function Pods({
  pods,
  capacity,
  workerPositions,
}: {
  pods: PodInstance[]
  capacity: number
  workerPositions: THREE.Vector3[]
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const reduced = useReducedMotion()

  // Per-instance spring state, keyed by pod id so a pod keeps its animation
  // even if the array order changes.
  const springs = useRef(new Map<number, { scale: number; velocity: number }>())

  useEffect(() => {
    const map = springs.current
    pods.forEach((pod) => {
      if (!map.has(pod.id)) {
        // Reduced motion: appear at full size, no bounce.
        map.set(pod.id, { scale: reduced ? 1 : 0, velocity: 0 })
      }
    })
    // Drop springs for pods that no longer exist, or the map grows forever.
    const live = new Set(pods.map((pod) => pod.id))
    map.forEach((_, id) => {
      if (!live.has(id)) map.delete(id)
    })
  }, [pods, reduced])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    // Clamp: a backgrounded tab resumes with a huge delta, which would launch
    // every spring to infinity on the first frame back.
    const step = Math.min(delta, 1 / 30)
    const { stiffness, damping } = springTokens.pop

    mesh.count = Math.min(pods.length, capacity)

    pods.slice(0, capacity).forEach((pod, index) => {
      const state = springs.current.get(pod.id) ?? { scale: 1, velocity: 0 }

      const displacement = state.scale - 1
      const acceleration = -stiffness * displacement - damping * state.velocity
      state.velocity += acceleration * step
      state.scale += state.velocity * step
      springs.current.set(pod.id, state)

      const base = workerPositions[pod.worker] ?? new THREE.Vector3()
      dummy.position.copy(base).add(podOffset(pod.slot))
      dummy.scale.setScalar(Math.max(0, state.scale) * POD_SIZE)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined as any, undefined as any, capacity]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={threeTokens.ok} toneMapped={false} />
    </instancedMesh>
  )
}

/* ──────────────────────────────────────────────────────────────── worker ── */

function Worker({
  index,
  position,
  hovered,
  onHover,
}: {
  index: number
  position: THREE.Vector3
  hovered: boolean
  onHover: (index: number | null) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const scale = useRef(1)

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    const target = hovered ? 1.3 : 1
    scale.current += (target - scale.current) * (1 - Math.exp(-10 * delta))
    mesh.scale.setScalar(scale.current)
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(event) => {
          event.stopPropagation()
          onHover(index)
          cursorHandlers('hover').onPointerOver()
        }}
        onPointerOut={() => {
          onHover(null)
          cursorHandlers().onPointerOut()
        }}
      >
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial
          color={hovered ? threeTokens.accentHot : threeTokens.accent}
          toneMapped={false}
          wireframe
        />
      </mesh>

      {/* Solid inner core so the wireframe reads as a shell around something. */}
      <mesh>
        <octahedronGeometry args={[0.34, 0]} />
        <meshBasicMaterial color={threeTokens.accentDeep} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ──────────────────────────────────────────────────────────────── scene ── */

export function ClusterScene({
  pods,
  hovered,
  onHover,
}: {
  pods: PodInstance[]
  hovered: number | null
  onHover: (index: number | null) => void
}) {
  const { budget, tier } = useTier()
  const reduced = useReducedMotion()
  const pointer = usePointerParallax()
  const groupRef = useRef<THREE.Group>(null)

  const positions = useMemo(
    () => workers.map((_, index) => workerPosition(index, workers.length)),
    [],
  )

  // Control plane → every worker. The only edges in the scene, because that is
  // genuinely the only direct relationship in a cluster: workers don't talk to
  // each other through the control plane.
  const edges = useMemo(
    () =>
      positions.map(
        (position) => [new THREE.Vector3(0, 0, 0), position] as [THREE.Vector3, THREE.Vector3],
      ),
    [positions],
  )

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (!reduced) groupRef.current.rotation.y += delta * 0.12

    // Parallax is applied to the whole cluster rather than the camera here: the
    // orbit already moves, and moving both reads as drift rather than depth.
    const camera = state.camera
    camera.position.x += (pointer.current.x * 1.4 - camera.position.x) * 0.04
    camera.position.y += (3.2 + pointer.current.y * 1.0 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })

  const hoveredWorker = hovered !== null ? workers[hovered] : null

  return (
    <>
      <group ref={groupRef}>
        <EdgeField segments={edges} opacity={0.22} />

        {/* control plane */}
        <group>
          <mesh>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshBasicMaterial color={threeTokens.accent} wireframe toneMapped={false} />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[0.72, 1]} />
            <meshBasicMaterial color={threeTokens.accentHot} toneMapped={false} />
          </mesh>
        </group>

        {positions.map((position, index) => (
          <Worker
            key={workers[index].id}
            index={index}
            position={position}
            hovered={hovered === index}
            onHover={onHover}
          />
        ))}

        <Pods pods={pods} capacity={budget.clusterPods} workerPositions={positions} />

        {/* HUD tooltip. Inside the canvas, which is aria-hidden — the same
            details are listed as real text in the DOM beside the scene. */}
        {hoveredWorker && hovered !== null ? (
          <GlassPanel
            position={[positions[hovered].x, positions[hovered].y + 2.6, positions[hovered].z]}
            width={3.4}
            height={1.7}
            distanceFactor={6}
            active
          >
            <p className="font-mono text-label-xs uppercase text-accent">{hoveredWorker.id}</p>
            <dl className="mt-2 space-y-0.5 font-mono text-label-xs text-ink-secondary">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">zone</dt>
                <dd>{hoveredWorker.zone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">cpu</dt>
                <dd>{hoveredWorker.cpu}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">pods</dt>
                <dd className="text-signal-ok">
                  {pods.filter((pod) => pod.worker === hovered).length}
                </dd>
              </div>
            </dl>
          </GlassPanel>
        ) : null}
      </group>

      <Effects bloomScale={tier === 'high' ? 1.1 : 1} />
    </>
  )
}

export default ClusterScene
