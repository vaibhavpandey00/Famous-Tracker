import Fuse from "fuse.js";
import prisma from "../db.server";
import { invalidateCache } from "./cache.server";

const celebritySelection = {
    fullName: true,
    categories: true,
    socials: true,
    maxFollowerDisplay: true,
    notableAchievements: true,
    notes: true,
};

/**
 * Finds a celebrity match, trying an exact match first, then a fuzzy search.
 * @param {string} customerName
 * @param {string} normalizedName
 * @returns {object | null}
 */
export const findCelebMatch = async (customerName, normalizedName) => {
    // --- STEP 1: The Exact Match ---
    console.log('Attempting fast path with exact match...');
    const exactMatch = await prisma.globalCelebrity.findFirst({
        where: { normalizedName: normalizedName },
        select: celebritySelection,
    });

    if (exactMatch) {
        console.log('Found a perfect match on the fast path!', exactMatch);
        return { ...exactMatch, score: 0.0 }; // Score 0 means a perfect match
    }

    // --- STEP 2: The "Fuzzy Path" (Fuse.js Fallback) ---
    console.log('No exact match found. Proceeding to fuzzy search...');

    // A) Pre-filter the database to get a smaller, relevant list.
    // This avoids loading millions of records into memory.
    const nameParts = customerName.split(' ');
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
        select: celebritySelection
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
        // The result from Fuse includes the original item and the score
        return { ...bestResult.item, score: bestResult.score };
    }

    console.log('No close fuzzy match found.');
    return null;
}

export const newCelebMatchRecord = async (data, shopName) => {

    const cacheKey = `shop_dashboard_${shopName}`;
    try {
        const newMatch = await prisma.MatchedCelebrity.create({
            data: data
        })

        invalidateCache(cacheKey);
        return newMatch;
    } catch (error) {
        console.log("Error creating new celeb match record:", error);
        return null;
    }
}