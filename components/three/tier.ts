'use client'

import { createContext, useContext } from 'react'
import { perf, type Tier } from '@/lib/tokens'

/**
 * Device tier, re-provided INSIDE the <Canvas>.
 *
 * react-three-fiber renders its children with a separate reconciler. Context
 * from the DOM tree is bridged in current versions, but relying on that is a
 * silent-failure risk: if it ever stops holding, `usePerf()` throws from inside
 * a canvas and takes the whole scene down with an error boundary.
 *
 * <Scene> reads the tier in DOM-land where it's unambiguous, then re-provides
 * it through this context on the 3D side. Scene contents use `useTier()`.
 */

export type TierValue = {
  tier: Tier
  budget: (typeof perf)[Tier]
}

export const SceneTierContext = createContext<TierValue>({
  tier: 'mid',
  budget: perf.mid,
})

export function useTier(): TierValue {
  return useContext(SceneTierContext)
}
