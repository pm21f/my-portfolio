'use client'

import type { ReactNode } from 'react'
import { PerfProvider } from '@/lib/perf'
import { SmoothScrollProvider } from '@/lib/scroll'
import Cursor from './Cursor'
import Nav from './Nav'
import Preloader from './Preloader'

/**
 * The client boundary.
 *
 * Everything interactive lives under here so app/layout.tsx and app/page.tsx
 * can stay server components — which is what keeps the site's text in the HTML
 * response rather than in a hydration payload.
 *
 * Order matters: PerfProvider must wrap everything, because <Scene> reads the
 * device tier and the preloader waits on the same detection.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <PerfProvider>
      <SmoothScrollProvider>
        <Preloader />
        <Cursor />
        <Nav />
        {children}
      </SmoothScrollProvider>
    </PerfProvider>
  )
}

export default Providers
