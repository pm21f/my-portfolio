'use client'

import { useMemo } from 'react'
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { postfx } from '@/lib/tokens'
import { useTier } from './tier'

/**
 * The post stack. One place, tier-gated, so no section can quietly turn on
 * depth of field for a phone.
 *
 * Order is fixed and matters: DOF must run before bloom, or you bloom a blurred
 * image and the highlights smear instead of glowing.
 *
 * On the low tier this renders NOTHING — not a composer with the effects
 * disabled. An EffectComposer costs a full-screen render target and an extra
 * pass even when empty, which is exactly the overhead a weak device can't take.
 */

type EffectsProps = {
  /** Depth of field. Only honoured on the high tier — it's the priciest pass. */
  dof?: boolean
  /** Distance from camera that stays sharp, in world units. */
  focusDistance?: number
  focalLength?: number
  bokehScale?: number
  /** Bloom multiplier for scenes that are unusually bright or dark. */
  bloomScale?: number
  vignette?: boolean
  /**
   * Chromatic aberration. Turn OFF for any scene whose subject is text —
   * the RGB split reads as a lens artefact on shapes, but as blurry
   * misregistered type on letterforms.
   */
  chromatic?: boolean
}

export function Effects({
  dof = false,
  focusDistance = 0.012,
  focalLength = 0.05,
  bokehScale = 3.5,
  bloomScale = 1,
  vignette = true,
  chromatic = true,
}: EffectsProps) {
  const { tier } = useTier()
  const settings = postfx[tier]

  // A new Vector2 on every render would make the effect re-initialise its
  // uniforms each frame — memoise or pay for it continuously.
  const chromaticOffset = useMemo(
    () => new THREE.Vector2(settings.chromatic, settings.chromatic),
    [settings.chromatic],
  )

  if (tier === 'low' || settings.bloom === 0) return null

  /*
   * Children are assembled into a real array rather than written inline with
   * `cond ? <Effect/> : <></>`.
   *
   * EffectComposer walks its children to build the render pass chain, and an
   * empty Fragment is a child that has no effect instance attached — depending
   * on version that either throws or silently drops the rest of the chain.
   * Building the array means a disabled effect simply isn't there.
   */
  const passes = []

  // DOF must precede bloom: blooming an already-blurred image smears the
  // highlights instead of making them glow.
  if (dof && settings.dof) {
    passes.push(
      <DepthOfField
        key="dof"
        focusDistance={focusDistance}
        focalLength={focalLength}
        bokehScale={bokehScale}
      />,
    )
  }

  passes.push(
    <Bloom
      key="bloom"
      intensity={settings.bloom * bloomScale}
      // High threshold on purpose: only the emissive nodes should bloom. Drop
      // it and the text glows too, which reads as a blur rather than light.
      luminanceThreshold={0.55}
      luminanceSmoothing={0.3}
      mipmapBlur
    />,
  )

  if (chromatic && settings.chromatic > 0) {
    passes.push(
      <ChromaticAberration
        key="chromatic"
        offset={chromaticOffset}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />,
    )
  }

  if (vignette) {
    passes.push(<Vignette key="vignette" eskil={false} offset={0.28} darkness={0.72} />)
  }

  return (
    <EffectComposer multisampling={settings.samples} enableNormalPass={false}>
      {passes}
    </EffectComposer>
  )
}

export default Effects
