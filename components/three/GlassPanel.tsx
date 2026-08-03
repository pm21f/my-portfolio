'use client'

import { useMemo, type ReactNode } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { color, three as threeTokens } from '@/lib/tokens'

/**
 * <GlassPanel> — a frosted readout floating in the scene.
 *
 * The content is real DOM rendered through drei's <Html>, not a texture. That
 * choice is deliberate and worth defending:
 *
 *   • Text stays selectable, zoomable, and readable by a screen reader.
 *   • It renders at device resolution instead of whatever the texture was
 *     baked at — canvas-drawn text at 3D scale looks soft on every retina
 *     display.
 *   • No font atlas to load, so nothing blocks the first frame.
 *
 * The cost is that panels don't intersect geometry — they composite over it.
 * `occlude` mitigates this by hiding a panel when something passes in front.
 *
 * The mesh behind the DOM is what actually makes it read as glass: a dark
 * translucent quad plus a glowing edge, both of which DO sit in the depth
 * buffer and catch the bloom pass.
 */

type GlassPanelProps = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  /** Panel size in world units. */
  width?: number
  height?: number
  /** Scales the DOM content relative to the world. Lower = smaller text. */
  distanceFactor?: number
  /** Hide the panel when geometry passes in front of it. */
  occlude?: boolean
  /** Fade/scale the whole panel — drive this from hover or scroll state. */
  opacity?: number
  /** Accent the border, e.g. for a selected pipeline stage. */
  active?: boolean
  children: ReactNode
  className?: string
}

export function GlassPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 4.2,
  height = 2.6,
  distanceFactor = 8,
  occlude = false,
  opacity = 1,
  active = false,
  children,
  className = '',
}: GlassPanelProps) {
  // Border as its own line loop rather than a wireframe material — a wireframe
  // on a plane draws the diagonal too, which looks like a bug.
  const borderGeometry = useMemo(() => {
    const half = { x: width / 2, y: height / 2 }
    const points = [
      new THREE.Vector3(-half.x, -half.y, 0),
      new THREE.Vector3(half.x, -half.y, 0),
      new THREE.Vector3(half.x, half.y, 0),
      new THREE.Vector3(-half.x, half.y, 0),
      new THREE.Vector3(-half.x, -half.y, 0),
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [width, height])

  if (opacity <= 0.01) return null

  return (
    <group position={position} rotation={rotation}>
      {/* backing surface */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={threeTokens.bgRaised}
          transparent
          opacity={0.62 * opacity}
          depthWrite={false}
        />
      </mesh>

      {/* glowing edge */}
      <line>
        <primitive object={borderGeometry} attach="geometry" />
        <lineBasicMaterial
          color={active ? threeTokens.accentHot : threeTokens.accent}
          transparent
          opacity={(active ? 0.9 : 0.4) * opacity}
          toneMapped={false}
        />
      </line>

      <Html
        transform
        occlude={occlude}
        distanceFactor={distanceFactor}
        position={[0, 0, 0.01]}
        // Keep panels behind the nav and cursor, above the canvas.
        zIndexRange={[20, 10]}
        style={{
          width: `${width * distanceFactor * 12}px`,
          opacity,
          pointerEvents: opacity > 0.9 ? 'auto' : 'none',
          transition: 'opacity 220ms var(--ease-out)',
        }}
      >
        <div className={`glass rounded-lg p-4 ${className}`}>{children}</div>
      </Html>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────────── DOM ── */

/**
 * The same surface as plain DOM, for fallback scenes and anything outside a
 * canvas. Kept beside the 3D version so the two can't drift apart visually.
 */
export function GlassSurface({
  children,
  className = '',
  active = false,
}: {
  children: ReactNode
  className?: string
  active?: boolean
}) {
  return (
    <div
      className={`glass rounded-lg ${className}`}
      style={
        active
          ? { borderColor: color.accent.core, boxShadow: `0 0 30px ${color.accent.dim}` }
          : undefined
      }
    >
      {children}
    </div>
  )
}

export default GlassPanel
