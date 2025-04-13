"use client"

import { useState, useRef, Suspense, useEffect } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Float,
  PresentationControls,
  Environment,
  useTexture,
  Html,
  Stars,
  Cloud,
  Text3D,
  Sparkles,
  OrbitControls,
} from "@react-three/drei"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, BadgeCheck, BadgeIcon as Certificate, Star, ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import type * as THREE from "three"

// Expanded achievements data
const achievements = [
  {
    id: 1,
    title: "Hackathon Winner",
    description:
      "First place at the Regional Coding Hackathon for developing an innovative cloud-based solution that addressed real-world problems in healthcare data management.",
    date: "June 2023",
    image: "/placeholder.svg?height=300&width=400",
    isMain: true,
  },
  {
    id: 2,
    title: "Best Project Award",
    description:
      "Recognized for outstanding project implementation in the annual tech showcase, demonstrating exceptional problem-solving skills and technical expertise.",
    date: "March 2023",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 3,
    title: "Innovation Challenge",
    description:
      "Top 3 finalist in the Tech Innovation Challenge for creating a novel approach to serverless architecture deployment.",
    date: "November 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 4,
    title: "Open Source Contributor",
    description:
      "Recognized as a key contributor to major open source projects with over 50 accepted pull requests to infrastructure-as-code repositories.",
    date: "October 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 5,
    title: "Tech Speaker",
    description: "Featured speaker at DevOps Conference 2022, presenting on 'Cloud Native Infrastructure Patterns'.",
    date: "September 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 6,
    title: "Code Optimization Award",
    description:
      "Awarded for developing a solution that reduced cloud infrastructure costs by 40% through innovative architecture redesign.",
    date: "July 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 7,
    title: "Community Leadership",
    description:
      "Led a community of 500+ developers, organizing workshops and knowledge-sharing sessions on cloud technologies.",
    date: "May 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 8,
    title: "Security Challenge Winner",
    description:
      "Won the Cybersecurity Challenge by identifying and patching critical vulnerabilities in cloud infrastructure setups.",
    date: "April 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 9,
    title: "Technical Blog Award",
    description:
      "Received recognition for technical writing excellence with a series on advanced AWS architecture patterns.",
    date: "February 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 10,
    title: "Mentorship Excellence",
    description:
      "Acknowledged for mentoring junior developers in cloud technologies, with all mentees successfully achieving AWS certifications.",
    date: "January 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
]

// Expanded certifications data
const certifications = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect - Professional",
    organization: "Amazon Web Services",
    date: "May 2023",
    image: "/placeholder.svg?height=300&width=400",
    isMain: true,
  },
  {
    id: 2,
    title: "HashiCorp Certified: Terraform Associate",
    organization: "HashiCorp",
    date: "January 2023",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 3,
    title: "Certified Kubernetes Administrator (CKA)",
    organization: "Cloud Native Computing Foundation",
    date: "October 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 4,
    title: "AWS Certified DevOps Engineer - Professional",
    organization: "Amazon Web Services",
    date: "August 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 5,
    title: "Google Cloud Professional Cloud Architect",
    organization: "Google Cloud",
    date: "July 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 6,
    title: "Microsoft Certified: Azure Solutions Architect Expert",
    organization: "Microsoft",
    date: "June 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 7,
    title: "Certified Jenkins Engineer",
    organization: "CloudBees",
    date: "May 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 8,
    title: "Docker Certified Associate",
    organization: "Docker",
    date: "April 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 9,
    title: "Certified Scrum Master",
    organization: "Scrum Alliance",
    date: "March 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
  {
    id: 10,
    title: "Red Hat Certified System Administrator",
    organization: "Red Hat",
    date: "February 2022",
    image: "/placeholder.svg?height=300&width=400",
    isMain: false,
  },
]

