"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ArrowRight, Github, Linkedin, Mail, MapPin } from "lucide-react"

/* ── helpers ── */
function useTyping(text: string, startDelay = 0, speed = 48) {
  const [displayed, setDisplayed] = useState("")
  useEffect(() => {
    let i = 0
    const t = setTimeout(() => {
      const id = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(id)
      }, speed)
      return () => clearInterval(id)
    }, startDelay)
    return () => clearTimeout(t)
  }, [text, startDelay, speed])
  return displayed
}

function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const steps = 60
    const inc = to / steps
    const id = setTimeout(() => {
      const interval = setInterval(() => {
        start += inc
        if (start >= to) { setN(to); clearInterval(interval) }
        else setN(Math.floor(start))
      }, 18)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(id)
  }, [inView, to, delay])
  return <span ref={ref}>{n}</span>
}

/* ── word slide-up (gradient on the text element itself) ── */
function BigWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <div style={{ overflow: "hidden", lineHeight: 1.05 }}>
      <motion.span
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%",   opacity: 1 }}
        transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "inline-block",
          willChange: "transform",
          background: "linear-gradient(135deg, #ffffff 0%, #00d4ff 50%, #00ff88 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {word}
      </motion.span>
    </div>
  )
}

/* ── system status items ── */
const statusItems = [
  { label: "AWS", status: "ONLINE",   color: "#f59e0b", delay: 2.2 },
  { label: "Kubernetes", status: "HEALTHY",  color: "#00d4ff", delay: 2.4 },
  { label: "Terraform",  status: "ACTIVE",   color: "#7c3aed", delay: 2.6 },
  { label: "Go runtime", status: "RUNNING",  color: "#00ff88", delay: 2.8 },
  { label: "CI/CD",      status: "PASSING",  color: "#00ff88", delay: 3.0 },
]

export default function Hero() {
  const role = useTyping("DevOps Engineer @ Nogiz", 1800, 52)
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 520)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center px-6 pt-20 pb-12 overflow-hidden"
    >
      {/* ambient blobs */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT ── */}
        <div>
          {/* availability badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-mono"
            style={{
              background: "rgba(0,255,136,0.07)",
              border: "1px solid rgba(0,255,136,0.25)",
              color: "#00ff88",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ boxShadow: "0 0 6px #00ff88", animation: "pulse-dot 2s ease-in-out infinite" }} />
            Available for DevOps roles
          </motion.div>

          {/* name */}
          <div className="display-text mb-4 select-none">
            <BigWord word="PIYUSH" delay={0.1} />
            <BigWord word="MODGIL" delay={0.45} />
          </div>

          {/* role typing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="text-lg md:text-xl font-mono mb-2"
            style={{ color: "#00d4ff" }}
          >
            {role}
            <span style={{ opacity: cursor ? 1 : 0, color: "#00ff88" }}>|</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
            className="text-sm font-mono mb-10 max-w-md"
            style={{ color: "#4a5568" }}
          >
            <MapPin className="inline w-3.5 h-3.5 mr-1" style={{ color: "#f59e0b" }} />
            Una, Himachal Pradesh, India
          </motion.p>

          {/* stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
            className="flex gap-8 mb-10"
          >
            {[
              { label: "Years Exp",      val: 2,  suffix: "+", color: "#00d4ff" },
              { label: "Projects Built", val: 4,  suffix: "+", color: "#00ff88" },
              { label: "Certifications", val: 3,  suffix: "",  color: "#f59e0b" },
            ].map((s, i) => (
              <div key={s.label}>
                <div className="text-3xl font-bold" style={{ color: s.color }}>
                  <CountUp to={s.val} delay={i * 150} />{s.suffix}
                </div>
                <div className="text-xs font-mono mt-0.5" style={{ color: "#4a5568" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="mailto:piyushmodgil9@gmail.com"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-mono font-semibold transition-all duration-300"
              style={{ background: "#00d4ff", color: "#020817" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(0,212,255,0.5)"; e.currentTarget.style.background = "#22e0ff" }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#00d4ff" }}
            >
              <Mail className="w-4 h-4" />
              Get in touch
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="https://linkedin.com/in/piyushmodgil"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-mono font-semibold transition-all duration-300"
              style={{ background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,212,255,0.14)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,255,0.2)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,212,255,0.07)"; e.currentTarget.style.boxShadow = "none" }}
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>

            <a
              href="https://github.com/pm21f"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-mono font-semibold transition-all duration-300"
              style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.14)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(124,58,237,0.2)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.07)"; e.currentTarget.style.boxShadow = "none" }}
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </motion.div>
        </div>

        {/* ── RIGHT — system status panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* outer glow ring */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: "0 0 80px rgba(0,212,255,0.08), inset 0 0 80px rgba(0,212,255,0.03)" }} />

          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(4,10,24,0.9)", border: "1px solid rgba(0,212,255,0.15)", backdropFilter: "blur(16px)" }}>

            {/* panel title bar */}
            <div className="flex items-center justify-between px-5 py-3"
              style={{ background: "rgba(2,6,18,0.8)", borderBottom: "1px solid rgba(0,212,255,0.08)" }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <span className="font-mono text-xs" style={{ color: "rgba(0,212,255,0.4)" }}>
                system_status.sh
              </span>
              <span className="font-mono text-xs dot-live" style={{ color: "#00ff88" }}>live</span>
            </div>

            {/* terminal lines */}
            <div className="p-6 font-mono text-sm space-y-3">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
                className="text-xs mb-4" style={{ color: "rgba(0,212,255,0.35)" }}>
                {`$ kubectl get nodes --all-namespaces`}
              </motion.div>

              {statusItems.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay, duration: 0.4 }}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg"
                  style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${item.color}15` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                    <span style={{ color: "#94a3b8" }}>{item.label}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: item.color }}>
                    {item.status}
                  </span>
                </motion.div>
              ))}

              {/* blinking prompt */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
                className="flex items-center gap-2 pt-3 text-xs"
                style={{ borderTop: "1px solid rgba(0,212,255,0.06)" }}
              >
                <span style={{ color: "#00ff88" }}>piyush@nogiz:~$</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  className="inline-block w-2 h-4"
                  style={{ background: "#00d4ff", boxShadow: "0 0 8px rgba(0,212,255,0.8)" }}
                />
              </motion.div>
            </div>

            {/* bottom strip — tech count */}
            <div className="px-5 py-3 flex items-center justify-between text-xs font-mono"
              style={{ background: "rgba(2,6,18,0.6)", borderTop: "1px solid rgba(0,212,255,0.06)" }}>
              <span style={{ color: "#4a5568" }}>stack: 8 technologies</span>
              <span style={{ color: "rgba(0,212,255,0.4)" }}>uptime: 100%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono" style={{ color: "rgba(0,212,255,0.3)" }}>scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, rgba(0,212,255,0.4), transparent)" }}
        />
      </motion.div>
    </section>
  )
}
