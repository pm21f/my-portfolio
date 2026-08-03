import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import '@/app/globals.css'
import Providers from '@/components/shell/Providers'
import { site } from '@/config/site'

/**
 * Fonts via next/font: self-hosted at build time, preloaded, and given a CSS
 * variable. No connection to fonts.googleapis.com at runtime, which removes two
 * DNS/TLS round-trips from the critical path.
 *
 * `display: swap` means text paints in the fallback immediately rather than
 * staying invisible — the difference between a fast LCP and a blank hero.
 */
const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    'DevOps Engineer',
    'Kubernetes',
    'AWS',
    'Terraform',
    'CI/CD',
    'Site Reliability',
    'Infrastructure as Code',
    site.name,
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    siteName: site.name,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  themeColor: '#05070a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // NOT maximum-scale: 1 — blocking pinch-zoom is an accessibility failure, and
  // on a site this type-dense some people will need it.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} dark`}>
      <body className="grain min-h-screen bg-void text-ink antialiased">
        {/* First tab stop. Skips the nav and every canvas. */}
        <a href="#main" className="skip-link sr-only focus:not-sr-only">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
