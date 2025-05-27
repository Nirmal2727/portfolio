"use client"

import { motion } from "framer-motion"
import { CuboidIcon as Cube } from "lucide-react"

export default function CubeIconAnimation() {
  return (
    <motion.div
      className="h-10 w-10 text-purple-500"
      animate={{
        rotateY: [0, 360],
        rotateX: [0, 360],
      }}
      transition={{
        duration: 6,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        times: [0, 1],
      }}
      whileHover={{
        scale: 1.2,
        rotateY: [null, 720],
        rotateX: [null, 720],
        transition: { duration: 1.5 },
      }}
    >
      <Cube className="h-10 w-10" />
    </motion.div>
  )
}
