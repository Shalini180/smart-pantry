import { useState, useMemo } from 'react';

// Helper to calculate expiry status for filtering
const getExpiryStatusKey = (addedDate, shelfLifeDays) => {
    const added = new Date(addedDate);
    const now = new Date();
    const expiryDate = new Date(added);
    expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);

    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'expired';
    if (diffDays <= 3) return 'expiring_soon';
    return 'fresh';
};

const getExpiryDate = (item) => {
    const added = new Date(item.addedAt);
    const expiry = new Date(added);
    expiry.setDate(expiry.getDate() + item.expiryDays);
    return expiry;
};

export const usePantryControls = (items = []) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('expiry_asc'); // 'expiry_asc', 'expiry_desc', 'name_asc', 'date_added'
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'expired', 'expiring_soon', 'fresh'

    const processedItems = useMemo(() => {
        let result = [...items];

        // 1. Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.brand.toLowerCase().includes(query)
            );
        }

        // 2. Filter by Status
        if (filterStatus !== 'all') {
            result = result.filter(item => {
                const status = getExpiryStatusKey(item.addedAt, item.expiryDays);
                if (filterStatus === 'expiring') return status === 'expiring_soon'; // Handle 'expiring' alias if needed, but UI uses 'expiring_soon' usually
                return status === filterStatus;
            });
        }

        // 3. Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'expiry_asc':
                    return getExpiryDate(a) - getExpiryDate(b);
                case 'expiry_desc':
                    return getExpiryDate(b) - getExpiryDate(a);
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'date_added':
                    return new Date(b.addedAt) - new Date(a.addedAt); // Newest first
                default:
                    return 0;
            }
        });

        return result;
    }, [items, searchQuery, sortBy, filterStatus]);

    return {
        processedItems,
        filters: {
            searchQuery,
            sortBy,
            filterStatus
        },
        setFilters: {
            setSearchQuery,
            setSortBy,
            setFilterStatus
        }
    };
};
