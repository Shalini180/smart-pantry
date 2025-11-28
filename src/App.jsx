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

// --- Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const MOCK_PRODUCTS = [
  {
    id: "P001",
    name: "Amul Taaza Milk",
    brand: "Amul",
    category: "Dairy",
    price: 72,
    image: "from-blue-400 to-blue-600",
    ingredients: ["Toned Milk", "Vitamin A", "Vitamin D"],
    expiryDays: 2
  },
  {
    id: "P002",
    name: "Coca Cola",
    brand: "Coca Cola",
    category: "Beverages",
    price: 40,
    image: "from-red-500 to-red-700",
    ingredients: ["Carbonated Water", "Sugar", "Caffeine", "Color (150d)"],
    expiryDays: 120
  },
  {
    id: "P003",
    name: "Lays Classic Salted",
    brand: "Lays",
    category: "Snacks",
    price: 20,
    image: "from-yellow-400 to-yellow-600",
    ingredients: ["Potato", "Edible Vegetable Oil", "Salt"],
    expiryDays: 90
  },
  {
    id: "P004",
    name: "Quaker Oats",
    brand: "Quaker",
    category: "Breakfast",
    price: 190,
    image: "from-orange-300 to-orange-500",
    ingredients: ["Oats", "Beta Glucan"],
    expiryDays: 180
  },
  {
    id: "P005",
    name: "Modern Whole Wheat Bread",
    brand: "Modern",
    category: "Bakery",
    price: 45,
    image: "from-amber-600 to-amber-800",
    ingredients: ["Whole Wheat Flour", "Yeast", "Sugar", "Preservatives"],
    expiryDays: 5
  }
];

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

const Navbar = ({ activeTab, setActiveTab }) => (
  <nav className="sticky top-0 z-50 backdrop-blur-xl bg-navy-900/80 border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('search')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-electric-teal flex items-center justify-center shadow-lg shadow-electric-blue/20">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SafeShelf
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Search', 'Pantry', 'Settings'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item.toLowerCase())}
              className={cn(
                "text-sm font-medium transition-all duration-200 hover:text-electric-teal",
                activeTab === item.toLowerCase() ? "text-electric-teal" : "text-slate-400"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="md:hidden">
          <Menu className="w-6 h-6 text-slate-400" />
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
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [pantry, setPantry] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pantryFilter, setPantryFilter] = useState('all');
  const { addToast } = useToast();

  // Derived State for Stats

  // Derived State for Stats
  const stats = usePantryStats(pantry);

  const handleFilterSelect = (filterType) => {
    setActiveTab('pantry');
    setPantryFilter(filterType);
  };

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

  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-navy-900 text-slate-200 font-sans selection:bg-electric-blue/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence mode="wait">

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Hero stats={stats} onFilterSelect={handleFilterSelect} />

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
              onClearExpired={clearExpiredItems}
              onClearAll={() => setPantry([])}
              initialFilter={pantryFilter}
            />
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>

              <div className="space-y-6">
                <div className="p-6 bg-navy-800/50 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Appearance</h3>
                    <p className="text-sm text-slate-400">Customize the look and feel</p>
                  </div>
                  <div className="flex bg-navy-900 p-1 rounded-lg border border-white/5">
                    <button className="px-4 py-1.5 bg-electric-blue text-white rounded-md text-sm font-medium shadow-lg">Dark</button>
                    <button className="px-4 py-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors">Light</button>
                  </div>
                </div>

                <div className="p-6 bg-navy-800/50 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Sort Preference</h3>
                    <p className="text-sm text-slate-400">Default sorting for search results</p>
                  </div>
                  <select className="bg-navy-900 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-electric-blue">
                    <option>Cheapest First</option>
                    <option>Healthiest First</option>
                  </select>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => addToast('Preferences saved successfully', 'success')}
                    className="px-6 py-2 bg-electric-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-electric-blue/20"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
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
      </main>
    </div>
  );
}

export default App;
