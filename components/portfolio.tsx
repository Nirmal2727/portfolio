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

// Import our new image gallery modal component (Ensure this file exists and has the correct code)
import ImageGalleryModal from "./image-gallery-modal";

// Define the type for a portfolio item
type PortfolioItem = {
  id: number
  title: string
  description: string
  thumbnail: string // Path to the thumbnail image (e.g., the first image)
  images: string[] // Array of image paths for the gallery
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
     // Optionally clear state after close animation completes
     // setModalImages([]);
     // setModalInitialIndex(0);
  };


  // Portfolio Data based on the directory structure
  // !! IMPORTANT: Update paths below to match your RENAMED folders and ACTUAL image filenames (e.g., 1.png, 2.png) !!
  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: "Contemporary Bathroom Design",
      description: "Stylish and modern bathroom visualization.",
      thumbnail: "/portfolio/public/render/contemporary-bathroom-design/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/contemporary-bathroom-design/1.png", // <-- Updated path
        "/portfolio/public/render/contemporary-bathroom-design/2.png", // <-- Update filename if different
        "/portfolio/public/render/contemporary-bathroom-design/3.png",
        // Add ALL image paths for this project's gallery here
        // e.g., "/portfolio/render/contemporary-bathroom-design/3.png",
      ],
    },
    {
      id: 2,
      title: "Contemporary Canopy Suit",
      description: "Elegant canopy design visualization.",
      thumbnail: "/portfolio/public/render/contemporary-canopy-suit/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/contemporary-canopy-suit/1.png", // <-- Updated path
        "/portfolio/public/render/contemporary-canopy-suit/2.png", // <-- Update filename if different
        "/portfolio/public/render/contemporary-canopy-suit/3.png", // <-- Update filename if different
        // ... more images
      ],
    },
     {
      id: 3,
      title: "Environmental Lighting Showcase",
      description: "Render focusing on lighting techniques.",
      thumbnail: "/portfolio/public/render/environmental-lighting-showcase/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/environmental-lighting-showcase/1.png", // <-- Updated path
        "/portfolio/public/render/environmental-lighting-showcase/2.png", // <-- Update filename if different
        "/portfolio/public/render/environmental-lighting-showcase/3.png", // <-- Update filename if different
        "/portfolio/public/render/environmental-lighting-showcase/4.png", // <-- Update filename if different
        "/portfolio/public/render/environmental-lighting-showcase/5.png",
        "/portfolio/public/render/environmental-lighting-showcase/6.png",
      ],
    },
     {
      id: 4,
      title: "Luxe Green Bathroom",
      description: "Luxury bathroom with green accents.",
      thumbnail: "/portfolio/public/render/luxe-green-bathroom/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/luxe-green-bathroom/1.png", // <-- Updated path
        "/portfolio/public/render/luxe-green-bathroom/2.png", // <-- Update filename if different
        "/portfolio/public/render/luxe-green-bathroom/3.png",
      ],
    },
     {
      id: 5,
      title: "Modern Luxury Dining",
      description: "High-end dining area visualization.",
      thumbnail: "/portfolio/public/render/modern-luxury-dining/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/modern-luxury-dining/1.png", // <-- Updated path
        "/portfolio/public/render/modern-luxury-dining/2.png", // <-- Update filename if different
        "/portfolio/public/render/modern-luxury-dining/3.png", // <-- Update filename if different
        "/portfolio/public/render/modern-luxury-dining/4.png",
      ],
    },
    {
      id: 6,
      title: "Neon Streets",
      description: "Urban scene with neon lighting.",
      thumbnail: "/portfolio/render/neon-streets/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/neon-streets/1.png", // <-- Updated path
      ],
    },
     {
      id: 7,
      title: "Noir Serenity",
      description: "Dark and serene visualization.",
      thumbnail: "/portfolio/public/render/noir-serenity/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/noir-serenity/1.png", // <-- Updated path
        "/portfolio/public/render/noir-serenity/2.png",
      ],
    },
     {
      id: 8,
      title: "Olive Hues & Modern Views",
      description: "Contemporary space with olive tones.",
      thumbnail: "/portfolio/public/render/olive-hues-modern-views/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/olive-hues-modern-views/1.png", // <-- Updated path
        "/portfolio/public/render/olive-hues-modern-views/2.png", // <-- Update filename if different
        "/portfolio/public/render/olive-hues-modern-views/3.png", // <-- Update filename if different
        "/portfolio/public/render/olive-hues-modern-views/4.png",
        "/portfolio/public/render/olive-hues-modern-views/5.png",
      ],
    },
     {
      id: 9,
      title: "Symphony of Gold and Black",
      description: "Opulent interior concept.",
      thumbnail: "/portfolio/public/render/symphony-of-gold-and-black/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/symphony-of-gold-and-black/1.png", // <-- Updated path
        "/portfolio/public/render/symphony-of-gold-and-black/2.png", // <-- Update filename if different
      ],
    },
     {
      id: 10,
      title: "The Soft Edge",
      description: "Visualization with soft transitions.",
      thumbnail: "/portfolio/public/render/the-soft-edge/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/the-soft-edge/1.png", // <-- Updated path
        "/portfolio/public/render/the-soft-edge/2.png",
      ],
    },
      {
      id: 11,
      title: "The Urban Escape",
      description: "Relaxing urban balcony/terrace.",
      thumbnail: "/portfolio/public/render/the-urban-escape/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/the-urban-escape/1.png", // <-- Updated path
         "/portfolio/public/render/the-urban-escape/2.png", // <-- Update filename if different
      ],
    },
       {
      id: 12,
      title: "The Urban Villa",
      description: "Modern villa in an urban setting.",
      thumbnail: "/portfolio/public/render/the-urban-villa/1.png", // <-- Updated path
      images: [
        "/portfolio/render/public/the-urban-villa/1.png", // <-- Updated path
      ],
    },
      {
      id: 13,
      title: "Velocity Vault",
      description: "Futuristic vehicle showcase.",
      thumbnail: "/portfolio/public/render/velocity-vault/1.png", // <-- Updated path
      images: [
        "/portfolio/public/render/velocity-vault/1.png", // <-- Updated path
        "/portfolio/public/render/velocity-vault/2.png",
      ],
    },
    // Add the rest of your projects following this pattern, updating paths and filenames
    // {
    //   id: N,
    //   title: "Project Name",
    //   description: "Brief description.",
    //   thumbnail: "/portfolio/render/your-project-name/1.png",
    //   images: [
    //     "/portfolio/render/your-project-name/1.png",
    //     "/portfolio/render/your-project-name/2.png",
    //     // ... more images
    //   ],
    // },
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
      {/* Max width container with padding */}
      <div className="max-w-7xl mx-auto px-6" ref={sectionRef}>
        {/* Title and Description - Apply Framer Motion */}
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

        {/* Swiper Slider for the Grid */}
        {/* Apply Framer Motion variants to the Swiper container itself */}
        {/* Adding a relative position to the container for absolute positioned arrows */}
        <motion.div variants={containerVariants} initial="hidden" animate={controls} className="relative">
            <Swiper
                modules={[Grid, Pagination, Navigation]}
                slidesPerView={1} // Default 1 item per slide
                grid={{
                    rows: 6, // 6 rows per page (1 col * 6 rows = 6 items)
                    fill: 'row',
                }}
                spaceBetween={24} // Gap between grid items
                pagination={{
                    el: '.swiper-pagination-custom', // Use a custom element for pagination
                    clickable: true,
                }}
                navigation={{
                    nextEl: '.swiper-button-next-custom', // Custom class for next button
                    prevEl: '.swiper-button-prev-custom', // Custom class for prev button
                     disabledClass: 'opacity-50 cursor-not-allowed', // Style for disabled buttons
                }}
                 // Responsive breakpoints for the grid layout
                breakpoints={{
                    640: { // sm breakpoint
                        slidesPerView: 2, // Show 2 columns
                        grid: {
                            rows: 3, // 3 rows * 2 columns = 6 items per page
                            fill: 'row',
                        },
                        spaceBetween: 24,
                    },
                    1024: { // lg breakpoint
                        slidesPerView: 3, // Show 3 columns
                         grid: {
                            rows: 2, // 2 rows * 3 columns = 6 items per page
                            fill: 'row',
                        },
                        spaceBetween: 24,
                    },
                }}
                 // Adding a minimum height to the swiper container to prevent layout shifts while loading
                 // and ensure pagination/nav buttons are positioned correctly.
                style={{ minHeight: '600px', paddingBottom: '40px' }} // Adjust height and padding for pagination space
                className="portfolio-swiper" // Custom class for potential styling
            >
                {/* Map over all portfolio items. Swiper handles which ones are visible per slide */}
                {portfolioItems.map((item) => (
                    <SwiperSlide key={item.id}>
                        {/* Wrap the item content in motion.div for stagger animation */}
                        <motion.div
                            variants={itemVariants} // Use the same itemVariants for individual items
                            className="group relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
                             // Pass the item's images array to the openModal function
                            onClick={() => openModal(item.images)} // Open with the first image (index 0)
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
                                {/* Use thumbnail for the grid view */}
                                <Image
                                    src={item.thumbnail}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    // Adjust sizes attribute for better performance based on the grid layout breakpoints
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    // Set priority for the first page items to optimize LCP
                                    priority={item.id <= 6} // Assuming the first 6 items are on the initial page
                                     // Optional: add unoptimized prop if image optimization is suspected
                                     // unoptimized={true}
                                />
                                {/* Overlay for title and description */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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

                                 {/* Icon Overlay (Generic View Icon) */}
                                 <motion.div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div
                                      className="bg-purple-600 rounded-full p-3 flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-expand text-white"><rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21v-4a3 3 0 0 0-3-3H3"/><path d="M21 14h-4a3 3 0 0 0-3 3v4"/></svg>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Arrows - Positioned relative to the parent motion.div */}
            {/* Needs z-index to be above Swiper content */}
            {/* Use translate to position them outside the content area if desired */}
            <div className="swiper-button-prev-custom absolute top-1/2 left-0 z-10 transform -translate-y-1/2 cursor-pointer bg-black/50 rounded-full p-2">
                <ChevronLeft className="h-8 w-8 text-white" />
            </div>
            <div className="swiper-button-next-custom absolute top-1/2 right-0 z-10 transform -translate-y-1/2 cursor-pointer bg-black/50 rounded-full p-2">
                 <ChevronRight className="h-8 w-8 text-white" />
            </div>

             {/* Custom Pagination */}
             {/* Position this below the swiper */}
            <div className="swiper-pagination-custom mt-8 text-center relative z-10"></div>


        </motion.div> {/* End Swiper container motion.div */}

        {/* Image Gallery Modal */}
        {/* Render the new modal component conditionally */}
        <ImageGalleryModal
          isOpen={isModalOpen}
          images={modalImages}
          initialIndex={modalInitialIndex}
          onClose={closeModal}
        />

      </div> {/* End max-w-7xl div */}
    </section>
  )
}
