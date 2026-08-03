'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Effects from '@/components/three/Effects'
import { useTier } from '@/components/three/tier'
import { usePointerParallax, useReducedMotion } from '@/lib/motion'
import { three as threeTokens } from '@/lib/tokens'
import { metricNoise } from '@/config/metrics'

/**
 * OBSERVABILITY — a wall of bars driven by the same generator as the readouts.
 *
 * One instanced mesh for the whole wall. The alternative — a mesh per bar —
 * would be 240 draw calls updated every frame, which is precisely the pattern
 * that turns a metrics dashboard into a space heater.
 *
 * Bar heights come from config/metrics.ts's `metricNoise`, the identical
 * function the DOM numbers use. That's what keeps the wall and the readouts
 * telling the same story rather than being two unrelated animations.
 */

const COLUMNS = 30
const ROWS = 8
const BAR_WIDTH = 0.34
const GAP = 0.14

function MetricBars({ columns, rows }: { columns: number; rows: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colorHelper = useMemo(() => new THREE.Color(), [])
  const reduced = useReducedMotion()
  const count = columns * rows

  const spanX = columns * (BAR_WIDTH + GAP)
  const spanY = rows * (BAR_WIDTH + GAP)

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return

    // Reduced motion still gets a wall — just a frozen one, sampled at a fixed
    // moment so it looks composed rather than empty.
    const time = reduced ? 4.2 : state.clock.elapsedTime

    let index = 0
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const seed = row * 31 + column
        // Columns lag their neighbour slightly, so the wall reads as a wave
        // travelling across it rather than every bar blinking in unison.
        const value = metricNoise(seed, time - column * 0.08)
        const height = 0.25 + value * 3.4

        dummy.position.set(
          column * (BAR_WIDTH + GAP) - spanX / 2,
          height / 2 - spanY / 2,
          row * -0.9,
        )
        dummy.scale.set(BAR_WIDTH, height, BAR_WIDTH)
        dummy.updateMatrix()
        mesh.setMatrixAt(index, dummy.matrix)

        // Hot bars read as pressure — the eye finds the busy columns without
        // needing a legend.
        colorHelper.setHex(value > 0.78 ? threeTokens.warn : threeTokens.accent)
        colorHelper.multiplyScalar(0.35 + value * 0.9)
        mesh.setColorAt(index, colorHelper)

        index++
      }
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined as any, undefined as any, count]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

/** A slowly rotating ring of empty panels framing the wall. */
function PanelRing({ radius = 9 }: { radius?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const reduced = useReducedMotion()

  useFrame((_, delta) => {
    if (reduced || !groupRef.current) return
    groupRef.current.rotation.y += delta * 0.06
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <planeGeometry args={[2.6, 1.5]} />
            <meshBasicMaterial
              color={threeTokens.accentDeep}
              transparent
              opacity={0.09}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function MetricsWall() {
  const { tier } = useTier()
  const pointer = usePointerParallax()

  const columns = tier === 'high' ? COLUMNS : tier === 'mid' ? 20 : 12
  const rows = tier === 'high' ? ROWS : tier === 'mid' ? 5 : 3

  useFrame((state) => {
    const camera = state.camera
    camera.position.x += (pointer.current.x * 2.4 - camera.position.x) * 0.04
    camera.position.y += (1.6 + pointer.current.y * 1.2 - camera.position.y) * 0.04
    camera.lookAt(0, 0, -2)
  })

  return (
    <>
      <MetricBars columns={columns} rows={rows} />
      {tier !== 'low' ? <PanelRing /> : null}
      <Effects bloomScale={1.2} />
    </>
  )
}

export default MetricsWall
