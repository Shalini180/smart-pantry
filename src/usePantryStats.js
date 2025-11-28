import { useMemo } from 'react';

// Helper to calculate days until expiry
const getDaysUntilExpiry = (addedDate, shelfLifeDays) => {
    const added = new Date(addedDate);
    const now = new Date();
    const expiryDate = new Date(added);
    expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);

    const diffTime = expiryDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const usePantryStats = (pantryItems = []) => {
    const stats = useMemo(() => {
        if (!pantryItems.length) {
            return {
                totalCount: 0,
                expiringCount: 0,
                expiredCount: 0,
                freshnessScore: 100
            };
        }

        let expiring = 0;
        let expired = 0;

        pantryItems.forEach(item => {
            const daysLeft = getDaysUntilExpiry(item.addedAt, item.expiryDays);

            if (daysLeft <= 0) {
                expired++;
            } else if (daysLeft <= 3) {
                expiring++;
            }
        });

        const total = pantryItems.length;
        // Freshness score: Percentage of non-expired items
        // If 0 items, 100% fresh. If all expired, 0% fresh.
        const freshnessScore = total > 0
            ? Math.round(((total - expired) / total) * 100)
            : 100;

        return {
            totalCount: total,
            expiringCount: expiring,
            expiredCount: expired,
            freshnessScore
        };
    }, [pantryItems]);

    return stats;
};
