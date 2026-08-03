'use client'

import dynamic from 'next/dynamic'
import SceneGate from '@/components/three/SceneGate'
import HeroFallback from './Fallback'

/**
 * The client boundary for the hero's 3D.
 *
 * `ssr: false` is only legal inside a client component in the App Router, which
 * is why this file exists separately from index.tsx — that keeps the section
 * itself a server component so its text ships in the HTML.
 *
 * <SceneGate> decides between the two branches. Because the 3D branch is only
 * referenced through `dynamic()`, a phone that resolves to the fallback never
 * issues a request for the three.js chunk at all.
 */
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

export function HeroCanvas() {
  return (
    <SceneGate fallback={<HeroFallback />}>
      <HeroScene />
    </SceneGate>
  )
}

export default HeroCanvas
