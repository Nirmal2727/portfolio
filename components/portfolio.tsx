// components/portfolio.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useInView, useAnimation } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper modules
import { Grid, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import our fixed image gallery modal component
import ImageGalleryModal from "./image-gallery-modal";

// Define the type for a portfolio item
type PortfolioItem = {
  id: number
  title: string
  description: string
  thumbnail: string
  images: string[]
}

export default function Portfolio() {
  // State for the main section entrance animation
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, threshold: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // State for the Image Gallery Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  const openModal = (images: string[], initialIndex = 0) => {
    setModalImages(images);
    setModalInitialIndex(initialIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Portfolio Data
  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: "Contemporary Bathroom Design",
      description: "Stylish and modern bathroom visualization.",
      thumbnail: "render/contemporary-bathroom-design/1.png",
      images: [
        "render/contemporary-bathroom-design/1.png",
        "render/contemporary-bathroom-design/2.png",
        "render/contemporary-bathroom-design/3.png",
      ],
    },
    {
      id: 2,
      title: "Contemporary Canopy Suit",
      description: "Elegant canopy design visualization.",
      thumbnail: "render/contemporary-canopy-suit/1.png",
      images: [
        "render/contemporary-canopy-suit/1.png",
        "render/contemporary-canopy-suit/2.png",
        "render/contemporary-canopy-suit/3.png",
      ],
    },
    {
      id: 3,
      title: "Environmental Lighting Showcase",
      description: "Render focusing on lighting techniques.",
      thumbnail: "render/environmental-lighting-showcase/1.png",
      images: [
        "render/environmental-lighting-showcase/1.png",
        "render/environmental-lighting-showcase/2.png",
        "render/environmental-lighting-showcase/3.png",
        "render/environmental-lighting-showcase/4.png",
        "render/environmental-lighting-showcase/5.png",
        "render/environmental-lighting-showcase/6.png",
      ],
    },
    {
      id: 4,
      title: "Luxe Green Bathroom",
      description: "Luxury bathroom with green accents.",
      thumbnail: "render/luxe-green-bathroom/1.png",
      images: [
        "render/luxe-green-bathroom/1.png",
        "render/luxe-green-bathroom/2.png",
        "render/luxe-green-bathroom/3.png",
      ],
    },
    {
      id: 5,
      title: "Modern Luxury Dining",
      description: "High-end dining area visualization.",
      thumbnail: "render/modern-luxury-dining/1.png",
      images: [
        "render/modern-luxury-dining/1.png",
        "render/modern-luxury-dining/2.png",
        "render/modern-luxury-dining/3.png",
        "render/modern-luxury-dining/4.png",
      ],
    },
    {
      id: 6,
      title: "Neon Streets",
      description: "Urban scene with neon lighting.",
      thumbnail: "render/neon-streets/1.png",
      images: [
        "render/neon-streets/1.png",
      ],
    },
    {
      id: 7,
      title: "Noir Serenity",
      description: "Dark and serene visualization.",
      thumbnail: "render/noir-serenity/1.png",
      images: [
        "render/noir-serenity/1.png",
        "render/noir-serenity/2.png",
      ],
    },
    {
      id: 8,
      title: "Olive Hues & Modern Views",
      description: "Contemporary space with olive tones.",
      thumbnail: "render/olive-hues-modern-views/1.png",
      images: [
        "render/olive-hues-modern-views/1.png",
        "render/olive-hues-modern-views/2.png",
        "render/olive-hues-modern-views/3.png",
        "render/olive-hues-modern-views/4.png",
        "render/olive-hues-modern-views/5.png",
      ],
    },
    {
      id: 9,
      title: "Symphony of Gold and Black",
      description: "Opulent interior concept.",
      thumbnail: "render/symphony-of-gold-and-black/1.png",
      images: [
        "render/symphony-of-gold-and-black/1.png",
        "render/symphony-of-gold-and-black/2.png",
      ],
    },
    {
      id: 10,
      title: "The Soft Edge",
      description: "Visualization with soft transitions.",
      thumbnail: "render/the-soft-edge/1.png",
      images: [
        "render/the-soft-edge/1.png",
        "render/the-soft-edge/2.png",
      ],
    },
    {
      id: 11,
      title: "The Urban Escape",
      description: "Relaxing urban balcony/terrace.",
      thumbnail: "render/the-urban-escape/1.png",
      images: [
        "render/the-urban-escape/1.png",
        "render/the-urban-escape/2.png",
      ],
    },
    {
      id: 12,
      title: "The Urban Villa",
      description: "Modern villa in an urban setting.",
      thumbnail: "render/the-urban-villa/1.png",
      images: [
        "render/the-urban-villa/1.png",
      ],
    },
    {
      id: 13,
      title: "Velocity Vault",
      description: "Futuristic vehicle showcase.",
      thumbnail: "render/velocity-vault/1.png",
      images: [
        "render/velocity-vault/1.png",
        "render/velocity-vault/2.png",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  }

  return (
    <section id="portfolio" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6" ref={sectionRef}>
        {/* Title and Description */}
        <motion.div variants={containerVariants} initial="hidden" animate={controls} className="text-center mb-12">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            My Portfolio
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-300 max-w-2xl mx-auto">
            Explore my latest 3D render projects. Click on a project to view the full gallery.
          </motion.p>
        </motion.div>

        {/* Swiper Slider Container with proper positioning for navigation */}
        <motion.div variants={containerVariants} initial="hidden" animate={controls} className="relative">
          {/* Navigation arrows positioned outside the swiper container */}
          <div className="swiper-button-prev-custom absolute top-1/2 -left-6 z-20 transform -translate-y-1/2 cursor-pointer bg-purple-600/80 hover:bg-purple-600 rounded-full p-3 transition-colors duration-300">
            <ChevronLeft className="h-6 w-6 text-white" />
          </div>
          <div className="swiper-button-next-custom absolute top-1/2 -right-6 z-20 transform -translate-y-1/2 cursor-pointer bg-purple-600/80 hover:bg-purple-600 rounded-full p-3 transition-colors duration-300">
            <ChevronRight className="h-6 w-6 text-white" />
          </div>

          <Swiper
            modules={[Grid, Pagination, Navigation]}
            slidesPerView={1}
            grid={{
              rows: 6,
              fill: 'row',
            }}
            spaceBetween={24}
            pagination={{
              el: '.swiper-pagination-custom',
              clickable: true,
              bulletClass: 'inline-block w-3 h-3 bg-gray-600 rounded-full mx-1 cursor-pointer transition-colors duration-300',
              bulletActiveClass: 'bg-purple-500',
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
              disabledClass: 'opacity-30 cursor-not-allowed',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                grid: {
                  rows: 3,
                  fill: 'row',
                },
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                grid: {
                  rows: 2,
                  fill: 'row',
                },
                spaceBetween: 24,
              },
            }}
            style={{ minHeight: '600px', paddingBottom: '60px' }}
            className="portfolio-swiper"
          >
            {portfolioItems.map((item) => (
              <SwiperSlide key={item.id}>
                <motion.div
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
                  onClick={() => openModal(item.images)}
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
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={item.id <= 6}
                    />
                    
                    {/* Overlay for title and description */}
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

                    {/* Icon Overlay */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-purple-600 rounded-full p-3 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-expand text-white">
                          <rect width="7" height="7" x="14" y="3" rx="1"/>
                          <path d="M10 21v-4a3 3 0 0 0-3-3H3"/>
                          <path d="M21 14h-4a3 3 0 0 0-3 3v4"/>
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="swiper-pagination-custom mt-8 text-center relative z-10"></div>
        </motion.div>

        {/* Image Gallery Modal */}
        <ImageGalleryModal
          isOpen={isModalOpen}
          images={modalImages}
          initialIndex={modalInitialIndex}
          onClose={closeModal}
        />
      </div>
    </section>
  )
}