// Enhanced 3D Certificate Component
function Certificate3D({ position, rotation, title, organization, onClick, isMain }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture("/placeholder.svg?height=512&width=512")
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02

      // Add pulse effect for main certificates
      if (isMain) {
        meshRef.current.scale.x = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.05
        meshRef.current.scale.y = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.05
        meshRef.current.scale.z = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      }
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
      <group
        position={position}
        rotation={rotation}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh ref={meshRef} receiveShadow castShadow>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial
            map={texture}
            emissive={isMain ? "#ffcc00" : "#ffffff"}
            emissiveIntensity={hovered ? 0.5 : isMain ? 0.3 : 0.1}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
        {isMain && <Sparkles count={20} scale={3} size={0.4} speed={0.3} color="#ffcc00" />}
        <Html position={[0, -1.3, 0]} transform occlude>
          <div
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg text-center w-[200px] ${isMain ? "border-2 border-yellow-400" : ""}`}
          >
            <h3 className="font-bold text-sm">{title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">{organization}</p>
            {isMain && (
              <span className="inline-flex items-center text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                <Star className="h-3 w-3 mr-1" /> Featured
              </span>
            )}
          </div>
        </Html>
      </group>
    </Float>
  )
}

// Enhanced 3D Trophy Component
function Trophy3D({ position, rotation, title, onClick, isMain }: any) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01

      // Add special effects for main achievements
      if (isMain) {
        meshRef.current.scale.x = 1.2 + Math.sin(state.clock.elapsedTime) * 0.05
        meshRef.current.scale.y = 1.2 + Math.sin(state.clock.elapsedTime) * 0.05
        meshRef.current.scale.z = 1.2 + Math.sin(state.clock.elapsedTime) * 0.05
      }
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group
        position={position}
        rotation={rotation}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <group ref={meshRef}>
          {/* Trophy base */}
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[0.5, 0.7, 0.2, 32]} />
            <meshStandardMaterial
              color={isMain ? "#FFD700" : "#D4AF37"}
              metalness={0.8}
              roughness={0.2}
              emissive={isMain ? "#FFD700" : "#000000"}
              emissiveIntensity={hovered ? 0.3 : isMain ? 0.2 : 0}
            />
          </mesh>

          {/* Trophy stem */}
          <mesh position={[0, 0.6, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Trophy cup */}
          <mesh position={[0, 1.2, 0]} receiveShadow castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={isMain ? "#FFD700" : "#D4AF37"}
              metalness={0.8}
              roughness={0.2}
              emissive={isMain ? "#FFD700" : "#000000"}
              emissiveIntensity={hovered ? 0.3 : isMain ? 0.2 : 0}
            />
          </mesh>

          {/* Add decorative elements for main trophy */}
          {isMain && (
            <>
              <group position={[0, 1.6, 0]}>
                {/* Create a star shape using multiple cones arranged in a circle */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <mesh key={i} position={[0, 0, 0]} rotation={[0, 0, (i * Math.PI * 2) / 5]} receiveShadow castShadow>
                    <coneGeometry args={[0.1, 0.4, 3]} />
                    <meshStandardMaterial
                      color="#FFD700"
                      metalness={0.9}
                      roughness={0.1}
                      emissive="#FFD700"
                      emissiveIntensity={0.5}
                    />
                  </mesh>
                ))}
              </group>
              <Sparkles count={30} scale={2} size={0.3} speed={0.5} color="#FFD700" />
            </>
          )}
        </group>

        <Html position={[0, -0.5, 0]} transform occlude>
          <div
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg text-center w-[150px] ${isMain ? "border-2 border-yellow-400" : ""}`}
          >
            <h3 className="font-bold text-xs">{title}</h3>
            {isMain && (
              <span className="inline-flex items-center text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                <Star className="h-3 w-3 mr-1" /> Featured
              </span>
            )}
          </div>
        </Html>
      </group>
    </Float>
  )
}

// 3D Title Component
function Title3D({ text, position = [0, 0, 0] }: { text: string; position?: [number, number, number] }) {
  const { viewport } = useThree()
  const isMobile = viewport.width < 4

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Text3D
        position={position}
        font="/fonts/Geist_Bold.json"
        size={isMobile ? 0.5 : 0.8}
        height={0.1}
        curveSegments={12}
      >
        {text}
        <meshStandardMaterial
          color="#4299e1"
          emissive="#4299e1"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Text3D>
      <Sparkles count={20} scale={6} size={0.4} speed={0.3} color="#4299e1" />
    </Float>
  )
}

