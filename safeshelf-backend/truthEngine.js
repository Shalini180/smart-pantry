const axios = require('axios');
const { getScientificCitation } = require('./scientificRiskDB');

// --- 1. The Evidence Dictionary (RISK_RULES) ---
// Kept for Heart/Metabolic thresholds, but Toxicity now uses scientificRiskDB
const RISK_RULES = {
    sugar: {
        threshold_high: 22.5,
        threshold_med: 10,
        citation: "WHO Guideline: Sugar intake for adults and children (2015)."
    },
    salt: {
        threshold_high: 1.5,
        citation: "WHO Salt Reduction Targets."
    },
    saturated_fat: {
        threshold_high: 5,
        citation: "American Heart Association (AHA) Saturated Fat Guidelines."
    },
    trans_fat: {
        // Regex to find hidden trans fats
        regex: /(hydrogenated|partially hydrogenated|vanaspati|margerine|shortening)/i,
        citation: "WHO REPLACE Trans Fat Action Package (Zero Tolerance)."
    },
    carb_quality: {
        ratio_threshold: 10,
        citation: "Harvard T.H. Chan School of Public Health: Carbohydrate Quality."
    }
};

// --- 2. Logic Function A: Heart Health ---
function analyzeHeartHealth(nutriments, ingredientsText = '') {
    const result = { riskLevel: "Low", flags: [], score_penalty: 0, citations: [] };

    // Step 1: Sat Fat
    const satFat = nutriments['saturated-fat_100g'] || 0;
    if (satFat > RISK_RULES.saturated_fat.threshold_high) {
        result.riskLevel = "Risk";
        result.flags.push(`High Saturated Fat (${satFat}g)`);
        result.score_penalty += 20;
        result.citations.push(RISK_RULES.saturated_fat.citation);
    }

    // Step 2: Salt
    // Convert Sodium to Salt if Salt is missing (Na * 2.5)
    let salt = nutriments['salt_100g'];
    if (salt === undefined || salt === null) {
        const sodium = nutriments['sodium_100g'] || 0;
        salt = sodium * 2.5;
    }

    if (salt > RISK_RULES.salt.threshold_high) {
        result.riskLevel = result.riskLevel === "Low" ? "Risk" : "High Risk";
        result.flags.push(`High Sodium (${salt.toFixed(2)}g)`);
        result.score_penalty += 20;
        result.citations.push(RISK_RULES.salt.citation);
    }

    // Step 3: Trans Fat (The Hidden Killer)
    const transFatNumeric = nutriments['trans-fat_100g'] || 0;
    const hasHiddenTransFat = RISK_RULES.trans_fat.regex.test(ingredientsText);

    if (transFatNumeric > 0 || hasHiddenTransFat) {
        result.riskLevel = "Critical";
        const reason = hasHiddenTransFat ? "Hidden Trans Fats detected (Hydrogenated Oil)" : `Trans Fats detected (${transFatNumeric}g)`;
        result.flags.push(reason);
        result.score_penalty += 40; // Max penalty
        result.citations.push(RISK_RULES.trans_fat.citation);
    }

    return result;
}

// --- 3. Logic Function B: Metabolic Health ---
function analyzeMetabolicHealth(nutriments, ingredientsText = '') {
    const result = { riskLevel: "Low", flags: [], score_penalty: 0, citations: [] };
    const lowerText = ingredientsText.toLowerCase();

    // Step 1: Sugar Shock
    const sugar = nutriments['sugars_100g'] || 0;
    const teaspoons = (sugar / 4).toFixed(1);

    if (sugar > RISK_RULES.sugar.threshold_high) {
        result.riskLevel = "Critical";
        result.flags.push(`Extreme Sugar Load (${teaspoons} tsp)`);
        result.score_penalty += 40;
        result.citations.push(RISK_RULES.sugar.citation);
    } else if (sugar > RISK_RULES.sugar.threshold_med) {
        result.riskLevel = result.riskLevel === "Low" ? "Risk" : "High Risk";
        result.flags.push(`High Sugar (${teaspoons} tsp)`);
        result.score_penalty += 20;
        result.citations.push(RISK_RULES.sugar.citation);
    }

    // Step 2: Carb Integrity
    const carbs = nutriments['carbohydrates_100g'] || 0;
    const fiber = nutriments['fiber_100g']; // Can be undefined

    let ratioHigh = false;

    if (fiber !== undefined && fiber > 0) {
        const ratio = carbs / fiber;
        if (ratio > RISK_RULES.carb_quality.ratio_threshold) {
            ratioHigh = true;
            result.flags.push(`Refined Carb Overload (Ratio ${ratio.toFixed(1)}:1)`);
        }
    } else {
        // Edge Case: Fiber missing, check ingredients
        // Simple heuristic: if "maida" or "refined" appears before "whole wheat"
        const maidaIndex = lowerText.search(/(maida|refined wheat flour|white flour)/);
        const wholeWheatIndex = lowerText.search(/(whole wheat|whole grain)/);

        if (maidaIndex !== -1) {
            if (wholeWheatIndex === -1 || maidaIndex < wholeWheatIndex) {
                ratioHigh = true;
                result.flags.push("Main Ingredient: Refined Flour (Empty Calories)");
            }
        }
    }

    if (ratioHigh) {
        result.riskLevel = result.riskLevel === "Critical" ? "Critical" : "High Risk";
        result.score_penalty += 20;
        result.citations.push(RISK_RULES.carb_quality.citation);
    }

    return result;
}

