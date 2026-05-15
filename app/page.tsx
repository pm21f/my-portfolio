import Hero         from "@/components/hero"
import About        from "@/components/about"
import Experience   from "@/components/experience"
import Skills       from "@/components/skills"
import Projects     from "@/components/projects"
import Achievements from "@/components/achievements"
import Contact      from "@/components/contact"
import NetworkBackground from "@/components/network-background"

export default function Home() {
  return (
    <main className="relative min-h-screen" style={{ background: "#020817" }}>
      {/* fixed layers */}
      <div className="fixed inset-0 z-0 grid-overlay pointer-events-none" />
      <NetworkBackground />

      {/* content */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </div>

      {/* footer */}
      <footer
        className="relative z-10 py-10 text-center font-mono text-xs"
        style={{ borderTop: "1px solid rgba(0,212,255,0.07)", color: "#334155" }}
      >
        <span style={{ color: "#00ff88" }}>piyush@nogiz</span>
        <span style={{ color: "#1e293b" }}>:~$</span>
        <span className="ml-2">echo &quot;© 2026 Piyush Modgil · Built with Next.js · Deployed on Vercel&quot;</span>
      </footer>
    </main>
  )
}
