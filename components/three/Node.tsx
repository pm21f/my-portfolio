'use client'

import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cursorHandlers } from '@/lib/cursor'
import { three as threeTokens } from '@/lib/tokens'

/**
 * <Node> / <NodeField> / <EdgeField> — the vocabulary every scene is drawn in.
 *
 * The whole site is one visual idea: infrastructure as glowing nodes joined by
 * thin edges. Rather than each section inventing its own spheres, they all
 * compose these three primitives, which keeps the look consistent and — more
 * practically — keeps the draw-call count honest.
 *
 * Draw calls, for the record:
 *   <NodeField>   1, regardless of node count (instanced)
 *   <EdgeField>   1, regardless of edge count (one LineSegments buffer)
 *   <Node>        1 each — for the handful of objects that need own behaviour
 */

/* ────────────────────────────────────────────────────────────── single ── */

type NodeProps = {
  position?: [number, number, number]
  scale?: number
  color?: number | string
  /** Hover/click affordance — sets the custom cursor and swells the node. */
  interactive?: boolean
  /** Cursor label shown while hovering. */
  label?: string
  onClick?: () => void
  onHoverChange?: (hovered: boolean) => void
  children?: ReactNode
}

/**
 * A single node. Use for objects that need their own hover state or payload —
 * a pipeline stage, a cluster control plane. For crowds, use <NodeField>.
 */
export function Node({
  position = [0, 0, 0],
  scale = 1,
  color = threeTokens.accent,
  interactive = false,
  label,
  onClick,
  onHoverChange,
  children,
}: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const hovered = useRef(false)
  const currentScale = useRef(scale)

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    const target = hovered.current ? scale * 1.35 : scale
    // Frame-rate independent damping: at 30fps the step is twice as large as at
    // 60fps, so the motion takes the same wall-clock time on both.
    currentScale.current += (target - currentScale.current) * (1 - Math.exp(-10 * delta))
    mesh.scale.setScalar(currentScale.current)
  })

  const handlers = interactive
    ? {
        ...cursorHandlers('hover', label),
        onPointerOver: (event: any) => {
          event.stopPropagation()
          hovered.current = true
          onHoverChange?.(true)
          cursorHandlers('hover', label).onPointerOver()
        },
        onPointerOut: () => {
          hovered.current = false
          onHoverChange?.(false)
          cursorHandlers().onPointerOut()
        },
        onClick: (event: any) => {
          event.stopPropagation()
          onClick?.()
        },
      }
    : {}

  return (
    <mesh ref={meshRef} position={position} {...handlers}>
      <icosahedronGeometry args={[1, 2]} />
      {/*
        Basic, not standard: these nodes are meant to READ as light sources.
        toneMapped={false} lets the colour exceed 1.0 in linear space, which is
        what makes the bloom pass actually catch them.
      */}
      <meshBasicMaterial color={color} toneMapped={false} />
      {children}
    </mesh>
  )
}

/* ──────────────────────────────────────────────────────────── instanced ── */

type NodeFieldProps = {
  /** World positions. Length determines the instance count. */
  positions: THREE.Vector3[] | [number, number, number][]
  radius?: number
  color?: number | string
  /** Per-instance scale jitter, 0–1. Breaks up the uniformity of a grid. */
  jitter?: number
  /** Subtle breathing. Costs one matrix write per node per frame. */
  pulse?: boolean
  pulseSpeed?: number
  /** Geometry subdivisions. 0 is an octahedron — fine below ~6px on screen. */
  detail?: number
  opacity?: number
}

/**
 * Many nodes, one draw call.
 *
 * The matrix buffer is written once on mount and only rewritten per-frame when
 * `pulse` is on — which is why `pulse` is opt-in rather than always-on.
 */
export function NodeField({
  positions,
  radius = 0.08,
  color = threeTokens.accent,
  jitter = 0.35,
  pulse = false,
  pulseSpeed = 1.4,
  detail = 0,
  opacity = 1,
}: NodeFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = positions.length

  const points = useMemo(
    () =>
      positions.map((position) =>
        Array.isArray(position) ? new THREE.Vector3(...position) : position,
      ),
    [positions],
  )

  /**
   * A stable per-instance scale and phase offset.
   *
   * Deterministic (hashed from the index) rather than Math.random() so the
   * layout is identical on every render and between server and client — a
   * random seed here would make the field visibly reshuffle on any re-render.
   */
  const variance = useMemo(
    () =>
      points.map((_, index) => {
        const hash = Math.sin(index * 127.1) * 43758.5453
        const fraction = hash - Math.floor(hash)
        return {
          scale: 1 - jitter * 0.5 + fraction * jitter,
          phase: fraction * Math.PI * 2,
        }
      }),
    [points, jitter],
  )

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    points.forEach((point, index) => {
      dummy.position.copy(point)
      dummy.scale.setScalar(variance[index].scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    // Without an explicit bounding sphere the renderer frustum-culls the whole
    // field against instance 0's bounds and it vanishes at certain angles.
    mesh.computeBoundingSphere()
  }, [points, variance, dummy])

  useFrame((state) => {
    if (!pulse) return
    const mesh = meshRef.current
    if (!mesh) return

    const time = state.clock.elapsedTime * pulseSpeed
    for (let index = 0; index < count; index++) {
      const { scale, phase } = variance[index]
      dummy.position.copy(points[index])
      dummy.scale.setScalar(scale * (0.82 + 0.18 * Math.sin(time + phase)))
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]} frustumCulled={false}>
      <icosahedronGeometry args={[radius, detail]} />
      <meshBasicMaterial
        color={color}
        toneMapped={false}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </instancedMesh>
  )
}

/* ──────────────────────────────────────────────────────────────── edges ── */

type EdgeFieldProps = {
  /** Flat pairs: [from, to, from, to, …]. */
  segments: [THREE.Vector3, THREE.Vector3][]
  color?: number | string
  opacity?: number
}

/**
 * All connections as ONE LineSegments buffer.
 *
 * Tempting alternative: a thin cylinder mesh per edge, which would let you
 * control width. It also turns 900 edges into 900 draw calls. Lines are 1px
 * everywhere and that is a fair trade at this density.
 */
export function EdgeField({ segments, color = threeTokens.accentDeep, opacity = 0.35 }: EdgeFieldProps) {
  const geometry = useMemo(() => {
    const vertices = new Float32Array(segments.length * 6)
    segments.forEach(([from, to], index) => {
      vertices.set([from.x, from.y, from.z, to.x, to.y, to.z], index * 6)
    })
    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    return buffer
  }, [segments])

  // Geometries are not garbage collected — they hold GPU buffers until disposed.
  useLayoutEffect(() => () => geometry.dispose(), [geometry])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </lineSegments>
  )
}
