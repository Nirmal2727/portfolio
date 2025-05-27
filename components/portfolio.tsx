"use client"

import { useState, useRef, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from "next/image"
import { motion, useInView, useAnimation } from "framer-motion"
import { X, Play, CuboidIcon as Cube , ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import ModelViewer from "@/components/model-viewer"

type PortfolioMedia = {
  type: "image" | "video" | "model" // Type of media
  url: string // URL for image, video, or model file (.glb, .gltf, etc.)
  // Optional: You could add captions, alt text, poster images for video, etc.
  alt?: string; // Alt text for accessibility (good practice)
  poster?: string; // Poster image URL for video
};

type PortfolioItem = {
  id: number
  title: string
  category: "render" | "animation" | "model" // Maybe keep this for filtering/initial icon? Or derive from media?
  thumbnail: string // Still useful for the main grid item
  description: string
  // New field: an array of media items for the gallery
  media: PortfolioMedia[];
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export default function Portfolio() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); // State to track current media in modal
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const controls = useAnimation(); // For section title animation

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

export default function Portfolio() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: "Architectural Visualization",
      category: "render",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "Photorealistic architectural render",
      content: "/placeholder.svg?height=800&width=1200",
    },
    {
      id: 2,
      title: "Interior Design",
      category: "render",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "Modern interior visualization",
      content: "/placeholder.svg?height=800&width=1200",
    },
    {
      id: 3,
      title: "Product Visualization",
      category: "render",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "High-quality product render",
      content: "/placeholder.svg?height=800&width=1200",
    },
    {
      id: 4,
      title: "Exterior Rendering",
      category: "render",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "Realistic exterior visualization",
      content: "/placeholder.svg?height=800&width=1200",
    },
    {
      id: 5,
      title: "Commercial Space",
      category: "render",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "Commercial interior design",
      content: "/placeholder.svg?height=800&width=1200",
    },
    {
      id: 6,
      title: "Residential Project",
      category: "render",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "Luxury residential visualization",
      content: "/placeholder.svg?height=800&width=1200",
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

  return (
    <section id="portfolio" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div variants={containerVariants} initial="hidden" animate={controls} className="text-center mb-12">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            My Portfolio
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-300 max-w-2xl mx-auto">
            Explore my latest work across 3D renders, animations, and interactive models
          </motion.p>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
              onClick={() => setSelectedItem(item)}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 30px -10px rgba(147, 51, 234, 0.3)",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <div className="aspect-[3/2] relative">
                <Image
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <motion.h3
                      className="text-white text-lg font-semibold"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-300 text-sm"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {item.description}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.category === "animation" && (
                    <motion.div
                      className="bg-purple-600 rounded-full p-3"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play className="h-8 w-8 text-white" />
                    </motion.div>
                  )}
                  {item.category === "model" && (
                    <motion.div
                      className="bg-pink-600 rounded-full p-3"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Cube className="h-8 w-8 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-5xl bg-gray-900 border-gray-800">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {selectedItem && (
            <div className="mt-2">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
              <p className="text-gray-300 mb-4">{selectedItem.description}</p>

              {selectedItem.category === "render" && (
                <div className="relative aspect-video">
                  <Image
                    src={selectedItem.content || "/placeholder.svg"}
                    alt={selectedItem.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}

              {selectedItem.category === "animation" && (
                <div className="relative aspect-video bg-black flex items-center justify-center rounded-md">
                  <Play className="h-16 w-16 text-white opacity-50" />
                  <p className="absolute bottom-4 text-center w-full text-gray-400">
                    Video placeholder - would play animation
                  </p>
                </div>
              )}

              {selectedItem.category === "model" && (
                <div className="h-[500px] rounded-md overflow-hidden">
                  <ModelViewer />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
