import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, Trash2, AlertCircle, CheckCircle2, XCircle, Check, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PantryToolbar from './PantryToolbar';
import { usePantryControls } from './usePantryControls';

// --- Utility ---
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Reusing helper logic locally if not exported from App.jsx yet
// Ideally this should be in a utils file, but keeping it self-contained as per plan
const getExpiryStatus = (addedDate, shelfLifeDays) => {
    const added = new Date(addedDate);
    const now = new Date();
    const expiryDate = new Date(added);
    expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);

    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: "Expired", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", icon: XCircle };
    if (diffDays <= 3) return { label: "Expiring Soon", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: AlertCircle };
    return { label: "Fresh", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 };
};

const PantryItem = ({ item, onRemove, onConsume, onWaste }) => {
    const status = getExpiryStatus(item.addedAt, item.expiryDays);
    const StatusIcon = status.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-between p-4 bg-navy-800/30 border border-white/5 rounded-xl hover:bg-navy-800/50 transition-colors group"
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.image} flex-shrink-0`} />
                <div>
                    <h4 className="font-bold text-white">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", status.color, status.bg)}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                        </span>
                        <span className="text-xs text-slate-500">Added: {new Date(item.addedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onConsume(item)}
                    className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    title="Consumed (Add to Shopping List)"
                >
                    <Check className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onWaste(item)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Wasted"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

const PantrySection = ({ pantry, onRemove, onConsume, onWaste, onClearExpired, onClearAll, initialFilter = 'all', userTier, onUpgradeClick }) => {
    const { processedItems, filters, setFilters } = usePantryControls(pantry);

    // Sync initial filter from props if provided (e.g. from Hero click)
    useEffect(() => {
        if (initialFilter !== 'all') {
            setFilters.setFilterStatus(initialFilter);
        }
    }, [initialFilter, setFilters.setFilterStatus]);

    const hasExpiredItems = pantry.some(item => {
        const status = getExpiryStatus(item.addedAt, item.expiryDays);
        return status.label === "Expired";
    });

    return (
        <motion.div
            key="pantry"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-12 max-w-4xl mx-auto"
        >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">My Pantry</h2>
                <button
                    onClick={onClearAll}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                    Clear All
                </button>
            </div>

            <PantryToolbar
                filters={filters}
                setFilters={setFilters}
                onClearExpired={onClearExpired}
                hasExpiredItems={hasExpiredItems}
            />

            {processedItems.length > 0 ? (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {processedItems.map(item => (
                            <PantryItem
                                key={item.id}
                                item={item}
                                onRemove={onRemove}
                                onConsume={onConsume}
                                onWaste={onWaste}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                    <ShoppingBasket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">
                        {pantry.length === 0 ? "Your pantry is empty" : "No items match your filter"}
                    </h3>
                    <p className="text-slate-400 mb-6">
                        {pantry.length === 0 ? "Start adding items from the search tab." : "Try adjusting your search or filters."}
                    </p>
                </div>
            )}

            {/* Premium Teaser - Only show for FREE users */}
            {userTier !== 'PRO' && (
                <div className="mt-12 p-1 rounded-2xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 opacity-80">
                    <div className="bg-navy-900 rounded-xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white">Unlock AI Expiry Prediction</h4>
                                <p className="text-sm text-slate-400">Get precise shelf-life estimates based on real-time data.</p>
                            </div>
                        </div>
                        <button
                            onClick={onUpgradeClick}
                            className="px-4 py-2 bg-white text-navy-900 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Upgrade
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default PantrySection;
