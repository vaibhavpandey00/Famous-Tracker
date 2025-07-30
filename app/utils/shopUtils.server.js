import prisma from "../db.server";
import { getCache, setCache, invalidateCache } from "./cache.server.js";

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
  if (cachedShopData) {
    return cachedShopData;
  }

  // 2. If it's a cache miss, proceed with fetching the data.
  const query = `
    query getShopInfo {
      shop {
        id
        name
        email
      }
    }
  `;
  // Using a retry utility is still a good practice for API calls.
  const shopInfoResponse = await admin.graphql(query).then(res => res.json()).then(json => json.data.shop);

  if (!shopInfoResponse || !shopInfoResponse.id) {
    throw new Error('Invalid shop data received from Shopify');
  }

  const { id: graphqlShopID, name: shopName, email: shopEmail } = shopInfoResponse;

  const shopRecord = await prisma.Shops.upsert({
    where: { shopId: graphqlShopID },
    update: { shopName, email: shopEmail || null },
    create: {
      shopId: graphqlShopID,
      shopName,
      email: shopEmail || null,
      name: null,
      subscriptionStatus: { active: true, subId: null },
      categories: { celebrity: true, influencer: true, athlete: true, musician: true },
      alertFrequency: "immediate",
      quietHours: { enabled: false, start: "22:00", end: "08:00" },
      emailAlerts: false,
      slackAlerts: false,
      webhookAlerts: true,
      inAppAlerts: false,
      minimumOrderValue: 0,
      minimumFollowers: 0,
    },
  });

  // 3. Store the newly fetched data in the cache before returning.
  setCache(cacheKey, shopRecord);

  return shopRecord;
};

/**
 * @param {string} shopId - The GraphQL shop ID.
 * @param {object} data - The data to update.
 * @returns {Promise<object>} - The updated shop record.
 */
export const updateShopRecord = async (admin, data) => {

  const query = `
    query getShopInfo {
      shop {
        id
      }
    }
  `;
  // Using a retry utility is still a good practice for API calls.
  const shopInfoResponse = await admin.graphql(query).then(res => res.json()).then(json => json.data.shop);

  if (!shopInfoResponse || !shopInfoResponse.id) {
    throw new Error('Invalid shop data received from Shopify');
  }

  const { id } = shopInfoResponse;

  const updatedShop = await prisma.Shops.update({
    where: { shopId: id },
    data: data,
  });

  const cacheKey = `shop_data_${updatedShop.shopName}`;
  invalidateCache(cacheKey);

  return updatedShop;
};