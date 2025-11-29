import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBasket,
  Settings,
  Zap,
  ChevronRight,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ProductModal from './ProductModal';
import Hero from './Hero';
import { usePantryStats } from './usePantryStats';
import { useToast } from './ToastContext';
import PantrySection from './PantrySection';
import ShoppingListSidebar from './ShoppingListSidebar';
import PricingModal from './PricingModal';
import MobileNav from './MobileNav';
import SettingsSection from './SettingsSection';
import OnboardingOverlay from './OnboardingOverlay';
import confetti from 'canvas-confetti';
import ScienceAnalysisModal from './ScienceAnalysisModal';
import { MOCK_PRODUCTS } from './data/mockProducts';

// --- Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
// Imported from src/data/mockProducts.js
const MOCK_ANALYSIS_DATA = {
  "score": 45,
  "grade": "D",
  "analysis": {
    "heart": { "status": "Risk", "reasons": ["Hidden Trans Fats detected"] },
    "metabolic": { "status": "Critical", "reasons": ["Extreme Sugar Load (8 tsp)"] },
    "toxicity": [
      {
        "name": "Hydrogenated Fat",
        "risk": "Critical",
        "claim": "Source of Trans Fats.",
        "source": "WHO REPLACE 2018"
      }
    ]
  },
  "citations": ["WHO REPLACE 2018", "IARC Vol 73"]
};

