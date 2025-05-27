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
    const modalContentRef = useRef<HTMLDivElement>(null); // Ref for outside click detection

    // Sync internal state when initialIndex prop changes (e.g., opening different projects)
    useEffect(() => {
        if (isOpen) {
             // Ensure the index is valid for the current set of images
            setCurrentImageIndex(Math.min(initialIndex, images.length - 1));
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
         if (index >= 0 && index < images.length) {
             setCurrentImageIndex(index);
         }
     }, [images.length]);


    // Keyboard Navigation and Escape to close
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return; // Only handle keys if modal is open

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
    }, [isOpen, goToNext, goToPrevious, onClose]); // Dependencies include state/props used in handlers


    // Outside click to close modal
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            // Check if the modal is open AND the click happened outside the modal content area
            if (isOpen && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                 // Additional check to ensure the click wasn't on the backdrop which should close it
                 // We only want to prevent closing if the click was *inside* modalContentRef BUT NOT
                 // on specifically designated interactive elements *within* modalContentRef
                 // However, since modalContentRef covers the main content area, we mostly rely on the
                 // !modalContentRef.current.contains check. If you need more granular control,
                 // you'd check event.target's classes/ids.
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
             document.body.style.overflow = ''; // Or 'visible'
         }
         return () => {
             document.body.style.overflow = ''; // Clean up on unmount
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
             x: direction > 0 ? 100 : -100, // Slide in from right (+1) or left (-1)
             opacity: 0,
         }),
         animate: {
             x: 0,
             opacity: 1,
             transition: {
                 duration: 0.3, // Adjust duration
                 ease: "easeOut" // Adjust easing
             }
         },
         exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100, // Slide out to left (+1) or right (-1)
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


    if (!isOpen) return null; // Don't render anything if not open

    // Add a check for empty images array
    if (!images || images.length === 0) {
         console.warn("ImageGalleryModal opened with an empty or null image array.");
         return null; // Or render an error/message
    }


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" // Full screen overlay
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Modal Content Container - Add ref for outside click */}
                    {/* This div contains the main image and thumbnails */}
                    <div ref={modalContentRef} className="relative w-full max-w-6xl max-h-[95vh] flex flex-col bg-gray-900 rounded-lg overflow-hidden"> {/* Adjusted max-h and max-w */}

                        {/* Close Button */}
                        <button
                             onClick={onClose}
                             className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors rounded-full bg-black/30 p-1"
                            aria-label="Close"
                        >
                             <X className="h-6 w-6" />
                         </button>

                        {/* Main Image Area */}
                         <div className="relative w-full flex-grow flex items-center justify-center p-4 overflow-hidden"> {/* Added overflow-hidden, padding */}
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                     key={images[currentImageIndex]} // Use image path as key for better transition
                                     custom={direction} // Pass direction to variants
                                     variants={imageVariants}
                                     initial="initial"
                                     animate="animate"
                                     exit="exit"
                                     className="relative w-full h-full flex items-center justify-center" // Added flex centering
                                >
                                    <Image
                                        src={images[currentImageIndex]}
                                        alt={`Portfolio image ${currentImageIndex + 1}`}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 80vw" // Adjust sizes based on modal max-width
                                        className="object-contain rounded-md" // object-contain to fit image without cropping
                                        priority={currentImageIndex === initialIndex} // Prioritize the initially opened image
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            {images.length > 1 && ( // Only show arrows if more than one image
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
                         {images.length > 1 && ( // Only show thumbnails if more than one image
                             <div className="w-full flex-shrink-0 px-4 py-2 overflow-x-auto"> {/* Added px-4 py-2, overflow-x-auto */}
                                <div className="flex gap-3 justify-center"> {/* Center thumbnails */}
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
