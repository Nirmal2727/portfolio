"use client"

import { motion } from "framer-motion"
import { Palette } from "lucide-react"

export default function PaletteIconAnimation() {
  const colors = [
    "text-purple-500",
    "text-pink-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-red-500",
  ]

  return (
    <div className="relative h-10 w-10">
      {colors.map((color, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 ${color}`}
          initial={{ opacity: index === 0 ? 1 : 0 }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            delay: index * 0.5,
            ease: "easeInOut",
          }}
          whileHover={{
            rotate: 360,
            transition: { duration: 0.8 },
          }}
        >
          <Palette className="h-10 w-10" />
        </motion.div>
      ))}
    </div>
  )
}
