import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ThreeDCarousel
 * A premium 3D "Coverflow" style carousel for displaying teacher cards.
 * Uses Framer Motion for smooth animations.
 */
const ThreeDCarousel = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance logic (optional, currently disabled for better UX control)
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setCurrentIndex((prev) => (prev + 1) % items.length);
    //     }, 5000);
    //     return () => clearInterval(timer);
    // }, [items.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="carousel-3d-container">
            <div className="carousel-viewport">
                <AnimatePresence mode="popLayout">
                    {items.map((item, index) => {
                        // Calculate position relative to current index
                        // We strictly handle circular wrapping logic for 3 positions: Center, Left, Right

                        let position = "hidden"; // Default

                        // Center
                        if (index === currentIndex) {
                            position = "center";
                        }
                        // Right (Next)
                        else if (index === (currentIndex + 1) % items.length) {
                            position = "right";
                        }
                        // Left (Prev)
                        else if (index === (currentIndex - 1 + items.length) % items.length) {
                            position = "left";
                        }

                        // For arrays with only 2 items, we need special handling to avoid conflict
                        if (items.length === 2 && position === "left") position = "hidden"; // Hide duplicate logic

                        // If array is large enough, we can show "far" items optionally, but keeping it simple to 3 is cleaner

                        // Variants for animation
                        const variants = {
                            center: {
                                x: 0,
                                scale: 1,
                                zIndex: 10,
                                opacity: 1,
                                rotateY: 0,
                                filter: "brightness(1)",
                                transition: { type: "spring", stiffness: 300, damping: 30 }
                            },
                            left: {
                                x: "-15%",
                                scale: 0.85,
                                zIndex: 5,
                                opacity: 0.7,
                                rotateY: 15, // Tilt inward
                                filter: "brightness(0.7) blur(1px)",
                                transition: { duration: 0.4 }
                            },
                            right: {
                                x: "15%",
                                scale: 0.85,
                                zIndex: 5,
                                opacity: 0.7,
                                rotateY: -15, // Tilt inward
                                filter: "brightness(0.7) blur(1px)",
                                transition: { duration: 0.4 }
                            },
                            hidden: {
                                x: 0,
                                scale: 0.5,
                                zIndex: 0,
                                opacity: 0,
                                transition: { duration: 0.2 }
                            }
                        };

                        // Only render if relevant position (optimization)
                        if (position === "hidden" && items.length > 3) return null;

                        return (
                            <motion.div
                                key={index}
                                variants={variants}
                                initial="hidden"
                                animate={position}
                                className="carousel-card-wrapper"
                                style={{
                                    position: position === "center" ? "relative" : "absolute",
                                    // Absolute positioning for side cards allows them to overlap properly
                                    top: position === "center" ? 0 : "50%",
                                    translateY: position === "center" ? 0 : "-50%",
                                    left: position === "center" ? 0 : position === "left" ? "0" : "auto",
                                    right: position === "right" ? "0" : "auto",
                                    marginLeft: position === "center" ? "auto" : 0,
                                    marginRight: position === "center" ? "auto" : 0,
                                    width: "100%", // Controlled by max-width in CSS
                                }}
                            >
                                {item}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            {items.length > 1 && (
                <div className="carousel-controls">
                    <button onClick={handlePrev} className="control-btn" aria-label="Previous">
                        <ChevronLeft size={24} />
                    </button>

                    <div className="carousel-dots">
                        {items.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`dot ${idx === currentIndex ? "active" : ""}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button onClick={handleNext} className="control-btn" aria-label="Next">
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}

            <style>{`
                .carousel-3d-container {
                    width: 100%;
                    max-width: 500px; /* Limit width specifically for mobile/tablet */
                    margin: 0 auto;
                    perspective: 1000px; /* Essential for 3D effect */
                    padding: 2rem 0;
                    overflow: visible; /* Allow shadows/tilts to spill slightly */
                }

                .carousel-viewport {
                    position: relative;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 450px; /* Fixed height to accommodate cards */
                }

                .carousel-card-wrapper {
                    width: 100%;
                    max-width: 320px; /* Standard card width */
                    backface-visibility: hidden;
                    transform-style: preserve-3d;
                }

                /* Ensure inner card fits */
                .carousel-card-wrapper > div {
                    height: 100%;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3) !important; /* Enhanced shadow for 3D feel */
                }

                .carousel-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 1rem;
                    padding: 0 1rem;
                }

                .control-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: white;
                    border: 1px solid #e2e8f0;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                    z-index: 20;
                }

                .control-btn:active {
                    transform: scale(0.95);
                    background: #f1f5f9;
                }

                .carousel-dots {
                    display: flex;
                    gap: 8px;
                }

                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #cbd5e1;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .dot.active {
                    background: #dc2626;
                    transform: scale(1.2);
                    width: 24px; /* Pill shape for active */
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default ThreeDCarousel;
