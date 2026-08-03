'use client'

import Scene from '@/components/three/Scene'
import GlobeScene from './GlobeScene'

/**
 * The hero's canvas, bundled as one lazily-loaded chunk.
 *
 * Everything three.js-shaped is imported statically HERE — <Scene>, the globe,
 * the post-processing stack — so webpack collects it all into the single chunk
 * that HeroCanvas dynamically imports. Importing <Scene> from the gate side
 * instead would drag fiber and drei into the initial bundle and quietly undo
 * the code-splitting.
 */
export function HeroScene() {
  return (
    <Scene
      className="absolute inset-0"
      label="A slowly rotating globe of glowing nodes connected by edges, representing distributed infrastructure"
      cameraPosition={[0, 0, 26]}
      // Mount eagerly — this is above the fold, so waiting on an intersection
      // would guarantee a blank first frame.
      rootMargin="1200px"
    >
      <GlobeScene />
    </Scene>
  )
}

export default HeroScene
