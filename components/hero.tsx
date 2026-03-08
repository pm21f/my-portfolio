"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, MapPin, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center pt-20 px-4 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        {/* Terminal Window Frame */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-xl">
          
          {/* Terminal Header */}
          <div className="flex items-center px-4 py-3 bg-gray-100/80 dark:bg-[#040814]/80 border-b border-gray-200 dark:border-gray-800">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/90 shadow-sm"></div>
            </div>
            <div className="mx-auto flex items-center text-xs text-gray-500 dark:text-gray-400 font-mono">
              <Terminal className="w-3 h-3 mr-2" />
              ssh piyush@coderroots-prod-server
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-8 font-mono text-sm md:text-base">
            
            {/* Boot Sequence Log */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 dark:text-gray-500 text-xs mb-6 select-none"
            >
              <div>[ OK ] Started System Logging Service.</div>
              <div>[ OK ] Reached target Network is Online.</div>
              <div>Authenticating user credentials... Success.</div>
              <div>Last login: Mon Mar 09 00:44:30 2026 from 192.168.1.1</div>
            </motion.div>

            {/* Command 1: whoami */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center text-gray-800 dark:text-gray-200 mb-2">
                <span className="text-green-600 dark:text-green-500 mr-2 font-bold">piyush@admin:~$</span> 
                <span className="text-sky-600 dark:text-[var(--go-cyan)]">whoami</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">
                Piyush Modgil
              </h1>
            </motion.div>

            {/* Command 2: cat profile.txt */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mb-6"
            >
              <div className="flex items-center text-gray-800 dark:text-gray-200 mb-2">
                <span className="text-green-600 dark:text-green-500 mr-2 font-bold">piyush@admin:~$</span> 
                <span className="text-sky-600 dark:text-[var(--go-cyan)]">cat profile.txt</span>
              </div>
              
              <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-800 mt-3 space-y-2">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="text-[var(--aws-amber)] font-semibold">Cloud Engineer</span> at CoderRoots | Open Source Contributor
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="text-[var(--tf-purple)]">Education:</span> B.Tech Computer Science & Engineering (Class of 2026)
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="text-[var(--go-cyan)]">Specialization:</span> Scalable Infrastructure, DevOps, & Backend (Go/Django)
                </p>
                <p className="text-gray-500 dark:text-gray-500 mt-2 flex items-center text-xs md:text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1.5" /> Una, Himachal Pradesh, India
                </p>
              </div>
            </motion.div>

            {/* Command 3: ./init_connections.sh */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <div className="flex items-center text-gray-800 dark:text-gray-200 mb-4">
                <span className="text-green-600 dark:text-green-500 mr-2 font-bold">piyush@admin:~$</span> 
                <span className="text-sky-600 dark:text-[var(--go-cyan)]">./init_connections.sh</span>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <Button variant="outline" className="font-mono bg-transparent border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200" asChild>
                  <a href="mailto:piyushmodgil9@gmail.com">
                    <Mail className="h-4 w-4 mr-2 text-[var(--aws-amber)]" />
                    Email
                  </a>
                </Button>
                <Button variant="outline" className="font-mono bg-transparent border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200" asChild>
                  <a href="https://linkedin.com/in/piyushmodgil" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2 text-[var(--go-cyan)]" />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="outline" className="font-mono bg-transparent border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2 text-[var(--tf-purple)]" />
                    GitHub
                  </a>
                </Button>
              </div>

              {/* Awaiting Input Prompt & Cursor */}
              <div className="flex items-center text-gray-800 dark:text-gray-200 mt-8">
                <span className="text-green-600 dark:text-green-500 mr-2 font-bold">piyush@admin:~$</span> 
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                  className="w-2.5 h-5 bg-sky-600 dark:bg-[var(--go-cyan)] inline-block shadow-[0_0_8px_rgba(0,173,216,0.8)]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}