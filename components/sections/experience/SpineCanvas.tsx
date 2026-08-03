'use client'

import type { MutableRefObject } from 'react'
import Scene from '@/components/three/Scene'
import SpineScene from './SpineScene'

export function SpineCanvas({
  progress,
  activeIndex,
}: {
  progress: MutableRefObject<number>
  activeIndex: number
}) {
  return (
    <Scene
      className="absolute inset-0"
      label="A vertical timeline of five glowing stations, one per role, descending as the page scrolls"
      cameraPosition={[0, 2, 9]}
      fov={38}
    >
      <SpineScene progress={progress} activeIndex={activeIndex} />
    </Scene>
  )
}

export default SpineCanvas
