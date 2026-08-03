'use client'

import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/lib/motion'
import { world } from '@/lib/tokens'

/**
 * <CameraRig> — the only thing allowed to move the camera.
 *
 * Two inputs, blended every frame:
 *
 *   PARALLAX  pointer position, damped. Gives the scene physical depth and is
 *             the single cheapest way to make a canvas feel like a space rather
 *             than a picture.
 *
 *   DOLLY     scroll progress through the section. This is what makes section
 *             transitions read as camera moves instead of cross-fades — the
 *             camera physically travels toward the subject as you scroll in.
 *
 * Both are disabled under prefers-reduced-motion. Camera movement the user
 * didn't ask for is the exact failure mode that setting exists to prevent, and
 * parallax tied to pointer movement is the most nauseating version of it.
 */

type CameraRigProps = {
  /** Pointer in [-1, 1], from usePointerParallax. Omit for no parallax. */
  pointer?: MutableRefObject<{ x: number; y: number }>
  /** Section scroll progress in [0, 1], from useScrollProgress. */
  progress?: MutableRefObject<number>
  /** How far the camera travels along Z across the full scroll range. */
  dollyRange?: number
  /** Max pointer-driven offset in world units. */
  parallaxStrength?: number
  /** Point the camera looks at. */
  target?: [number, number, number]
  /** Damping factor — lower is heavier. */
  damping?: number
}

export function CameraRig({
  pointer,
  progress,
  dollyRange = 0,
  parallaxStrength = world.parallax,
  target = [0, 0, 0],
  damping = 3.5,
}: CameraRigProps) {
  const reduced = useReducedMotion()
  const lookAt = useRef(new THREE.Vector3(...target))
  const desired = useRef(new THREE.Vector3())
  const initial = useRef<THREE.Vector3 | null>(null)

  useFrame((state, delta) => {
    const camera = state.camera

    // Capture the authored position on the first frame — the rig offsets from
    // wherever the scene placed the camera rather than assuming an origin.
    if (!initial.current) initial.current = camera.position.clone()
    const base = initial.current

    if (reduced) {
      camera.position.copy(base)
      camera.lookAt(lookAt.current)
      return
    }

    const scrollAmount = progress ? progress.current : 0
    const pointerX = pointer ? pointer.current.x : 0
    const pointerY = pointer ? pointer.current.y : 0

    desired.current.set(
      base.x + pointerX * parallaxStrength,
      base.y + pointerY * parallaxStrength * 0.6,
      // Scroll pulls the camera IN toward the subject, so the section feels
      // approached rather than scrolled past.
      base.z - scrollAmount * dollyRange,
    )

    // Exponential damping — same settle time at any frame rate. A plain
    // lerp(0.1) moves twice as fast at 120fps as at 60.
    const factor = 1 - Math.exp(-damping * delta)
    camera.position.lerp(desired.current, factor)
    camera.lookAt(lookAt.current)
  })

  return null
}

export default CameraRig
