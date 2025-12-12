import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselProps {
    children: React.ReactNode;
    className?: string;
    autoPlay?: boolean;
    interval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
    children,
    className = '',
    autoPlay = false,
    interval = 3000,
}) => {
    const [page, setPage] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const childrenArray = React.Children.toArray(children);
    const count = childrenArray.length;

    const paginate = useCallback((newDirection: number) => {
        setPage((prev) => (prev + newDirection + count) % count);
    }, [count]);

    useEffect(() => {
        if (!autoPlay || isPaused || count <= 1) return;

        const timer = setInterval(() => {
            paginate(1);
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, isPaused, interval, paginate, count]);

    if (count === 0) return null;

    const getProperties = (index: number) => {
        // Calculate the relative index to the current page, ensuring correct wrapping
        let relativeIndex = (index - page + count) % count;
        // Adjust for negative wrapping (e.g., if page is 0, last item should appear as -1)
        if (relativeIndex > count / 2) relativeIndex -= count;

        if (relativeIndex === 0) {
            // Center Item
            return {
                x: '0%',
                scale: 1,
                opacity: 1,
                zIndex: 10,
                display: 'block',
            };
        } else if (relativeIndex === -1 || (relativeIndex === count - 1 && count > 1)) {
            // Left Item (Prev)
            return {
                x: '-60%', // Partially seen on left
                scale: 0.85,
                opacity: 0.4,
                zIndex: 5,
                display: 'block',
            };
        } else if (relativeIndex === 1 || (relativeIndex === -(count - 1) && count > 1)) {
            // Right Item (Next)
            return {
                x: '60%', // Partially seen on right
                scale: 0.85,
                opacity: 0.4,
                zIndex: 5,
                display: 'block',
            };
        } else {
            // Hidden Items
            return {
                x: relativeIndex < 0 ? '-100%' : '100%', // Move out of view
                scale: 0.5,
                opacity: 0,
                zIndex: 0,
                display: 'none', // Hide from DOM flow interactions
            };
        }
    };

    return (
        <div
            className={`relative group overflow-hidden ${className} flex justify-center items-center h-[450px]`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Left Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(-1)}
                className="absolute left-4 z-30 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/20 text-slate-700 hover:text-primary transition-all focus:outline-none hidden md:block"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </motion.button>

            {/* Carousel Track */}
            <div className="relative w-full max-w-sm md:max-w-md h-full flex items-center justify-center">
                <AnimatePresence initial={false} mode="popLayout">
                    {childrenArray.map((child, index) => {
                        const props = getProperties(index);
                        return (
                            <motion.div
                                key={index}
                                animate={props}
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    scale: { duration: 0.4 },
                                    opacity: { duration: 0.4 }
                                }}
                                className="absolute w-full px-2"
                                style={{
                                    transformOrigin: 'center center',
                                }}
                            >
                                {child}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Right Button */}
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(1)}
                className="absolute right-4 z-30 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/20 text-slate-700 hover:text-primary transition-all focus:outline-none hidden md:block"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </motion.button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {childrenArray.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setPage(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === page ? 'bg-primary w-6' : 'bg-slate-300 hover:bg-slate-400'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
