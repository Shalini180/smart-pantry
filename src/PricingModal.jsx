import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Crown, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const PricingModal = ({ isOpen, onClose, onUpgrade }) => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

    const plans = [
        {
            name: 'Free',
            price: '0',
            period: 'forever',
            description: 'Essential pantry tracking',
            features: [
                'Track up to 50 items',
                'Basic expiry notifications',
                'Manual barcode entry',
                'Community recipes'
            ],
            current: true,
            color: 'slate'
        },
        {
            name: 'Pro',
            price: billingCycle === 'monthly' ? '4.99' : '3.99',
            period: 'per month',
            description: 'AI-powered kitchen assistant',
            features: [
                'Unlimited pantry items',
                'AI Expiry Prediction',
                'Smart Recipe Generation',
                'Cloud Sync & Multi-device',
                'Advanced Health Insights'
            ],
            recommended: true,
            color: 'electric-blue'
        },
        {
            name: 'Family',
            price: billingCycle === 'monthly' ? '9.99' : '7.99',
            period: 'per month',
            description: 'Complete home management',
            features: [
                'Everything in Pro',
                'Up to 5 family members',
                'Shared Shopping Lists',
                'Role-based permissions',
                'Priority Support'
            ],
            color: 'purple'
        }
    ];

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-5xl h-fit max-h-[90vh] overflow-y-auto bg-navy-900 border border-white/10 rounded-3xl shadow-2xl z-[110] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-electric-blue/10 to-transparent pointer-events-none" />

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/20 text-electric-blue text-xs font-bold uppercase tracking-wider mb-4 border border-electric-blue/20">
                                    <Sparkles className="w-3 h-3" />
                                    Upgrade Your Kitchen
                                </span>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    Unlock the Full Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-purple">SafeShelf</span>
                                </h2>
                                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                    Get precise AI predictions, unlimited tracking, and seamless cloud sync across all your devices.
                                </p>
                            </motion.div>

                            {/* Billing Toggle */}
                            <div className="flex justify-center mt-8">
                                <div className="bg-navy-800 p-1 rounded-xl flex items-center relative">
                                    <motion.div
                                        layoutId="billing-pill"
                                        className={cn(
                                            "absolute top-1 bottom-1 rounded-lg bg-electric-blue shadow-lg",
                                            billingCycle === 'monthly' ? "left-1 w-[100px]" : "left-[108px] w-[140px]"
                                        )}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                    <button
                                        onClick={() => setBillingCycle('monthly')}
                                        className={cn(
                                            "relative z-10 px-6 py-2 text-sm font-bold transition-colors w-[100px]",
                                            billingCycle === 'monthly' ? "text-white" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle('yearly')}
                                        className={cn(
                                            "relative z-10 px-6 py-2 text-sm font-bold transition-colors w-[140px] flex items-center justify-center gap-2",
                                            billingCycle === 'yearly' ? "text-white" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Yearly <span className="text-[10px] bg-green-500 text-navy-900 px-1.5 py-0.5 rounded font-extrabold">-20%</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Plans Grid */}
                        <div className="p-8 pt-0 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
                            {plans.map((plan, idx) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                    className={cn(
                                        "relative p-6 rounded-2xl border flex flex-col transition-all duration-300",
                                        plan.recommended
                                            ? "bg-navy-800/50 border-electric-blue shadow-2xl shadow-electric-blue/10 scale-105 z-10"
                                            : "bg-navy-800/20 border-white/5 hover:border-white/10 hover:bg-navy-800/30"
                                    )}
                                >
                                    {plan.recommended && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-electric-blue to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className={cn("text-xl font-bold mb-2", plan.recommended ? "text-white" : "text-slate-200")}>
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-white">${plan.price}</span>
                                            <span className="text-sm text-slate-500">/{plan.period === 'forever' ? '' : 'mo'}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                                    </div>

                                    <div className="flex-1 space-y-4 mb-8">
                                        {plan.features.map((feature) => (
                                            <div key={feature} className="flex items-start gap-3">
                                                <div className={cn(
                                                    "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                                                    plan.recommended ? "bg-electric-blue/20 text-electric-blue" : "bg-white/5 text-slate-400"
                                                )}>
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <span className={cn("text-sm", plan.recommended ? "text-slate-200" : "text-slate-400")}>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => plan.name !== 'Free' ? onUpgrade(plan.name) : onClose()}
                                        className={cn(
                                            "w-full py-3 rounded-xl font-bold transition-all",
                                            plan.current
                                                ? "bg-white/5 text-slate-400 cursor-default"
                                                : plan.recommended
                                                    ? "bg-gradient-to-r from-electric-blue to-blue-600 text-white hover:shadow-lg hover:shadow-electric-blue/25 hover:scale-[1.02]"
                                                    : "bg-white text-navy-900 hover:bg-slate-200"
                                        )}
                                    >
                                        {plan.current ? "Current Plan" : `Get ${plan.name}`}
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-6 text-center text-slate-500 text-sm border-t border-white/5">
                            <p>Secure payment powered by Stripe. Cancel anytime.</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PricingModal;
