// components/about.tsx
"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useInView, useAnimation } from "framer-motion"
import { Layers, Cpu, Palette } from "lucide-react"
import SectionReveal from "@/components/section-reveal"
import DynamicGlowCircle from "./dynamic-glow-circle"

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const skills = [
    { name: "3ds Max", icon: <Layers className="h-8 w-8" /> },
    { name: "Unreal Engine", icon: <Cpu className="h-8 w-8" /> },
    { name: "Photoshop", icon: <Palette className="h-8 w-8" /> },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="about" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Text and Skills */}
          <SectionReveal>
            <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text animate-text-gradient">
                About Me
              </h2>

              <p className="text-gray-300 mb-6 text-lg">
                I'm Nirmal Sharma passionate 3D visualizer with over 4 years of experience creating stunning digital art,
                architectural visualizations, and interactive experiences. My work combines technical precision with
                artistic vision to bring concepts to life in ways that captivate and inspire.
              </p>

              <p className="text-gray-300 mb-8 text-lg">
                Whether you need photorealistic product renders, immersive environments, or interactive 3D experiences,
                I deliver high-quality visuals that exceed expectations and help your ideas stand out in today's
                competitive digital landscape.
              </p>

              <div className="w-full">
                <h3 className="text-2xl font-semibold mb-4 text-white">My Skills</h3>
                <div className="grid grid-cols-3 gap-4">
                  {skills.map((skill, index) => (
                    <SectionReveal key={index} delay={index * 0.1}>
                      <motion.div
                        variants={itemVariants}
                        className="bg-gray-900 p-4 rounded-lg flex flex-col items-center text-center hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-purple-500 cursor-hover"
                        whileHover={{
                          y: -5,
                          boxShadow: "0 10px 30px -10px rgba(147, 51, 234, 0.3)",
                        }}
                      >
                        <motion.div
                          className="text-purple-400 mb-2"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {skill.icon}
                        </motion.div>
                        <span className="text-gray-200">{skill.name}</span>
                      </motion.div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </motion.div>
          </SectionReveal>

          {/* Right Column - Image with Dynamic Glow */}
          <SectionReveal direction="left" delay={0.3}>
            <motion.div variants={itemVariants} className="flex justify-center md:justify-end">
              <DynamicGlowCircle
                size={320}
                variants={itemVariants}
                initial="hidden"
                animate={controls}
                glowIntensity={4.0}
                glowWidth={0.25}
                waveSpeed={1.2}
                waveAmplitude={0.2}
                pulseSpeed={0.6}
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/profile.JPG"
                    alt="Profile"
                    fill
                    className="object-cover rounded-full border-4 border-white/20 backdrop-blur-sm"
                    priority
                    sizes="320px"
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={() => console.error('Image failed to load')}
                  />
                </div>
              </DynamicGlowCircle>
            </motion.div>
          </SectionReveal>
        </motion.div>
      </div>
    </section>
  )
}
