"use client"

import { motion } from "framer-motion"
import { Video } from "lucide-react"

export default function VideoIconAnimation() {
  return (
    <div className="relative h-10 w-10">
      <motion.div
        className="absolute inset-0 text-purple-500"
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
        whileHover={{
          scale: [null, 1.3, 1],
          transition: { duration: 0.5 },
        }}
      >
        <Video className="h-10 w-10" />
      </motion.div>

      <motion.div
        className="absolute inset-0 text-pink-500 opacity-0"
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: 0.5,
        }}
      >
        <Video className="h-10 w-10" />
      </motion.div>
    </div>
  )
}
