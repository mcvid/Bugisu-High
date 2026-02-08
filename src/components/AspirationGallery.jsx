import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './ui/OptimizedImage';
import './AspirationGallery.css';

const AspirationGallery = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll logic for mobile
    useEffect(() => {
        if (!images.length) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    if (!images || images.length === 0) return null;

    return (
        <div className="aspiration-gallery-wrapper">

            {/* MOBILE: AUTO-SCROLL CAROUSEL */}
            <div className="gallery-mobile-card">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="frame-image-container"
                    >
                        <OptimizedImage
                            src={images[currentIndex]}
                            alt={`School Aspiration ${currentIndex + 1}`}
                            aspectRatio="1/1"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Carousel Indicators */}
                <div className="carousel-indicators">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className={`carousel-dot ${i === currentIndex ? "active" : "inactive"}`}
                        />
                    ))}
                </div>
            </div>

            {/* DESKTOP: STAGGERED HANGING FRAMES */}
            <div className="gallery-desktop-hanging">
                {/* Strings coming from top */}
                <div className="hanging-string string-1" />
                <div className="hanging-string string-2" />
                <div className="hanging-string string-3" />

                <div className="relative w-full h-full">
                    {/* Top Left Image */}
                    {images[0] && (
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hanging-frame frame-1"
                        >
                            <div className="frame-clip">
                                <div className="clip-line" />
                            </div>
                            <div className="frame-image-container">
                                <OptimizedImage src={images[0]} aspectRatio="4/5" alt="Gallery 1" />
                            </div>
                        </motion.div>
                    )}

                    {/* Top Right Image */}
                    {images[2] && (
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="hanging-frame frame-3"
                        >
                            <div className="frame-clip">
                                <div className="clip-line" />
                            </div>
                            <div className="frame-image-container">
                                <OptimizedImage src={images[2]} aspectRatio="4/5" alt="Gallery 3" />
                            </div>
                        </motion.div>
                    )}

                    {/* Bottom Middle Image (Overlapping & Staggered) */}
                    {images[1] && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="hanging-frame frame-2"
                        >
                            <div className="frame-clip">
                                <div className="clip-line" />
                            </div>
                            <div className="frame-image-container">
                                <OptimizedImage src={images[1]} aspectRatio="4/5" alt="Gallery 2" />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AspirationGallery;
