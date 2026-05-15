"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Terminal, Send, Server, ShieldCheck, Loader2, Mail, Linkedin, Github, MapPin } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState<Partial<typeof formData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const validate = () => {
    const errs: Partial<typeof formData> = {}
    if (!formData.name.trim()) errs.name = "Name is required"
    if (!formData.email.trim()) {
      errs.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email"
    }
    if (!formData.message.trim()) errs.message = "Message is required"
    else if (formData.message.trim().length < 10) errs.message = "Message too short (min 10 chars)"
    return errs
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    if (submitStatus !== "idle") setSubmitStatus("idle")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", message: "" })
        setErrors({})
      } else {
        setSubmitStatus("error")
        setErrorMsg(data.message || "Something went wrong. Please try again.")
      }
    } catch {
      setSubmitStatus("error")
      setErrorMsg("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-32 relative z-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-px w-8" style={{ background: "rgba(0,212,255,0.4)" }} />
          <span className="section-marker">06 — Contact</span>
          <div className="h-px flex-1" style={{ background: "rgba(0,212,255,0.08)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 font-mono text-sm mb-12"
          style={{ color: "rgba(0,212,255,0.6)" }}
        >
          <Terminal className="w-4 h-4" style={{ color: "#00d4ff" }} />
          <span style={{ color: "#00ff88" }}>$</span>
          <span>curl -X POST https://api.piyushmodgil.dev/v1/contact</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 rounded-xl overflow-hidden"
            style={{
              background: "rgba(4, 10, 24, 0.85)",
              border: "1px solid rgba(0,212,255,0.12)",
            }}
          >
            {/* Form header */}
            <div
              className="flex justify-between items-center px-6 py-4"
              style={{
                background: "rgba(2, 6, 18, 0.8)",
                borderBottom: "1px solid rgba(0,212,255,0.08)",
              }}
            >
              <span className="font-mono font-bold text-sm" style={{ color: "#e2e8f0" }}>
                POST /v1/contact — Request Body
              </span>
              <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "#00ff88" }}>
                <ShieldCheck className="w-3.5 h-3.5" />
                TLS 1.3
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 font-mono text-sm">
              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>
                  <span style={{ color: "#7c3aed" }}>const </span>
                  <span style={{ color: "#00d4ff" }}>name</span>
                  <span style={{ color: "#94a3b8" }}>: </span>
                  <span style={{ color: "#f59e0b" }}>string</span>
                  <span style={{ color: "#94a3b8" }}> =</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='"Your name"'
                  className="w-full rounded-lg px-4 py-3 text-sm font-mono outline-none transition-all duration-200"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid ${errors.name ? "rgba(239,68,68,0.5)" : "rgba(0,212,255,0.12)"}`,
                    color: "#e2e8f0",
                  }}
                  onFocus={(e) => {
                    if (!errors.name) {
                      e.target.style.borderColor = "rgba(0,212,255,0.5)"
                      e.target.style.boxShadow = "0 0 0 2px rgba(0,212,255,0.08)"
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.name) {
                      e.target.style.borderColor = "rgba(0,212,255,0.12)"
                      e.target.style.boxShadow = "none"
                    }
                  }}
                />
                {errors.name && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs" style={{ color: "#f87171" }}>
                    // {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>
                  <span style={{ color: "#7c3aed" }}>const </span>
                  <span style={{ color: "#00d4ff" }}>email</span>
                  <span style={{ color: "#94a3b8" }}>: </span>
                  <span style={{ color: "#f59e0b" }}>string</span>
                  <span style={{ color: "#94a3b8" }}> =</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='"your@email.com"'
                  className="w-full rounded-lg px-4 py-3 text-sm font-mono outline-none transition-all duration-200"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid ${errors.email ? "rgba(239,68,68,0.5)" : "rgba(0,212,255,0.12)"}`,
                    color: "#e2e8f0",
                  }}
                  onFocus={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = "rgba(0,212,255,0.5)"
                      e.target.style.boxShadow = "0 0 0 2px rgba(0,212,255,0.08)"
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = "rgba(0,212,255,0.12)"
                      e.target.style.boxShadow = "none"
                    }
                  }}
                />
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs" style={{ color: "#f87171" }}>
                    // {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Message field */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>
                  <span style={{ color: "#7c3aed" }}>const </span>
                  <span style={{ color: "#00d4ff" }}>message</span>
                  <span style={{ color: "#94a3b8" }}>: </span>
                  <span style={{ color: "#f59e0b" }}>string</span>
                  <span style={{ color: "#94a3b8" }}> =</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder='"Your message..."'
                  className="w-full rounded-lg px-4 py-3 text-sm font-mono outline-none transition-all duration-200 resize-none"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid ${errors.message ? "rgba(239,68,68,0.5)" : "rgba(0,212,255,0.12)"}`,
                    color: "#e2e8f0",
                  }}
                  onFocus={(e) => {
                    if (!errors.message) {
                      e.target.style.borderColor = "rgba(0,212,255,0.5)"
                      e.target.style.boxShadow = "0 0 0 2px rgba(0,212,255,0.08)"
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.message) {
                      e.target.style.borderColor = "rgba(0,212,255,0.12)"
                      e.target.style.boxShadow = "none"
                    }
                  }}
                />
                {errors.message && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs" style={{ color: "#f87171" }}>
                    // {errors.message}
                  </motion.p>
                )}
              </div>

              {/* Error banner */}
              {submitStatus === "error" && errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                  }}
                >
                  <span style={{ color: "#ef4444" }}>✗</span>
                  {errorMsg}
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || submitStatus === "success"}
                whileHover={{ scale: isSubmitting || submitStatus === "success" ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-mono font-bold text-sm transition-all duration-300 disabled:cursor-not-allowed"
                style={
                  submitStatus === "success"
                    ? {
                        background: "rgba(0,255,136,0.12)",
                        border: "1px solid rgba(0,255,136,0.4)",
                        color: "#00ff88",
                        boxShadow: "0 0 20px rgba(0,255,136,0.15)",
                      }
                    : submitStatus === "error"
                    ? {
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.35)",
                        color: "#f87171",
                      }
                    : {
                        background: "rgba(0,212,255,0.1)",
                        border: "1px solid rgba(0,212,255,0.4)",
                        color: "#00d4ff",
                        opacity: isSubmitting ? 0.7 : 1,
                      }
                }
                onMouseEnter={(e) => {
                  if (!isSubmitting && submitStatus === "idle") {
                    e.currentTarget.style.background = "rgba(0,212,255,0.18)"
                    e.currentTarget.style.boxShadow = "0 0 25px rgba(0,212,255,0.25)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && submitStatus === "idle") {
                    e.currentTarget.style.background = "rgba(0,212,255,0.1)"
                    e.currentTarget.style.boxShadow = "none"
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending request...
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    200 OK — Message Sent!
                  </>
                ) : submitStatus === "error" ? (
                  <>
                    <Send className="w-4 h-4" />
                    Retry
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    POST /contact
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col gap-5"
          >
            {/* Server log */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "#020c1b",
                border: "1px solid rgba(0,212,255,0.1)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ background: "rgba(2,6,18,0.9)", borderBottom: "1px solid rgba(0,212,255,0.06)" }}
              >
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5" style={{ color: "rgba(0,212,255,0.5)" }} />
                  <span className="font-mono text-xs" style={{ color: "rgba(0,212,255,0.5)" }}>
                    server.log
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs" style={{ color: "#00ff88" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block pulse-dot" />
                  LISTENING :443
                </div>
              </div>
              <div className="p-5 font-mono text-xs leading-relaxed" style={{ color: "#64748b" }}>
                <div className="mb-3">
                  <span style={{ color: "rgba(0,212,255,0.3)" }}>{"// Awaiting POST /v1/contact..."}</span>
                  <br />
                  <span style={{ color: "rgba(0,212,255,0.3)" }}>{"// Content-Type: application/json"}</span>
                </div>
                <pre className="text-xs">
                  <code>
                    <span style={{ color: "#4ec9b0" }}>{`{`}</span>{"\n"}
                    <span style={{ color: "#9cdcfe" }}>  &quot;headers&quot;</span>
                    <span style={{ color: "#d4d4d4" }}>: {`{`}</span>{"\n"}
                    <span style={{ color: "#ce9178" }}>    &quot;Auth&quot;</span>
                    <span style={{ color: "#d4d4d4" }}>: </span>
                    <span style={{ color: "#ce9178" }}>&quot;Bearer ***&quot;</span>{"\n"}
                    <span style={{ color: "#d4d4d4" }}>  {`},`}</span>{"\n"}
                    <span style={{ color: "#9cdcfe" }}>  &quot;body&quot;</span>
                    <span style={{ color: "#d4d4d4" }}>: {`{`}</span>{"\n"}
                    <span style={{ color: "#ce9178" }}>    &quot;name&quot;</span>
                    <span style={{ color: "#d4d4d4" }}>: </span>
                    <span style={{ color: "#ce9178" }}>&quot;{formData.name || "..."}&quot;</span>{"\n"}
                    <span style={{ color: "#ce9178" }}>    &quot;email&quot;</span>
                    <span style={{ color: "#d4d4d4" }}>: </span>
                    <span style={{ color: "#ce9178" }}>&quot;{formData.email || "..."}&quot;</span>{"\n"}
                    <span style={{ color: "#d4d4d4" }}>  {`}`}</span>{"\n"}
                    <span style={{ color: "#4ec9b0" }}>{`}`}</span>
                  </code>
                </pre>
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4"
                    style={{ borderTop: "1px solid rgba(0,212,255,0.08)", color: "#00ff88" }}
                  >
                    {"> STATUS: 200 OK"}
                    <br />
                    {"> Connection established. I'll reply shortly."}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div
              className="rounded-xl p-5 space-y-3"
              style={{
                background: "rgba(4, 10, 24, 0.8)",
                border: "1px solid rgba(0,212,255,0.1)",
              }}
            >
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "rgba(0,212,255,0.5)" }}>
                Direct Channels
              </h4>
              {[
                { icon: Mail, label: "piyushmodgil9@gmail.com", href: "mailto:piyushmodgil9@gmail.com", color: "#f59e0b" },
                { icon: Linkedin, label: "linkedin.com/in/piyushmodgil", href: "https://linkedin.com/in/piyushmodgil", color: "#00d4ff" },
                { icon: Github, label: "github.com/pm21f", href: "https://github.com/pm21f", color: "#7c3aed" },
                { icon: MapPin, label: "Una, HP, India", href: "#", color: "#00ff88" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 text-sm font-mono transition-all duration-200 group"
                    style={{ color: "rgba(148,163,184,0.6)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = item.color }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(148,163,184,0.6)" }}
                  >
                    <div
                      className="p-1.5 rounded-md transition-all duration-200"
                      style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <span className="text-xs truncate">{item.label}</span>
                  </a>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
