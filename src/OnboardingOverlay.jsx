import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBasket, Sparkles, ArrowRight, Check } from 'lucide-react';

const OnboardingOverlay = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            id: 'welcome',
            title: "Welcome to SafeShelf",
            description: "Let's get your kitchen smart, organized, and waste-free.",
            icon: Sparkles,
            color: "text-electric-blue",
            position: "center"
        },
        {
            id: 'search',
            title: "Find & Add Products",
            description: "Start by searching for items to add to your pantry. We analyze ingredients automatically.",
            icon: Search,
            color: "text-electric-teal",
            position: "top-24" // Approximate position for search bar
        },
        {
            id: 'pantry',
            title: "Track Freshness",
            description: "Your pantry tracks expiry dates and freshness in real-time.",
            icon: ShoppingBasket,
            color: "text-amber-400",
            position: "bottom-20" // Approximate position for mobile nav / pantry tab
        },
        {
            id: 'eco',
            title: "Earn Eco Points",
            description: "Consume items before they expire to level up your Food Saver status!",
            icon: Sparkles,
            color: "text-emerald-400",
            position: "center"
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const currentStep = steps[step];
    const Icon = currentStep.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            >
                {/* Backdrop with Spotlight Effect */}
                <div className="absolute inset-0 bg-navy-900/90 backdrop-blur-sm" />

                {/* Spotlight Hole (Visual Trick) */}
                {/* In a real app, we might use a complex SVG mask or clip-path based on element coordinates.
            For this "Joyride", we'll use a simplified centered modal approach that highlights the concept. */}

                <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="relative z-10 max-w-md w-full mx-4 bg-navy-800 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b ${currentStep.color.replace('text-', 'from-')}/10 to-transparent pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 shadow-lg ${currentStep.color}`}>
                            <Icon className="w-8 h-8" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3">{currentStep.title}</h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            {currentStep.description}
                        </p>

                        <div className="flex items-center gap-2 w-full">
                            {/* Progress Dots */}
                            <div className="flex gap-1.5 mr-auto">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${idx === step ? 'bg-white' : 'bg-white/20'}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-3 bg-electric-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-electric-blue/20"
                            >
                                {step === steps.length - 1 ? "Get Started" : "Next"}
                                {step === steps.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OnboardingOverlay;