// --- Logic Engines ---
const analyzeIngredients = (ingredients) => {
  const flags = [];
  const lowerIngredients = ingredients.map(i => i.toLowerCase());

  if (lowerIngredients.some(i => i.includes('sugar'))) {
    flags.push({ label: "High Sugar", color: "bg-red-500/20 text-red-400 border-red-500/30" });
  }
  if (lowerIngredients.some(i => i.includes('preservatives') || i.includes('color'))) {
    flags.push({ label: "Processed", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" });
  }
  if (lowerIngredients.some(i => i.includes('oats') || i.includes('whole wheat'))) {
    flags.push({ label: "High Fiber", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" });
  }
  if (lowerIngredients.some(i => i.includes('vitamin'))) {
    flags.push({ label: "Fortified", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" });
  }

  return flags;
};

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

// --- Components ---

const Navbar = ({ activeTab, onTabChange }) => (
  <nav className="sticky top-0 z-50 backdrop-blur-xl bg-navy-900/80 border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-electric-teal flex items-center justify-center shadow-lg shadow-electric-blue/20">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SafeShelf
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Pantry', 'Settings'].map((item) => (
            <button
              key={item}
              onClick={() => onTabChange(item.toLowerCase())}
              className={cn(
                "text-sm font-medium transition-all duration-200 hover:text-electric-teal",
                activeTab === item.toLowerCase() ? "text-electric-teal" : "text-slate-400"
              )}
            >
              {item}
            </button>
          ))}

          {/* Shopping Cart Trigger */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-shopping-list'))}
            className="relative p-3 text-slate-400 hover:text-white transition-colors"
          >
            <ShoppingBasket className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-electric-blue rounded-full border border-navy-900" />
          </button>
        </div>

        <div className="md:hidden">
          <button className="p-3 text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </nav>
);


// Re-exporting helper logic for use in PantrySection if needed, 
// but currently PantrySection has its own copy to be self-contained.
// In a real app, we'd move this to a utils.js file.

const ProductCard = ({ product, onAdd, onClick }) => {
  const flags = analyzeIngredients(product.ingredients);

  return (
    <motion.div
      layoutId={`product-${product.id}`}
      onClick={onClick}
      whileHover={{ y: -5 }}
      className="group relative bg-navy-800/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-electric-blue/30 transition-all duration-300 shadow-lg hover:shadow-electric-blue/10 cursor-pointer"
    >
      <div className={`h-40 w-full bg-gradient-to-br ${product.image} relative overflow-hidden`}>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/10">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-electric-blue transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-slate-400">{product.brand}</p>
          </div>
          <span className="text-lg font-bold text-emerald-400">₹{product.price}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
          {flags.map((flag, i) => (
            <span key={i} className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border", flag.color)}>
              {flag.label}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-electric-blue text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-electric-blue/25"
        >
          <Plus className="w-4 h-4" />
          Add to Pantry
        </button>
      </div>
    </motion.div>
  );
};

const PantryItem = ({ item, onRemove }) => {
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
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.image} flex-shrink-0 overflow-hidden relative`}>
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          )}
        </div>
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

      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

// --- Main App ---
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pantry, setPantry] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [userTier, setUserTier] = useState('FREE'); // 'FREE' | 'PRO'
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [ecoScore, setEcoScore] = useState(() => {
    const saved = localStorage.getItem('ecoScore');
    return saved ? parseInt(saved, 10) : 500;
  });
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pantryFilter, setPantryFilter] = useState('all');
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('hasSeenOnboarding');
  });
  const [isScienceModalOpen, setIsScienceModalOpen] = useState(false);
  const { addToast } = useToast();

  // Derived State for Stats

  // Derived State for Stats
  const stats = usePantryStats(pantry);

  const handleFilterSelect = (filterType) => {
    setActiveTab('pantry');
    setPantryFilter(filterType);
  };

  // Listen for navbar toggle
  useEffect(() => {
    const handleToggle = () => setIsShoppingListOpen(prev => !prev);
    window.addEventListener('toggle-shopping-list', handleToggle);
    return () => window.removeEventListener('toggle-shopping-list', handleToggle);
  }, []);

  // Persist Eco Score
  useEffect(() => {
    localStorage.setItem('ecoScore', ecoScore.toString());
  }, [ecoScore]);

  const addToPantry = (product) => {
    const newItem = {
      ...product,
      id: Date.now(), // simple unique id
      addedAt: new Date().toISOString()
    };
    setPantry([...pantry, newItem]);
    addToast(`Added ${product.name} to pantry`, 'success');
  };

  const removeFromPantry = (id) => {
    setPantry(pantry.filter(item => item.id !== id));
    addToast('Item removed from pantry', 'info');
  };

  const clearExpiredItems = () => {
    const now = new Date();
    const initialCount = pantry.length;

    const newPantry = pantry.filter(item => {
      const added = new Date(item.addedAt);
      const expiryDate = new Date(added);
      expiryDate.setDate(expiryDate.getDate() + item.expiryDays);

      // Keep item if expiry date is in the future (or today)
      // Actually, logic says diffDays <= 0 is expired.
      // Let's use the same logic as getExpiryStatus for consistency.
      const diffTime = expiryDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0;
    });

    const removedCount = initialCount - newPantry.length;

    if (removedCount > 0) {
      setPantry(newPantry);
      addToast(`Removed ${removedCount} expired items`, 'success');
    } else {
      addToast('No expired items found', 'info');
    }
  };

  // --- Shopping List Logic ---

  const addToShoppingList = (item) => {
    // Check if already in list
    if (shoppingList.some(i => i.name === item.name && i.brand === item.brand)) {
      addToast(`${item.name} is already in shopping list`, 'info');
      return;
    }

    const newItem = {
      ...item,
      id: Date.now() + Math.random(), // new ID for shopping list
      addedToListAt: new Date().toISOString()
    };
    setShoppingList(prev => [...prev, newItem]);
    addToast(`Added ${item.name} to shopping list`, 'success');
  };

  const removeFromShoppingList = (id) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const restockItems = (itemsToRestock) => {
    const newPantryItems = itemsToRestock.map(item => ({
      ...item,
      id: Date.now() + Math.random(),
      addedAt: new Date().toISOString() // Reset added date to today
    }));

    setPantry(prev => [...prev, ...newPantryItems]);

    // Remove from shopping list
    const restockedIds = itemsToRestock.map(i => i.id);
    setShoppingList(prev => prev.filter(i => !restockedIds.includes(i.id)));

    addToast(`Restocked ${itemsToRestock.length} items to pantry`, 'success');
    setIsShoppingListOpen(false);
  };

  const handleConsume = (item) => {
    removeFromPantry(item.id);
    addToShoppingList(item); // Auto-add to shopping list
    setEcoScore(prev => Math.min(prev + 10, 1000)); // Cap at 1000
    addToast(`Consumed ${item.name}. +10 Eco Points! 🌱`, 'success');
  };

  const handleWaste = (item) => {
    removeFromPantry(item.id);
    setEcoScore(prev => Math.max(prev - 20, 0)); // Floor at 0
    addToast(`Marked ${item.name} as wasted. -20 Eco Points 📉`, 'info');
    // Future: Track waste stats here
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'pantry') {
      // Ideally scroll to pantry section, for now just ensure filter is all
      setPantryFilter('all');
      const pantryElement = document.getElementById('pantry-section');
      if (pantryElement) pantryElement.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'shop') {
      setIsShoppingListOpen(true);
    } else if (tabId === 'settings') {
      addToast('Settings coming soon! ⚙️', 'info');
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
    addToast("You're all set! Enjoy SafeShelf. 🚀", 'success');
  };

  const handleUpgrade = (planName) => {
    setUserTier('PRO');
    setIsPricingOpen(false);
    addToast(`Welcome to SafeShelf ${planName}! 🌟`, 'success');

    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 150 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleExportData = () => {
    const data = {
      pantry,
      shoppingList,
      ecoScore,
      userTier,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safeshelf_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast('Data exported successfully 📦', 'success');
  };

  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to reset SafeShelf? This will delete all your data and cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-navy-900 text-slate-200 font-sans selection:bg-electric-blue/30">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-20">
        <AnimatePresence mode="wait">

          {activeTab === 'home' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Hero
                stats={stats}
                onFilterClick={handleFilterSelect}
                userTier={userTier}
                ecoScore={ecoScore}
                onUpgradeClick={() => setIsPricingOpen(true)}
              />

              {/* Content Tabs */}
              <div className="mb-12 relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-6 h-6 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search products, brands, or ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-navy-800/50 border border-white/10 rounded-2xl text-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue/50 transition-all shadow-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToPantry}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                  <p className="text-xl">No products found matching "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'pantry' && (
            <PantrySection
              pantry={pantry}
              onRemove={removeFromPantry}
              onConsume={handleConsume}
              onWaste={handleWaste}
              onClearExpired={clearExpiredItems}
              onClearAll={() => setPantry([])}
              initialFilter={pantryFilter}
              userTier={userTier}
              onUpgradeClick={() => setIsPricingOpen(true)}
            />
          )}

          {/* Anchor for scrolling */}
          <div id="pantry-section" />

          {/* Empty State / Loading would go here */}
          {activeTab === 'settings' && (
            <SettingsSection
              onExport={handleExportData}
              onReset={handleFactoryReset}
              addToast={addToast}
            />
          )}

        </AnimatePresence>

        <AnimatePresence>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAdd={addToPantry}
            />
          )}
        </AnimatePresence>

        <ShoppingListSidebar
          isOpen={isShoppingListOpen}
          onClose={() => setIsShoppingListOpen(false)}
          items={shoppingList}
          onRemove={removeFromShoppingList}
          onRestock={restockItems}
        />

        <PricingModal
          isOpen={isPricingOpen}
          onClose={() => setIsPricingOpen(false)}
          onUpgrade={handleUpgrade}
        />

        <MobileNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          cartCount={shoppingList.length}
        />

        {showOnboarding && (
          <OnboardingOverlay onComplete={handleOnboardingComplete} />
        )}

        <ScienceAnalysisModal
          isOpen={isScienceModalOpen}
          onClose={() => setIsScienceModalOpen(false)}
          analysis={MOCK_ANALYSIS_DATA}
        />

        {/* Temporary Test Trigger */}
        <button
          onClick={() => setIsScienceModalOpen(true)}
          className="fixed bottom-24 right-4 z-40 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Test Science Modal"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
}

export default App;
