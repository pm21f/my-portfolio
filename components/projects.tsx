"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Float, Sparkles } from "@react-three/drei"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type * as THREE from "three"

const projects = [
  {
    title: "Bug Finder",
    description: "Secure backend with Spring Data JPA, user authentication, and API testing",
    details:
      "A comprehensive bug tracking system built with Spring Boot that allows teams to track, manage, and resolve software bugs efficiently.",
  },
  {
    title: "AI Resume Scanner",
    description: "RESTful Spring backend, scalable microservices",
    details:
      "An intelligent resume parsing and analysis tool that uses AI to extract key information from resumes and match candidates to job requirements.",
  },
  {
    title: "Learning Zone",
    description: "DevOps + Cybersecurity platform",
    details:
      "An interactive learning platform focused on DevOps and Cybersecurity with hands-on labs, tutorials, and assessments.",
  },
]

function ProjectSphere({
  position,
  title,
  onClick,
}: { position: [number, number, number]; title: string; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1

      // Add pulse effect when hovered
      if (hovered) {
        meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
        meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
        meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      }
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={hovered ? "#a855f7" : "#8b5cf6"}
            emissive={hovered ? "#7c3aed" : "#4c1d95"}
            emissiveIntensity={hovered ? 1 : 0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        {hovered && <Sparkles count={50} scale={3} size={0.4} speed={0.3} color="#f0f8ff" />}
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
        >
          {title}
        </Text>
      </group>
    </Float>
  )
}

function ProjectsScene({ onProjectClick }: { onProjectClick: (index: number) => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <ProjectSphere position={[-2.5, 0, 0]} title={projects[0].title} onClick={() => onProjectClick(0)} />
      <ProjectSphere position={[0, 0, 0]} title={projects[1].title} onClick={() => onProjectClick(1)} />
      <ProjectSphere position={[2.5, 0, 0]} title={projects[2].title} onClick={() => onProjectClick(2)} />
      <Sparkles count={100} scale={10} size={0.6} speed={0.3} color="#f0f8ff" />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  return (
    <section id="projects" className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto"
      >
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Projects</h2>

        <div className="mb-12 h-[500px] rounded-lg bg-gradient-to-b from-purple-900/20 to-sky-900/20 backdrop-blur-sm glow">
          <Suspense fallback={<div className="flex h-full items-center justify-center">Loading 3D Projects...</div>}>
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <ProjectsScene onProjectClick={setSelectedProject} />
            </Canvas>
          </Suspense>
        </div>

        {selectedProject !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="floating-element"
          >
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-2 border-sky-500/30 dark:border-purple-500/30">
              <CardHeader className="bg-gradient-to-r from-sky-500/20 to-purple-500/20">
                <CardTitle>{projects[selectedProject].title}</CardTitle>
                <CardDescription>{projects[selectedProject].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{projects[selectedProject].details}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
          <p>Click on a project sphere to view details</p>
        </div>
      </motion.div>
    </section>
  )
}
