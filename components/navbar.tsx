"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { Terminal, Menu, X, FileText } from "lucide-react"

const navItems = [
  { name: "About",      href: "#about"      },
  { name: "Experience", href: "#experience" },
  { name: "Skills",     href: "#skills"     },
  { name: "Projects",   href: "#projects"   },
  { name: "Contact",    href: "#contact"    },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [mounted,     setMounted]     = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
    setMobileOpen(false)
  }

  if (!mounted) return null

  return (
    <>
      {/* ── scroll progress bar ── */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none overflow-hidden">
        <motion.div
          style={{
            scaleX,
            transformOrigin: "left",
            height: "100%",
            background: "linear-gradient(90deg, #00d4ff 0%, #00ff88 50%, #7c3aed 100%)",
            boxShadow: "0 0 10px rgba(0,212,255,0.7)",
          }}
        />
      </div>

      {/* ── nav ── */}
      <nav
        className="fixed top-0 z-50 w-full transition-all duration-500"
        style={{
          background:     scrolled ? "rgba(2,8,23,0.90)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom:   scrolled ? "1px solid rgba(0,212,255,0.1)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">

          {/* logo */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1,  x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => scrollTo("#home")}
            className="flex items-center gap-2.5 font-mono font-bold tracking-tight"
            style={{ color: "#e2e8f0" }}
          >
            <Terminal className="w-4 h-4" style={{ color: "#00d4ff" }} />
            <span style={{ color: "#00d4ff" }}>~/</span>
            <span>piyush_modgil</span>
            <span className="blink" style={{ color: "#00ff88" }}>_</span>
          </motion.button>

          {/* desktop links */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1,  y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-1"
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                onClick={() => scrollTo(item.href)}
                className="relative px-4 py-2 text-sm font-mono rounded-md transition-colors duration-200 group"
                style={{ color: "rgba(148,163,184,0.8)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#00d4ff" }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(148,163,184,0.8)" }}
              >
                {item.name}
                <span
                  className="absolute bottom-0 inset-x-3 h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                  style={{ background: "linear-gradient(90deg, #00d4ff, #00ff88)" }}
                />
              </motion.button>
            ))}

            <div className="w-px h-5 mx-2" style={{ background: "rgba(0,212,255,0.15)" }} />

            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              href="mailto:piyushmodgil9@gmail.com"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all duration-300"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "#00d4ff",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background  = "rgba(0,212,255,0.16)"
                e.currentTarget.style.boxShadow   = "0 0 20px rgba(0,212,255,0.25)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background  = "rgba(0,212,255,0.08)"
                e.currentTarget.style.boxShadow   = "none"
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              Hire me
            </motion.a>
          </motion.div>

          {/* mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md"
            style={{ color: "#00d4ff" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden"
          style={{ background: "rgba(2,8,23,0.97)", borderBottom: "1px solid rgba(0,212,255,0.1)" }}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.name}
                onClick={() => scrollTo(item.href)}
                className="text-left px-4 py-3 text-sm font-mono rounded-lg transition-colors duration-200"
                style={{ color: "rgba(148,163,184,0.8)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#00d4ff"; e.currentTarget.style.background = "rgba(0,212,255,0.05)" }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(148,163,184,0.8)"; e.currentTarget.style.background = "transparent" }}
              >
                <span style={{ color: "#00ff88" }}>$ </span>{item.name}
              </button>
            ))}
          </div>
        </motion.div>
      </nav>
    </>
  )
}
