"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const experiences = [
  {
    id: "EXP-05",
    company: "Nogiz",
    role: "DevOps Engineer",
    period: "May 2026 — Present",
    location: "Remote",
    status: "CURRENT",
    color: "#00d4ff",
    highlights: [
      "Architecting end-to-end DevOps pipelines for production-grade systems.",
      "Container orchestration with Kubernetes and full infra automation via Terraform.",
      "Building CI/CD workflows, monitoring stacks, and alerting for high-availability services.",
    ],
  },
  {
    id: "EXP-04",
    company: "CoderRoots",
    role: "Cloud Engineer",
    period: "Dec 2025 — Apr 2026",
    location: "Mohali",
    status: "COMPLETED",
    color: "#f59e0b",
    highlights: [
      "Configured AWS infrastructure: Lambda, EC2, VPC, S3, IAM, CloudWatch.",
      "Optimised cloud resource allocation — measurable cost reduction across services.",
      "Built and maintained CI/CD pipelines for zero-downtime automated deployments.",
    ],
  },
  {
    id: "EXP-03",
    company: "CoderRoots",
    role: "Cloud Computing Intern",
    period: "Jun 2025 — Aug 2025",
    location: "Mohali",
    status: "COMPLETED",
    color: "#00ff88",
    highlights: [
      "Deployed and monitored scalable cloud infrastructure on AWS.",
      "Hands-on with core AWS services and infrastructure as code principles.",
      "Collaborated with senior engineers to streamline deployment pipelines.",
    ],
  },
  {
    id: "EXP-02",
    company: "Think Next Tech",
    role: "Linux / CCNA Intern",
    period: "Jun 2024 — Aug 2024",
    location: "Mohali",
    status: "COMPLETED",
    color: "#7c3aed",
    highlights: [
      "Shell scripting and Linux system administration tasks.",
      "IP routing, subnetting, and OSI-layer network design.",
      "Complex enterprise network simulation with Cisco Packet Tracer.",
    ],
  },
  {
    id: "EXP-01",
    company: "Excellence Tech",
    role: "Java Developer Intern",
    period: "Jun 2023 — Aug 2023",
    location: "Mohali",
    status: "COMPLETED",
    color: "#a78bfa",
    highlights: [
      "Spring Boot applications with secure authentication modules.",
      "REST API design and scalable backend service implementation.",
      "Servlet/JSP for analytics-driven performance improvements.",
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-32 relative z-10">
      <div className="max-w-5xl mx-auto px-6">

        {/* section header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-px w-8" style={{ background: "rgba(0,212,255,0.4)" }} />
          <span className="section-tag">02 — Experience</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="display-text-sm text-white mb-16"
        >
          Work<span className="text-gradient-cyan"> History</span>
        </motion.h2>

        {/* timeline */}
        <div className="relative">
          {/* vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, rgba(0,212,255,0.3), rgba(0,212,255,0.05))" }}
          />

          <div className="space-y-0">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                {/* timeline dot */}
                <div
                  className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full hidden md:block transition-all duration-300 group-hover:scale-150"
                  style={{
                    background: exp.color,
                    boxShadow: `0 0 10px ${exp.color}`,
                  }}
                />

                <div
                  className="md:pl-12 py-8 border-b transition-all duration-300 group-hover:pl-14"
                  style={{ borderColor: "rgba(0,212,255,0.06)" }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">

                    {/* left: company + role */}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3
                          className="text-2xl md:text-3xl font-bold tracking-tight"
                          style={{ color: exp.color }}
                        >
                          {exp.company}
                        </h3>
                        {exp.status === "CURRENT" && (
                          <span
                            className="flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(0,255,136,0.1)",
                              border: "1px solid rgba(0,255,136,0.3)",
                              color: "#00ff88",
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
                            Now
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm" style={{ color: "#94a3b8" }}>
                        <span style={{ color: "#e2e8f0" }}>{exp.role}</span>
                        <span style={{ color: "#334155" }}>·</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    {/* right: period + id */}
                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm" style={{ color: "rgba(0,212,255,0.6)" }}>
                        {exp.period}
                      </div>
                      <div className="font-mono text-xs mt-1" style={{ color: "#334155" }}>
                        {exp.id}
                      </div>
                    </div>
                  </div>

                  {/* highlights */}
                  <ul className="space-y-2">
                    {exp.highlights.map((h, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 + j * 0.05 }}
                        className="flex items-start gap-3 text-sm font-mono"
                        style={{ color: "#4a5568" }}
                      >
                        <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: exp.color, boxShadow: `0 0 6px ${exp.color}` }} />
                        <span style={{ transition: "color 0.2s" }} onMouseEnter={e => { (e.target as HTMLElement).style.color = "#94a3b8" }} onMouseLeave={e => { (e.target as HTMLElement).style.color = "#4a5568" }}>{h}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* education footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl"
          style={{ background: "rgba(8,18,35,0.6)", border: "1px solid rgba(0,212,255,0.08)" }}
        >
          <div>
            <div className="font-bold text-white text-lg">Sant Baba Bhag Singh University</div>
            <div className="text-sm font-mono mt-1" style={{ color: "#4a5568" }}>
              B.Tech Computer Science &amp; Engineering
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm" style={{ color: "#00d4ff" }}>2022 — 2026</div>
            <div className="flex items-center gap-1.5 text-xs font-mono mt-1" style={{ color: "#00ff88" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              Graduating 2026
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
