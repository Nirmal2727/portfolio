"use client"

import { motion } from "framer-motion"
import { Smartphone } from "lucide-react"

export default function SmartphoneIconAnimation() {
  return (
    <div className="relative h-10 w-10">
      <motion.div
        className="absolute inset-0 text-purple-500"
        animate={{
          y: [0, -5, 0, -5, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.2,
          y: -10,
          transition: { duration: 0.3 },
        }}
      >
        <Smartphone className="h-10 w-10" />
      </motion.div>

      {/* VR/AR effect */}
      <motion.div
        className="absolute inset-0 w-full h-full rounded-full bg-purple-500/20 blur-md"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />
    </div>
  )
}
