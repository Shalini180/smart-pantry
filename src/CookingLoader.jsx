import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
    "Deciphering Ingredients...",
    "Measuring Sugar Levels...",
    "Detecting Hidden Fats...",
    "Calibrating Toxicity Scanner...",
    "Consulting WHO Guidelines...",
    "Preparing Health Report..."
];

const CookingLoader = () => {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            {/* The Knife Animation */}
            <div className="relative w-32 h-32 mb-8">
                {/* Cutting Board */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-700 rounded-full" />

                {/* The Knife */}
                <motion.div
                    animate={{
                        rotate: [0, -15, 0],
                        y: [0, -20, 0],
                        x: [0, 5, 0]
                    }}
                    transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute left-1/2 bottom-4 w-4 h-24 bg-gradient-to-b from-slate-300 to-slate-100 rounded-sm origin-bottom-left shadow-lg"
                    style={{ x: '-50%' }}
                >
                    {/* Handle */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-wood-800 bg-amber-900 rounded-t-sm" />
                    {/* Blade Shine */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
                </motion.div>

                {/* Flying Particles (Ingredients) */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -40, 0],
                            x: [0, (i % 2 === 0 ? 30 : -30), 0],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeOut"
                        }}
                        className={`absolute bottom-2 left-1/2 w-3 h-3 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-red-500' : 'bg-yellow-500'
                            }`}
                    />
                ))}
            </div>

            {/* Cycling Text */}
            <div className="h-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={msgIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-xl font-mono text-electric-blue font-bold tracking-wider"
                    >
                        {MESSAGES[msgIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CookingLoader;
