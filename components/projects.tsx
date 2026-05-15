"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Github } from "lucide-react"

const projects = [
  {
    num: "01",
    name: "Vigilance AI",
    type: "Serverless Engine",
    region: "us-east-1",
    status: "HEALTHY",
    description:
      "A serverless market-perception engine built entirely on AWS and provisioned via Terraform. Real-time data ingestion using Lambda + SQS pipeline with DynamoDB persistence.",
    tech: ["AWS Lambda", "Terraform", "SQS", "DynamoDB", "CloudWatch"],
    metrics: [
      { label: "Uptime",   val: "99.99%" },
      { label: "Latency",  val: "42 ms"  },
      { label: "Cost/mo",  val: "$0.003" },
    ],
    color: "#f59e0b",
    github: "https://github.com/pm21f",
  },
  {
    num: "02",
    name: "Real-Time Comm Engine",
    type: "WebSocket Backend",
    region: "ap-south-1",
    status: "HEALTHY",
    description:
      "High-concurrency messaging backend for a WhatsApp-like platform. Handles real-time presence, message routing, and persistent storage with sub-20 ms delivery.",
    tech: ["Golang", "Gin", "WebSockets", "PostgreSQL", "Redis"],
    metrics: [
      { label: "Uptime",        val: "99.95%" },
      { label: "Msg latency",   val: "12 ms"  },
      { label: "Concurrent",    val: "10 k+"  },
    ],
    color: "#00d4ff",
    github: "https://github.com/pm21f",
  },
  {
    num: "03",
    name: "Restaurant Core API",
    type: "Monolith Service",
    region: "eu-central-1",
    status: "HEALTHY",
    description:
      "Full-featured ordering platform built with Django REST framework — managing transactions, menu state, and delivery routing with Postgres as the source of truth.",
    tech: ["Django", "Python", "REST API", "PostgreSQL", "Celery"],
    metrics: [
      { label: "Uptime",   val: "99.9%" },
      { label: "Latency",  val: "85 ms" },
      { label: "APIs",     val: "32"    },
    ],
    color: "#7c3aed",
    github: "https://github.com/pm21f",
  },
  {
    num: "04",
    name: "IoT Edge Node · VECTOR",
    type: "Hardware Prototype",
    region: "edge-device",
    status: "ONLINE",
    description:
      "Wi-Fi controlled autonomous robotics platform on ESP32 microcontrollers. Ultrasonic sensor arrays enable real-time obstacle detection and autonomous navigation.",
    tech: ["ESP32", "C++", "Wi-Fi", "FreeRTOS", "Ultrasonic"],
    metrics: [
      { label: "Uptime",   val: "98.5%" },
      { label: "Latency",  val: "5 ms"  },
      { label: "Nodes",    val: "3"     },
    ],
    color: "#00ff88",
    github: "https://github.com/pm21f",
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative z-10">
      <div className="max-w-5xl mx-auto px-6">

        {/* header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-px w-8" style={{ background: "rgba(0,212,255,0.4)" }} />
          <span className="section-tag">04 — Projects</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="display-text-sm text-white mb-16"
        >
          Selected<span className="text-gradient-cyan"> Work</span>
        </motion.h2>

        <div className="space-y-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-2xl overflow-hidden transition-all duration-400"
              style={{
                background: "rgba(8,18,35,0.75)",
                border: "1px solid rgba(0,212,255,0.08)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${p.color}35`
                e.currentTarget.style.boxShadow   = `0 0 50px ${p.color}08, 0 20px 50px rgba(0,0,0,0.3)`
                e.currentTarget.style.transform   = "translateY(-2px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.08)"
                e.currentTarget.style.boxShadow   = "none"
                e.currentTarget.style.transform   = "translateY(0)"
              }}
            >
              {/* left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background: p.color, boxShadow: `0 0 16px ${p.color}` }}
              />

              <div className="pl-8 pr-6 py-7 flex flex-col md:flex-row md:items-start gap-6">

                {/* project number */}
                <div
                  className="font-mono text-5xl font-bold shrink-0 leading-none select-none"
                  style={{ color: `${p.color}18` }}
                >
                  {p.num}
                </div>

                {/* main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>{p.name}</h3>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{ background: `${p.color}12`, border: `1px solid ${p.color}28`, color: p.color }}
                    >
                      {p.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#334155" }}>
                      {p.region}
                    </span>

                    {/* live status */}
                    <span
                      className="flex items-center gap-1.5 text-xs font-mono ml-auto"
                      style={{ color: p.color }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: p.color, boxShadow: `0 0 6px ${p.color}`, animation: "pulse-dot 2s ease-in-out infinite" }}
                      />
                      {p.status}
                    </span>
                  </div>

                  <p className="text-sm font-mono mb-5 leading-relaxed" style={{ color: "#4a5568" }}>
                    {p.description}
                  </p>

                  {/* metrics strip */}
                  <div className="flex flex-wrap gap-4 mb-5">
                    {p.metrics.map(m => (
                      <div key={m.label}>
                        <div className="text-xs font-mono uppercase tracking-wider mb-0.5" style={{ color: "#334155" }}>
                          {m.label}
                        </div>
                        <div className="text-sm font-bold font-mono" style={{ color: p.color }}>{m.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* tech + links row */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {p.tech.map(t => (
                        <span
                          key={t}
                          className="text-xs font-mono px-2.5 py-1 rounded-lg"
                          style={{
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(0,212,255,0.1)",
                            color: "#4a5568",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <a
                        href={p.github}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono transition-colors duration-200"
                        style={{ color: "#334155" }}
                        onMouseEnter={e => { e.currentTarget.style.color = p.color }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#334155" }}
                      >
                        <Github className="w-3.5 h-3.5" />
                        Source
                      </a>
                      <a
                        href={p.github}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-mono transition-colors duration-200"
                        style={{ color: "#334155" }}
                        onMouseEnter={e => { e.currentTarget.style.color = p.color }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#334155" }}
                      >
                        Details
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
