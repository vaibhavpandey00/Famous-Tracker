/**
 * Processes raw match data to generate dashboard stats and recent match list.
 * @param {Array<object>} matches - An array of MatchedCelebrity records from Prisma.
 * @returns {{stats: Array<object>, recentMatches: Array<object>}}
 */

export function calculateDashboardData(matches) {
    // --- 1. Handle Edge Case: No Matches Found ---
    if (!matches || matches.length === 0) {
        return {
            stats: [
                { title: "Total Matches", value: "0", change: "+0%", changeType: "positive", period: "This month", iconId: "totalMatches" },
                { title: "Revenue from Influencers", value: "$0.00", change: "+0%", changeType: "positive", period: "This month", iconId: "revenue" },
                { title: "Avg. Order Value", value: "$0.00", change: "+0%", changeType: "positive", period: "Celebrity orders", iconId: "avgOrderValue" },
            ],
            recentMatches: [], // Return an empty array if there are no matches
        };
    }

    // --- 2. Calculate Quick Tile Stats ---
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthMatches = matches.filter(m => new Date(m.createdAt) >= startOfThisMonth);
    const lastMonthMatches = matches.filter(m => new Date(m.createdAt) >= startOfLastMonth && new Date(m.createdAt) < startOfThisMonth);

    // This month's data
    const totalMatchesThisMonth = thisMonthMatches.length;
    const revenueThisMonth = thisMonthMatches.reduce((sum, match) => sum + match.orderValue, 0);

    // Last month's data for comparison
    const totalMatchesLastMonth = lastMonthMatches.length;
    const revenueLastMonth = lastMonthMatches.reduce((sum, match) => sum + match.orderValue, 0);

    // All-time data for Avg. Order Value
    const totalRevenueAllTime = matches.reduce((sum, match) => sum + match.orderValue, 0);
    const avgOrderValueAllTime = totalRevenueAllTime / matches.length;

    // Calculate percentage changes
    const matchesChange = calculateChange(totalMatchesThisMonth, totalMatchesLastMonth);
    const revenueChange = calculateChange(revenueThisMonth, revenueLastMonth);
    const avgOrderChange = calculateChange(
        (revenueThisMonth / (totalMatchesThisMonth || 1)),
        (revenueLastMonth / (totalMatchesLastMonth || 1))
    );

    const stats = [
        {
            title: "Total Matches",
            value: totalMatchesThisMonth.toString(),
            change: `${matchesChange >= 0 ? "+" : ""}${matchesChange.toFixed(0)}%`,
            changeType: matchesChange >= 0 ? "positive" : "negative",
            period: "This month",
            iconId: "totalMatches"
        },
        {
            title: "Revenue from Influencers",
            value: formatCurrency(revenueThisMonth),
            change: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(0)}%`,
            changeType: revenueChange >= 0 ? "positive" : "negative",
            period: "This month",
            iconId: "revenue"
        },
        {
            title: "Avg. Order Value",
            value: formatCurrency(avgOrderValueAllTime),
            change: `${avgOrderChange >= 0 ? "+" : ""}${avgOrderChange.toFixed(0)}%`,
            changeType: avgOrderChange >= 0 ? "positive" : "negative",
            period: "Celebrity orders",
            iconId: "avgOrderValue"
        },
    ];

    // --- 3. Format Recent Matches List ---
    // Matches are already sorted by `createdAt` descending from Prisma query
    const recentMatches = matches.slice(0, 5).map(match => {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return {
            id: match.id,
            customerName: match.matchedCelebName,
            orderValue: match.orderValue,
            platform: match.socials?.[ 0 ]?.platform || "N/A",
            followers: match.maxFollowerDisplay || "0",
            category: match.celebCategories?.[ 0 ] || "General",
            matchTime: formatRelativeTime(new Date(match.createdAt)),
            status: new Date(match.createdAt) > twentyFourHoursAgo ? "new" : "processed",
            orderItems: match.products,
        };
    });

    // console.log("Dashboard Data:");
    // console.log("Stats:", stats);
    // console.log("Recent Matches:", recentMatches);

    return { stats, recentMatches };
}

/**
 * Calculates the percentage change between two values.
 * @param {number} current - The current value.
 * @param {number} previous - The previous value.
 * @returns {number} The percentage change.
 */
function calculateChange(current, previous) {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
}

/**
 * Formats a number into a currency string (e.g., $1,234.56).
 * @param {number} value - The number to format.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

/**
 * Converts a date into a relative time string (e.g., "2 minutes ago").
 * @param {Date} date - The date to format.
 * @returns {string} The relative time string.
 */
function formatRelativeTime(date) {
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}