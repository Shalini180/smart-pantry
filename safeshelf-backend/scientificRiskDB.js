/**
 * The Source of Truth for Scientific Risk Assessment
 * Maps ingredients to their scientific verdict, risk level, and citation.
 */
const EVIDENCE_DB = {
    "palm": {
        risk: "High",
        system: "Cardiovascular",
        claim: "High palmitic acid raises LDL cholesterol and inflammation markers.",
        source: "Sun et al., 2015 (American Heart Association Journal)"
    },
    "hydrogenated": {
        risk: "Critical",
        system: "Cardiovascular",
        claim: "Primary source of Trans Fats. No safe limit exists.",
        source: "WHO REPLACE Action Package (2018)"
    },
    "bromate": {
        risk: "Critical",
        system: "Carcinogenic",
        claim: "Classified as Group 2B Carcinogen (Possibly carcinogenic to humans).",
        source: "IARC Monographs Vol 73 / FSSAI Ban"
    },
    "benzoate": {
        risk: "Moderate",
        system: "Cellular Health",
        claim: "Can form Benzene (Class 1 Carcinogen) in presence of Vitamin C.",
        source: "FDA Data on Benzene in Soft Drinks"
    },
    "carrageenan": {
        risk: "Moderate",
        system: "Gut Health",
        claim: "Linked to intestinal inflammation and glucose intolerance.",
        source: "Environmental Health Perspectives (2017)"
    },
    "high fructose": {
        risk: "High",
        system: "Metabolic",
        claim: "Direct liver metabolism leads to Non-Alcoholic Fatty Liver Disease (NAFLD).",
        source: "Journal of Hepatology"
    },
    "propyl paraben": {
        risk: "High",
        system: "Endocrine",
        claim: "Potential endocrine disruptor affecting reproductive health.",
        source: "EU Scientific Committee on Consumer Safety"
    },
    "bha": {
        risk: "High",
        system: "Carcinogenic",
        claim: "Reasonably anticipated to be a human carcinogen.",
        source: "National Toxicology Program (NTP)"
    },
    "bht": {
        risk: "Moderate",
        system: "Carcinogenic",
        claim: "Linked to tumor promotion in animal studies.",
        source: "IARC Monographs Vol 17"
    },
    "titanium dioxide": {
        risk: "High",
        system: "Genotoxic",
        claim: "No longer considered safe as food additive due to genotoxicity concerns.",
        source: "EFSA Assessment 2021"
    },
    "aspartame": {
        risk: "Moderate",
        system: "Carcinogenic",
        claim: "Classified as possibly carcinogenic to humans (Group 2B).",
        source: "IARC / WHO JECFA (2023)"
    },
    "nitrite": {
        risk: "High",
        system: "Carcinogenic",
        claim: "Can form carcinogenic nitrosamines in the body.",
        source: "IARC Monographs Vol 94"
    }
};

/**
 * Citation Linker Utility
 * Performs a partial match search against the EVIDENCE_DB
 * @param {string} ingredientTag - The raw ingredient tag (e.g., "en:refined-palm-oil")
 * @returns {Object|null} The Evidence Object or null if no match found
 */
function getScientificCitation(ingredientTag) {
    if (!ingredientTag) return null;

    // 1. Clean the tag: remove "en:", replace hyphens with spaces, lowercase
    const cleanTag = ingredientTag.replace(/^en:/, '').replace(/-/g, ' ').toLowerCase();

    // 2. Partial Match Search
    // We check if any key in EVIDENCE_DB is contained within the cleanTag
    const matchedKey = Object.keys(EVIDENCE_DB).find(key => cleanTag.includes(key));

    if (matchedKey) {
        return {
            keyword: matchedKey,
            ...EVIDENCE_DB[matchedKey]
        };
    }

    return null;
}

module.exports = { EVIDENCE_DB, getScientificCitation };
