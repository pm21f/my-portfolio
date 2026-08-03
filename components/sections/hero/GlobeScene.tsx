'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EdgeField, NodeField } from '@/components/three/Node'
import CameraRig from '@/components/three/CameraRig'
import Effects from '@/components/three/Effects'
import { useTier } from '@/components/three/tier'
import { markBooted } from '@/lib/boot'
import { usePointerParallax, useReducedMotion } from '@/lib/motion'
import { three as threeTokens } from '@/lib/tokens'

/**
 * HERO — distributed infrastructure as a globe of nodes and edges.
 *
 * The read: a lot of independent machines, all connected, all alive. It is the
 * thesis of the rest of the page in one object.
 */

const RADIUS = 7.4

/**
 * Fibonacci sphere — points spaced by the golden angle.
 *
 * Not lat/long: that bunches points at the poles, and a globe with visibly
 * denser caps reads as a mistake. This gives near-uniform spacing at any count,
 * which is what lets the node budget change per tier without redesigning.
 */
function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let index = 0; index < count; index++) {
    const y = 1 - (index / Math.max(count - 1, 1)) * 2
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = goldenAngle * index
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * ringRadius * radius,
        y * radius,
        Math.sin(theta) * ringRadius * radius,
      ),
    )
  }
  return points
}

/**
 * Join each node to its nearest neighbours.
 *
 * Brute-force O(n²) — about 400k distance checks at the high tier. That sounds
 * alarming and is roughly 3ms, once, at mount. A spatial index would be the
 * right call if this ran per-frame; it doesn't, and the simpler code is worth
 * more here than the microseconds.
 */
function buildEdges(
  points: THREE.Vector3[],
  neighbours: number,
  maxEdges: number,
): [THREE.Vector3, THREE.Vector3][] {
  const seen = new Set<string>()
  const edges: [THREE.Vector3, THREE.Vector3][] = []

  for (let i = 0; i < points.length; i++) {
    const distances: { index: number; distance: number }[] = []
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue
      distances.push({ index: j, distance: points[i].distanceToSquared(points[j]) })
    }
    distances.sort((a, b) => a.distance - b.distance)

    for (let k = 0; k < neighbours && k < distances.length; k++) {
      const j = distances[k].index
      // Undirected: key on the sorted pair so A→B and B→A collapse to one line.
      const key = i < j ? `${i}:${j}` : `${j}:${i}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push([points[i], points[j]])
      if (edges.length >= maxEdges) return edges
    }
  }
  return edges
}

/* ───────────────────────────────────────────────────────── travelling light ── */

/**
 * Packets of light crossing the sphere — the thing that makes it read as
 * *running* infrastructure rather than a wireframe model.
 *
 * One instanced mesh, one draw call, positions recomputed per frame by lerping
 * along a randomly assigned edge.
 */
function Traffic({ edges, count }: { edges: [THREE.Vector3, THREE.Vector3][]; count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const packets = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        // Deterministic pseudo-random: identical every mount, so the scene
        // never "reshuffles" on a re-render.
        const hash = Math.sin(index * 78.233) * 43758.5453
        const fraction = hash - Math.floor(hash)
        return {
          edge: Math.floor(fraction * edges.length),
          offset: fraction,
          speed: 0.15 + fraction * 0.35,
        }
      }),
    [edges.length, count],
  )

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh || edges.length === 0) return

    const time = state.clock.elapsedTime
    packets.forEach((packet, index) => {
      const [from, to] = edges[packet.edge % edges.length]
      // Sawtooth in [0,1): the packet runs the edge, then restarts.
      const t = (time * packet.speed + packet.offset) % 1

      dummy.position.lerpVectors(from, to, t)
      // Fade in and out at the ends so packets don't pop at the nodes.
      const fade = Math.sin(t * Math.PI)
      dummy.scale.setScalar(0.05 + fade * 0.09)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined as any, undefined as any, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={threeTokens.accentHot} toneMapped={false} />
    </instancedMesh>
  )
}

/* ──────────────────────────────────────────────────────────────── scene ── */

export function GlobeScene() {
  const { tier, budget } = useTier()
  const reduced = useReducedMotion()
  const pointer = usePointerParallax()
  const groupRef = useRef<THREE.Group>(null)
  const booted = useRef(false)
  const { size } = useThree()

  /**
   * Push the globe to the right of frame on wide viewports.
   *
   * Centred, it sits directly behind the name — the type stays legible but the
   * two subjects fight, and neither gets to be the focal point. Offset, the
   * headline occupies the left third and the globe reads as the thing it's
   * standing in front of.
   *
   * Below ~1024px the layout stacks and there is no left column to clear, so
   * the offset drops back to zero rather than pushing the globe off-canvas.
   */
  const offsetX = size.width >= 1024 ? 5.2 : 0

  const nodes = useMemo(
    () => fibonacciSphere(budget.globeNodes, RADIUS),
    [budget.globeNodes],
  )

  const edges = useMemo(
    () => buildEdges(nodes, 3, budget.globeEdges),
    [nodes, budget.globeEdges],
  )

  // A sparse second shell, larger and dimmer — reads as depth beyond the globe
  // without the cost of doubling the main field.
  const halo = useMemo(
    () => fibonacciSphere(Math.round(budget.globeNodes * 0.22), RADIUS * 1.55),
    [budget.globeNodes],
  )

  useFrame((_, delta) => {
    if (!booted.current) {
      booted.current = true
      markBooted('scene')
    }
    if (reduced || !groupRef.current) return
    // Slow enough to be felt rather than watched — a full turn takes ~90s.
    groupRef.current.rotation.y += delta * 0.07
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.00005) * 0.08
  })

  return (
    <>
      <CameraRig pointer={pointer} parallaxStrength={2.2} damping={2.4} />

      <group ref={groupRef} position={[offsetX, 0, 0]}>
        <EdgeField segments={edges} opacity={0.28} />
        <NodeField positions={nodes} radius={0.075} pulse={tier === 'high'} jitter={0.5} />
        <NodeField
          positions={halo}
          radius={0.05}
          color={threeTokens.accentDeep}
          opacity={0.5}
          jitter={0.8}
        />
        {/* Traffic is the most expensive per-frame work here — top tier only. */}
        {tier === 'high' && !reduced ? <Traffic edges={edges} count={48} /> : null}
      </group>

      {/* A dim core so the sphere reads as solid rather than a hollow shell.
          Outside the rotating group — it's a fill, not part of the structure. */}
      <mesh position={[offsetX, 0, 0]}>
        <sphereGeometry args={[RADIUS * 0.92, 24, 24]} />
        <meshBasicMaterial color={threeTokens.bg} transparent opacity={0.55} />
      </mesh>

      <Effects dof focusDistance={0.028} focalLength={0.04} bokehScale={2.4} />
    </>
  )
}

export default GlobeScene
