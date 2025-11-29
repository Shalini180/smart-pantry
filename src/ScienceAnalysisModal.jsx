import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Skull, Activity, Info, Heart, Zap, ShieldAlert } from 'lucide-react';

const ScienceAnalysisModal = ({ isOpen, onClose, analysis }) => {
    if (!isOpen || !analysis) return null;

    const { score, grade, analysis: details, citations } = analysis;

    // Determine color theme based on grade
    const getThemeColor = (grade) => {
        if (grade === 'A' || grade === 'B') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
        if (grade === 'C') return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
        return 'text-red-500 border-red-500/30 bg-red-500/10';
    };

    const themeClass = getThemeColor(grade);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl scrollbar-hide"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-900/95 backdrop-blur border-b border-slate-800">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                Scientific Analysis
                            </h2>
                            <p className="text-sm text-slate-400">Powered by SafeShelf Truth Engine™</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Score Section */}
                        <div className="flex items-center justify-between bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <div>
                                <div className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-1">Health Score</div>
                                <div className={`text-5xl font-black ${themeClass.split(' ')[0]}`}>{score}/100</div>
                            </div>
                            <div className={`flex items-center justify-center w-20 h-20 rounded-full border-4 text-4xl font-bold ${themeClass}`}>
                                {grade}
                            </div>
                        </div>

                        {/* Health Pillars Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Heart Health */}
                            <div className={`p-4 rounded-xl border ${details.heart.status === 'Good' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Heart className={`w-5 h-5 ${details.heart.status === 'Good' ? 'text-emerald-400' : 'text-red-400'}`} />
                                    <h3 className="font-semibold text-white">Heart Health</h3>
                                </div>
                                <div className="space-y-2">
                                    {details.heart.reasons.length > 0 ? (
                                        details.heart.reasons.map((reason, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                <span>{reason}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-emerald-400 flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4" />
                                            No risks detected
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Metabolic Health */}
                            <div className={`p-4 rounded-xl border ${details.metabolic.status === 'Good' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className={`w-5 h-5 ${details.metabolic.status === 'Good' ? 'text-emerald-400' : 'text-red-400'}`} />
                                    <h3 className="font-semibold text-white">Metabolic Health</h3>
                                </div>
                                <div className="space-y-2">
                                    {details.metabolic.reasons.length > 0 ? (
                                        details.metabolic.reasons.map((reason, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                <span>{reason}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-emerald-400 flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4" />
                                            Balanced profile
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Toxicity Section */}
                        {details.toxicity.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Skull className="w-5 h-5 text-red-500" />
                                    Toxicity Scanner
                                </h3>
                                <div className="space-y-3">
                                    {details.toxicity.map((item, idx) => (
                                        <div key={idx} className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-red-400">{item.name}</span>
                                                <span className="text-xs font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                                                    {item.risk.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 mb-2">{item.claim}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Info className="w-3 h-3" />
                                                Source: {item.source}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Citations Footer */}
                        {citations && citations.length > 0 && (
                            <div className="border-t border-slate-800 pt-6">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Scientific References</h4>
                                <ul className="space-y-2">
                                    {citations.map((cite, idx) => (
                                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                                            <span className="text-slate-600">•</span>
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
