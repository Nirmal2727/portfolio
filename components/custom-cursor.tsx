"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", mouseMove)

    // Add event listeners for cursor variants
    const links = document.querySelectorAll("a, button, .cursor-hover")
    links.forEach((link) => {
      link.addEventListener("mouseenter", () => setCursorVariant("hover"))
      link.addEventListener("mouseleave", () => setCursorVariant("default"))
    })

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      links.forEach((link) => {
        link.removeEventListener("mouseenter", () => setCursorVariant("hover"))
        link.removeEventListener("mouseleave", () => setCursorVariant("default"))
      })
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(147, 51, 234, 0)",
      border: "2px solid rgba(147, 51, 234, 0.5)",
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      },
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(147, 51, 234, 0.1)",
      border: "2px solid rgba(236, 72, 153, 0.8)",
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      },
    },
  }

  // Only show custom cursor on desktop
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return null
  }

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-50 hidden lg:block"
      variants={variants}
      animate={cursorVariant}
    />
  )
}
