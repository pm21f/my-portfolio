"use client"

import { motion } from "framer-motion"
import { Cpu, Users, GraduationCap } from "lucide-react"

const facts = [
  { label: "Role",          value: "DevOps Engineer",         color: "#00d4ff" },
  { label: "Company",       value: "Nogiz",                   color: "#00ff88" },
  { label: "Stack",         value: "AWS · K8s · Terraform",   color: "#f59e0b" },
  { label: "Languages",     value: "Go · Python · Bash",      color: "#7c3aed" },
  { label: "Graduating",    value: "B.Tech CSE — 2026",       color: "#a78bfa" },
  { label: "Based in",      value: "Una, HP, India",          color: "#00d4ff" },
]

export default function About() {
  return (
    <section id="about" className="py-32 relative z-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* section tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-px w-8" style={{ background: "rgba(0,212,255,0.4)" }} />
          <span className="section-tag">01 — About</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: bio ── */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="display-text-sm text-white mb-8"
            >
              Building infra<br />
              <span className="text-gradient-cyan">that scales.</span>
            </motion.h2>

            {[
              "Final-year Computer Science Engineering student (Class of 2026) and DevOps Engineer at Nogiz. I specialise in architecting scalable AWS infrastructure and automating everything with Terraform and Go.",
              "My focus is on bridging the gap between code and production — building CI/CD pipelines, container orchestration with Kubernetes, and monitoring stacks that give teams confidence in their deployments.",
              "Beyond work, I lead the VECTOR Student Club as Cloud Lead, where I run workshops on cloud architecture and help students build real-world infrastructure projects.",
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="text-sm font-mono leading-relaxed mb-5"
                style={{ color: "#4a5568" }}
              >
                {para}
              </motion.p>
            ))}

            {/* callout quote */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 p-5 rounded-xl"
              style={{
                background: "rgba(0,212,255,0.04)",
                borderLeft: "3px solid #00d4ff",
              }}
            >
              <p className="text-sm font-mono italic" style={{ color: "#94a3b8" }}>
                &ldquo;I lead technical strategy and architecture decisions while continuously learning
                new technologies to enhance product and team capabilities.&rdquo;
              </p>
            </motion.div>
          </div>

          {/* ── RIGHT: quick facts + cards ── */}
          <div className="space-y-6">

            {/* fact grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl p-6"
              style={{ background: "rgba(8,18,35,0.7)", border: "1px solid rgba(0,212,255,0.1)" }}
            >
              <div className="text-xs font-mono mb-4" style={{ color: "rgba(0,212,255,0.4)" }}>
                $ cat /etc/profile.json
              </div>
              <div className="space-y-3">
                {facts.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + i * 0.06 }}
                    className="flex items-center justify-between py-1.5"
                    style={{ borderBottom: "1px solid rgba(0,212,255,0.04)" }}
                  >
                    <span className="text-xs font-mono" style={{ color: "#334155" }}>
                      {f.label}
                    </span>
                    <span className="text-xs font-mono font-semibold" style={{ color: f.color }}>
                      {f.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* leadership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="rounded-2xl p-6 space-y-5"
              style={{ background: "rgba(8,18,35,0.7)", border: "1px solid rgba(0,212,255,0.08)" }}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" style={{ color: "#7c3aed" }} />
                <h4 className="font-mono text-sm font-bold" style={{ color: "#e2e8f0" }}>
                  Leadership
                </h4>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#00ff88", marginTop: "6px" }} />
                <div>
                  <div className="font-mono text-sm font-semibold" style={{ color: "#e2e8f0" }}>VECTOR Student Club</div>
                  <div className="font-mono text-xs mt-0.5" style={{ color: "#4a5568" }}>
                    Cloud Lead — managing infrastructure workshops and software community.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#f59e0b", marginTop: "6px" }} />
                <div>
                  <div className="flex items-center gap-2 font-mono text-sm font-semibold" style={{ color: "#e2e8f0" }}>
                    Edge Computing
                    <Cpu className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
                  </div>
                  <div className="font-mono text-xs mt-0.5" style={{ color: "#4a5568" }}>
                    Wi-Fi robotics and autonomous sensor arrays with ESP32.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="rounded-2xl p-6"
              style={{ background: "rgba(8,18,35,0.7)", border: "1px solid rgba(0,212,255,0.08)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="w-4 h-4" style={{ color: "#f59e0b" }} />
                <h4 className="font-mono text-sm font-bold" style={{ color: "#e2e8f0" }}>Education</h4>
              </div>
              <div className="font-mono text-sm font-semibold mb-1" style={{ color: "#e2e8f0" }}>
                B.Tech in Computer Science &amp; Engineering
              </div>
              <div className="font-mono text-xs" style={{ color: "#4a5568" }}>
                Sant Baba Bhag Singh University
              </div>
              <div className="font-mono text-xs mt-2" style={{ color: "#00d4ff" }}>
                2022 – 2026 &nbsp;·&nbsp;
                <span style={{ color: "#00ff88" }}>Graduating 2026</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
