import React from 'react';
import { Search, Filter, Trash2, ArrowUpDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const PantryToolbar = ({
    filters,
    setFilters,
    onClearExpired,
    hasExpiredItems
}) => {
    const { searchQuery, sortBy, filterStatus } = filters;
    const { setSearchQuery, setSortBy, setFilterStatus } = setFilters;

    return (
        <div className="mb-6 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Left: Search */}
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Find in pantry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electric-blue/50 transition-colors"
                />
            </div>

            {/* Middle: Filters & Sort */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-start">

                {/* Sort Dropdown */}
                <div className="relative group">
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="pl-8 pr-8 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-electric-blue/50 appearance-none cursor-pointer hover:bg-navy-900/80 transition-colors"
                    >
                        <option value="expiry_asc">Expiry (Earliest)</option>
                        <option value="expiry_desc">Expiry (Latest)</option>
                        <option value="name_asc">Name (A-Z)</option>
                        <option value="date_added">Date Added (Newest)</option>
                    </select>
                </div>

                <div className="w-px h-6 bg-white/10 hidden sm:block" />

                {/* Filter Pills */}
                <div className="flex bg-navy-900/50 p-1 rounded-lg border border-white/5">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'expiring_soon', label: 'Expiring' },
                        { id: 'expired', label: 'Expired' },
                        { id: 'fresh', label: 'Fresh' }
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setFilterStatus(filter.id)}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                filterStatus === filter.id
                                    ? "bg-electric-blue text-white shadow-lg shadow-electric-blue/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="w-full md:w-auto flex justify-end">
                {hasExpiredItems && (
                    <button
                        onClick={onClearExpired}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear Expired
                    </button>
                )}
            </div>

        </div>
    );
};

export default PantryToolbar;
