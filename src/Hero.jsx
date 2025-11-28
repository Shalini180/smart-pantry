import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Hero = ({ stats, onFilterClick, userTier, onUpgradeClick, ecoScore = 500 }) => {
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

    // Determine Eco Level
    let levelName = "Novice";
    let levelColor = "text-slate-400";
    let progress = (ecoScore / 1000) * 100;

    if (ecoScore >= 600) {
        levelName = "Food Warrior";
        levelColor = "text-electric-blue";
    } else if (ecoScore >= 300) {
        levelName = "Saver";
        levelColor = "text-emerald-400";
    }

    return (
        <div className="relative overflow-hidden bg-navy-900 rounded-3xl p-8 mb-12 border border-white/5 shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-electric-blue/10 rounded-full blur-[100px] -z-10" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-purple">Chef</span>
                        </h1>
                        {userTier === 'PRO' && (
                            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-electric-blue to-blue-600 text-[10px] font-bold text-white shadow-lg shadow-electric-blue/20 tracking-wider">
                                PRO
                            </span>
                        )}
                    </div>
                    <p className="text-slate-400">Here's what's happening in your kitchen today.</p>
                </div>

                {/* Freshness Bar */}
                <div className="flex flex-col items-end min-w-[200px] gap-4">
                    {/* Eco Score */}
                    <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Food Saver Level</div>
                        <div className={cn("text-lg font-bold", levelColor)}>{levelName}</div>
                        <div className="w-32 h-1.5 bg-navy-800 rounded-full overflow-hidden border border-white/5 mt-1">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={cn("h-full rounded-full", ecoScore >= 600 ? "bg-electric-blue" : "bg-emerald-400")}
                            />
                        </div>
                    </div>

                    {/* Pantry Freshness */}
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Pantry Freshness</span>
                            <span className={cn("text-sm font-bold", freshnessText)}>{stats.freshnessScore}%</span>
                        </div>
                        <div className="w-32 h-1.5 bg-navy-800 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.freshnessScore}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", freshnessColor, freshnessGlow)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div
                    onClick={() => onFilterClick('all')}
                    className="bg-navy-800/50 p-4 rounded-2xl border border-white/5 hover:bg-navy-800 hover:border-white/10 transition-all cursor-pointer group"
                >
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-electric-blue transition-colors">{stats.totalCount}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Items</div>
                </div>

                <div
                    onClick={() => onFilterClick('expiring')}
                    className="bg-navy-800/50 p-4 rounded-2xl border border-white/5 hover:bg-navy-800 hover:border-amber-500/30 transition-all cursor-pointer group"
                >
                    <div className="text-3xl font-bold text-amber-400 mb-1">{stats.expiringCount}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-medium group-hover:text-amber-400 transition-colors">Expiring Soon</div>
                </div>

                <div
                    onClick={() => onFilterClick('expired')}
                    className="bg-navy-800/50 p-4 rounded-2xl border border-white/5 hover:bg-navy-800 hover:border-red-500/30 transition-all cursor-pointer group"
                >
                    <div className="text-3xl font-bold text-red-500 mb-1">{stats.expiredCount}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-medium group-hover:text-red-500 transition-colors">Expired</div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
