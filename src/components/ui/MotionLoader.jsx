import React from 'react';
import { motion } from 'framer-motion';
import './MotionLoader.css';

const MotionLoader = ({ message = "BUGISU HIGH SCHOOL" }) => {
    return (
        <div className="motion-loader-container">
            <div className="motion-loader-content">
                <motion.div
                    className="motion-loader-logo"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    <svg width="80" height="80" viewBox="0 0 100 100">
                        <motion.path
                            d="M 20 80 L 50 20 L 80 80 Z"
                            fill="none"
                            stroke="var(--academics-primary, #1e90ff)"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="rgba(30, 144, 255, 0.1)"
                            strokeWidth="2"
                        />
                    </svg>
                </motion.div>

                <motion.div className="motion-loader-text">
                    {message.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.05,
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 1.5,
                                repeatType: "reverse"
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </motion.div>

                <motion.div
                    className="motion-loader-progress"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    );
};

export default MotionLoader;
