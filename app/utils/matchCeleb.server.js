import { getCache, setCache } from "./cache.server";
import { normalizeName } from "./normalizeName.server"
import Fuse from "fuse.js";
import prisma from "../db.server";

export const findCelebMatch = async (customerName) => {
    const normalizedCustomerName = normalizeName(customerName);

    // 1. FAST PATH: Try for an exact normalized match in the DB
    let match = await prisma.GlobalCelebrity.findUnique({
        where: { normalizedName: normalizedCustomerName },
    });

    if (match) {
        console.log("Found direct match! ✅");
        return {
            fullName: match.fullName,
            celebCategory: match.categories,
            maxFollower: parseFollowerString(match.maxFollower),
            socials: match.socials,
            note: match.note
        };
    }

    // 2. FUZZY FALLBACK: If no direct match, use Fuse.js
    console.log("No direct match, trying fuzzy search... 🧠");

    let allCelebs;
    const cacheKey = "fuzzy_search_global_celebrities";

    // Use the cache to avoid hitting the DB repeatedly
    const cachedCelebs = getCache(cacheKey);
    if (cachedCelebs) {
        allCelebs = cachedCelebs;
    } else {
        // If not in cache, fetch from DB and then cache it
        allCelebs = await prisma.GlobalCelebrity.findMany({
            select: {
                fullName: true,
                normalizedName: true,
                categories: true,
                maxFollower: true,
                socials: true,
                note: true
            }
        });
        setCache(cacheKey, allCelebs, 3600); // Cache for 1 hour
    }

    const fuse = new Fuse(allCelebs, {
        keys: [ "normalizedName" ],
        threshold: 0.4,
    });

    const fuseResult = fuse.search(normalizedCustomerName)[ 0 ]?.item;

    if (fuseResult) {
        console.log("Found fuzzy match! ✅");
        return {
            fullName: fuseResult.fullName,
            celebCategory: fuseResult.categories,
            maxFollower: parseFollowerString(fuseResult.maxFollower),
            socials: fuseResult.socials,
            note: fuseResult.note
        };
    }

    // 3. NO MATCH: Return null
    console.log("No match found. ❌");
    return null;
}

/**
 * Converts a string with a suffix (K, M, B, T) into a number.
 *
 * @param {string} followerStr - The string to parse (e.g., '29M', '821K').
 * @returns {number|null} The full numeric value, or null if the format is invalid.
 */
function parseFollowerString(followerStr) {
    // Return null if the input is not a valid string
    if (!followerStr || typeof followerStr !== 'string') {
        return null;
    }

    const upperStr = followerStr.toUpperCase().trim();
    const lastChar = upperStr.slice(-1);
    const numPart = parseFloat(upperStr);

    if (isNaN(numPart)) {
        return null;
    }

    switch (lastChar) {
        case 'T':
            return numPart * 1_000_000_000_000;
        case 'B':
            return numPart * 1_000_000_000;
        case 'M':
            return numPart * 1_000_000;
        case 'K':
            return numPart * 1_000;
        default:
            // If no suffix, assume it's a plain number
            return numPart;
    }
}

/**
 * Checks if a celebrity's categories match the user's enabled alert settings.
 *
 * @param {object} userCategorySettings - The user's settings object (e.g., { celebrity: true, influencer: false }).
 * @param {string[]} celebCategoryTags - The celebrity's category array (e.g., ['Celebrity']).
 * @returns {boolean} - True if there is at least one match, otherwise false.
 */
export const doCategoriesMatch = (userCategorySettings, celebCategoryTags) => {
    if (!celebCategoryTags || celebCategoryTags.length === 0) {
        return false;
    }

    // The .some() method is perfect here. It checks if at least one element
    // in the array passes the test. It stops and returns true on the first match.
    return celebCategoryTags.some(tag => {
        // Normalize the tag to lowercase
        const key = tag.toLowerCase().trim();

        // Return true if that key exists in the settings AND its value is true.
        return userCategorySettings[ key ] === true;
    });
}