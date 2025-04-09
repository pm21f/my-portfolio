"use client"

import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function About() {
  return (
    <section id="about" className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto"
      >
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">About Me</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Who I Am</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I'm a passionate developer with a strong foundation in computer science and a keen interest in
                  building scalable, efficient applications. I enjoy solving complex problems and continuously learning
                  new technologies to enhance my skill set.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="h-full overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white">
                  <GraduationCap className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  Education
                </h3>
                <div className="mb-2 text-lg font-medium text-gray-800 dark:text-white">B.Tech in Computer Science</div>
                <div className="text-gray-600 dark:text-gray-300">Sant Baba Bhag Singh University, Punjab</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
