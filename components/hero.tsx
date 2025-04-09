"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section id="home" className="flex min-h-screen flex-col items-center justify-center pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1
          className="mb-4 text-5xl font-bold text-gray-800 dark:text-white md:text-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Piyush Modgil
        </motion.h1>

        <motion.p
          className="mb-8 text-xl text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Developer & Tech Enthusiast
        </motion.p>

        <motion.div
          className="mb-8 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Phone className="h-4 w-4" />
            <span>8352977033</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Mail className="h-4 w-4" />
            <span>piyushmodgil9@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MapPin className="h-4 w-4" />
            <span>Una, Himachal Pradesh, India</span>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Button variant="outline" size="icon" asChild>
            <a
              href="https://linkedin.com/in/piyushmodgil"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a
              href="https://instagram.com/piyushmodgil"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
