import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- Context ---
const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// --- Components ---

const Toast = ({ id, message, type, onDismiss }) => {
    const icons = {
        success: CheckCircle2,
        error: AlertCircle,
        info: Info
    };

    const styles = {
        success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20",
        error: "border-red-500/50 bg-red-500/10 text-red-400 shadow-red-500/20",
        info: "border-electric-blue/50 bg-electric-blue/10 text-electric-blue shadow-electric-blue/20"
    };

    const Icon = icons[type] || Info;
    const style = styles[type] || styles.info;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
                "pointer-events-auto flex items-center gap-3 w-full max-w-sm p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all",
                "bg-[#1e293b]/90", // Base dark background
                style
            )}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium text-white flex-1">{message}</p>
            <button
                onClick={() => onDismiss(id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-full max-w-sm pointer-events-none p-4 sm:p-0">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onDismiss={removeToast}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

// --- Provider ---

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        // Auto-dismiss
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};
