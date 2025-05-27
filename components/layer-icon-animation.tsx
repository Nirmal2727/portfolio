"use client"

import { motion } from "framer-motion"
import { Layers } from "lucide-react"

export default function LayerIconAnimation() {
  return (
    <div className="relative h-10 w-10">
      <motion.div
        className="absolute inset-0 text-purple-500 opacity-70"
        initial={{ y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Layers className="h-10 w-10" />
      </motion.div>

      <motion.div
        className="absolute inset-0 text-pink-500 opacity-70"
        initial={{ y: 0 }}
        whileHover={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
      >
        <Layers className="h-10 w-10" />
      </motion.div>

      <motion.div
        className="absolute inset-0 text-purple-300 opacity-70"
        initial={{ y: 0 }}
        whileHover={{ y: 4 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
      >
        <Layers className="h-10 w-10" />
      </motion.div>
    </div>
  )
}
