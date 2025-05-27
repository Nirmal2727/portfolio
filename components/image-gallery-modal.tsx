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
    const modalContentRef = useRef<HTMLDivElement>(null);

    // Sync internal state when initialIndex prop changes
    useEffect(() => {
        if (isOpen) {
            setCurrentImageIndex(Math.min(initialIndex, images.length - 1));
        }
    }, [isOpen, initialIndex, images]);

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

    // Keyboard Navigation
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
            if (isOpen && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleOutsideClick);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    // Lock body scroll when modal is open
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

    // Modal animation variants
    const modalVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    // Image transition variants
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

    // Direction tracking for image transitions
    const [direction, setDirection] = useState(0);
    const prevImageIndexRef = useRef(initialIndex);

    useEffect(() => {
        if (currentImageIndex !== prevImageIndexRef.current) {
            setDirection(currentImageIndex > prevImageIndexRef.current ? 1 : -1);
            prevImageIndexRef.current = currentImageIndex;
        }
    }, [currentImageIndex]);

    if (!isOpen) return null;

    if (!images || images.length === 0) {
        console.warn("ImageGalleryModal opened with an empty or null image array.");
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Modal Content Container */}
                    <div ref={modalContentRef} className="relative w-full h-full max-w-7xl flex flex-col p-4">
                        
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-20 text-white hover:text-gray-300 transition-colors rounded-full bg-black/50 p-2"
                            aria-label="Close"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Main Image Area - Now takes most of the screen */}
                        <div className="relative flex-1 flex items-center justify-center mb-4 min-h-0">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={images[currentImageIndex]}
                                    custom={direction}
                                    variants={imageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="relative w-full h-full flex items-center justify-center"
                                >
                                    <div className="relative w-full h-full max-w-6xl max-h-full">
                                        <Image
                                            src={images[currentImageIndex]}
                                            alt={`Portfolio image ${currentImageIndex + 1}`}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 90vw"
                                            className="object-contain rounded-lg"
                                            priority={currentImageIndex === initialIndex}
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={goToPrevious}
                                        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors rounded-full bg-black/50 p-3 hover:bg-black/70"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors rounded-full bg-black/50 p-3 hover:bg-black/70"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails Strip */}
                        {images.length > 1 && (
                            <div className="flex-shrink-0 w-full px-4 py-3 overflow-x-auto">
                                <div className="flex gap-3 justify-center">
                                    {images.map((imagePath, index) => (
                                        <motion.div
                                            key={index}
                                            className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
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
                                                sizes="80px"
                                                className="object-cover"
                                            />
                                            {index !== currentImageIndex && (
                                                <div className="absolute inset-0 bg-black/50"></div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
