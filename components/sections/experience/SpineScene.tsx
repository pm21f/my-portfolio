'use client'

import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Effects from '@/components/three/Effects'
import { EdgeField } from '@/components/three/Node'
import { useReducedMotion } from '@/lib/motion'
import { three as threeTokens } from '@/lib/tokens'
import { experience } from '@/config/experience'

/**
 * EXPERIENCE — a vertical spine the camera descends as you scroll.
 *
 * Restrained on purpose. This section's job is to be READ: five roles, dates,
 * what I did. A busy scene competing with that text would be working against
 * the content. So the 3D is a single line with five stations, and every word
 * lives in DOM cards beside it.
 */

const STATION_GAP = 4.2
const SPINE_TOP = 2

export const stationY = (index: number) => SPINE_TOP - index * STATION_GAP

function Station({
  index,
  active,
  current,
}: {
  index: number
  active: boolean
  current: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const strength = useRef(0)

  useFrame((state, delta) => {
    const target = active ? 1 : 0
    strength.current += (target - strength.current) * (1 - Math.exp(-8 * delta))

    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.7 + strength.current * 0.55)
    }

    // The current role gets a slow pulse — the only station that reads as live.
    if (ringRef.current && current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.12
      ringRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group position={[0, stationY(index), 0]}>
      <group ref={groupRef}>
        <mesh>
          <icosahedronGeometry args={[0.34, 1]} />
          <meshBasicMaterial
            color={active ? threeTokens.accentHot : threeTokens.accentDeep}
            toneMapped={false}
          />
        </mesh>
      </group>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.012, 6, 40]} />
        <meshBasicMaterial
          color={current ? threeTokens.ok : threeTokens.accent}
          transparent
          opacity={active ? 0.85 : 0.25}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export function SpineScene({
  progress,
  activeIndex,
}: {
  progress: MutableRefObject<number>
  activeIndex: number
}) {
  const reduced = useReducedMotion()
  const travel = useRef(0)

  const spine = useMemo(() => {
    const top = new THREE.Vector3(0, stationY(0) + 2, 0)
    const bottom = new THREE.Vector3(0, stationY(experience.length - 1) - 2, 0)
    return [[top, bottom]] as [THREE.Vector3, THREE.Vector3][]
  }, [])

  useFrame((state, delta) => {
    const camera = state.camera
    const span = (experience.length - 1) * STATION_GAP
    const target = SPINE_TOP - progress.current * span

    travel.current += (target - travel.current) * (1 - Math.exp(-(reduced ? 60 : 4) * delta))
    camera.position.set(0, travel.current, 9)
    camera.lookAt(0, travel.current, 0)
  })

  return (
    <>
      <EdgeField segments={spine} opacity={0.3} />

      {experience.map((role, index) => (
        <Station
          key={role.id}
          index={index}
          active={index === activeIndex}
          current={role.status === 'current'}
        />
      ))}

      <Effects bloomScale={0.85} vignette={false} />
    </>
  )
}

export default SpineScene
