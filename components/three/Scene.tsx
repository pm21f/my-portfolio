'use client'

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveEvents, Preload } from '@react-three/drei'
import { useFpsGuard, usePerf } from '@/lib/perf'
import { world } from '@/lib/tokens'
import { SceneTierContext } from './tier'

/**
 * <Scene> — the canvas shell every 3D section mounts through.
 *
 * It exists so that no section has to think about the four things that
 * actually decide whether this site holds 60fps:
 *
 *   MOUNTING     the canvas is created only when the section nears the
 *                viewport, and torn down when it's well past. Browsers allow
 *                ~16 live WebGL contexts; eight permanently-mounted scenes
 *                would sit uncomfortably close to that ceiling, and exceeding
 *                it silently kills the OLDEST context — your hero goes black.
 *
 *   FRAMELOOP    an off-screen canvas renders nothing. Without this, scrolling
 *                to the contact section still pays for the hero's globe.
 *
 *   RESOLUTION   DPR comes from the device tier and is hard-capped at 2. A 3x
 *                phone screen renders 9x the pixels of a 1x one for a
 *                difference almost nobody can resolve.
 *
 * The fourth concern — whether to use WebGL at all — is handled one level up by
 * <SceneGate>, so that low-power devices never even download this module.
 */

type SceneProps = {
  children: ReactNode
  /**
   * Shown while the scene is mounted but not yet near the viewport.
   *
   * There is no `fallback` prop: the low-power decision happens one level up in
   * <SceneGate>, before this module — and therefore three.js — is ever loaded.
   */
  loading?: ReactNode
  /** Camera position. Defaults to the shared dolly distance in tokens. */
  cameraPosition?: [number, number, number]
  fov?: number
  className?: string
  /**
   * How far outside the viewport to mount. Generous by default — a canvas that
   * mounts at the moment it becomes visible shows a blank frame first.
   */
  rootMargin?: string
  /** Accessible name for the canvas region. */
  label: string
}

export function Scene({
  children,
  loading = null,
  cameraPosition = [0, 0, world.camera.dolly],
  fov = world.camera.fov,
  className,
  rootMargin = '600px',
  label,
}: SceneProps) {
  const { tier, budget, downgrade } = usePerf()
  const tierValue = useMemo(() => ({ tier, budget }), [tier, budget])

  const hostRef = useRef<HTMLDivElement>(null)
  /** Near the viewport → the canvas exists. */
  const [mounted, setMounted] = useState(false)
  /** Actually on screen → the canvas renders frames. */
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const mountObserver = new IntersectionObserver(
      ([entry]) => setMounted(entry.isIntersecting),
      { rootMargin },
    )
    const visibleObserver = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '0px', threshold: 0.01 },
    )

    mountObserver.observe(host)
    visibleObserver.observe(host)
    return () => {
      mountObserver.disconnect()
      visibleObserver.disconnect()
    }
  }, [rootMargin])

  // Only judge frame rate while this scene is the one on screen — measuring a
  // paused canvas would blame it for someone else's slow frames.
  useFpsGuard(downgrade, { enabled: visible })

  return (
    <div ref={hostRef} className={className} aria-hidden="true">
      {mounted ? (
        <Canvas
          role="img"
          aria-label={label}
          dpr={budget.dpr}
          shadows={budget.shadows}
          frameloop={visible ? 'always' : 'never'}
          camera={{
            position: cameraPosition,
            fov,
            near: world.camera.near,
            far: world.camera.far,
          }}
          gl={{
            // MSAA is the single most expensive default in three.js. Bloom
            // hides most aliasing anyway, so only the top tier pays for it.
            antialias: budget.shadows,
            powerPreference: 'high-performance',
            alpha: true,
            // The scene is composited over CSS backgrounds; without this the
            // canvas paints its own opaque black over the page gradient.
            premultipliedAlpha: false,
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
          }}
        >
          <SceneTierContext.Provider value={tierValue}>
            <Suspense fallback={null}>{children}</Suspense>
          </SceneTierContext.Provider>
          {/* Downgrade raycasting during movement — pointer tests are O(objects). */}
          <AdaptiveEvents />
          <Preload all />
        </Canvas>
      ) : (
        loading
      )}
    </div>
  )
}

export default Scene
