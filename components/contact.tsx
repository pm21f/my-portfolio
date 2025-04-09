"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Instagram, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function Contact() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send the form data to the API route
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Message sent!",
          description: "Thanks for reaching out. I'll get back to you soon.",
        })
        setFormData({ name: "", email: "", message: "" })
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto"
      >
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Contact Me</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="floating-element"
          >
            <Card className="h-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-2 border-sky-500/30 dark:border-purple-500/30">
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
                <CardDescription>Fill out the form and I'll get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="floating-element"
          >
            <Card className="h-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-2 border-sky-500/30 dark:border-purple-500/30">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Feel free to reach out through any of these channels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <span className="text-gray-700 dark:text-gray-300"></span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <span className="text-gray-700 dark:text-gray-300">piyushmodgil9@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <span className="text-gray-700 dark:text-gray-300">Una, Himachal Pradesh, India</span>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">Social Media</h4>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon" asChild className="glow">
                      <a
                        href="https://linkedin.com/in/piyushmodgil"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild className="glow">
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild className="glow">
                      <a
                        href="https://instagram.com/piyushmodgil"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
