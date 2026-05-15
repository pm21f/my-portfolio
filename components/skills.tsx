"use client"

import { motion } from "framer-motion"

const categories = [
  {
    id: "cloud",
    title: "Cloud & Infra",
    color: "#f59e0b",
    skills: ["AWS EC2", "Lambda", "S3", "VPC", "IAM", "CloudWatch", "EKS", "Route 53"],
  },
  {
    id: "iac",
    title: "IaC & CI/CD",
    color: "#7c3aed",
    skills: ["Terraform", "Docker", "Kubernetes", "Helm", "GitHub Actions", "Jenkins", "Ansible"],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    color: "#00ff88",
    skills: ["Go (Gin/Echo)", "Python", "Django", "REST", "gRPC", "WebSockets", "Microservices"],
  },
  {
    id: "data",
    title: "Databases",
    color: "#00d4ff",
    skills: ["PostgreSQL", "DynamoDB", "Redis", "AWS S3", "MongoDB", "SQL"],
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show:   { opacity: 1, scale: 1,   y: 0,  transition: { duration: 0.35 } },
}

export default function Skills() {
  return (
    <section id="skills" className="py-32 relative z-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-px w-8" style={{ background: "rgba(0,212,255,0.4)" }} />
          <span className="section-tag">03 — Skills & Stack</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="display-text-sm text-white mb-3">
            Tech<span className="text-gradient-cyan"> Stack</span>
          </h2>
          <p className="text-sm font-mono max-w-md" style={{ color: "#4a5568" }}>
            Tools and technologies I use to build, deploy, and maintain production infrastructure.
          </p>
        </motion.div>

        {/* 2×2 category grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, catIdx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              className="rounded-2xl p-6"
              style={{ background: "rgba(8,18,35,0.7)", border: `1px solid ${cat.color}18` }}
            >
              {/* category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-6 rounded-full" style={{ background: cat.color, boxShadow: `0 0 12px ${cat.color}` }} />
                <h3 className="font-mono font-bold text-sm" style={{ color: cat.color }}>
                  {cat.title}
                </h3>
              </div>

              {/* pills */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {cat.skills.map(skill => (
                  <motion.span
                    key={skill}
                    variants={itemVariants}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium cursor-default transition-shadow duration-200"
                    style={{
                      background: `${cat.color}0d`,
                      border: `1px solid ${cat.color}28`,
                      color: cat.color,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = `0 0 18px ${cat.color}30`
                      e.currentTarget.style.borderColor = `${cat.color}60`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.borderColor = `${cat.color}28`
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* bottom bar — big floating tech names */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 overflow-hidden py-4"
          style={{ borderTop: "1px solid rgba(0,212,255,0.07)", borderBottom: "1px solid rgba(0,212,255,0.07)" }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            className="flex gap-10 whitespace-nowrap"
          >
            {["AWS", "Kubernetes", "Terraform", "Docker", "Go", "Python", "PostgreSQL", "Redis", "Linux", "CI/CD",
              "AWS", "Kubernetes", "Terraform", "Docker", "Go", "Python", "PostgreSQL", "Redis", "Linux", "CI/CD"].map((t, i) => (
              <span key={i} className="font-mono font-bold text-sm" style={{ color: "rgba(0,212,255,0.12)" }}>
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
