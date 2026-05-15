import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Piyush Modgil | Cloud Engineer & DevOps",
  description: "Cloud Infrastructure, DevOps & Backend Engineer — AWS, Terraform, Kubernetes, Go",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" style={{ backgroundColor: '#020817', color: '#e2e8f0' }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
