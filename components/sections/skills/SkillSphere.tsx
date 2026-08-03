'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Effects from '@/components/three/Effects'
import { NodeField } from '@/components/three/Node'
import { setCursor } from '@/lib/cursor'
import { useReducedMotion } from '@/lib/motion'
import { selectSkill } from '@/lib/filter'
import { color, three as threeTokens } from '@/lib/tokens'
import { skills } from '@/config/skills'

/**
 * SKILLS — a draggable sphere of technology labels.
 *
 * Text rendering approach: each label is drawn once into a 2D canvas and used
 * as a sprite texture.
 *
 * The obvious alternative, drei's <Text>, pulls in troika-three-text AND
 * fetches a font file at runtime — for a site whose whole typographic identity
 * is already loaded via next/font, that's a second copy of a typeface and an
 * extra network request on the critical path. Canvas textures reuse the font
 * the browser already has.
 *
 * Sprites always face the camera, so every label stays readable at any
 * rotation. That is the entire reason this is a sphere of sprites rather than
 * a sphere of oriented planes.
 */

const RADIUS = 6.4
/** Below this pointer travel, a press counts as a click rather than a drag. */
const CLICK_THRESHOLD = 5

/* ─────────────────────────────────────────────────────────────── textures ── */

/**
 * Draw a label into a canvas texture.
 *
 * Rendered at 2x and downsampled by the GPU, which is why the text stays crisp
 * without the memory cost of a genuinely large texture.
 */
function makeLabelTexture(text: string, active: boolean): THREE.CanvasTexture {
  const scale = 2
  const width = 256
  const height = 64

  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale

  const context = canvas.getContext('2d')!
  context.scale(scale, scale)
  context.clearRect(0, 0, width, height)

  context.font = '500 22px ui-monospace, "JetBrains Mono", monospace'
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  if (active) {
    // A glow drawn into the texture, so the bloom pass has something to catch.
    context.shadowColor = color.accent.core
    context.shadowBlur = 14
  }
  context.fillStyle = active ? color.accent.hot : color.text.secondary
  context.fillText(text, width / 2, height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  // Sprites are viewed head-on; anisotropy and mips buy nothing here.
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

/* ──────────────────────────────────────────────────────────────── labels ── */

function Label({
  position,
  text,
  active,
  dimmed,
  onSelect,
}: {
  position: THREE.Vector3
  text: string
  active: boolean
  dimmed: boolean
  onSelect: () => void
}) {
  const spriteRef = useRef<THREE.Sprite>(null)
  const [hovered, setHovered] = useState(false)
  const currentScale = useRef(1)

  const texture = useMemo(() => makeLabelTexture(text, active || hovered), [text, active, hovered])

  // CanvasTextures hold GPU memory until disposed. With 32 labels each
  // regenerating on hover, leaking these would grow unboundedly during a
  // single visit.
  useEffect(() => () => texture.dispose(), [texture])

  useFrame((_, delta) => {
    const sprite = spriteRef.current
    if (!sprite) return

    const target = hovered || active ? 1.22 : 1
    currentScale.current += (target - currentScale.current) * (1 - Math.exp(-12 * delta))
    sprite.scale.set(2.6 * currentScale.current, 0.65 * currentScale.current, 1)

    const material = sprite.material as THREE.SpriteMaterial
    material.opacity = dimmed && !active ? 0.22 : 1
  })

  return (
    <sprite
      ref={spriteRef}
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
        setCursor('hover')
      }}
      onPointerOut={() => {
        setHovered(false)
        setCursor('drag')
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect()
      }}
    >
      <spriteMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  )
}

/* ──────────────────────────────────────────────────────────────── sphere ── */