// Enhanced 3D Scene for Achievements
function AchievementsScene({ onSelect }: { onSelect: (id: number) => void }) {
  const { viewport } = useThree()
  const isMobile = viewport.width < 4

  // Calculate positions based on viewport
  const getPositions = () => {
    if (isMobile) {
      // Stack vertically on mobile
      return achievements.map((_, i) => [0, -i * 2.5, 0])
    } else {
      // Arrange in a circular pattern
      const radius = 6
      return achievements.map((_, i) => [
        radius * Math.cos(i * ((2 * Math.PI) / achievements.length)),
        0,
        radius * Math.sin(i * ((2 * Math.PI) / achievements.length)),
      ])
    }
  }

  const positions = getPositions()

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <spotLight position={[0, 10, 0]} intensity={0.5} castShadow />

      <Title3D text="Achievements" position={[0, isMobile ? 3 : 4, 0]} />

      <PresentationControls
        global
        zoom={0.8}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        {achievements.map((achievement, index) => (
          <Trophy3D
            key={achievement.id}
            position={positions[index]}
            rotation={[0, 0, 0]}
            title={achievement.title}
            onClick={() => onSelect(achievement.id)}
            isMain={achievement.isMain}
          />
        ))}
      </PresentationControls>

      <Cloud position={[0, -3, 0]} opacity={0.5} speed={0.4} width={10} depth={1.5} />
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="city" />
    </>
  )
}

// Enhanced 3D Scene for Certifications
function CertificationsScene({ onSelect }: { onSelect: (id: number) => void }) {
  const { viewport } = useThree()
  const isMobile = viewport.width < 4

  // Calculate positions based on viewport
  const getPositions = () => {
    if (isMobile) {
      // Stack vertically on mobile
      return certifications.map((_, i) => [0, -i * 2.5, 0])
    } else {
      // Arrange in a grid pattern
      const cols = 3
      const rows = Math.ceil(certifications.length / cols)
      return certifications.map((_, i) => [((i % cols) - 1) * 4, Math.floor(i / cols) * -3 + rows, 0])
    }
  }

  const positions = getPositions()

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <spotLight position={[0, 10, 0]} intensity={0.5} castShadow />

      <Title3D text="Certifications" position={[0, isMobile ? 3 : 4, 0]} />

      <PresentationControls
        global
        zoom={0.8}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        {certifications.map((cert, index) => (
          <Certificate3D
            key={cert.id}
            position={positions[index]}
            rotation={[0, 0, 0]}
            title={cert.title}
            organization={cert.organization}
            onClick={() => onSelect(cert.id)}
            isMain={cert.isMain}
          />
        ))}
      </PresentationControls>

      <Cloud position={[0, -3, 0]} opacity={0.5} speed={0.4} width={10} depth={1.5} />
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="sunset" />
    </>
  )
}

