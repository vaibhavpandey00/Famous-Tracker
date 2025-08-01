// The Map object holds key-value pairs and remembers the original insertion order.
const cache = new Map();

// Default Time-To-Live (TTL) for cache entries, in seconds.
const DEFAULT_TTL_SECONDS = 60;

/**
 * Retrieves an item from the cache if it exists and is not expired.
 * @param {string} key The unique key for the cache entry.
 * @returns {any | null} The cached data, or null if not found or expired.
 */
export function getCache(key) {
    if (typeof key !== 'string') {
        console.error("Cache key must be a string.");
        return null;
    }

    const entry = cache.get(key);

    // If there's no entry, it's a cache miss.
    if (!entry) {
        console.log(`❌ CACHE MISS for key: ${key}`);
        return null;
    }

    // Check if the item has expired.
    const isExpired = Date.now() > entry.expiresAt;

    if (isExpired) {
        console.log(`⚠️ CACHE EXPIRED for key: ${key}`);
        // Clean up the expired item from the cache.
        cache.delete(key);
        return null;
    }

    console.log(`✅ CACHE HIT for key: ${key}`);
    return entry.value;
}

/**
 * Adds or updates an item in the cache with a specific TTL.
 * @param {string} key The unique key for the cache entry.
 * @param {any} value The data to be cached.
 * @param {number} [ttlInSeconds=DEFAULT_TTL_SECONDS] The Time-To-Live for this specific entry, in seconds.
 */
export function setCache(key, value, ttlInSeconds = DEFAULT_TTL_SECONDS) {
    if (typeof key !== 'string') {
        console.error("Cache key must be a string.");
        return;
    }

    const expiresAt = Date.now() + ttlInSeconds * 1000;
    cache.set(key, {
        value,
        expiresAt,
    });
    console.log(`➕ CACHE SET for key: ${key} with TTL: ${ttlInSeconds}s`);
}

/**
 * Deletes an item from the cache. Useful for invalidating data after an update.
 * @param {string} key The unique key for the cache entry to delete.
 */
export function invalidateCache(key) {
    if (typeof key !== 'string') {
        console.error("Cache key must be a string.");
        return;
    }
    const deleted = cache.delete(key);
    if (deleted) {
        console.log(`🔶 CACHE INVALIDATED for key: ${key}`);
    }
}