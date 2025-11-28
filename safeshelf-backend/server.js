const express = require('express');
const cors = require('cors');
const { fetchRawProductData } = require('./truthEngine');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/analyze/:barcode', async (req, res) => {
    const { barcode } = req.params;

    if (!barcode) {
        return res.status(400).json({ error: 'Barcode is required' });
    }

    try {
        const productData = await fetchRawProductData(barcode);

        if (productData) {
            res.json(productData);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
