const axios = require('axios');

/**
 * Fetches raw product data from OpenFoodFacts API
 * @param {string} barcode 
 * @returns {Promise<Object|null>} Filtered product data or null if not found
 */
async function fetchRawProductData(barcode) {
    try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);

        if (response.data.status === 1) {
            const product = response.data.product;

            // Extract ONLY the relevant fields
            return {
                product_name: product.product_name,
                image_url: product.image_url,
                ingredients_text: product.ingredients_text,
                ingredients_tags: product.ingredients_tags,
                nutriments: {
                    sugars_100g: product.nutriments['sugars_100g'],
                    salt_100g: product.nutriments['salt_100g'],
                    sodium_100g: product.nutriments['sodium_100g'],
                    'saturated-fat_100g': product.nutriments['saturated-fat_100g']
                },
                nova_group: product.nova_group
            };
        } else {
            return null; // Product not found
        }
    } catch (error) {
        console.error(`Error fetching data for barcode ${barcode}:`, error.message);
        throw error;
    }
}

module.exports = { fetchRawProductData };
