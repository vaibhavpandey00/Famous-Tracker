import prisma from "../db.server";
import { getCache, setCache, invalidateCache } from "./cache.server.js";
import { calculateDashboardData } from "./ShopStats.server.js";

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
              name
              email
           }
       }
   `;

  try {
    const response = await retryOperation(async () => {
      const result = await admin.graphql(query);
      return result.json();
    });

    if (!response?.data?.shop) {
      throw new Error('Invalid shop data received from Shopify');
    }
    return response.data.shop;
  } catch (error) {
    console.error('Failed to fetch shop info:', error);
    throw new Error(`Shop info fetch failed: ${error.message}`);
  }
};

/**
 * @param {object} admin - The authenticated admin context from Shopify.
 * @param {string} shopDomain - The shop's domain (e.g., 'your-shop.myshopify.com').
 * @returns {Promise<object>} - The shop record from the database.
 */

export const getShopData = async (admin, shopDomain) => {
  // Define a unique cache key for this specific piece of data.
  const cacheKey = `shop_data_${shopDomain}`;

  // 1. Check the cache first.
  const cachedShopData = getCache(cacheKey);
  if (cachedShopData && cachedShopData !== null) {
    return cachedShopData;
  }

  // 2. If it's a cache miss, proceed with fetching the data.
  const shopInfoResponse = await getShopID(admin);

  const { id: graphqlShopID, name: shopName, email: shopEmail } = shopInfoResponse;

  let shopRecord;

  shopRecord = await prisma.Shops.findUnique({
    where: { shopId: graphqlShopID },
  });

  if (!shopRecord) {
    // If the record doesn't exist, create a new one.
    shopRecord = await retryOperation(() => createShopRecord(shopInfoResponse));
  }

  // 3. Store the newly fetched data in the cache before returning.
  setCache(cacheKey, shopRecord, 1800); // Cache for 30 minutes (1800 seconds)

  return shopRecord;
};

const createShopRecord = async (shopInfoResponse) => {
  const { id: graphqlShopID, name: shopName, email: shopEmail } = shopInfoResponse;

  const shopRecord = await prisma.Shops.create({
    data: {
      shopId: graphqlShopID,
      shopName,
      email: shopEmail || null,
      name: null,
      subscriptionStatus: { active: false, subId: null },
      emailAlerts: true,
      slackAlerts: false,
      webhookAlerts: true,
      inAppAlerts: true
    },
  });

  return shopRecord;
};

/**
 * @param {string} shopId - The GraphQL shop ID.
 * @param {object} data - The data to update.
 * @returns {Promise<object>} - The updated shop record.
 */
export const updateShopRecord = async (admin, data) => {

  if (!data || !admin) {
    throw new Error("Invalid data received for admin and data.");
  };

  let id;
  if (!data.shopId) {
    const temp = await getShopID(admin);
    id = temp.id;
  }
  else {
    id = data.shopId
  }

  const updatedShop = await prisma.Shops.update({
    where: { shopId: id },
    data: data,
  });

  const cacheKey = `shop_data_${updatedShop.shopName}`;
  invalidateCache(cacheKey);

  return updatedShop;
};

export const getShopStats = async (admin) => {
  try {
    const shopInfoResponse = await getShopID(admin);
    const { id: graphqlShopID, name: shopName } = shopInfoResponse;

    const cacheKey = `shop_dashboard_${shopName}`;

    // Check the cache first
    const cachedShopData = getCache(cacheKey);
    if (cachedShopData && cachedShopData !== null) {
      return cachedShopData;
    }

    // 1. Find internal shop record using the Shopify ID.
    const shopRecord = await prisma.Shops.findUnique({
      where: { shopId: graphqlShopID },
      select: { id: true },
    });

    if (!shopRecord) {
      console.log("Shop not found in our database.");
      return null;
    }

    const internalShopId = shopRecord.id;

    const matches = await prisma.MatchedCelebrity.findMany({
      where: { shopId: internalShopId },
      orderBy: { createdAt: 'desc' },
    });

    const dashboardData = calculateDashboardData(matches, shopName);

    setCache(cacheKey, dashboardData, 1800);

    return dashboardData;

  } catch (error) {
    console.error("Failed to get shop stats:", error);
    return null;
  }
};

// Functions only for webhooks related activity
export const webhookShopData = async (shopName) => {
  const cacheKey = `shop_data_${shopName}`;

  const cachedShopData = getCache(cacheKey);
  if (cachedShopData && cachedShopData !== null) {
    return cachedShopData;
  }

  const shopRecord = await prisma.Shops.findUnique({
    where: { shopName },
  });

  if (shopRecord && shopRecord.shopId && shopRecord.shopName) {

    console.log("Valide Shop Data: ", !!shopRecord);
    setCache(cacheKey, shopRecord, 1800);

    return shopRecord;
  }

  return null;
}

export const appUninstalled = async (shopName) => {
  const cacheKey1 = `shop_data_${shopName}`;
  const cacheKey2 = `shop_dashboard_${shopName}`;

  try {
    // Find the shop record to get unique ID.
    const shop = await prisma.Shops.findUnique({
      where: { shopName },
    });

    // If the shop doesn't exist, log it and exit.
    if (!shop) {
      console.log(`Shop "${shopName}" not found. No action taken.`);
      return;
    }

    // Delete all MatchedCelebrity records associated with this shop's ID.
    const deleteResult = await prisma.matchedCelebrity.deleteMany({
      where: {
        shopId: shop.id,
      },
    });

    // console.log(`${deleteResult.count} MatchedCelebrity records deleted for shop: ${shopName}`);

    // Update the shop's status to reflect the uninstallation.
    await prisma.Shops.update({
      where: { shopName },
      data: {
        termsAccepted: false,
        subscriptionStatus: {
          set: {
            active: false,
            subId: null,
          },
        },
      },
    });

    // Invalidate the cache for this shop.
    invalidateCache(cacheKey1);
    invalidateCache(cacheKey2);

    // console.log(`App has been successfully uninstalled and data cleared for shop: ${shopName}`);
  } catch (error) {
    console.error(`An error occurred during app uninstallation for ${shopName}:`, error);
  }
};