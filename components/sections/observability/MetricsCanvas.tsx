'use client'

import Scene from '@/components/three/Scene'
import MetricsWall from './MetricsWall'

export function MetricsCanvas() {
  return (
    <Scene
      className="absolute inset-0"
      label="A wall of animated bar graphs representing live infrastructure metrics"
      cameraPosition={[0, 1.6, 12]}
    >
      <MetricsWall />
    </Scene>
  )
}

export default MetricsCanvas
