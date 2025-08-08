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
    // console.log(`📦 Order payload: ${JSON.stringify(formattedData, null, 2)}`);

    let shopDataDb;
    try {
        shopDataDb = await webhookShopData(shopName);

        if (shopDataDb === null) {
            console.log("Shop data is null. No action taken.");
            return new Response("Shop data is null. No action taken.", { status: 200 });
        }

        // Check if the store/shop has an active subscription
        if (shopDataDb.subscriptionStatus.active === false) {
            console.log("Subscription is inactive. No action taken.");
            return new Response("Subscription is inactive. No action taken.", { status: 200 });
        }

        const { name: userName, email: userEmail, categories, minimumOrderValue, minimumFollowers, emailAlerts, slackAlerts, inAppAlerts } = shopDataDb;

        // console.log("----- Shop Data -----");
        // console.log("Name: ", userName);
        // console.log("Email: ", userEmail);
        // console.log("Categories: ", categories);
        // console.log("Minimum Order Value: ", minimumOrderValue);
        // console.log("Minimum Followers: ", minimumFollowers);
        // console.log("Email Alert: ", emailAlerts);
        // console.log("Slack Alert: ", slackAlerts);
        // console.log("In-App Alert: ", inAppAlerts);

        if (formattedData.spent < minimumOrderValue) {
            console.log("Order value is below the minimum threshold. No alert will be sent.");
            return new Response("Order value is below the minimum threshold. No alert will be sent.", { status: 200 });
        }

        const { sendOrderAlertEmail } = await import("../utils/orderCreate.server")
        const { findCelebMatch, doCategoriesMatch } = await import("../utils/matchCeleb.server");

        // Check if the Celeb has a match in the DB
        const celebMatch = await findCelebMatch(formattedData.customerName);

        if (!celebMatch || celebMatch === null) {
            console.log("No celeb match found. No alert will be sent.");
            return new Response("No celeb match found. No alert will be sent.", { status: 200 });
        }

        // Destructure the celebMatch object
        const { fullName, celebCategory, maxFollower, socials, note } = celebMatch;

        if (maxFollower < minimumFollowers) {
            console.log("Celeb has fewer followers than the minimum threshold. No alert will be sent.");
            return new Response("Celeb has fewer followers than the minimum threshold. No alert will be sent.", { status: 200 });
        }

        // It checks if the celeb's categories match the user's enabled alert settings
        const categoryMatch = doCategoriesMatch(categories, celebCategory);

        if (!categoryMatch) {
            console.log("Categories do not match. No alert will be sent.");
            return new Response("Categories do not match. No alert will be sent.", { status: 200 });
        }

        if (userEmail && emailAlerts) {
            await sendOrderAlertEmail(userName, userEmail, celebCategory, formattedData.customerName, fullName, formattedData.customerEmail, formattedData.products, formattedData.spent, formattedData.createdAt, note);
        }

    } catch (error) {
        console.log("Failed to get the shop data: ", error);
    } finally {
        return json({ message: "Webhook processed successfully." }, { status: 200 });
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


    // Construct and return the clean object
    const cleanData = {
        orderId: payload.id,
        customerName: customerName,
        customerEmail: payload.contact_email,
        shippingAddress: payload.shipping_address,
        products: products,
        spent: parseFloat(payload.current_total_price),
        createdAt: createdAtFormatted,
    };

    return cleanData;
}