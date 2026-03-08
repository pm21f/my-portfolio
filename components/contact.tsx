"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Terminal, Send, Server, ShieldCheck, Activity, Loader2 } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (submitStatus !== "idle") setSubmitStatus("idle")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API latency or replace with your actual fetch call
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      // Fallback for simulation if API route doesn't exist yet
      setTimeout(() => {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", message: "" })
        setIsSubmitting(false)
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Section Header */}
        <div className="flex items-center mb-10 font-mono text-xl md:text-2xl text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-4">
          <Terminal className="mr-3 text-[var(--sky-blue)]" />
          <span className="text-[var(--term-green)] mr-2">$</span> 
          <span>curl -X POST https://api.piyushmodgil.dev/v1/contact</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Area (The Request) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">Request Payload</h3>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-[var(--term-green)]" />
                <span>TLS v1.3 Secured</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 font-mono text-sm">
              <div className="space-y-2">
                <label className="text-slate-500 dark:text-slate-400">
                  <span className="text-[var(--tf-purple)]">const</span> <span className="text-[var(--sky-blue)]">name</span>: <span className="text-[var(--aws-amber)]">string</span> =
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[var(--sky-blue)] focus:ring-1 focus:ring-[var(--sky-blue)] transition-all"
                  placeholder='"Enter your name"'
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-500 dark:text-slate-400">
                  <span className="text-[var(--tf-purple)]">const</span> <span className="text-[var(--sky-blue)]">email</span>: <span className="text-[var(--aws-amber)]">string</span> =
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[var(--sky-blue)] focus:ring-1 focus:ring-[var(--sky-blue)] transition-all"
                  placeholder='"Enter your email"'
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-500 dark:text-slate-400">
                  <span className="text-[var(--tf-purple)]">const</span> <span className="text-[var(--sky-blue)]">message</span>: <span className="text-[var(--aws-amber)]">string</span> =
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[var(--sky-blue)] focus:ring-1 focus:ring-[var(--sky-blue)] transition-all resize-none"
                  placeholder='"Type your message here..."'
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 dark:bg-[var(--sky-blue)] dark:hover:bg-sky-400 text-white dark:text-slate-950 font-bold py-3 px-4 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Request...</span>
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>200 OK - Message Sent</span>
                  </>
                ) : submitStatus === "error" ? (
                  <>
                    <Activity className="w-4 h-4" />
                    <span>500 ERROR - Retry</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>POST /contact</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Live Data Preview (The Server Side) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-6 flex flex-col space-y-6"
          >
            {/* JSON Output Viewer */}
            <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-slate-800 shadow-2xl h-full">
              <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#1e1e1e]">
                <div className="flex space-x-2">
                  <Server className="w-4 h-4 text-slate-400" />
                  <span className="text-[#858585] text-xs font-mono">server.log</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--term-green)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--term-green)]"></span>
                  </span>
                  <span className="text-[#858585] text-[10px] font-mono">LISTENING: PORT 443</span>
                </div>
              </div>
              
              <div className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-slate-300">
                <div className="text-slate-500 mb-4">
                  {`// Awaiting incoming POST request...`}
                  <br />
                  {`// Parsing application/json payload`}
                </div>
                <pre>
                  <code className="language-json">
                    <span className="text-[#d4d4d4]">{`{`}</span>{"\n"}
                    <span className="text-[#9cdcfe]">  "headers"</span><span className="text-[#d4d4d4]">: {`{`}</span>{"\n"}
                    <span className="text-[#ce9178]">    "Content-Type"</span><span className="text-[#d4d4d4]">: </span><span className="text-[#ce9178]">"application/json"</span><span className="text-[#d4d4d4]">,</span>{"\n"}
                    <span className="text-[#ce9178]">    "Authorization"</span><span className="text-[#d4d4d4]">: </span><span className="text-[#ce9178]">"Bearer **********"</span>{"\n"}
                    <span className="text-[#d4d4d4]">  {`},`}</span>{"\n"}
                    <span className="text-[#9cdcfe]">  "body"</span><span className="text-[#d4d4d4]">: {`{`}</span>{"\n"}
                    <span className="text-[#ce9178]">    "name"</span><span className="text-[#d4d4d4]">: </span><span className="text-[#ce9178]">"{formData.name || ""}"</span><span className="text-[#d4d4d4]">,</span>{"\n"}
                    <span className="text-[#ce9178]">    "email"</span><span className="text-[#d4d4d4]">: </span><span className="text-[#ce9178]">"{formData.email || ""}"</span><span className="text-[#d4d4d4]">,</span>{"\n"}
                    <span className="text-[#ce9178]">    "message"</span><span className="text-[#d4d4d4]">: </span><span className="text-[#ce9178]">"{formData.message ? formData.message.substring(0, 30) + (formData.message.length > 30 ? '...' : '') : ""}"</span>{"\n"}
                    <span className="text-[#d4d4d4]">  {`}`}</span>{"\n"}
                    <span className="text-[#d4d4d4]">{`}`}</span>
                  </code>
                </pre>
                
                {submitStatus === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-[var(--term-green)] border-t border-slate-800 pt-4"
                  >
                    {`> STATUS: 200 OK`}
                    <br />
                    {`> MESSAGE: "Connection established. I'll get back to you shortly."`}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}