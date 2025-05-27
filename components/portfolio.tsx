// components/portfolio.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useInView, useAnimation } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react" // Chevron icons for slider nav

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper modules
import { Grid, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import our new image gallery modal component
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
    // Modal state is cleared in the ImageGalleryModal component's useEffect
  };


  // Portfolio Data based on the directory structure
  // !! IMPORTANT: These paths MUST EXACTLY MATCH the case and extension
  //               of the files in your public/portfolio/render/ directory on the server !!
  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: "Contemporary Bathroom Design",
      description: "Stylish and modern bathroom visualization.",
      thumbnail: "/portfolio/render/Contemporary Bathroom Design/1.png", // Using .png extension
      images: [
        "/portfolio/render/Contemporary Bathroom Design/1.png",
        "/portfolio/render/Contemporary Bathroom Design/2.png",
        "/portfolio/render/Contemporary Bathroom Design/3.png",
        // Add all actual image paths for this project here
        // e.g., "/portfolio/render/Contemporary Bathroom Design/render_final.png",
        // e.g., "/portfolio/render/Contemporary Bathroom Design/wireframe.png",
      ],
    },
    {
      id: 2,
      title: "Contemporary Canopy Suit",
      description: "Elegant canopy design visualization.",
      thumbnail: "/portfolio/render/Contemporary Canopy Suit/1.png", // Using .png extension
      images: [
        "/portfolio/render/Contemporary Canopy Suit/1.png",
        "/portfolio/render/Contemporary Canopy Suit/2.png",
        "/portfolio/render/Contemporary Canopy Suit/3.png",
        // Add all actual image paths for this project here
      ],
    },
     {
      id: 3,
      title: "Environmental Lighting Showcase",
      description: "Render focusing on lighting techniques.",
      thumbnail: "/portfolio/render/Environmental Lighting Showcase/1.png", // Using .png extension
      images: [
        "/portfolio/render/Environmental Lighting Showcase/1.png",
        "/portfolio/render/Environmental Lighting Showcase/2.png",
        "/portfolio/render/Environmental Lighting Showcase/3.png",
        "/portfolio/render/Environmental Lighting Showcase/4.png",
        "/portfolio/render/Environmental Lighting Showcase/5.png",
        "/portfolio/render/Environmental Lighting Showcase/6.png",
         // Add all actual image paths for this project here
      ],
    },
     {
      id: 4,
      title: "Luxe Green Bathroom",
      description: "Luxury bathroom with green accents.",
      thumbnail: "/portfolio/render/Luxe Green Bathroom/1.png", // Using .png extension
      images: [
        "/portfolio/render/Luxe Green Bathroom/1.png",
        "/portfolio/render/Luxe Green Bathroom/2.png",
        "/portfolio/render/Luxe Green Bathroom/2.png",
        // Add all actual image paths for this project here
      ],
    },
     {
      id: 5,
      title: "Modern Luxury Dining",
      description: "High-end dining area visualization.",
      thumbnail: "/portfolio/render/Modern Luxury Dining/1.png", // Using .png extension
      images: [
        "/portfolio/render/Modern Luxury Dining/1.png",
        "/portfolio/render/Modern Luxury Dining/2.png",
        "/portfolio/render/Modern Luxury Dining/3.png",
        "/portfolio/render/Modern Luxury Dining/4.png",
        // Add all actual image paths for this project here
      ],
    },
    {
      id: 6,
      title: "Neon Streets",
      description: "Urban scene with neon lighting.",
      thumbnail: "/portfolio/render/Neon Streets/1.png", // Using .png extension
      images: [
        "/portfolio/render/Neon Streets/1.png",
        // Add all actual image paths for this project here
      ],
    },
     {
      id: 7,
      title: "Noir Serenity",
      description: "Dark and serene visualization.",
      thumbnail: "/portfolio/render/Noir Serenity/1.png", // Using .png extension
      images: [
        "/portfolio/render/Noir Serenity/1.png",
        "/portfolio/render/Noir Serenity/2.png",
         // Add all actual image paths for this project here
      ],
    },
     {
      id: 8,
      title: "Olive Hues & Modern Views",
      description: "Contemporary space with olive tones.",
      thumbnail: "/portfolio/render/Olive Hues & Modern Views/1.png", // Using .png extension
      images: [
        "/portfolio/render/Olive Hues & Modern Views/1.png",
        "/portfolio/render/Olive Hues & Modern Views/2.png",
        "/portfolio/render/Olive Hues & Modern Views/3.png",
        "/portfolio/render/Olive Hues & Modern Views/4.png",
        "/portfolio/render/Olive Hues & Modern Views/5.png",
         // Add all actual image paths for this project here
      ],
    },
     {
      id: 9,
      title: "Symphony of Gold and Black",
      description: "Opulent interior concept.",
      thumbnail: "/portfolio/render/Symphony of Gold and Black/1.png", // Using .png extension
      images: [
        "/portfolio/render/Symphony of Gold and Black/1.png",
        "/portfolio/render/Symphony of Gold and Black/2.png",
         // Add all actual image paths for this project here
      ],
    },
     {
      id: 10,
      title: "The Soft Edge",
      description: "Visualization with soft transitions.",
      thumbnail: "/portfolio/render/The Soft Edge/1.png", // Using .png extension
      images: [
        "/portfolio/render/The Soft Edge/1.png",
        "/portfolio/render/The Soft Edge/2.png",
        // Add all actual image paths for this project here
      ],
    },
      {
      id: 11,
      title: "The Urban Escape",
      description: "Relaxing urban balcony/terrace.",
      thumbnail: "/portfolio/render/The Urban Escape/1.png", // Using .png extension
      images: [
        "/portfolio/render/The Urban Escape/1.png",
         "/portfolio/render/The Urban Escape/2.png",
          // Add all actual image paths for this project here
      ],
    },
       {
      id: 12,
      title: "The Urban Villa",
      description: "Modern villa in an urban setting.",
      thumbnail: "/portfolio/render/The Urban Villa/1.png", // Using .png extension
      images: [
        "/portfolio/render/The Urban Villa/1.png",
           // Add all actual image paths for this project here
      ],
    },
      {
      id: 13,
      title: "Velocity Vault",
      description: "Futuristic vehicle showcase.",
      thumbnail: "/portfolio/render/Velocity Vault/1.png", // Using .png extension
      images: [
        "/portfolio/render/Velocity Vault/1.png",
        "/portfolio/render/Velocity Vault/2.png",
         // Add all actual image paths for this project here
      ],
    },
    // Add the rest of your projects following this pattern
    // Ensure paths and extensions are correct!
  ];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced stagger for slider items
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4, // Reduced duration slightly
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
                                    // Prioritize loading for the first page of items (adjust based on items per page)
                                    priority={item.id <= 6}
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
                                 {/* Only show if there's at least one image */}
                                 {item.images && item.images.length > 0 && (
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div
                                          className="bg-purple-600 rounded-full p-3 flex items-center justify-center"
                                        >
                                            {/* Icon indicating view or expand */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-expand text-white"><rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21v-4a3 3 0 0 0-3-3H3"/><path d="M21 14h-4a3 3 0 0 0-3 3v4"/></svg>
                                        </div>
                                    </motion.div>
                                  )}

                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Arrows - Positioned relative to the parent motion.div */}
            {/* Needs z-index to be above Swiper content */}
             {/* Adjust positioning as needed */}
            <div className="swiper-button-prev-custom absolute top-1/2 left-0 z-10 transform -translate-y-1/2 cursor-pointer bg-black/50 rounded-full p-2 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronLeft className="h-8 w-8 text-white" />
            </div>
            <div className="swiper-button-next-custom absolute top-1/2 right-0 z-10 transform -translate-y-1/2 cursor-pointer bg-black/50 rounded-full p-2 group-hover:opacity-100 transition-opacity duration-300">
                 <ChevronRight className="h-8 w-8 text-white" />
            </div>

             {/* Custom Pagination Element */}
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
