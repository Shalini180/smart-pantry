import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Hero = ({ stats, onFilterSelect }) => {
    // Determine freshness color
    let freshnessColor = "bg-emerald-400";
    let freshnessGlow = "shadow-emerald-400/50";
    let freshnessText = "text-emerald-400";

    if (stats.freshnessScore < 50) {
        freshnessColor = "bg-red-500";
        freshnessGlow = "shadow-red-500/50";
        freshnessText = "text-red-500";
    } else if (stats.freshnessScore < 80) {
        freshnessColor = "bg-amber-400";
        freshnessGlow = "shadow-amber-400/50";
        freshnessText = "text-amber-400";
    }

    return (
        <div className="relative overflow-hidden py-16 sm:py-24">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-electric-blue/20 rounded-full blur-[120px] -z-10 opacity-30" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
                        <span className="block text-white mb-2">Future of</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-electric-teal">
                            Food Intelligence
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Analyze ingredients, find healthier alternatives, and track expiry—automatically.
                        Your pantry, upgraded with AI.
                    </p>
                </motion.div>

                {/* Live Stats Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="inline-flex flex-col sm:flex-row items-center gap-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50"
                >
                    {/* Stats Grid */}
                    <div className="flex items-center gap-8">
                        <div className="text-center cursor-pointer group" onClick={() => onFilterSelect('all')}>
                            <div className="text-3xl font-bold text-white group-hover:text-electric-blue transition-colors">
                                {stats.totalCount}
                            </div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 group-hover:text-white transition-colors">Items</div>
                        </div>

                        <div className="w-px h-12 bg-white/10 hidden sm:block" />

                        <div className="text-center cursor-pointer group" onClick={() => onFilterSelect('expiring')}>
                            <div className="text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                                {stats.expiringCount}
                            </div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 group-hover:text-white transition-colors">Expiring</div>
                        </div>

                        <div className="w-px h-12 bg-white/10 hidden sm:block" />

                        <div className="text-center cursor-pointer group" onClick={() => onFilterSelect('expired')}>
                            <div className="text-3xl font-bold text-red-500 group-hover:text-red-400 transition-colors">
                                {stats.expiredCount}
                            </div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 group-hover:text-white transition-colors">Expired</div>
                        </div>
                    </div>

                    {/* Freshness Bar Divider (Mobile) */}
                    <div className="w-full h-px bg-white/10 sm:hidden" />
                    <div className="w-px h-12 bg-white/10 hidden sm:block" />

                    {/* Freshness Bar Section */}
                    <div className="flex flex-col items-center sm:items-start min-w-[150px]">
                        <div className="flex justify-between w-full mb-2">
                            <span className="text-xs text-slate-400 uppercase tracking-wider">Freshness</span>
                            <span className={cn("text-xs font-bold", freshnessText)}>{stats.freshnessScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.freshnessScore}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", freshnessColor, freshnessGlow)}
                            />
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
