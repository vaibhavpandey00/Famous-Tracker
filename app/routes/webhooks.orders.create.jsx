import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
    // Renamed loader to action to handle POST requests
    const { topic, shop, payload, webhookId } = await authenticate.webhook(request);

    if (topic === "ORDERS_CREATE" && webhookId.includes("test-webhook")) {
        console.log("Received test webhook. No action taken.");
        return new Response("Test webhook received", { status: 200 });
    }

    const { webhookShopData } = await import("../utils/shopUtils.server");

    const shopName = shop.replace(".myshopify.com", "");
    const formattedData = formatShopifyOrder(payload);

    try {
        const shopDataDb = await webhookShopData(shopName);

        if (shopDataDb === null) {
            console.log("Shop data is null. No action taken.");
            return new Response("Shop data is null. No action taken.", { status: 200 });
        }

        // Check if the store/shop has an active subscription
        if (shopDataDb.subscriptionStatus.active === false) {
            console.log("Subscription is inactive. No action taken.");
            return new Response("Subscription is inactive. No action taken.", { status: 200 });
        }

        // console.log("----- Shop Data -----");
        // console.log(`Order payload: ${JSON.stringify(formattedData, null, 2)}`);
        // console.log("Shop Data: ", shopDataDb);

        const { sendOrderAlertEmail } = await import("../utils/orderCreate.server")
        const { findCelebMatch, newCelebMatchRecord } = await import("../utils/matchCeleb.server");

        // Check if the Celeb has a match in the DB
        const celebMatch = await findCelebMatch(formattedData.customerName, formattedData.normalizedName);

        if (!celebMatch || celebMatch === null) {
            console.log("No celeb match found. No alert will be sent.");
            return new Response("No celeb match found. No alert will be sent.", { status: 200 });
        }

        // Save the new Matched Celebrity to DB
        const celebDataTOSave = {
            // shopId is foreign key
            shopId: shopDataDb.id,
            // Customer Details
            customerName: formattedData.customerName,
            orderId: formattedData.orderId.toString(),
            products: formattedData.products,
            orderValue: formattedData.spent,
            // Customer matching celebrity detials
            matchedCelebName: celebMatch.fullName,
            celebCategories: celebMatch.categories,
            socials: celebMatch.socials,
            maxFollowerDisplay: celebMatch.maxFollowerDisplay,
        }
        const newCelebMatch = await newCelebMatchRecord(celebDataTOSave, shopName);

        if (newCelebMatch === null) {
            console.log("Failed to save new Celeb Match record to DB. No alert will be sent.");
            // return new Response("Failed to save new Celeb Match record to DB. No alert will be sent.", { status: 200 });
        }

        if (shopDataDb.email && shopDataDb.emailAlerts) {
            const matchesForEmail = [ {
                fullName: celebMatch.fullName,
                score: celebMatch.score,
            } ];

            const emailData = {
                // Shop owner details
                userName: shopDataDb.name,
                userEmail: shopDataDb.email,
                // Customer details
                customerName: formattedData.customerName,
                customerEmail: formattedData.customerEmail,
                shippingAddress: formattedData.shippingAddress,
                acceptsMarketing: formattedData.acceptsMarketing,
                orderId: formattedData.orderId,
                products: formattedData.products,
                spent: formattedData.spent,
                // Celebrity details
                matches: matchesForEmail,
                customerCategory: celebMatch.categories,
                maxFollowerDisplay: celebMatch.maxFollowerDisplay,
                socials: celebMatch.socials,
                notableAchievements: celebMatch.notableAchievements,
                note: celebMatch.notes,
                createdAt: formattedData.createdAt,
            };

            await sendOrderAlertEmail(emailData);
        }

        return new Response("Webhook processed", { status: 200 });

    } catch (error) {
        console.log("Error processing webhook: ", error);
        return new Response("Error processing webhook", { status: 500 });
    }
};

/**
 * @param {object} payload The full order object from the Shopify webhook.
 * @returns {object} A simplified object with the required data.
 */
function formatShopifyOrder(payload) {
    // Guard against null or undefined payloads
    if (!payload) {
        return null;
    }

    // Safely get the customer's full name
    const firstName = payload.customer?.first_name ?? '';
    const lastName = payload.customer?.last_name ?? '';
    const customerName = `${firstName} ${lastName}`.trim();

    // Map the line_items array to an array of product names
    const products = payload.line_items?.map(item => item.name) ?? [];

    // --- NEW: Format the creation date to "Month Day, Year at hh:mm AM/PM" ---
    const date = new Date(payload.created_at);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use 12-hour clock with AM/PM
        timeZone: 'America/New_York',
    };

    // Get all the individual parts of the date in the specified timezone
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);

    // Convert the array of parts into an easier-to-use object
    const partsMap = parts.reduce((acc, part) => {
        if (part.type !== 'literal') {
            acc[ part.type ] = part.value;
        }
        return acc;
    }, {});

    // Assemble the parts into your exact custom format
    const createdAtFormatted = `${partsMap.month} ${partsMap.day}, ${partsMap.year} at ${partsMap.hour}:${partsMap.minute} ${partsMap.dayPeriod}`;

    // --- NEW: Generate the normalizedName slug ---
    const city = payload.shipping_address?.city ?? '';
    const state = payload.shipping_address?.province ?? '';

    // A small helper function to clean and format each part of the slug
    const cleanPart = (str) => str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    const normalizedName = [
        cleanPart(customerName),
        cleanPart(city),
        cleanPart(state)
    ].filter(part => part).join('_'); // Filter out empty parts and join with an underscore

    // 1. Create an array of address parts in order
    const addressParts = [
        payload.shipping_address?.address1,
        payload.shipping_address?.address2,
        payload.shipping_address?.city,
        payload.shipping_address?.province,
        payload.shipping_address?.zip,
        payload.shipping_address?.country
    ];

    // 2. Filter out empty/null parts and 3. Join them into a string
    const formattedAddress = addressParts.filter(Boolean).join(', ');

    // Construct and return the clean object
    const cleanData = {
        orderId: payload.id,
        customerName: customerName,
        normalizedName: normalizedName,
        customerEmail: payload.contact_email,
        shippingAddress: formattedAddress,
        products: products,
        spent: parseFloat(payload.current_total_price),
        createdAt: createdAtFormatted,
    };

    return cleanData;
}