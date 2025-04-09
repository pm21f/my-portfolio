"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    title: "Java Developer Intern",
    company: "Excellence Tech",
    period: "Aug 2022 – Ongoing",
    location: "Mohali",
    responsibilities: [
      "Built Spring Boot applications with secure modules",
      "Created user-friendly REST APIs and scalable web apps",
      "Used Servlet/JSP for analytics-based improvements",
    ],
  },
  {
    title: "Linux / CCNA Intern",
    company: "Think Next Tech",
    period: "June – Aug 2024",
    location: "Mohali",
    responsibilities: [
      "Shell scripting, Linux sysadmin basics",
      "Networking concepts like IP, subnetting, OSI",
      "Used Cisco Packet Tracer for networking labs",
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto"
      >
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Experience</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="perspective-1000"
            >
              <div className="transform-style-3d transition-transform duration-500 hover:rotate-y-5 hover:scale-105">
                <Card className="h-full overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg dark:bg-gray-800/80">
                  <CardHeader className="bg-gradient-to-r from-sky-500 to-purple-500 pb-3 pt-6">
                    <CardTitle className="text-white">{exp.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-white/90">
                      <span>{exp.company}</span>
                      <span>•</span>
                      <span>{exp.period}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                          <Badge variant="outline" className="mt-0.5 h-2 w-2 rounded-full p-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
