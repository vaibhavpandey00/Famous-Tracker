import prisma from "../db.server";
import { getCache, setCache, invalidateCache } from "./cache.server.js";

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
    shopRecord = await createShopRecord(shopInfoResponse);
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
      categories: { celebrity: true, influencer: true, athlete: true, musician: true },
      alertFrequency: "immediate",
      quietHours: { enabled: false, start: "22:00", end: "08:00" },
      emailAlerts: true,
      slackAlerts: false,
      webhookAlerts: true,
      inAppAlerts: true,
      minimumOrderValue: 0,
      minimumFollowers: 0,
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

  setCache(cacheKey, shopRecord, 1800); // Cache for 30 minutes (1800 seconds)

  console.log("Webhook Shop Data:", shopRecord);
  return shopRecord;
}

export const appUninstalled = async (shopName) => {
  const cacheKey = `shop_data_${shopName}`;

  const updatedShop = await prisma.Shops.update({
    where: { shopName },
    data: {
      subscriptionStatus: {
        active: false,
        subId: null,
      },
    },
  });
  invalidateCache(cacheKey);

  console.log("App has been uninstalled.");

  return;
}