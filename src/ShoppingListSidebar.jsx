import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, RefreshCw, Check, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const ShoppingListSidebar = ({ isOpen, onClose, items, onRemove, onRestock }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    // Toggle selection
    const toggleSelection = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    // Handle Restock
    const handleRestock = () => {
        // If items are selected, restock those. Else restock all.
        const itemsToRestock = selectedItems.length > 0
            ? items.filter(item => selectedItems.includes(item.id))
            : items;

        onRestock(itemsToRestock);
        setSelectedItems([]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-[#1e293b] border-l border-white/10 shadow-2xl z-[100] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-navy-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-electric-blue/20 rounded-lg text-electric-blue">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Shopping List</h2>
                                    <p className="text-xs text-slate-400">{items.length} items to buy</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {items.length > 0 ? (
                                items.map(item => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                                            selectedItems.includes(item.id)
                                                ? "bg-electric-blue/10 border-electric-blue/50"
                                                : "bg-white/5 border-white/5 hover:border-white/10"
                                        )}
                                        onClick={() => toggleSelection(item.id)}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                            selectedItems.includes(item.id)
                                                ? "bg-electric-blue border-electric-blue"
                                                : "border-slate-500 group-hover:border-slate-300"
                                        )}>
                                            {selectedItems.includes(item.id) && <Check className="w-3 h-3 text-white" />}
                                        </div>

                                        <div className="flex-1">
                                            <h4 className={cn("font-medium transition-colors", selectedItems.includes(item.id) ? "text-white" : "text-slate-300")}>
                                                {item.name}
                                            </h4>
                                            <p className="text-xs text-slate-500">{item.brand}</p>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove(item.id);
                                            }}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Your shopping list is empty.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/10 bg-navy-900/50">
                            <button
                                onClick={handleRestock}
                                disabled={items.length === 0}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-electric-blue to-blue-600 text-white font-bold shadow-lg shadow-electric-blue/20 hover:shadow-electric-blue/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                {selectedItems.length > 0 ? `Restock Selected (${selectedItems.length})` : "Restock All Items"}
                            </button>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShoppingListSidebar;
