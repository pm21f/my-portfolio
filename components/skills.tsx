"use client"

import { Suspense, useRef } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, OrbitControls, Float } from "@react-three/drei"
import type * as THREE from "three"

const skillCategories = [
  {
    title: "Languages",
    skills: ["Java", "Golang", "HTML", "CSS"],
  },
  {
    title: "Cloud & Database",
    skills: ["MySQL", "AWS VPC", "Lambda", "EC2", "S3", "DynamoDB"],
  },
  {
    title: "DevOps & Tools",
    skills: ["Docker", "Kubernetes", "Terraform", "GPRC"],
  },
  {
    title: "Golang Ecosystem",
    skills: ["Goroutines", "SQLX", "PGX", "GROM", "Gin", "Echo"],
  },
  {
    title: "Security",
    skills: ["Security", "IAM", "ELB"],
  },
]

// Super skills that should be highlighted
const superSkills = ["AWS", "Terraform", "Docker", "Kubernetes", "IAM"]

function SkillCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x += 0.002
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#4299e1" transparent opacity={0.7} />
        <Text position={[0, 0, 1.51]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
          Java
        </Text>
        <Text
          position={[0, 0, -1.51]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI, 0]}
        >
          Golang
        </Text>
        <Text
          position={[1.51, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI / 2, 0]}
        >
          Docker
        </Text>
        <Text
          position={[-1.51, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -Math.PI / 2, 0]}
        >
          AWS
        </Text>
        <Text
          position={[0, 1.51, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          MySQL
        </Text>
        <Text
          position={[0, -1.51, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[Math.PI / 2, 0, 0]}
        >
          Terraform
        </Text>
      </mesh>
    </Float>
  )
}

// AWS Super Skill Component
function AWSSkillHighlight() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="mt-8 p-6 rounded-xl bg-gradient-to-r from-sky-900/30 to-purple-900/30 backdrop-blur-sm shadow-xl"
    >
      <h3 className="text-2xl font-bold text-center mb-4 text-white">AWS & Terraform Expertise</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-sky-500/30">
          <h4 className="text-xl font-semibold mb-2 text-sky-400">AWS Cloud Architecture</h4>
          <ul className="space-y-2 text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-sky-400">•</span>
              Advanced VPC network design and security
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400">•</span>
              Serverless architecture with Lambda & API Gateway
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400">•</span>
              High-availability database solutions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400">•</span>
              S3 & CloudFront for global content delivery
            </li>
          </ul>
        </div>
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30">
          <h4 className="text-xl font-semibold mb-2 text-purple-400">Infrastructure as Code</h4>
          <ul className="space-y-2 text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              Terraform module development
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              CI/CD pipeline integration
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              Multi-environment deployment strategies
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              State management and collaboration workflows
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto"
      >
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Skills</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-6"
          >
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, idx) => {
                    const isSuper = superSkills.some((s) => skill.includes(s))
                    return (
                      <span
                        key={idx}
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          isSuper ? "superskill" : "bg-gradient-to-r from-sky-500 to-purple-500 text-white"
                        }`}
                      >
                        {skill}
                      </span>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-[400px] rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-800/50 glow"
          >
            <Suspense fallback={<div className="flex h-full items-center justify-center">Loading 3D Skills...</div>}>
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <SkillCube />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
              </Canvas>
            </Suspense>
          </motion.div>
        </div>

        <AWSSkillHighlight />
      </motion.div>
    </section>
  )
}
