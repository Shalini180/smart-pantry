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
            ingredients: ["White Quinoa", "Red Quinoa"],
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
            ingredients: ["Oat base", "Rapeseed Oil", "Calcium"],
            prices: { "WholeFoods": 4.99, "Target": 4.59, "Walmart": 4.29 }
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

    // --- 3. UI Render Engine ---
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

                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <div class="card-header">
                        <span class="brand">${product.brand}</span>
                        <span class="category">${product.category}</span>
                    </div>
                    <h3>${product.name}</h3>
                    <div class="ingredients">Contains: ${product.ingredients.slice(0, 2).join(', ')}...</div>
                    <div class="price-tag">
                        <span class="label">BEST PRICE:</span>
                        <span class="amount">$${cheapestPrice.toFixed(2)}</span>
                        <span class="store">@ ${cheapestStore}</span>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    };

    // --- 4. Event Bindings ---
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

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

        // Add subtle interaction (kept from previous version)
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
