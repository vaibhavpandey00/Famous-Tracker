// 1. Define the base data for test celeb
const testCelebBaseData = {
    fullName: "Test User 123",
    email: "test.user.123@example.com",
    phone: "+1987654321",
    address: {
        street: "789 Test Ave",
        city: "Testington",
        state: "TX",
        zipCode: "77777",
        country: "USA",
    },
    categories: [ "Tester", "Developer" ],
    socials: [
        { platform: "GitHub", link: "https://github.com/testuser123", followers: 1000 },
        { platform: "LinkedIn", link: "https://linkedin.com/in/testuser123", followers: 500 },
        { platform: "YouTube", link: "https://youtube.com/johndoe_vlogs", followers: 1234567 },
        { platform: "X (Twitter)", link: "https://x.com/testuser123", followers: 98765 },
        { platform: "Instagram", link: "https://instagram.com/johndoe", followers: null }
    ],
    notes: "This is a test user created for demonstration purposes.",
};

// 2. Function to calculate the maximum follower count
function calculateMaxFollower(socials) {
    if (!socials || socials.length === 0) {
        return null;
    }

    const followerCounts = socials
        .map(s => s.followers)
        .filter(f => typeof f === 'number' && f !== null);

    if (followerCounts.length === 0) {
        return null;
    }

    return Math.max(...followerCounts);
}

// 3. Function to format follower count into K/M/B string
function formatFollowerCount(num) {
    if (num === null) {
        return null;
    }
    if (num >= 1000000000) { // Billions
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) { // Millions
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) { // Thousands
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return String(num); // Return as string for numbers less than 1000
}

// 4. Function to add a new Celeb with default data
export const addCeleb = async (prisma, celebData = testCelebBaseData) => {
    try {
        const dataToCreate = { ...celebData };

        const rawMaxFollower = calculateMaxFollower(dataToCreate.socials);

        // Apply formatting here
        dataToCreate.maxFollower = formatFollowerCount(rawMaxFollower);

        const newCeleb = await prisma.Celebs.create({
            data: dataToCreate,
        });
        console.log("Celeb added successfully:", newCeleb);
        return newCeleb;
    } catch (error) {
        console.error("Error adding celeb:", error);
        throw error;
    }
};