import Fuse from "fuse.js";
import prisma from "../db.server";
import { getCache, setCache, invalidateCache } from "../utils/cache.server";

export const invalidateAdminCache = () => {
    const cacheKey = `admin_dashboard_data_${process.env.ADMIN_AUTH_CODE}`;
    invalidateCache(cacheKey);
}

export const getAdminDashboardData = async () => {

    const $_authCode = process.env.ADMIN_AUTH_CODE;
    const cacheKey = `admin_dashboard_data_${$_authCode}`;

    const cachedDashboardData = getCache(cacheKey);
    if (cachedDashboardData && cachedDashboardData !== null) {
        return cachedDashboardData;
    }

    const [ activeShops, inActiveShops, totalShops, shopsCreatedThisMonth, celebCount ] = await Promise.all([
        getActiveShops(),
        getInActiveShops(),
        getTotalShops(),
        countShopsCreatedThisMonth(),
        celebrityCount()
    ]);

    const result = {
        activeShops,
        inActiveShops,
        totalShops,
        shopsCreatedThisMonth,
        celebCount
    };

    setCache(cacheKey, result, 1800);

    return result;
};

export const adminAddCelebrity = async (celeb) => {
    try {
        const newCeleb = await prisma.GlobalCelebrity.create({ data: celeb });
        return newCeleb;
    } catch (error) {
        console.log("Error creating new celeb:", error);
        return null;
    }
};

export const findCelebMatch = async (fullName, normalizedName) => {
    // --- STEP 1: The Exact Match ---
    console.log('Attempting fast path with exact match...');
    const exactMatch = await prisma.globalCelebrity.findFirst({
        where: { normalizedName: normalizedName },
    });

    if (exactMatch) {
        console.log("Found a perfect match on the fast path!");
        // Stringify the BigInt into a string
        const dataToSend = stringifyBigInts(exactMatch);
        return { ...dataToSend, score: 0.0 }; // Score 0 means a perfect match
    }

    // --- STEP 2: The "Fuzzy Path" (Fuse.js Fallback) ---
    console.log('No exact match found. Proceeding to fuzzy search...');

    // A) Pre-filter the database to get a smaller, relevant list.
    const nameParts = fullName.split(' ');
    const potentialMatches = await prisma.globalCelebrity.findMany({
        where: {
            OR: nameParts.map((part) => ({
                fullName: {
                    contains: part,
                    mode: 'insensitive',
                },
            })),
        },
        take: 100,
    });

    if (potentialMatches.length === 0) {
        console.log('No potential matches found after pre-filtering.');
        return null;
    }

    // B) Configure and run Fuse.js on the smaller list.
    const fuseOptions = {
        includeScore: true,
        threshold: 0.5,
        keys: [ 'normalizedName', 'fullName' ],
    };

    const fuse = new Fuse(potentialMatches, fuseOptions);
    const results = fuse.search(normalizedName);

    if (results.length > 0) {
        const bestResult = results[ 0 ];
        console.log(`Fuzzy match found: ${bestResult.item.fullName} with score: ${bestResult.score}`);
        // Stringify the BigInt into a string
        const dataToSend = stringifyBigInts(bestResult.item);
        // The result from Fuse includes the original item and the score
        return { ...dataToSend, score: bestResult.score };
    }

    console.log('No close fuzzy match found.');
    return null;
}

/**
 * A helper function to recursively find and convert all BigInt values in an object to strings.
 * @param {any} obj The object or value to process.
 * @returns {any} The processed object with BigInts converted to strings.
 */
const stringifyBigInts = (obj) => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(stringifyBigInts);
    }

    if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[ key ] = stringifyBigInts(obj[ key ]);
            }
        }
        return newObj;
    }

    if (typeof obj === 'bigint') {
        return obj.toString();
    }

    return obj;
}
const getActiveShops = async () => {
    const activeShops = await prisma.Shops.findMany({
        where: {
            subscriptionStatus: {
                is: {
                    active: true,
                },
            },
        },
    });

    return activeShops;
};

const getInActiveShops = async () => {
    const inActiveShops = await prisma.Shops.findMany({
        where: {
            subscriptionStatus: {
                is: {
                    active: false,
                },
            },
        },
    });

    return inActiveShops;
};

const getTotalShops = async () => {
    const totalShops = await prisma.Shops.count();
    return totalShops;
};

const countShopsCreatedThisMonth = async () => {
    // The date logic is identical
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const shopCount = await prisma.Shops.count({
        where: {
            createdAt: {
                gte: startOfMonth,
                lt: startOfNextMonth,
            },
        },
    });

    return shopCount;
};

const celebrityCount = async () => {
    const celebrCount = await prisma.GlobalCelebrity.count();
    return celebrCount || 0;
};