export function SkillSphere({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (id: string) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const reduced = useReducedMotion()
  const { gl } = useThree()

  /** Angular velocity, in radians per second. */
  const velocity = useRef({ x: 0, y: reduced ? 0 : 0.12 })
  const dragging = useRef(false)

  const positions = useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    return skills.map((_, index) => {
      const y = 1 - (index / Math.max(skills.length - 1, 1)) * 2
      const ringRadius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = goldenAngle * index
      return new THREE.Vector3(
        Math.cos(theta) * ringRadius * RADIUS,
        y * RADIUS,
        Math.sin(theta) * ringRadius * RADIUS,
      )
    })
  }, [])

  // Faint points marking the sphere's surface between labels.
  const lattice = useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    const count = 160
    return Array.from({ length: count }, (_, index) => {
      const y = 1 - (index / (count - 1)) * 2
      const ringRadius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = goldenAngle * index
      return new THREE.Vector3(
        Math.cos(theta) * ringRadius * RADIUS * 1.04,
        y * RADIUS * 1.04,
        Math.sin(theta) * ringRadius * RADIUS * 1.04,
      )
    })
  }, [])

  /**
   * Drag handling, bound to the canvas element directly.
   *
   * Listening on the DOM rather than using a mesh's pointer handlers means the
   * user can grab anywhere in the section — including the empty space between
   * labels — which is what people actually try first.
   */
  useEffect(() => {
    const element = gl.domElement
    let lastX = 0
    let lastY = 0
    let travelled = 0
    let pointerId: number | null = null

    const onDown = (event: PointerEvent) => {
      dragging.current = true
      pointerId = event.pointerId
      lastX = event.clientX
      lastY = event.clientY
      travelled = 0
      setCursor('drag')
      element.setPointerCapture(event.pointerId)
    }

    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return
      const deltaX = event.clientX - lastX
      const deltaY = event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY
      travelled += Math.abs(deltaX) + Math.abs(deltaY)

      // Feed velocity rather than setting rotation, so releasing mid-drag
      // leaves the sphere spinning instead of stopping dead.
      velocity.current.y = deltaX * 0.005
      velocity.current.x = deltaY * 0.005
    }

    const onUp = (event: PointerEvent) => {
      if (!dragging.current) return
      dragging.current = false
      if (pointerId !== null && element.hasPointerCapture(pointerId)) {
        element.releasePointerCapture(pointerId)
      }
      pointerId = null
      setCursor('default')
      // A press that never moved is a click; three.js will deliver it to the
      // sprite's onClick, so nothing more is needed here.
      void travelled
    }

    element.addEventListener('pointerdown', onDown)
    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerup', onUp)
    element.addEventListener('pointercancel', onUp)

    return () => {
      element.removeEventListener('pointerdown', onDown)
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerup', onUp)
      element.removeEventListener('pointercancel', onUp)
    }
  }, [gl])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const step = Math.min(delta, 1 / 30)

    if (!dragging.current) {
      // Friction, then drift back toward the idle spin.
      velocity.current.x *= 0.94
      velocity.current.y *= 0.94
      if (!reduced) {
        velocity.current.y += (0.12 - velocity.current.y) * 0.02
      }
    }

    group.rotation.y += velocity.current.y * step * 60
    group.rotation.x += velocity.current.x * step * 60
    // Clamp pitch — past vertical the sphere reads as upside down and the
    // labels become unreadable.
    group.rotation.x = THREE.MathUtils.clamp(group.rotation.x, -0.7, 0.7)
  })

  return (
    <>
      <group ref={groupRef}>
        <NodeField
          positions={lattice}
          radius={0.045}
          color={threeTokens.accentDeep}
          opacity={0.35}
        />

        {skills.map((skill, index) => (
          <Label
            key={skill.id}
            position={positions[index]}
            text={skill.label}
            active={selected === skill.id}
            dimmed={selected !== null}
            onSelect={() => onSelect(skill.id)}
          />
        ))}
      </group>

      {/*
        No chromatic aberration here. Every subject in this scene is a word,
        and an RGB split turns crisp 22px type into something that looks
        misprinted rather than cinematic.
      */}
      <Effects bloomScale={0.9} vignette={false} chromatic={false} />
    </>
  )
}

export default SkillSphere
