import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Skull, Activity, Info, Heart, Zap, ShieldAlert, Flame } from 'lucide-react';

const ScienceAnalysisModal = ({ isOpen, onClose, analysis }) => {
    if (!isOpen || !analysis) return null;

    const { score, grade, analysis: details, citations } = analysis.health_report || analysis; // Handle both structures

    // Determine color theme based on grade
    const getThemeColor = (grade) => {
        if (grade === 'A' || grade === 'B') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-emerald-500/20';
        if (grade === 'C') return 'text-orange-400 border-orange-500/30 bg-orange-500/10 shadow-orange-500/20';
        return 'text-red-500 border-red-500/30 bg-red-500/10 shadow-red-500/20';
    };

    const themeClass = getThemeColor(grade);
    const scoreColor = grade === 'A' || grade === 'B' ? '#34d399' : grade === 'C' ? '#fb923c' : '#ef4444';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop with Steam Effect */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                />

                {/* Modal Content - The Holographic Board */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
                    animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                    exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-600/50 rounded-3xl shadow-2xl scrollbar-hide ring-1 ring-white/10"
                >
                    {/* Metal Texture Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-10 pointer-events-none rounded-3xl" />

                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                        <div>
                            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 flex items-center gap-3 uppercase tracking-wider">
                                <Activity className="w-6 h-6 text-electric-blue" />
                                Truth Engine™ Analysis
                            </h2>
                            <p className="text-xs font-mono text-electric-blue/70 tracking-widest mt-1">LAB REPORT // ID: {Date.now().toString().slice(-6)}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-8 relative z-0">
                        {/* The Stove Dial Score */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-black/40 p-8 rounded-2xl border border-white/5 shadow-inner">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                {/* Dial Background */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-slate-800"
                                    />
                                    <motion.circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke={scoreColor}
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={553}
                                        strokeDashoffset={553}
                                        animate={{ strokeDashoffset: 553 - (553 * score) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                    />
                                </svg>
                                {/* Center Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-sm text-slate-400 font-mono uppercase">Purity Score</span>
                                    <span className={`text-5xl font-black ${themeClass.split(' ')[0]} drop-shadow-lg`}>{score}</span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Flame className={`w-4 h-4 ${themeClass.split(' ')[0]}`} />
                                        <span className={`text-sm font-bold ${themeClass.split(' ')[0]}`}>{grade} Grade</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <h3 className="text-xl font-bold text-white">Nutritional Verdict</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    This product has been analyzed against 4 scientific domains.
                                    {score > 80 ? " It is highly pure and minimally processed." :
                                        score > 50 ? " It shows signs of moderate processing and some risk factors." :
                                            " Critical warning: High levels of processing or toxicity detected."}
                                </p>
                                <div className="flex gap-2">
                                    {['Cardiovascular', 'Metabolic', 'Toxicity', 'Processing'].map((tag, i) => (
                                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-slate-400 border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Health Pillars Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Heart Health */}
                            <div className={`p-5 rounded-xl border backdrop-blur-sm ${details.heart.status === 'Low' ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Heart className={`w-5 h-5 ${details.heart.status === 'Low' ? 'text-emerald-400' : 'text-red-400'}`} />
                                    <h3 className="font-bold text-white tracking-wide">HEART HEALTH</h3>
                                </div>
                                <div className="space-y-3">
                                    {details.heart.reasons.length > 0 ? (
                                        details.heart.reasons.map((reason, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-sm text-slate-200 bg-black/20 p-2 rounded">
                                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                <span className="font-medium">{reason}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-emerald-400 flex items-center gap-2 font-medium">
                                            <ShieldAlert className="w-4 h-4" />
                                            Cardiovascular Safe
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Metabolic Health */}
                            <div className={`p-5 rounded-xl border backdrop-blur-sm ${details.metabolic.status === 'Low' ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className={`w-5 h-5 ${details.metabolic.status === 'Low' ? 'text-emerald-400' : 'text-red-400'}`} />
                                    <h3 className="font-bold text-white tracking-wide">METABOLIC HEALTH</h3>
                                </div>
                                <div className="space-y-3">
                                    {details.metabolic.reasons.length > 0 ? (
                                        details.metabolic.reasons.map((reason, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-sm text-slate-200 bg-black/20 p-2 rounded">
                                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                <span className="font-medium">{reason}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-emerald-400 flex items-center gap-2 font-medium">
                                            <ShieldAlert className="w-4 h-4" />
                                            Metabolically Stable
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Toxicity Section - The Evidence Cards */}
                        {details.toxicity.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-widest border-b border-white/10 pb-2">
                                    <Skull className="w-5 h-5 text-red-500" />
                                    Detected Toxins
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {details.toxicity.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-red-950/30 border border-red-500/30 p-5 rounded-xl relative overflow-hidden group hover:bg-red-900/20 transition-colors"
                                        >
                                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Skull className="w-24 h-24 text-red-500" />
                                            </div>

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xl font-black text-red-400 tracking-tight">{item.name}</span>
                                                    <span className="text-xs font-bold font-mono bg-red-500 text-white px-2 py-1 rounded shadow-lg shadow-red-500/20">
                                                        {item.risk ? item.risk.toUpperCase() : 'WARNING'}
                                                    </span>
                                                </div>
                                                <p className="text-slate-200 font-medium mb-3 border-l-2 border-red-500/50 pl-3">
                                                    {item.claim}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-red-300/70 font-mono bg-black/30 w-fit px-3 py-1 rounded-full">
                                                    <Info className="w-3 h-3" />
                                                    SOURCE: {item.source}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Citations Footer */}
                        {citations && citations.length > 0 && (
                            <div className="border-t border-white/10 pt-6 mt-8">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Scientific Reference Log</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {citations.map((cite, idx) => (
                                        <li key={idx} className="text-[10px] text-slate-400 flex items-start gap-2 font-mono">
                                            <span className="text-electric-blue">[{idx + 1}]</span>
                                            {cite}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ScienceAnalysisModal;
