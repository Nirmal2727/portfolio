"use client"

import { motion } from "framer-motion"
import { Compass } from "lucide-react"

export default function CompassIconAnimation() {
  return (
    <div className="relative h-10 w-10">
      <motion.div
        className="absolute inset-0 text-purple-500"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "linear",
        }}
        whileHover={{
          rotate: [null, 720],
          transition: { duration: 1.5 },
        }}
      >
        <Compass className="h-10 w-10" />
      </motion.div>

      {/* Compass needle */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-pink-500 -ml-[1px] -mt-4 origin-bottom"
        animate={{
          rotate: [0, 180, 360, 540, 720],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
