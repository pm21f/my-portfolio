"use client"

import { motion } from "framer-motion"
import { Award, FileBadge } from "lucide-react"

const auditLogs = [
  {
    eventId: "EVT-2025-10A",
    timestamp: "Oct 2025",
    type: "COMPETITION_WIN",
    issuer: "Maharaja Agrasen College",
    title: "Hackathon Winner: Project Supertech",
    status: "VERIFIED",
    description: "Secured top position for innovative technical implementation and problem-solving.",
    color: "text-[var(--sky-blue)]",
    bg: "bg-[var(--sky-blue)]/10"
  },
  {
    eventId: "EVT-2025-10B",
    timestamp: "Oct 2025",
    type: "COMPETITION_WIN",
    issuer: "Maharaja Agrasen College",
    title: "Hackathon Winner: Project Prayas",
    status: "VERIFIED",
    description: "Awarded for outstanding prototype and system architecture design.",
    color: "text-[var(--tf-purple)]",
    bg: "bg-[var(--tf-purple)]/10"
  },
  {
    eventId: "SEC-2023-05X",
    timestamp: "May 2023",
    type: "CERTIFICATION",
    issuer: "Amazon Web Services",
    title: "AWS Certified Solutions Architect",
    status: "ACTIVE",
    description: "Validated expertise in designing distributed applications and systems on the AWS platform.",
    color: "text-[var(--aws-amber)]",
    bg: "bg-[var(--aws-amber)]/10"
  },
  {
    eventId: "SEC-2023-01Y",
    timestamp: "Jan 2023",
    type: "CERTIFICATION",
    issuer: "HashiCorp",
    title: "Terraform Associate",
    status: "ACTIVE",
    description: "Certified competency in infrastructure as code (IaC) concepts and HashiCorp tools.",
    color: "text-slate-500",
    bg: "bg-slate-800/50"
  }
]

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 relative z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Section Header - Clean & Professional */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Certifications & Audits
          </h2>
          <div className="w-16 h-1.5 bg-[var(--tf-purple)] rounded-full"></div>
        </div>

        {/* Audit Log Table Wrapper */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl">
          
          {/* Table Header (Desktop only) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-2">Event ID</div>
            <div className="col-span-5">Details</div>
            <div className="col-span-3 text-right">Status</div>
          </div>

          {/* Log Entries */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {auditLogs.map((log, index) => (
              <motion.div
                key={log.eventId}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center">
                  
                  {/* Timestamp & Type (Mobile + Desktop) */}
                  <div className="md:col-span-2 flex flex-row md:flex-col justify-between md:justify-start">
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{log.timestamp}</span>
                    <span className={`md:hidden px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${log.bg} ${log.color}`}>
                      {log.status}
                    </span>
                  </div>

                  {/* Event ID */}
                  <div className="md:col-span-2 font-mono text-xs text-slate-400 hidden md:block">
                    {log.eventId}
                  </div>

                  {/* Details */}
                  <div className="md:col-span-5">
                    <div className="flex items-center space-x-2 mb-1">
                      {log.type === "CERTIFICATION" ? <FileBadge className="w-4 h-4 text-slate-400" /> : <Award className="w-4 h-4 text-[var(--aws-amber)]" />}
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{log.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mb-1">Issuer: {log.issuer}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2 md:mt-1">
                      {log.description}
                    </p>
                  </div>

                  {/* Status (Desktop only) */}
                  <div className="md:col-span-3 text-right hidden md:flex justify-end items-center">
                    <div className={`px-3 py-1 rounded border border-current text-[11px] font-mono font-bold tracking-wider ${log.color} ${log.bg}`}>
                      [ {log.status} ]
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
          
          {/* EOF Indicator */}
          <div className="px-6 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500">
            EOF - Log parsing complete.
          </div>
        </div>

      </div>
    </section>
  )
}