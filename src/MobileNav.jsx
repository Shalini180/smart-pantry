import React from 'react';
import { Home, ShoppingCart, Settings, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const MobileNav = ({ activeTab, onTabChange, cartCount }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'pantry', icon: Search, label: 'Pantry' },
        { id: 'shop', icon: ShoppingCart, label: 'Shop', badge: cartCount },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-navy-900/90 backdrop-blur-lg border-t border-white/10 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full relative transition-colors",
                                isActive ? "text-electric-blue" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <div className="relative">
                                <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current/20")} />
                                {item.badge > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>

                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-electric-blue rounded-b-full shadow-[0_2px_8px_rgba(0,240,255,0.5)]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