export default function Achievements() {
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null)
  const [selectedCertification, setSelectedCertification] = useState<number | null>(null)
  const [canvasHeight, setCanvasHeight] = useState("600px")

  // Adjust canvas height based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCanvasHeight("400px")
      } else {
        setCanvasHeight("600px")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getAchievementById = (id: number) => achievements.find((a) => a.id === id)
  const getCertificationById = (id: number) => certifications.find((c) => c.id === id)

  return (
    <section id="achievements" className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto"
      >
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Achievements & Certifications
        </h2>

        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Certificate className="h-4 w-4" />
              Certifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements">
            <div
              className="mb-8 rounded-lg bg-gradient-to-b from-purple-900/20 to-sky-900/20 backdrop-blur-sm glow"
              style={{ height: canvasHeight }}
            >
              <Suspense
                fallback={<div className="flex h-full items-center justify-center">Loading 3D Achievements...</div>}
              >
                <Canvas camera={{ position: [0, 0, 15], fov: 50 }} shadows>
                  <AchievementsScene onSelect={setSelectedAchievement} />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
              </Suspense>
            </div>

            <div className="text-center mb-8 text-gray-600 dark:text-gray-300">
              <p>Click on a trophy to view achievement details</p>
            </div>

            {selectedAchievement && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="floating-element mb-8"
              >
                <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-2 border-sky-500/30 dark:border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {getAchievementById(selectedAchievement)?.title}
                        {getAchievementById(selectedAchievement)?.isMain && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                          >
                            <Star className="h-3 w-3 mr-1" /> Featured
                          </Badge>
                        )}
                      </CardTitle>
                      <Badge variant="outline">{getAchievementById(selectedAchievement)?.date}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={getAchievementById(selectedAchievement)?.image || "/placeholder.svg"}
                          alt={getAchievementById(selectedAchievement)?.title}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {getAchievementById(selectedAchievement)?.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Main Achievement Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border-2 border-yellow-500/30 dark:border-amber-500/30">
                <CardHeader>
                  <div className="flex items-center">
                    <BadgeCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <CardTitle>Main Achievement</CardTitle>
                  </div>
                  <CardDescription>
                    {achievements.find((a) => a.isMain)?.title} - {achievements.find((a) => a.isMain)?.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{achievements.find((a) => a.isMain)?.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedAchievement(achievement.id)}
                >
                  <Card
                    className={`h-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 hover:shadow-lg transition-all ${achievement.isMain ? "border-2 border-yellow-500/50" : ""}`}
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={achievement.image || "/placeholder.svg"}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                      />
                      {achievement.isMain && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="h-3 w-3 mr-1" /> Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline">{achievement.date}</Badge>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications">
            <div
              className="mb-8 rounded-lg bg-gradient-to-b from-sky-900/20 to-purple-900/20 backdrop-blur-sm glow"
              style={{ height: canvasHeight }}
            >
              <Suspense
                fallback={<div className="flex h-full items-center justify-center">Loading 3D Certifications...</div>}
              >
                <Canvas camera={{ position: [0, 0, 15], fov: 50 }} shadows>
                  <CertificationsScene onSelect={setSelectedCertification} />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
              </Suspense>
            </div>

            <div className="text-center mb-8 text-gray-600 dark:text-gray-300">
              <p>Click on a certificate to view details</p>
            </div>

            {selectedCertification && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="floating-element mb-8"
              >
                <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-2 border-sky-500/30 dark:border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle>
                        {getCertificationById(selectedCertification)?.title}
                        {getCertificationById(selectedCertification)?.isMain && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                          >
                            <Star className="h-3 w-3 mr-1" /> Featured
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge>{getCertificationById(selectedCertification)?.organization}</Badge>
                        <Badge variant="outline">{getCertificationById(selectedCertification)?.date}</Badge>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={getCertificationById(selectedCertification)?.image || "/placeholder.svg"}
                        alt={getCertificationById(selectedCertification)?.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Main Certification Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-blue-500/30 dark:border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center">
                    <BadgeCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                    <CardTitle>Main Certification</CardTitle>
                  </div>
                  <CardDescription>
                    {certifications.find((c) => c.isMain)?.title} - {certifications.find((c) => c.isMain)?.organization}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={certifications.find((c) => c.isMain)?.image || "/placeholder.svg"}
                        alt={certifications.find((c) => c.isMain)?.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        This professional-level certification demonstrates advanced expertise in designing distributed
                        applications and systems on the AWS platform. It validates the ability to deploy robust,
                        scalable, highly available, and fault-tolerant systems on AWS.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        Issued: {certifications.find((c) => c.isMain)?.date}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((certification) => (
                <motion.div
                  key={certification.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedCertification(certification.id)}
                >
                  <Card
                    className={`h-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 hover:shadow-lg transition-all ${certification.isMain ? "border-2 border-blue-500/50" : ""}`}
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={certification.image || "/placeholder.svg"}
                        alt={certification.title}
                        className="w-full h-full object-cover"
                      />
                      {certification.isMain && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-500 text-white">
                            <Star className="h-3 w-3 mr-1" /> Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{certification.title}</CardTitle>
                      <CardDescription>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge>{certification.organization}</Badge>
                          <Badge variant="outline">{certification.date}</Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact for more information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-sky-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-sky-500/30 dark:border-purple-500/30">
            <CardContent className="pt-6">
              <Info className="h-12 w-12 mx-auto mb-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Want to know more?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Contact Piyush Modgil to learn more about his achievements and certifications.
              </p>
              <Button asChild className="glow">
                <a href="#contact">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact for Details
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  )
}
