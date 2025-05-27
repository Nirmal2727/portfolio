"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Linkedin, Instagram } from "lucide-react"

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

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

  const socialLinks = [
    { 
      icon: <Linkedin className="h-5 w-5" />, 
      url: "https://www.linkedin.com/in/nirmal-sharma-268936205", 
      label: "LinkedIn" 
    },
    { 
      icon: <Instagram className="h-5 w-5" />, 
      url: "https://www.instagram.com/ddstudi0_968", 
      label: "Instagram" 
    },
    {
      icon: <div className="h-5 w-5 flex items-center justify-center font-bold text-xs">Be</div>,
      url: "https://www.behance.net/nirmalsharma6",
      label: "Behance",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Get In Touch
            </h2>
            <p className="text-gray-300 mb-8">
              Have a project in mind or want to discuss a collaboration? I'd love to hear from you. Fill out the form
              and I'll get back to you as soon as possible.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">Email</h3>
                <p className="text-purple-400">nirmalsharma7272@gmail.com</p>
              </div>

              <div>
                <h3 className="text-white text-xl font-semibold mb-2">Connect</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="bg-gray-900 hover:bg-gray-800 text-purple-400 hover:text-purple-300 p-3 rounded-full transition-colors"
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
