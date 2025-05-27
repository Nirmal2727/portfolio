// components/hero.tsx
"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import HeroWebGLCanvas from "./hero-webgl-canvas" // Import the new component

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Remove or comment out the old parallax useEffect if you removed the backgroundRef
  // useEffect(() => { ... }, []);

  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById("portfolio")
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ filter: "brightness(1.1)" }}
    >
      {/* WebGL Canvas - draws background, spotlight, and text */}
      <HeroWebGLCanvas />

      {/* Content div - still needed for button and scroll indicator */}
      {/* pointer-events-none allows mouse events to pass through to the canvas */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pointer-events-none">
        {/* Hide the HTML text elements */}
        {/* Remove Framer Motion animations */}
        <h1 // Use h1 instead of motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 pointer-events-auto opacity-0" // Added opacity-0
          // Remove initial, animate, transition props
        >
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            3D Visualization
          </span>
          <br />
          <span // Use span instead of motion.span
            className="text-white"
            // Remove initial, animate, transition props
          >
            That Captivates
          </span>
        </h1>

        <p // Use p instead of motion.p
          className="text-xl md:text-2xl text-gray-300 mb-24 pointer-events-auto opacity-0" // Changed from mb-16 to mb-24
          // Remove initial, animate, transition props
        >
          Bringing imagination to life through stunning 3D renders, animations, and interactive experiences
        </p>

        {/* Button - Keep visible and interactive */}
        {/* This motion div and button are not text, so keep them and their animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="relative z-20 pointer-events-auto inline-block"
        >
          {/* ... Button code remains the same ... */}
          <Button
            onClick={scrollToPortfolio}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-full cursor-hover relative overflow-hidden group"
            size="lg"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-purple-700 hover:to-pink-700"></span>
            <span className="absolute inset-0 w-0 bg-white mix-blend-overlay transition-all duration-300 ease-out group-hover:w-full"></span>
            <span className="relative flex items-center">
              View My Work
              {/* Keep Framer motion on the icon */}
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                <ArrowDown className="ml-2 h-5 w-5" />
              </motion.span>
            </span>
          </Button>
        </motion.div>

        {/* Animated scroll indicator - Keep visible and interactive */}
        {/* This motion div is not text, so keep it and its animations */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        ></motion.div>
      </div>
    </section>
  )
}
