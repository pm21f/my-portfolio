"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Cloud {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  blur: number
}

export default function FloatingClouds() {
  const [clouds, setClouds] = useState<Cloud[]>([])

  useEffect(() => {
    // Generate random clouds
    const newClouds: Cloud[] = []
    const cloudCount = window.innerWidth < 768 ? 8 : 15

    for (let i = 0; i < cloudCount; i++) {
      newClouds.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 150 + 50,
        opacity: Math.random() * 0.4 + 0.1,
        duration: Math.random() * 60 + 60,
        delay: Math.random() * 20,
        blur: Math.random() * 30 + 10,
      })
    }

    setClouds(newClouds)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute rounded-full bg-white dark:bg-gray-200"
          style={{
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            opacity: cloud.opacity,
            filter: `blur(${cloud.blur}px)`,
          }}
          initial={{ x: -100 }}
          animate={{
            x: window.innerWidth + 100,
          }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
