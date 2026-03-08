"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a dark background placeholder to prevent a flash of white
    return <div className="min-h-screen bg-[#040814] text-slate-300" /> 
  }

  // We recommend passing defaultTheme="dark" and attribute="class" from your layout.tsx
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}