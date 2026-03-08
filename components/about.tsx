"use client"

import { motion } from "framer-motion"
import { GraduationCap, FileText, Code2, Users, Cpu } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-24 relative z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Section Header - Clean & Professional */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            About Me
          </h2>
          <div className="w-16 h-1.5 bg-[var(--sky-blue)] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: The Markdown Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-lg"
          >
            {/* Editor Tab Bar */}
            <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-4 overflow-x-auto">
              <div className="flex items-center space-x-2 text-sm font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-t-md border-t border-x border-slate-200 dark:border-slate-800 -mb-[9px] z-10">
                <FileText className="w-3 h-3 text-[var(--sky-blue)]" />
                <span>README.md</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-mono text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer px-3 py-1.5">
                <Code2 className="w-3 h-3 text-[var(--tf-purple)]" />
                <span>profile.go</span>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="p-6 md:p-8 font-sans text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                  Hello, World! 👋
                </h1>
                <p>
                 Final-year Computer Science Engineering student (Class of 2026) and active Cloud Engineer at CoderRoots. Specializing in architecting scalable AWS infrastructure and high-concurrency backend systems using Go. As the Cloud Lead for the VECTOR Student Club, I lead technical strategy to bridge the gap between robust software architecture and hardware prototyping.
                </p>
              </div>

              <p>
              As a Cloud Engineer with a focus on DevOps and AWS, I leverage Terraform and Go to build and automate production-grade infrastructure. My professional focus involves optimizing cloud resource allocation for maximum efficiency and architecting robust microservices that drive modern applications. Beyond software, I lead technical initiatives for the VECTOR Club, bridging the gap between high-level cloud architecture and hardware prototyping.
              </p>

              <p>
               
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/50 border-l-4 border-[var(--sky-blue)] p-4 rounded-r-lg italic text-slate-600 dark:text-slate-400">
                "I lead technical strategy and architecture decisions while continuously learning new technologies to enhance product offerings and team capabilities."
              </div>
            </div>
          </motion.div>

          {/* Right Column: System Specs / Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-4 flex flex-col space-y-6"
          >
            {/* Education Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="flex items-center text-lg font-bold text-slate-900 dark:text-white mb-4 font-mono">
                <GraduationCap className="w-5 h-5 mr-2 text-[var(--aws-amber)]" />
                Runtime Env
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">B.Tech in Computer Science</div>
                  <div className="text-xs text-slate-500 mt-1">Sant Baba Bhag Singh University</div>
                  <div className="text-[10px] font-mono text-[var(--sky-blue)] mt-2 uppercase tracking-wider">Status: Executing (Exp. 2026)</div>
                </div>
              </div>
            </div>

            {/* Leadership & Hardware Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="flex items-center text-lg font-bold text-slate-900 dark:text-white mb-4 font-mono">
                <Users className="w-5 h-5 mr-2 text-[var(--tf-purple)]" />
                Active Threads
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[var(--term-green)] mr-2 mt-1">{">"}</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">VECTOR Student Club</div>
                    <div className="text-xs text-slate-500 mt-1">Cloud Lead, managing cloud infrastructure and fostering a community of software development.</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--term-green)] mr-2 mt-1">{">"}</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center">
                      Edge Computing <Cpu className="w-3 h-3 ml-1.5 text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Integrating Wi-Fi robotics and autonomous sensor arrays.</div>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}