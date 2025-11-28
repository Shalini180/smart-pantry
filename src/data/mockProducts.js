export const MOCK_PRODUCTS = [
    // Dairy
    {
        id: "D001",
        name: "Organic Whole Milk",
        brand: "Horizon",
        category: "Dairy",
        price: 5.99,
        image: "from-blue-400 to-blue-600",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Organic Grade A Milk", "Vitamin D3"],
        expiryDays: 7
    },
    {
        id: "D002",
        name: "Greek Yogurt",
        brand: "Chobani",
        category: "Dairy",
        price: 1.49,
        image: "from-blue-300 to-cyan-500",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Cultured Milk", "Live Cultures"],
        expiryDays: 14
    },
    {
        id: "D003",
        name: "Salted Butter",
        brand: "Kerrygold",
        category: "Dairy",
        price: 4.49,
        image: "from-yellow-300 to-yellow-500",
        imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Pasteurized Cream", "Salt"],
        expiryDays: 90
    },
    {
        id: "D004",
        name: "Cheddar Cheese Block",
        brand: "Tillamook",
        category: "Dairy",
        price: 8.99,
        image: "from-orange-400 to-orange-600",
        imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Cultured Milk", "Salt", "Enzymes", "Annatto"],
        expiryDays: 60
    },

    // Produce
    {
        id: "P001",
        name: "Fresh Avocados",
        brand: "Nature's Pride",
        category: "Produce",
        price: 1.99,
        image: "from-green-600 to-green-800",
        imageUrl: "https://images.unsplash.com/photo-1523049673856-64917be3cb63?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Avocado"],
        expiryDays: 5
    },
    {
        id: "P002",
        name: "Organic Bananas",
        brand: "Dole",
        category: "Produce",
        price: 0.69,
        image: "from-yellow-400 to-yellow-600",
        imageUrl: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Banana"],
        expiryDays: 4
    },
    {
        id: "P003",
        name: "Red Bell Peppers",
        brand: "Local Farm",
        category: "Produce",
        price: 1.29,
        image: "from-red-500 to-red-700",
        imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdf5dbc240?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Bell Pepper"],
        expiryDays: 7
    },
    {
        id: "P004",
        name: "Baby Spinach",
        brand: "Earthbound Farm",
        category: "Produce",
        price: 3.99,
        image: "from-green-500 to-emerald-700",
        imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Organic Spinach"],
        expiryDays: 5
    },

    // Bakery
    {
        id: "B001",
        name: "Sourdough Bread",
        brand: "Artisan Bakery",
        category: "Bakery",
        price: 5.49,
        image: "from-amber-700 to-orange-900",
        imageUrl: "https://images.unsplash.com/photo-1585478259539-e62233f1c357?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Wheat Flour", "Water", "Salt", "Yeast"],
        expiryDays: 4
    },
    {
        id: "B002",
        name: "Bagels (Plain)",
        brand: "Thomas'",
        category: "Bakery",
        price: 4.29,
        image: "from-orange-200 to-orange-400",
        imageUrl: "https://images.unsplash.com/photo-1585478259539-e62233f1c357?auto=format&fit=crop&w=500&q=80", // Placeholder, reuse bread or find bagel
        ingredients: ["Enriched Wheat Flour", "Sugar", "Yeast"],
        expiryDays: 7
    },
    {
        id: "B003",
        name: "Croissants",
        brand: "Costco Bakery",
        category: "Bakery",
        price: 6.99,
        image: "from-yellow-500 to-orange-600",
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Butter", "Flour", "Sugar", "Yeast"],
        expiryDays: 3
    },

    // Snacks
    {
        id: "S001",
        name: "Sea Salt Potato Chips",
        brand: "Kettle Brand",
        category: "Snacks",
        price: 3.49,
        image: "from-blue-500 to-indigo-700",
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Potatoes", "Vegetable Oil", "Sea Salt"],
        expiryDays: 90
    },
    {
        id: "S002",
        name: "Dark Chocolate Bar",
        brand: "Lindt",
        category: "Snacks",
        price: 2.99,
        image: "from-slate-700 to-black",
        imageUrl: "https://images.unsplash.com/photo-1511381978029-18b57354346d?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Cocoa Mass", "Sugar", "Cocoa Butter", "Vanilla"],
        expiryDays: 365
    },
    {
        id: "S003",
        name: "Mixed Nuts",
        brand: "Planters",
        category: "Snacks",
        price: 9.99,
        image: "from-amber-800 to-brown-900",
        imageUrl: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Peanuts", "Almonds", "Cashews", "Sea Salt"],
        expiryDays: 180
    },

    // Beverages
    {
        id: "V001",
        name: "Orange Juice",
        brand: "Tropicana",
        category: "Beverages",
        price: 4.99,
        image: "from-orange-400 to-orange-600",
        imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80",
        ingredients: ["100% Orange Juice"],
        expiryDays: 10
    },
    {
        id: "V002",
        name: "Almond Milk",
        brand: "Almond Breeze",
        category: "Beverages",
        price: 3.49,
        image: "from-blue-200 to-blue-400",
        imageUrl: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Almondmilk", "Calcium Carbonate", "Vitamin E"],
        expiryDays: 21
    },
    {
        id: "V003",
        name: "Sparkling Water",
        brand: "LaCroix",
        category: "Beverages",
        price: 4.99,
        image: "from-cyan-300 to-blue-500",
        imageUrl: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Carbonated Water", "Natural Flavor"],
        expiryDays: 365
    },
    {
        id: "V004",
        name: "Cold Brew Coffee",
        brand: "Stok",
        category: "Beverages",
        price: 5.49,
        image: "from-stone-800 to-stone-950",
        imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&w=500&q=80",
        ingredients: ["Coffee", "Water"],
        expiryDays: 14
    }
];
