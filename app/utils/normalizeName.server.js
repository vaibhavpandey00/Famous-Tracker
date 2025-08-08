/**
 * @param {string} name The name to normalize.
 * @returns {string} The normalized name.
 */
export const normalizeName = (name) => {
    if (!name) return "";

    return name
        .toLowerCase()
        // Remove common titles like Mr, Mrs, Ms, Dr. with or without a period
        .replace(/^(mr|mrs|ms|dr)\.?\s*/, '')
        // Remove all characters that are not letters, numbers, or spaces
        .replace(/[^a-z0-9\s]/g, '')
        // Replace multiple spaces with a single space
        .replace(/\s+/g, ' ')
        .trim();
}