// --- 4. Logic Function C: Toxicity Scanner (Enhanced with Scientific Risk DB) ---
function analyzeToxicity(tags) {
    if (!tags || !Array.isArray(tags)) return { warnings: [], score_penalty: 0, citations: [] };

    const warnings = [];
    const citations = [];
    let score_penalty = 0;

    tags.forEach(tag => {
        // Use the Citation Linker
        const evidence = getScientificCitation(tag);

        if (evidence) {
            // Format: "Palm Oil (High Risk: Cardiovascular) - High palmitic acid..."
            warnings.push({
                name: evidence.keyword.toUpperCase(),
                risk: evidence.risk,
                system: evidence.system,
                claim: evidence.claim,
                source: evidence.source
            });

            // Dynamic penalty based on risk level
            if (evidence.risk === "Critical") score_penalty += 40;
            else if (evidence.risk === "High") score_penalty += 20;
            else score_penalty += 10;

            citations.push(`${evidence.source}: ${evidence.claim}`);
        }
    });

    return { warnings, score_penalty, citations };
}

// --- 5. Main Aggregator ---
function calculateHealthImpact(product) {
    let totalScore = 100;
    const allCitations = new Set();

    const nutriments = product.nutriments || {};
    const ingredientsText = product.ingredients_text || '';
    const ingredientsTags = product.ingredients_tags || [];
    const novaGroup = product.nova_group;

    // Run Analyses
    const heart = analyzeHeartHealth(nutriments, ingredientsText);
    const metabolic = analyzeMetabolicHealth(nutriments, ingredientsText);
    const toxicity = analyzeToxicity(ingredientsTags);

    // Apply Penalties (Max 40 for Heart/Metabolic)
    totalScore -= Math.min(40, heart.score_penalty);
    totalScore -= Math.min(40, metabolic.score_penalty);
    totalScore -= toxicity.score_penalty;

    // Nova Penalty
    if (novaGroup === 4) {
        totalScore -= 20;
    }

    // Clamp Score
    totalScore = Math.max(0, Math.min(100, totalScore));

    // Determine Grade
    let grade = 'A';
    if (totalScore < 40) grade = 'D';
    else if (totalScore < 60) grade = 'C';
    else if (totalScore < 80) grade = 'B';

    // Collect Citations
    heart.citations.forEach(c => allCitations.add(c));
    metabolic.citations.forEach(c => allCitations.add(c));
    toxicity.citations.forEach(c => allCitations.add(c));

    return {
        score: totalScore,
        grade: grade,
        analysis: {
            heart: { status: heart.riskLevel, reasons: heart.flags },
            metabolic: { status: metabolic.riskLevel, reasons: metabolic.flags },
            toxicity: toxicity.warnings // Now returns objects
        },
        citations: Array.from(allCitations)
    };
}

/**
 * Fetches raw product data from OpenFoodFacts API
 * @param {string} barcode 
 * @returns {Promise<Object|null>} Filtered product data or null if not found
 */
async function fetchProductRaw(barcode) {
    try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);

        if (response.data.status === 1) {
            const product = response.data.product;

            // Calculate Health Impact
            const healthReport = calculateHealthImpact(product);

            return {
                product_name: product.product_name,
                brands: product.brands,
                image_url: product.image_url,
                ingredients_text: product.ingredients_text,
                nutriments: {
                    sugars_100g: product.nutriments['sugars_100g'],
                    salt_100g: product.nutriments['salt_100g'],
                    'saturated-fat_100g': product.nutriments['saturated-fat_100g'],
                    'trans-fat_100g': product.nutriments['trans-fat_100g'],
                    'carbohydrates_100g': product.nutriments['carbohydrates_100g'],
                    'fiber_100g': product.nutriments['fiber_100g'],
                    'energy-kcal_100g': product.nutriments['energy-kcal_100g']
                },
                nova_group: product.nova_group,
                health_report: healthReport // New structured report
            };

        } else {
            return null; // Product not found
        }
    } catch (error) {
        console.error(`Error fetching data for barcode ${barcode}:`, error.message);
        throw error;
    }
}

module.exports = { fetchProductRaw };
