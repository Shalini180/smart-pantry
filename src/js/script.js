// SafeShelf System Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c SafeShelf System: Online ", "background: #00f3ff; color: #0a0a0f; font-weight: bold; padding: 4px; border-radius: 2px;");

    // ==================== CONFIG & STATE ====================
    const CONFIG = {
        currency: '₹',
        loadingDelay: 500
    };

    // ==================== DATA (MOCK DB) ====================
    const MOCK_PRODUCTS = [
        // Milk & Dairy
        { id: "P001", name: "Amul Taaza Milk 1L", brand: "Amul", category: "Milk & Dairy", ingredients: ["Toned Milk", "Vitamin A", "Vitamin D"], prices: { "BigBasket": 72, "Blinkit": 75, "Zepto": 74 } },
        { id: "P002", name: "Britannia Cheese Slices", brand: "Britannia", category: "Milk & Dairy", ingredients: ["Cheese", "Milk Solids", "Emulsifiers", "Preservatives"], prices: { "BigBasket": 140, "Amazon": 135 } },
        { id: "P003", name: "Epigamia Greek Yogurt", brand: "Epigamia", category: "Milk & Dairy", ingredients: ["Pasteurized Double Toned Milk", "Milk Solids", "Active Cultures"], prices: { "Swiggy Instamart": 45, "Zepto": 40 } },

        // Bread & Bakery
        { id: "P004", name: "Modern Whole Wheat Bread", brand: "Modern", category: "Bread & Bakery", ingredients: ["Whole Wheat Flour", "Yeast", "Sugar", "Preservatives"], prices: { "Local Store": 45, "BigBasket": 42 } },
        { id: "P005", name: "Britannia Milk Bikis", brand: "Britannia", category: "Snacks & Biscuits", ingredients: ["Refined Wheat Flour", "Sugar", "Palm Oil", "Milk Solids"], prices: { "Amazon": 30, "Blinkit": 32 } },

        // Vegetables & Fruits
        { id: "P006", name: "Fresh Tomato (1kg)", brand: "FarmFresh", category: "Vegetables & Fruits", ingredients: ["Tomato"], prices: { "BigBasket": 40, "Local Market": 35 } },
        { id: "P007", name: "Organic Spinach", brand: "Organic India", category: "Vegetables & Fruits", ingredients: ["Spinach"], prices: { "Zepto": 60, "BigBasket": 55 } },

        // Snacks & Biscuits
        { id: "P008", name: "Lays Classic Salted", brand: "Lays", category: "Snacks & Biscuits", ingredients: ["Potato", "Edible Vegetable Oil", "Salt"], prices: { "Blinkit": 20, "Zepto": 20 } },
        { id: "P009", name: "Dark Fantasy Choco Fills", brand: "Sunfeast", category: "Snacks & Biscuits", ingredients: ["Choco Creme", "Sugar", "Refined Wheat Flour", "Hydrogenated Vegetable Oil"], prices: { "Amazon": 120, "BigBasket": 115 } },

        // Breakfast Cereals
        { id: "P010", name: "Kellogg's Corn Flakes", brand: "Kellogg's", category: "Breakfast Cereals", ingredients: ["Corn Grits", "Sugar", "Malt Extract", "Vitamins"], prices: { "Amazon": 290, "BigBasket": 295 } },
        { id: "P011", name: "Quaker Oats 1kg", brand: "Quaker", category: "Breakfast Cereals", ingredients: ["Oats"], prices: { "Amazon": 190, "Blinkit": 195 } },
        { id: "P012", name: "Chocos", brand: "Kellogg's", category: "Breakfast Cereals", ingredients: ["Wheat Flour", "Sugar", "Cocoa Solids", "Palm Oil"], prices: { "Zepto": 45, "BigBasket": 48 } },

        // Soft Drinks & Juices
        { id: "P013", name: "Coca Cola 750ml", brand: "Coca Cola", category: "Soft Drinks & Juices", ingredients: ["Carbonated Water", "Sugar", "Caffeine", "Color (150d)"], prices: { "Blinkit": 40, "Zepto": 40 } },
        { id: "P014", name: "Real Mixed Fruit Juice", brand: "Real", category: "Soft Drinks & Juices", ingredients: ["Water", "Mixed Fruit Concentrate", "Sugar", "Acidity Regulator"], prices: { "Amazon": 110, "BigBasket": 105 } },

        // Frozen Food
        { id: "P015", name: "McCain French Fries", brand: "McCain", category: "Frozen Food", ingredients: ["Potato", "Palmolein Oil"], prices: { "Blinkit": 125, "Zepto": 130 } },
        { id: "P016", name: "Sumeru Green Peas", brand: "Sumeru", category: "Frozen Food", ingredients: ["Green Peas"], prices: { "BigBasket": 85, "Local Store": 90 } }
    ];

    // ==================== UTILITIES ====================
    const Utils = {
        formatCurrency: (amount) => {
            return `${CONFIG.currency}${amount.toFixed(2)}`;
        },

        formatDate: (dateInput) => {
            return new Date(dateInput).toLocaleDateString();
        },

        getCheapestPrice: (pricesObj) => {
            const entries = Object.entries(pricesObj);
            entries.sort((a, b) => a[1] - b[1]);
            return entries[0];
        }
    };

    // ==================== SETTINGS ENGINE ====================
    const SettingsEngine = {
        defaults: {
            theme: 'dark',
            defaultCategory: 'all',
            sortMode: 'cheapest'
        },
        current: {},

        init: () => {
            SettingsEngine.load();
            SettingsEngine.apply();
        },

        load: () => {
            const stored = localStorage.getItem('safeshelf_settings');
            SettingsEngine.current = stored ? JSON.parse(stored) : { ...SettingsEngine.defaults };
        },

        save: () => {
            localStorage.setItem('safeshelf_settings', JSON.stringify(SettingsEngine.current));
            SettingsEngine.apply();
            alert('Preferences saved!');
        },

        apply: () => {
            if (SettingsEngine.current.theme === 'light') {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
            UI.updateSettingsControls();
        }
    };

    // ==================== CORE ENGINES ====================

    // --- Search Engine ---
    const SearchEngine = {
        find: (query, categoryFilter = 'all') => {
            let results = MOCK_PRODUCTS;

            if (categoryFilter !== 'all') {
                results = results.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
            }

            if (query) {
                const lowerQuery = query.toLowerCase();
                results = results.filter(product =>
                    product.name.toLowerCase().includes(lowerQuery) ||
                    product.brand.toLowerCase().includes(lowerQuery) ||
                    product.ingredients.some(i => i.toLowerCase().includes(lowerQuery))
                );
            }

            results = SearchEngine.sort(results);
            return results;
        },

        sort: (products) => {
            const mode = SettingsEngine.current.sortMode;
            return [...products].sort((a, b) => {
                if (mode === 'cheapest') {
                    const [, priceA] = Utils.getCheapestPrice(a.prices);
                    const [, priceB] = Utils.getCheapestPrice(b.prices);
                    return priceA - priceB;
                } else if (mode === 'healthiest') {
                    return RecommendationEngine.calculateScore(b) - RecommendationEngine.calculateScore(a);
                }
                return 0;
            });
        }
    };

    // --- Health Engine ---
    const HealthEngine = {
        analyze: (product) => {
            const flags = [];
            const ingredients = product.ingredients.map(i => i.toLowerCase());

            const firstThree = ingredients.slice(0, 3);
            if (firstThree.some(i => i.includes('sugar'))) {
                flags.push({ label: "High Sugar", type: "bad" });
            }

            if (ingredients.some(i => i.includes('palm oil') || i.includes('palmolein'))) {
                flags.push({ label: "Contains Palm Oil", type: "bad" });
            }

            const additives = ["e150", "e102", "ins", "color", "flavor", "red 40", "preservatives", "hydrogenated"];
            if (ingredients.some(i => additives.some(a => i.includes(a)))) {
                flags.push({ label: "Processed/Additives", type: "warning" });
            }

            if (ingredients.some(i => i.includes('whole wheat') || i.includes('oats') || i.includes('spinach') || i.includes('peas'))) {
                flags.push({ label: "Whole Food / Fiber", type: "good" });
            }

            return flags;
        }
    };

    // --- Recommendation Engine ---
    const RecommendationEngine = {
        calculateScore: (product) => {
            let score = 0;
            const flags = HealthEngine.analyze(product);
            flags.forEach(flag => {
                if (flag.type === 'bad') score -= 2;
                if (flag.type === 'warning') score -= 1;
                if (flag.type === 'good') score += 2;
            });
            return score;
        },

        getAlternatives: (currentProduct) => {
            const currentScore = RecommendationEngine.calculateScore(currentProduct);

            return MOCK_PRODUCTS.filter(p => {
                if (p.category !== currentProduct.category || p.id === currentProduct.id) return false;
                const score = RecommendationEngine.calculateScore(p);
                return score > currentScore;
            }).sort((a, b) => {
                return RecommendationEngine.calculateScore(b) - RecommendationEngine.calculateScore(a);
            }).slice(0, 3);
        }
    };

    // --- Expiry Engine ---
    const ExpiryEngine = {
        estimate: (product) => {
            const now = new Date();
            let daysToAdd = 30; // Default
            const cat = product.category.toLowerCase();

            if (cat.includes('milk') || cat.includes('dairy')) {
                daysToAdd = 5;
                if (product.name.toLowerCase().includes('cheese')) daysToAdd = 60;
            } else if (cat.includes('bread') || cat.includes('bakery')) {
                daysToAdd = 5;
            } else if (cat.includes('vegetables') || cat.includes('fruits')) {
                daysToAdd = 7;
            } else if (cat.includes('snacks') || cat.includes('biscuits') || cat.includes('cereals')) {
                daysToAdd = 180;
            } else if (cat.includes('frozen')) {
                daysToAdd = 365;
            } else if (cat.includes('drinks') || cat.includes('juices')) {
                daysToAdd = 120;
            }

            const expiryDate = new Date(now);
            expiryDate.setDate(now.getDate() + daysToAdd);
            return expiryDate;
        },

        getStatus: (expiryDateString) => {
            const now = new Date();
            const expiry = new Date(expiryDateString);
            const diffTime = expiry - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 0) {
                return { label: "Expired", class: "expiry-expired", days: diffDays };
            } else if (diffDays <= 3) {
                return { label: "Expiring Soon", class: "expiry-soon", days: diffDays };
            } else {
                return { label: "Fresh", class: "expiry-fresh", days: diffDays };
            }
        }
    };

    // --- Pantry Engine ---
    const PantryEngine = {
        items: [],

        init: () => {
            const stored = localStorage.getItem('safeshelf_pantry');
            if (stored) {
                PantryEngine.items = JSON.parse(stored);
            }
            PantryEngine.renderPantryList();
        },

        add: (product) => {
            const estimatedExpiry = ExpiryEngine.estimate(product).toISOString();
            const newItem = {
                id: Date.now().toString(),
                productId: product.id,
                name: product.name,
                brand: product.brand,
                addedAt: new Date().toLocaleDateString(),
                estimatedExpiry: estimatedExpiry
            };
            PantryEngine.items.push(newItem);
            PantryEngine.save();
            PantryEngine.renderPantryList();
            alert(`${product.name} added to pantry!`);
        },

        remove: (id) => {
            PantryEngine.items = PantryEngine.items.filter(item => item.id !== id);
            PantryEngine.save();
            PantryEngine.renderPantryList();
        },

        clear: () => {
            if (confirm("Are you sure you want to clear your entire pantry?")) {
                PantryEngine.items = [];
                PantryEngine.save();
                PantryEngine.renderPantryList();
            }
        },

        updateExpiry: (id) => {
            const item = PantryEngine.items.find(i => i.id === id);
            if (!item) return;

            const current = new Date(item.estimatedExpiry).toISOString().split('T')[0];
            const newDateStr = prompt(`Update expiry for ${item.name} (YYYY-MM-DD):`, current);

            if (newDateStr) {
                const newDate = new Date(newDateStr);
                if (!isNaN(newDate.getTime())) {
                    item.estimatedExpiry = newDate.toISOString();
                    PantryEngine.save();
                    PantryEngine.renderPantryList();
                } else {
                    alert("Invalid date format.");
                }
            }
        },

        save: () => {
            localStorage.setItem('safeshelf_pantry', JSON.stringify(PantryEngine.items));
        },

        renderPantryList: () => {
            const container = document.getElementById('pantry-section');
            const list = document.getElementById('pantry-list');
            const countBadge = document.getElementById('pantryCount');
            const clearBtn = document.getElementById('clearPantryBtn');

            container.classList.remove('hidden');
            countBadge.textContent = `${PantryEngine.items.length} items`;

            if (PantryEngine.items.length > 0) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }

            if (PantryEngine.items.length === 0) {
                list.innerHTML = `
                    <div class="state-message" style="grid-column: 1/-1;">
                        <i class="fas fa-basket-shopping" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>Your pantry is empty</h3>
                        <p class="sub-hint">Track your groceries here to avoid waste.</p>
                        <button class="btn-text-primary" onclick="document.querySelector('[data-target=\\'search-section\\']').click()">+ Add items from Search</button>
                    </div>
                `;
                return;
            }

            list.innerHTML = '';

            PantryEngine.items.forEach(item => {
                const status = ExpiryEngine.getStatus(item.estimatedExpiry);
                const expiryDate = Utils.formatDate(item.estimatedExpiry);

                const itemEl = document.createElement('div');
                itemEl.className = 'pantry-item';
                itemEl.innerHTML = `
                    <div class="p-info">
                        <div class="p-name">${item.name}</div>
                        <div class="p-brand">${item.brand}</div>
                    </div>
                    <div class="p-meta">
                        <div class="p-date">Added: ${item.addedAt}</div>
                        <div class="p-expiry">
                            <span class="expiry-label">Expires: ${expiryDate}</span>
                            <span class="expiry-badge ${status.class}">${status.label}</span>
                        </div>
                    </div>
                    <div class="pantry-actions">
                        <button class="btn-icon edit" title="Edit Expiry">✎</button>
                        <button class="btn-icon delete" title="Remove">✕</button>
                    </div>
                `;

                itemEl.querySelector('.edit').addEventListener('click', () => PantryEngine.updateExpiry(item.id));
                itemEl.querySelector('.delete').addEventListener('click', () => PantryEngine.remove(item.id));

                list.appendChild(itemEl);
            });
        }
    };

    // ==================== UI RENDERING ====================
    const UI = {
        grid: document.getElementById('resultsGrid'),

        showLoading: () => {
            UI.grid.innerHTML = `
                <div class="state-message">
                    <div class="loading-spinner"></div>
                    <p>Scanning Database...</p>
                </div>
            `;
        },

        showInitialState: () => {
            UI.grid.innerHTML = `
                <div class="state-message">
                    <i class="fas fa-search" style="font-size: 2rem; color: var(--accent-cyan); margin-bottom: 1rem;"></i>
                    <h3>Ready to Search</h3>
                    <p>Enter a product name or scan a barcode to begin.</p>
                    <div class="suggestion-chips">
                        <span>Try: "Milk"</span>
                        <span>"Bread"</span>
                        <span>"Cereal"</span>
                        <span>"Tomato"</span>
                    </div>
                </div>
            `;
        },

        showNoResults: (query) => {
            UI.grid.innerHTML = `
                <div class="state-message">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3>No Products Found</h3>
                    <p>We couldn't find anything matching "${query}".</p>
                    <p class="sub-hint">Try checking the spelling or browsing by category.</p>
                </div>
            `;
        },

        renderSearchResults: (products) => {
            UI.grid.innerHTML = '';

            if (products.length === 0) {
                return;
            }

            products.forEach(product => {
                const [cheapestStore, cheapestPrice] = Utils.getCheapestPrice(product.prices);
                const healthFlags = HealthEngine.analyze(product);
                const alternatives = RecommendationEngine.getAlternatives(product);

                const card = document.createElement('div');
                card.className = 'product-card';

                let flagsHtml = '';
                if (healthFlags.length > 0) {
                    flagsHtml = `<div class="health-flags">
                        <div class="flags-list">
                            ${healthFlags.map(flag => `<span class="flag flag-${flag.type}">${flag.label}</span>`).join('')}
                        </div>
                    </div>`;
                }

                let alternativesHtml = '';
                if (alternatives.length > 0) {
                    alternativesHtml = `<div class="alternatives-section">
                        <div class="alt-title">Better options:</div>
                        <div class="alt-list">
                            ${alternatives.map(alt => {
                        const [store, price] = Utils.getCheapestPrice(alt.prices);
                        return `
                                    <div class="alt-item">
                                        <span class="alt-name">${alt.name}</span>
                                        <span class="alt-price">${Utils.formatCurrency(price)}</span>
                                    </div>
                                `;
                    }).join('')}
                        </div>
                    </div>`;
                }

                card.innerHTML = `
                    <div class="card-header">
                        <span class="category">${product.category}</span>
                        <span class="brand">${product.brand}</span>
                    </div>
                    
                    <div class="card-body">
                        <h3>${product.name}</h3>
                        <div class="ingredients">Contains: ${product.ingredients.slice(0, 3).join(', ')}...</div>
                        
                        ${flagsHtml}
                        
                        <div class="price-section">
                            <div class="price-large">${Utils.formatCurrency(cheapestPrice)}</div>
                            <div class="store-name">at ${cheapestStore}</div>
                        </div>

                        ${alternativesHtml}
                    </div>
                    
                    <button class="btn-add" data-id="${product.id}">
                        <i class="fas fa-plus"></i> Add to Pantry
                    </button>
                `;

                const addBtn = card.querySelector('.btn-add');
                addBtn.addEventListener('click', () => PantryEngine.add(product));

                UI.grid.appendChild(card);
            });
        },

        updateSettingsControls: () => {
            document.querySelectorAll('.btn-toggle').forEach(btn => {
                if (btn.dataset.value === SettingsEngine.current.theme) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            const catSelect = document.getElementById('settingCategory');
            if (catSelect) catSelect.value = SettingsEngine.current.defaultCategory;

            const sortRadios = document.getElementsByName('sortMode');
            sortRadios.forEach(radio => {
                if (radio.value === SettingsEngine.current.sortMode) {
                    radio.checked = true;
                }
            });
        },

        switchPanel: (panelId) => {
            document.querySelectorAll('.glass-panel').forEach(p => p.classList.add('hidden'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

            document.getElementById(panelId).classList.remove('hidden');
            const navLink = document.querySelector(`.nav-item[data-target="${panelId}"]`);
            if (navLink) navLink.classList.add('active');
        }
    };

    // ==================== EVENT LISTENERS ====================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');

    // Navigation
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            UI.switchPanel(target);
        });
    });

    // Settings Events
    document.querySelectorAll('.btn-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            SettingsEngine.current.theme = btn.dataset.value;
            SettingsEngine.apply();
        });
    });

    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            SettingsEngine.current.defaultCategory = document.getElementById('settingCategory').value;
            const sortRadios = document.getElementsByName('sortMode');
            sortRadios.forEach(r => {
                if (r.checked) SettingsEngine.current.sortMode = r.value;
            });
            SettingsEngine.save();
        });
    }

    const executeSearch = () => {
        const query = searchInput.value.trim();
        const category = categoryFilter.value;

        if (!query && category === 'all') {
            UI.showInitialState();
            return;
        }

        UI.showLoading();

        setTimeout(() => {
            console.log(`Searching for: "${query}" in category: "${category}"`);
            const results = SearchEngine.find(query, category);

            if (results.length > 0) {
                UI.renderSearchResults(results);
            } else {
                UI.showNoResults(query || category);
            }
        }, CONFIG.loadingDelay);
    };

    if (searchBtn) {
        searchBtn.addEventListener('click', executeSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeSearch();
            }
        });

        const searchBar = document.querySelector('.search-bar');
        searchInput.addEventListener('focus', () => {
            searchBar.style.borderColor = '#00f3ff';
            searchBar.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.2)';
        });
        searchInput.addEventListener('blur', () => {
            searchBar.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            searchBar.style.boxShadow = 'none';
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', executeSearch);
    }

    const clearBtn = document.getElementById('clearPantryBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', PantryEngine.clear);
    }

    const heroCtaBtn = document.getElementById('heroCtaBtn');
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', () => {
            UI.switchPanel('search-section');
            document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('searchInput').focus();
        });
    }

    // ==================== INITIALIZATION ====================
    SettingsEngine.init();
    PantryEngine.init();

    if (categoryFilter) {
        categoryFilter.value = SettingsEngine.current.defaultCategory;
    }

    UI.showInitialState();
});
