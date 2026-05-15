"use client"

import { motion } from "framer-motion"
import { Trophy, ShieldCheck, FileBadge, Award } from "lucide-react"

const items = [
  {
    icon: Trophy,
    title: "Hackathon Winner — Project Supertech",
    issuer: "Maharaja Agrasen College",
    date: "Oct 2025",
    status: "VERIFIED",
    color: "#00d4ff",
  },
  {
    icon: Award,
    title: "Hackathon Winner — Project Prayas",
    issuer: "Maharaja Agrasen College",
    date: "Oct 2025",
    status: "VERIFIED",
    color: "#7c3aed",
  },
  {
    icon: ShieldCheck,
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "May 2023",
    status: "ACTIVE",
    color: "#f59e0b",
  },
  {
    icon: FileBadge,
    title: "HashiCorp Terraform Associate",
    issuer: "HashiCorp",
    date: "Jan 2023",
    status: "ACTIVE",
    color: "#00ff88",
  },
]

export default function Achievements() {
  return (
    <section id="achievements" className="py-32 relative z-10">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-px w-8" style={{ background: "rgba(0,212,255,0.4)" }} />
          <span className="section-tag">05 — Achievements</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="display-text-sm text-white mb-16"
        >
          Certs &amp;<span className="text-gradient-cyan"> Awards</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex items-start gap-4 p-5 rounded-2xl transition-all duration-300"
                style={{ background: "rgba(8,18,35,0.7)", border: `1px solid ${item.color}15` }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor  = `${item.color}40`
                  e.currentTarget.style.boxShadow    = `0 0 30px ${item.color}08`
                  e.currentTarget.style.transform    = "translateY(-2px)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor  = `${item.color}15`
                  e.currentTarget.style.boxShadow    = "none"
                  e.currentTarget.style.transform    = "translateY(0)"
                }}
              >
                <div
                  className="p-3 rounded-xl shrink-0"
                  style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-mono text-sm font-semibold leading-snug" style={{ color: "#e2e8f0" }}>
                      {item.title}
                    </h4>
                    <span
                      className="shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded"
                      style={{
                        background: `${item.color}10`,
                        border: `1px solid ${item.color}28`,
                        color: item.color,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs font-mono" style={{ color: "#334155" }}>
                    <span>{item.issuer}</span>
                    <span>·</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
