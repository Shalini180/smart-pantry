// SafeShelf System Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c SafeShelf System: Online ", "background: #00f3ff; color: #0a0a0f; font-weight: bold; padding: 4px; border-radius: 2px;");

    // --- 1. Product Database (Fake) ---
    const productDatabase = [
        {
            id: "P001",
            name: "Organic Quinoa",
            brand: "Nature's Earth",
            category: "Grains",
            ingredients: ["White Quinoa", "Red Quinoa", "Whole Grain"],
            prices: { "WholeFoods": 5.99, "TraderJoes": 4.50, "Walmart": 4.20 }
        },
        {
            id: "P002",
            name: "Almond Milk (Unsweetened)",
            brand: "Silk",
            category: "Dairy Alternative",
            ingredients: ["Almond base", "Vitamin D2", "Calcium Carbonate"],
            prices: { "WholeFoods": 3.99, "Target": 3.49, "Walmart": 3.29 }
        },
        {
            id: "P003",
            name: "Greek Yogurt",
            brand: "Chobani",
            category: "Dairy",
            ingredients: ["Cultured Milk", "Live Cultures"],
            prices: { "WholeFoods": 1.50, "Kroger": 1.25, "Walmart": 1.00 }
        },
        {
            id: "P004",
            name: "Avocado Oil",
            brand: "Primal Kitchen",
            category: "Oils",
            ingredients: ["Avocado Oil"],
            prices: { "WholeFoods": 12.99, "Amazon": 10.50, "Costco": 9.99 }
        },
        {
            id: "P005",
            name: "Oat Milk",
            brand: "Oatly",
            category: "Dairy Alternative",
            ingredients: ["Oat base", "Rapeseed Oil", "Calcium", "Oats"],
            prices: { "WholeFoods": 4.99, "Target": 4.59, "Walmart": 4.29 }
        },
        {
            id: "P006",
            name: "Sugary Blast Cereal",
            brand: "SweetCo",
            category: "Breakfast",
            ingredients: ["Sugar", "Corn Flour", "Palm Oil", "Red 40", "Artificial Flavor"],
            prices: { "Walmart": 2.99, "Target": 3.50 }
        },
        {
            id: "P007",
            name: "Healthy Oats Cereal",
            brand: "GoodGrains",
            category: "Breakfast",
            ingredients: ["Whole Grain Oats", "Honey", "Almonds"],
            prices: { "WholeFoods": 4.99, "Target": 4.29 }
        }
    ];

    // --- 2. Search Core Engine ---
    const searchCore = {
        find: (query) => {
            if (!query) return [];
            const lowerQuery = query.toLowerCase();
            return productDatabase.filter(product =>
                product.name.toLowerCase().includes(lowerQuery) ||
                product.brand.toLowerCase().includes(lowerQuery) ||
                product.category.toLowerCase().includes(lowerQuery)
            );
        },
        getCheapestPrice: (pricesObj) => {
            const entries = Object.entries(pricesObj);
            // Sort by price ascending
            entries.sort((a, b) => a[1] - b[1]);
            return entries[0]; // Returns [StoreName, Price]
        }
    };

    // --- 3. Health Engine (Day 3 Addition) ---
    const healthEngine = {
        analyze: (product) => {
            const flags = [];
            const ingredients = product.ingredients.map(i => i.toLowerCase());

            // Rule 1: High Sugar (Sugar in first 3 ingredients)
            const firstThree = ingredients.slice(0, 3);
            if (firstThree.some(i => i.includes('sugar'))) {
                flags.push({ label: "High Sugar", type: "bad" });
            }

            // Rule 2: Palm Oil
            if (ingredients.some(i => i.includes('palm oil'))) {
                flags.push({ label: "Contains Palm Oil", type: "bad" });
            }

            // Rule 3: Additives
            const additives = ["e150", "e102", "ins", "color", "flavor", "red 40"];
            if (ingredients.some(i => additives.some(a => i.includes(a)))) {
                flags.push({ label: "Contains Additives", type: "warning" });
            }

            // Rule 4: Good Choice
            if (ingredients.some(i => i.includes('whole grain') || i.includes('oats'))) {
                flags.push({ label: "High Fiber / Better Choice", type: "good" });
            }

            return flags;
        }
    };

    // --- 4. Recommendation Engine (Day 4 Addition) ---
    const recommendationEngine = {
        calculateScore: (product) => {
            let score = 0;
            const flags = healthEngine.analyze(product);
            flags.forEach(flag => {
                if (flag.type === 'bad') score -= 2;
                if (flag.type === 'warning') score -= 1;
                if (flag.type === 'good') score += 2;
            });
            return score;
        },
        getAlternatives: (currentProduct) => {
            const currentScore = recommendationEngine.calculateScore(currentProduct);

            return productDatabase.filter(p => {
                // Same category, different product
                if (p.category !== currentProduct.category || p.id === currentProduct.id) return false;

                // Score must be better or equal
                const score = recommendationEngine.calculateScore(p);
                return score > currentScore;
            }).sort((a, b) => {
                // Sort by score descending
                return recommendationEngine.calculateScore(b) - recommendationEngine.calculateScore(a);
            }).slice(0, 3); // Top 3
        }
    };

    // --- 5. Pantry Engine (Day 5 Addition) ---
    const pantryEngine = {
        items: [],
        init: () => {
            const stored = localStorage.getItem('safeshelf_pantry');
            if (stored) {
                pantryEngine.items = JSON.parse(stored);
            }
            pantryEngine.render();
        },
        add: (product) => {
            const newItem = {
                id: Date.now().toString(), // Simple unique ID
                productId: product.id,
                name: product.name,
                brand: product.brand,
                addedAt: new Date().toLocaleDateString()
            };
            pantryEngine.items.push(newItem);
            pantryEngine.save();
            pantryEngine.render();

            // Visual feedback
            console.log(`Added ${product.name} to pantry.`);
            alert(`${product.name} added to your pantry!`);
        },
        save: () => {
            localStorage.setItem('safeshelf_pantry', JSON.stringify(pantryEngine.items));
        },
        render: () => {
            const container = document.getElementById('pantry-section');
            const list = document.getElementById('pantry-list');
            const countBadge = document.getElementById('pantryCount');

            if (pantryEngine.items.length === 0) {
                container.classList.add('hidden');
                return;
            }

            container.classList.remove('hidden');
            countBadge.textContent = `${pantryEngine.items.length} items`;

            list.innerHTML = pantryEngine.items.map(item => `
                <div class="pantry-item">
                    <div class="p-info">
                        <div class="p-name">${item.name}</div>
                        <div class="p-brand">${item.brand}</div>
                    </div>
                    <div class="p-date">Added: ${item.addedAt}</div>
                </div>
            `).join('');
        }
    };

    // --- 6. UI Render Engine ---
    const uiRender = {
        display: (products) => {
            const grid = document.getElementById('resultsGrid');
            grid.innerHTML = ''; // Clear previous results

            if (products.length === 0) {
                grid.innerHTML = '<div class="no-results">No products found in database.</div>';
                return;
            }

            products.forEach(product => {
                const [cheapestStore, cheapestPrice] = searchCore.getCheapestPrice(product.prices);
                const healthFlags = healthEngine.analyze(product);
                const alternatives = recommendationEngine.getAlternatives(product);

                const card = document.createElement('div');
                card.className = 'product-card';

                // Generate HTML for flags
                let flagsHtml = '';
                if (healthFlags.length > 0) {
                    flagsHtml = `<div class="health-flags">
                        <div class="flags-title">Health Analysis:</div>
                        <div class="flags-list">
                            ${healthFlags.map(flag => `<span class="flag flag-${flag.type}">${flag.label}</span>`).join('')}
                        </div>
                    </div>`;
                }

                // Generate HTML for alternatives
                let alternativesHtml = '';
                if (alternatives.length > 0) {
                    alternativesHtml = `<div class="alternatives-section">
                        <div class="alt-title">Better options in this category:</div>
                        <div class="alt-list">
                            ${alternatives.map(alt => {
                        const [store, price] = searchCore.getCheapestPrice(alt.prices);
                        return `
                                    <div class="alt-item">
                                        <span class="alt-name">${alt.name}</span>
                                        <span class="alt-price">$${price.toFixed(2)}</span>
                                    </div>
                                `;
                    }).join('')}
                        </div>
                    </div>`;
                }

                card.innerHTML = `
                    <div class="card-header">
                        <span class="brand">${product.brand}</span>
                        <span class="category">${product.category}</span>
                    </div>
                    <h3>${product.name}</h3>
                    <div class="ingredients">Contains: ${product.ingredients.slice(0, 3).join(', ')}...</div>
                    
                    ${flagsHtml}
                    ${alternativesHtml}

                    <div class="price-tag">
                        <span class="label">BEST PRICE:</span>
                        <span class="amount">$${cheapestPrice.toFixed(2)}</span>
                        <span class="store">@ ${cheapestStore}</span>
                    </div>
                    
                    <button class="btn-add" data-id="${product.id}">
                        <i class="fas fa-plus"></i> Add to Pantry
                    </button>
                `;

                // Bind Add to Pantry button
                const addBtn = card.querySelector('.btn-add');
                addBtn.addEventListener('click', () => pantryEngine.add(product));

                grid.appendChild(card);
            });
        }
    };

    // --- 7. Event Bindings ---
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Initialize Pantry
    pantryEngine.init();

    const executeSearch = () => {
        const query = searchInput.value.trim();
        console.log(`Searching for: ${query}`);
        const results = searchCore.find(query);
        uiRender.display(results);
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

        // Add subtle interaction
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
});
