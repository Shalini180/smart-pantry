import { useState } from 'react';
import axios from 'axios';

/**
 * The "Prep Station" Hook
 * Manages the state of food analysis:
 * - 'idle': Waiting for ingredients
 * - 'chopping': Analyzing (Loading)
 * - 'plated': Analysis Complete (Success)
 * - 'burnt': Error occurred
 */
export const useKitchenLab = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const analyzeProduct = async (barcode) => {
        if (!barcode) return;

        setStatus('chopping');
        setError(null);
        setData(null);

        try {
            // Simulate a bit of "cooking time" for the animation to play
            // Real science takes at least 1.5 seconds ;)
            const minCookTime = new Promise(resolve => setTimeout(resolve, 2000));

            const apiCall = axios.get(`http://localhost:3000/api/scan/${barcode}`);

            const [response] = await Promise.all([apiCall, minCookTime]);

            if (response.data) {
                setData(response.data);
                setStatus('plated');
            } else {
                throw new Error("Product data incomplete");
            }

        } catch (err) {
            console.error("Kitchen Disaster:", err);
            setError(err.response?.data?.error || "Recipe failed. Try another barcode.");
            setStatus('burnt');
        }
    };

    const resetLab = () => {
        setStatus('idle');
        setData(null);
        setError(null);
    };

    return {
        status,
        data,
        error,
        analyzeProduct,
        resetLab
    };
};
