"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import CubeIconAnimation from "./cube-icon-animation"
import VideoIconAnimation from "./video-icon-animation"
import PaletteIconAnimation from "./palette-icon-animation"
import LayerIconAnimation from "./layer-icon-animation"
import SmartphoneIconAnimation from "./smartphone-icon-animation"
import CompassIconAnimation from "./compass-icon-animation"

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const services = [
    {
      title: "3D Modeling",
      description: "High-quality 3D models with attention to detail and optimized topology for various applications.",
      icon: <CubeIconAnimation />,
      animationType: "none",
    },
    {
      title: "Animation",
      description: "Fluid and engaging animations that bring your products, characters, or environments to life.",
      icon: <VideoIconAnimation />,
      animationType: "none",
    },
    {
      title: "Texturing",
      description: "Realistic materials and textures that enhance the visual quality of your 3D assets.",
      icon: <PaletteIconAnimation />,
      animationType: "none",
    },
    {
      title: "Visualization",
      description: "Photorealistic renders of architecture, products, and environments for marketing or presentations.",
      icon: <LayerIconAnimation />,
      animationType: "none",
    },
    {
      title: "AR/VR Assets",
      description: "Optimized 3D assets for augmented and virtual reality experiences across platforms.",
      icon: <SmartphoneIconAnimation />,
      animationType: "none",
    },
    {
      title: "Interactive 3D",
      description: "Web-based interactive 3D experiences and configurators for products and environments.",
      icon: <CompassIconAnimation />,
      animationType: "none",
    },
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

  // Custom animation variants for each icon type
  const iconAnimations = {
    rotate3d: {
      rest: { rotateX: 0, rotateY: 0, rotateZ: 0 },
      hover: {
        rotateX: [0, 30, 0, -30, 0],
        rotateY: [0, -30, 0, 30, 0],
        transition: {
          duration: 2,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      },
    },
    play: {
      rest: { scale: 1, opacity: 1 },
      hover: {
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
        transition: {
          duration: 1.5,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      },
    },
    colorShift: {
      rest: { filter: "hue-rotate(0deg)" },
      hover: {
        filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
        transition: {
          duration: 3,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      },
    },
    layers: {
      rest: { y: 0 },
      hover: {
        y: [-2, 2, -2],
        transition: {
          duration: 1,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          times: [0, 0.5, 1],
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
    },
    float: {
      rest: { y: 0 },
      hover: {
        y: [0, -10, 0],
        transition: {
          duration: 2,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      },
    },
    compass: {
      rest: { rotate: 0 },
      hover: {
        rotate: [0, 360],
        transition: {
          duration: 2,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      },
    },
  }

  return (
    <section id="services" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div variants={containerVariants} initial="hidden" animate={controls} className="text-center mb-12">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            My Services
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-300 max-w-2xl mx-auto">
            Comprehensive 3D visualization services tailored to your specific needs
          </motion.p>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-purple-500 transition-all duration-300 group"
              whileHover={{
                y: -10,
                boxShadow: "0 10px 30px -10px rgba(147, 51, 234, 0.3)",
              }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors">{service.description}</p>
              <motion.div
                className="w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mt-4 group-hover:w-full transition-all duration-300"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
