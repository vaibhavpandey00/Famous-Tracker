import prisma from "../db.server";

// Retry utility for handling network issues
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error.message);
            lastError = error;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
};

const getShopID = async (admin) => {
    const query = `
        query getShopInfo {
            shop {
                id
            }
        }
    `;

    try {
        const response = await retryOperation(async () => {
            const result = await admin.graphql(query);
            return result.json();
        });

        if (!response?.data?.shop?.id) {
            throw new Error('Invalid shop data received from Shopify');
        }
        return response.data.shop.id;
    } catch (error) {
        console.error('Failed to fetch shop info:', error);
        throw new Error(`Shop info fetch failed: ${error.message}`);
    }
};

export const getShopData = async (admin) => {
    const graphqlShopID = await getShopID(admin);
    // console.log("GraphQL Shop Data:", graphqlShopID); // Returns the shop ID retrieved using GraphQL API

    const dbShopRecord = await prisma.Shops.findUnique({ where: { shopId: graphqlShopID } });
    // console.log("DB Shop:", dbShopRecord); // Returns the shop record from the database if it exists

    let shopData;

    if (graphqlShopID !== dbShopRecord?.shopId) {
        shopData = await createShopRecord(graphqlShopID);
        console.log("New Shop:", shopData);
    }
    else {
        console.log("Shop already exists in DB");
        shopData = dbShopRecord;
    }

    return shopData;
}

const createShopRecord = async (graphqlShopID) => {
    const shopData = {
        shopId: graphqlShopID,
        subscriptionStatus: {
            active: true,
            subId: "123456789",
        },
        name: "",
        email: "",
        categories: {
            celebrity: true,
            influencer: true,
            athlete: true,
            musician: true,
        },
        alertFrequency: "immediate",
        quietHours: {
            enabled: false,
            start: "22:00",
            end: "08:00"
        },
    }

    const newShop = await prisma.Shops.create({ data: shopData });

    return newShop;
}

export const updateShopRecord = async (admin, data) => {
    // get the shop ID from the admin object
    const graphqlShopID = await getShopID(admin);
    // console.log("GraphQL Shop Data:", graphqlShopID);

    // update the shop record in the database
    const updatedShop = await prisma.Shops.update({
        where: { shopId: graphqlShopID },
        data: data,
    });

    return updatedShop;
}