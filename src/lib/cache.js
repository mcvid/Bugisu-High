/**
 * Simple session-based cache for Supabase queries
 * to reduce redundant network requests and improve performance.
 */

const CACHE_PREFIX = 'bhs_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export const cacheManager = {
    /**
     * Set a value in the cache
     * @param {string} key - Unique key for the query
     * @param {any} data - The data to store
     * @param {number} ttl - Time to live in milliseconds
     */
    set: (key, data, ttl = DEFAULT_TTL) => {
        try {
            const cacheItem = {
                data,
                expiry: Date.now() + ttl
            };
            sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
        } catch (e) {
            console.warn('Cache set failed:', e);
        }
    },

    /**
     * Get a value from the cache
     * @param {string} key - Unique key for the query
     * @returns {any|null} - The cached data or null if not found/expired
     */
    get: (key) => {
        try {
            const raw = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
            if (!raw) return null;

            const cacheItem = JSON.parse(raw);
            if (Date.now() > cacheItem.expiry) {
                sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
                return null;
            }

            return cacheItem.data;
        } catch (e) {
            console.warn('Cache get failed:', e);
            return null;
        }
    },

    /**
     * Clear a specific cache key
     */
    invalidate: (key) => {
        sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
    },

    /**
     * Clear all caches starting with prefix
     */
    clearAll: () => {
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                sessionStorage.removeItem(key);
            }
        });
    }
};
