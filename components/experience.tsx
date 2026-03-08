"use client"

import { motion } from "framer-motion"
import { GitCommit, CheckCircle2, CircleDashed, Terminal, ArrowRight } from "lucide-react"

const experiences = [
  {
    id: "deploy-prod-4",
    status: "IN_PROGRESS",
    role: "Cloud Engineer",
    company: "CoderRoots",
    period: "Dec 2025 – Present",
    location: "Mohali",
    logs: [
      "Configuring AWS infrastructure and serverless architectures.",
      "Optimizing cloud resource allocation for cost-efficiency.",
      "Developing and maintaining CI/CD pipelines for automated deployments.",
    ],
  },
  {
    id: "deploy-prod-3",
    status: "SUCCESS",
    role: "Cloud Computing Intern",
    company: "CoderRoots",
    period: "June 2025 – Aug 2025",
    location: "Mohali",
    logs: [
      "Assisted in deploying and monitoring scalable cloud infrastructure.",
      "Gained hands-on experience with AWS core services and infrastructure as code.",
      "Collaborated with senior engineers to troubleshoot and streamline deployment pipelines.",
    ],
  },
  {
    id: "deploy-prod-2",
    status: "SUCCESS",
    role: "Linux / CCNA Intern",
    company: "Think Next Tech",
    period: "June 2024 – Aug 2024",
    location: "Mohali",
    logs: [
      "Executed shell scripting and fundamental Linux system administration.",
      "Architected networking solutions covering IP routing, subnetting, and OSI layers.",
      "Simulated complex enterprise networks using Cisco Packet Tracer.",
    ],
  },
  {
    id: "deploy-prod-1",
    status: "SUCCESS",
    role: "Java Developer Intern",
    company: "Excellence Tech",
    period: "June 2023 – Aug 2023",
    location: "Mohali",
    logs: [
      "Built Spring Boot applications with secure authentication modules.",
      "Engineered user-friendly REST APIs and scalable backend services.",
      "Implemented Servlet/JSP for analytics-based performance improvements.",
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative z-10">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Section Header */}
        <div className="flex items-center mb-12 font-mono text-xl md:text-2xl text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-4">
          <Terminal className="mr-3 text-[var(--sky-blue)]" />
          <span className="text-[var(--term-green)] mr-2">$</span> 
          <span>kubectl get deployments --namespace=career</span>
        </div>

        {/* Pipeline Container */}
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 space-y-12">
          
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Node */}
              <div className="absolute -left-[17px] top-1 bg-white dark:bg-slate-900 p-1">
                {exp.status === "SUCCESS" ? (
                  <CheckCircle2 className="h-6 w-6 text-[var(--term-green)] bg-white dark:bg-slate-900 rounded-full" />
                ) : (
                  <CircleDashed className="h-6 w-6 text-[var(--aws-amber)] animate-spin-slow bg-white dark:bg-slate-900 rounded-full" />
                )}
              </div>

              {/* Experience Card (Log Window format) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-lg transition-all hover:border-[var(--sky-blue)]/50 dark:hover:border-[var(--sky-blue)]/50">
                
                {/* Log Header */}
                <div className="flex flex-wrap items-center justify-between bg-slate-50 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 font-mono text-xs md:text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 dark:text-slate-400">commit: <span className="text-[var(--sky-blue)]">{exp.id}</span></span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-2 md:mt-0">
                    {exp.period} | {exp.location}
                  </div>
                </div>

                {/* Log Body */}
                <div className="p-5 font-mono">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center mb-1">
                    {exp.role} 
                    <ArrowRight className="h-4 w-4 mx-2 text-slate-400" /> 
                    <span className="text-[var(--tf-purple)]">{exp.company}</span>
                  </h3>
                  
                  <div className="mt-4 space-y-2">
                    {exp.logs.map((log, idx) => (
                      <div key={idx} className="flex items-start text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-[var(--term-green)] mr-2 mt-0.5">{">"}</span>
                        <p>{log}</p>
                      </div>
                    ))}
                  </div>

                  {/* Status Badge */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center text-xs">
                    <span className="text-slate-500 mr-2">Status:</span>
                    <span className={`px-2 py-0.5 rounded ${
                      exp.status === "SUCCESS" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-[var(--term-green)]" 
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-[var(--aws-amber)]"
                    }`}>
                      {exp.status}
                    </span>
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