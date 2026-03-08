"use client"

import { motion } from "framer-motion"
import { Activity, Server, Database, Globe, Cpu, Terminal } from "lucide-react"

const projects = [
  {
    id: "i-09a8b7c6d5e4f32",
    name: "Vigilance AI",
    type: "Serverless Engine",
    status: "HEALTHY",
    region: "us-east-1",
    description: "A serverless market perception engine architected with AWS and provisioned entirely via Terraform.",
    tech: ["AWS", "Terraform", "Serverless"],
    metrics: { uptime: "99.99%", latency: "42ms" },
    icon: <Globe className="w-5 h-5 text-[var(--aws-amber)]" />
  },
  {
    id: "i-0a1b2c3d4e5f678",
    name: "Real-Time Comm Engine",
    type: "WebSocket Backend",
    status: "HEALTHY",
    region: "ap-south-1",
    description: "High-concurrency backend infrastructure for a WhatsApp clone, managing real-time messaging and state.",
    tech: ["Golang", "PostgreSQL", "WebSockets"],
    metrics: { uptime: "99.95%", latency: "12ms" },
    icon: <Activity className="w-5 h-5 text-[var(--go-cyan)]" />
  },
  {
    id: "i-0f9e8d7c6b5a432",
    name: "Restaurant Core API",
    type: "Monolith Service",
    status: "HEALTHY",
    region: "eu-central-1",
    description: "Robust backend ordering platform managing transactions, menu states, and delivery routing.",
    tech: ["Django", "Python", "REST API"],
    metrics: { uptime: "99.9%", latency: "85ms" },
    icon: <Database className="w-5 h-5 text-[var(--tf-purple)]" />
  },
  {
    id: "i-0123456789abcde",
    name: "IoT Edge Node (VECTOR)",
    type: "Hardware Prototype",
    status: "ONLINE",
    region: "edge-device",
    description: "Wi-Fi controlled autonomous robotics platform utilizing ESP32 microcontrollers and ultrasonic sensors.",
    tech: ["ESP32", "C++", "Hardware"],
    metrics: { uptime: "98.5%", latency: "5ms" },
    icon: <Cpu className="w-5 h-5 text-green-500" />
  }
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Section Header */}
        <div className="flex items-center mb-10 font-mono text-xl md:text-2xl text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-4">
          <Server className="mr-3 text-[var(--aws-amber)]" />
          <span className="text-green-600 dark:text-green-500 mr-2">$</span> 
          <span>aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"</span>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg hover:border-sky-500/50 dark:hover:border-[var(--go-cyan)]/50 transition-colors group"
            >
              {/* Instance Header */}
              <div className="flex justify-between items-center px-5 py-3 bg-gray-50 dark:bg-[#040814] border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  {project.icon}
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{project.name}</h3>
                    <div className="text-xs font-mono text-gray-500">{project.id} | {project.region}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded border border-green-200 dark:border-green-800/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-mono text-green-700 dark:text-green-400 font-bold tracking-wider">{project.status}</span>
                </div>
              </div>

              {/* Instance Body */}
              <div className="p-5">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed font-mono">
                  {project.description}
                </p>

                {/* Metrics Mockup */}
                <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 dark:bg-[#111827] rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="text-center w-1/2 border-r border-gray-200 dark:border-gray-700">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider mb-1">Uptime</div>
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{project.metrics.uptime}</div>
                  </div>
                  <div className="text-center w-1/2">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider mb-1">Avg Latency</div>
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{project.metrics.latency}</div>
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((t, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-1 bg-gray-100 dark:bg-[#1f2937] text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}