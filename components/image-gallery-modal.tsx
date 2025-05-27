// components/image-gallery-modal.tsx
"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryModalProps {
    isOpen: boolean;
    images: string[];
    initialIndex?: number;
    onClose: () => void;
}

export default function ImageGalleryModal({
    isOpen,
    images,
    initialIndex = 0,
    onClose,
}: ImageGalleryModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
    // Use a ref for the main modal content container for outside click detection
    const modalContentRef = useRef<HTMLDivElement>(null);

    // Sync internal state when initialIndex prop changes (e.g., opening different projects)
    useEffect(() => {
        if (isOpen) {
             // Ensure the index is valid for the current set of images
            setCurrentImageIndex(Math.min(initialIndex, images.length > 0 ? images.length - 1 : 0)); // Handle empty images array
        }
    }, [isOpen, initialIndex, images]); // Re-run if modal opens, initial index, or image list changes

    const goToNext = useCallback(() => {
        if (images.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    }, [images.length]);

    const goToPrevious = useCallback(() => {
        if (images.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        }
    }, [images.length]);

     const goToImage = useCallback((index: number) => {
         if (images && index >= 0 && index < images.length) {
             setCurrentImageIndex(index);
         }
     }, [images]);


    // Keyboard Navigation and Escape to close
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            if (event.key === 'ArrowRight') {
                goToNext();
            } else if (event.key === 'ArrowLeft') {
                goToPrevious();
            } else if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, goToNext, goToPrevious, onClose]);


    // Outside click to close modal
     useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            // Check if the modal is open AND the click target is outside the modal content container
            if (isOpen && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                 // If click is outside the main content area, close the modal
                 onClose();
            }
        };

         // Add a small delay before attaching the click listener to avoid immediate closing
         // if the click that opened the modal also registers outside it.
         const timer = setTimeout(() => {
             document.addEventListener('mousedown', handleOutsideClick);
         }, 100);


        return () => {
             clearTimeout(timer);
             document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);


    // Ensure body scroll is locked when modal is open
     useEffect(() => {
         if (isOpen) {
             document.body.style.overflow = 'hidden';
         } else {
             document.body.style.overflow = '';
         }
         return () => {
             document.body.style.overflow = '';
         };
     }, [isOpen]);


    // Variants for modal animation
    const modalVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    // Variants for image transition animation
     const imageVariants = {
         initial: (direction: number) => ({
             x: direction > 0 ? 100 : -100,
             opacity: 0,
         }),
         animate: {
             x: 0,
             opacity: 1,
             transition: {
                 duration: 0.3,
                 ease: "easeOut"
             }
         },
         exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
             transition: {
                 duration: 0.3,
                 ease: "easeOut"
             }
         }),
     };

     // Determine direction for image transition (used with custom prop in AnimatePresence)
     const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
     const prevImageIndexRef = useRef(initialIndex);

     useEffect(() => {
        if (currentImageIndex !== prevImageIndexRef.current) {
            setDirection(currentImageIndex > prevImageIndexRef.current ? 1 : -1);
            prevImageIndexRef.current = currentImageIndex;
        }
     }, [currentImageIndex]);


    if (!isOpen) return null;

    // Add a check for empty images array
    if (!images || images.length === 0) {
         console.warn("ImageGalleryModal opened with an empty or null image array.");
         // If images are missing, close the modal instead of returning null immediately
         // This prevents the modal from being 'stuck' open if it was opened with bad data.
         onClose();
         return null; // Still return null for this render cycle
    }


    return (
        <AnimatePresence>
            {isOpen && ( // Keep the conditional render inside AnimatePresence
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Modal Content Container - Now has the main padding */}
                    {/* Adjusted max-h slightly to leave some space for the top padding + close button */}
                    <div ref={modalContentRef} className="relative w-full max-w-6xl max-h-[calc(100vh-6rem)] lg:max-h-[95vh] flex flex-col bg-gray-900 rounded-lg overflow-hidden p-4">

                        {/* Close Button */}
                        <button
                             onClick={onClose}
                             className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors rounded-full bg-black/30 p-1"
                            aria-label="Close"
                        >
                             <X className="h-6 w-6" />
                         </button>

                        {/* Main Image Area - Relies on flex-grow */}
                         <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                     key={images[currentImageIndex]}
                                     custom={direction}
                                     variants={imageVariants}
                                     initial="initial"
                                     animate="animate"
                                     exit="exit"
                                     // This div holds the Image, it needs w-full h-full for Image fill to work
                                     className="relative w-full h-full flex items-center justify-center"
                                >
                                    <Image
                                        src={images[currentImageIndex]}
                                        alt={`Portfolio image ${currentImageIndex + 1}`}
                                        fill
                                        // sizes prop helps Next.js optimize, doesn't strictly control rendered size with `fill`
                                        // The size is determined by the parent's layout.
                                        // Keep reasonable sizes, perhaps slightly larger to account for modal size.
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 70vw"
                                        className="object-contain rounded-md" // object-contain is correct for fitting
                                        priority={currentImageIndex === initialIndex}
                                         // Optional: add unoptimized prop if you suspect issues with Next.js Image component optimization
                                         // unoptimized={true}
                                    />
                                    {/* Console log inside the JSX can sometimes cause hydration issues */}
                                    {/* {console.log("Modal Main Image path:", images[currentImageIndex])} */}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={goToPrevious}
                                         className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors rounded-full bg-black/30 p-2"
                                         aria-label="Previous image"
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                         className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors rounded-full bg-black/30 p-2"
                                         aria-label="Next image"
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                    </button>
                                </>
                            )}
                         </div>


                        {/* Thumbnails Strip */}
                         {images.length > 1 && (
                             {/* This container now needs vertical padding */}
                             <div className="w-full flex-shrink-0 px-4 py-2 overflow-x-auto">
                                <div className="flex gap-3 justify-center">
                                    {images.map((imagePath, index) => (
                                        <motion.div
                                            key={index}
                                            className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden cursor-pointer border-2 ${
                                                index === currentImageIndex ? 'border-purple-500' : 'border-transparent'
                                            } transition-colors`}
                                            onClick={() => goToImage(index)}
                                             whileHover={{ scale: 1.05 }}
                                             whileTap={{ scale: 0.95 }}
                                        >
                                            <Image
                                                src={imagePath}
                                                alt={`Thumbnail ${index + 1}`}
                                                fill
                                                sizes="64px" // Fixed size for thumbnails
                                                className="object-cover"
                                            />
                                            {/* Console log inside JSX can sometimes cause hydration issues */}
                                            {/* {console.log(`Modal Thumbnail ${index}:`, imagePath)} */}
                                            {/* Optional: Add overlay for non-selected thumbnails */}
                                             {index !== currentImageIndex && (
                                                 <div className="absolute inset-0 bg-black/50"></div>
                                             )}
                                        </motion.div>
                                    ))}
                                </div>
                             </div>
                         )}

                    </div> {/* End Modal Content Container */}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
