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

const Hero = ({ stats }) => (
  <div className="relative overflow-hidden py-16 sm:py-24">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-electric-blue/20 rounded-full blur-[120px] -z-10 opacity-30" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
          <span className="block text-white mb-2">Future of</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-electric-teal">
            Food Intelligence
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Analyze ingredients, find healthier alternatives, and track expiry—automatically.
          Your pantry, upgraded with AI.
        </p>
      </motion.div>

      {/* Live Stats Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="inline-flex items-center gap-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50"
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Items</div>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-400">{stats.expiring}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Expiring</div>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="text-center">
          <div className="text-3xl font-bold text-red-500">{stats.expired}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Expired</div>
        </div>
      </motion.div>
    </div>
  </div>
);

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

  // Derived State for Stats
  const stats = {
    total: pantry.length,
    expiring: pantry.filter(i => getExpiryStatus(i.addedAt, i.expiryDays).label === "Expiring Soon").length,
    expired: pantry.filter(i => getExpiryStatus(i.addedAt, i.expiryDays).label === "Expired").length
  };

  const addToPantry = (product) => {
    const newItem = {
      ...product,
      id: Date.now(), // simple unique id
      addedAt: new Date().toISOString()
    };
    setPantry([...pantry, newItem]);
  };

  const removeFromPantry = (id) => {
    setPantry(pantry.filter(item => item.id !== id));
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
              <Hero stats={stats} />

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
                  onClick={() => setPantry([])}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {pantry.length > 0 ? (
                <div className="space-y-4">
                  {pantry.map(item => (
                    <PantryItem key={item.id} item={item} onRemove={removeFromPantry} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                  <ShoppingBasket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Your pantry is empty</h3>
                  <p className="text-slate-400 mb-6">Start adding items from the search tab to track them here.</p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="px-6 py-2 bg-electric-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    Go to Search
                  </button>
                </div>
              )}

              {/* Premium Teaser */}
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
                  <button className="px-4 py-2 bg-white text-navy-900 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                    Upgrade
                  </button>
                </div>
              </div>
            </motion.div>
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
