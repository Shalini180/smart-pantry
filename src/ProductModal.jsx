import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertCircle, CheckCircle2, Info, Sparkles, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Enhanced analysis logic with explanations
const getHealthInsights = (ingredients) => {
  const insights = [];
  const lowerIngredients = ingredients.map(i => i.toLowerCase());

  if (lowerIngredients.some(i => i.includes('sugar'))) {
    insights.push({
      label: "High Sugar",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: AlertCircle,
      description: "Contains added sugars which may exceed daily recommended limits for a balanced diet."
    });
  }
  if (lowerIngredients.some(i => i.includes('preservatives') || i.includes('color'))) {
    insights.push({
      label: "Processed",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: Info,
      description: "Contains artificial preservatives or colors. Moderate consumption is advised."
    });
  }
  if (lowerIngredients.some(i => i.includes('oats') || i.includes('whole wheat'))) {
    insights.push({
      label: "High Fiber",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: CheckCircle2,
      description: "Rich in dietary fiber, supporting digestive health and sustained energy."
    });
  }
  if (lowerIngredients.some(i => i.includes('vitamin'))) {
    insights.push({
      label: "Fortified",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: Sparkles,
      description: "Enriched with essential vitamins to support overall health."
    });
  }

  return insights;
};

const ProductModal = ({ product, onClose, onAdd }) => {
  if (!product) return null;

  const insights = getHealthInsights(product.ingredients);

  // Mock alternatives based on category
  const alternatives = [
    { name: "Organic Option", brand: "Nature's Best", price: product.price * 1.5 },
    { name: "Low Sugar Ver.", brand: "HealthyLife", price: product.price * 1.2 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image Area */}
        <div className={`relative h-48 sm:h-64 w-full bg-gradient-to-br ${product.image} overflow-hidden shrink-0`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-[#1e293b]/20 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white backdrop-blur-md border border-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 mb-3 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-white">
                  {product.category}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">{product.name}</h2>
                <p className="text-lg text-slate-300">{product.brand}</p>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-3xl font-bold text-emerald-400">₹{product.price}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Mobile Price */}
          <div className="sm:hidden flex items-center justify-between pb-6 border-b border-white/5">
            <span className="text-slate-400">Price</span>
            <span className="text-2xl font-bold text-emerald-400">₹{product.price}</span>
          </div>

          {/* Health Analysis */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-electric-blue" />
              Health Analysis
            </h3>
            <div className="grid gap-4">
              {insights.length > 0 ? (
                insights.map((insight, idx) => {
                  const Icon = insight.icon;
                  return (
                    <div key={idx} className={cn("p-4 rounded-xl border flex gap-4", insight.bg, insight.border)}>
                      <div className={cn("p-2 rounded-lg h-fit", insight.bg)}>
                        <Icon className={cn("w-5 h-5", insight.color)} />
                      </div>
                      <div>
                        <h4 className={cn("font-bold mb-1", insight.color)}>{insight.label}</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-slate-400 text-sm">
                  No specific health flags detected for this product.
                </div>
              )}
            </div>
          </section>

          {/* Ingredients */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-navy-900 border border-white/10 text-sm text-slate-300">
                  {ing}
                </span>
              ))}
            </div>
          </section>

          {/* Better Alternatives */}
          <section className="pt-4 border-t border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Better Alternatives</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {alternatives.map((alt, i) => (
                <div key={i} className="group p-4 rounded-xl bg-navy-800/50 border border-white/5 hover:border-electric-blue/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-white group-hover:text-electric-blue transition-colors">{alt.name}</div>
                      <div className="text-xs text-slate-500">{alt.brand}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-electric-blue transition-colors" />
                  </div>
                  <div className="text-sm font-medium text-emerald-400">₹{alt.price.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="pt-6 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={() => {
                onAdd(product);
                onClose();
              }}
              className="flex-[2] py-3 rounded-xl bg-electric-blue hover:bg-blue-600 text-white font-bold shadow-lg shadow-electric-blue/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add to Pantry
            </button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductModal;
