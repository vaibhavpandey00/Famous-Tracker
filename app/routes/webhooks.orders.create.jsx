import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { Resend } from "resend";
import { render } from "@react-email/render";
import AlertEmail from "../emails/AlertEmail";

export const action = async ({ request }) => {
    // Renamed loader to action to handle POST requests
    const { topic, shop, payload, webhookId } = await authenticate.webhook(request);

    if (topic === "ORDERS_CREATE" && webhookId.includes("test-webhook")) {
        console.log("Received test webhook. No action taken.");
        return new Response("Test webhook received", { status: 200 });
    }

    const { webhookShopData } = await import("../utils/shopUtils.server");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const shopName = shop.replace(".myshopify.com", "");

    console.log(`✅ Received ${topic} webhook for ${shop} with ID: ${webhookId}`);
    const formattedData = formatShopifyOrder(payload);
    // console.log(`📦 Order payload: ${JSON.stringify(formattedData, null, 2)}`);

    let shopDataDb;
    try {
        shopDataDb = await webhookShopData(shopName);
        const { name: userName, email: userEmail, categories, emailAlerts, slackAlerts, inAppAlerts } = shopDataDb;

        // console.log("----- Shop Data -----");
        // console.log("Name: ", userName);
        // console.log("Email: ", userEmail);
        // console.log("Categories: ", categories);
        // console.log("Email Alert: ", emailAlerts);
        // console.log("Slack Alert: ", slackAlerts);
        // console.log("In-App Alert: ", inAppAlerts);

        if (!userEmail) {
            console.log("Email is not set for this shop. No email will be sent.");
        }
        if (userEmail && emailAlerts) {
            const emailHtml = await render(AlertEmail({ userName, customerName: formattedData.customerName, customerEmail: formattedData.customerEmail, products: formattedData.products, spent: formattedData.spent, createdAt: formattedData.createdAt }));

            if (typeof emailHtml !== 'string') {
                console.error("Rendered email HTML is not a string:", typeof emailHtml);
                return json({ success: false, error: "Failed to render email template." }, { status: 500 });
            }

            const { data, error } = await resend.emails.send({
                from: "Famous Tracker <notifications@famoustracker.io>",
                to: [ userEmail ],

                subject: `New purchase notification from Famous Tracker`,

                html: emailHtml,
                text: generatePlainTextVersion(userName, formattedData.customerName, formattedData.customerEmail, formattedData.products, formattedData.spent),

                // IMPROVED: Essential headers only
                headers: {
                    'X-Entity-Ref-ID': `purchase-${Date.now()}`,
                    'List-Unsubscribe': '<mailto:unsubscribe@famoustracker.io>',
                    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
                    'Return-Path': 'notifications@famoustracker.io',
                    'Reply-To': 'support@famoustracker.io',
                },

                tags: [
                    { name: 'type', value: 'notification' },
                    { name: 'category', value: 'purchase' }
                ],

                metadata: {
                    'notification_type': 'purchase',
                    'sent_at': new Date().toISOString()
                }
            });

            if (error) {
                console.error("Resend error:", error);
                return json({ success: false, error: "Failed to send email." }, { status: 500 });
            }
            console.log("Email sent successfully:", data);
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

function generatePlainTextVersion(userName, customerName, customerEmail, products, spent) {
    return `Hi ${userName},

You have a new purchase notification from Famous Tracker.

Customer Details:
Name: ${customerName}
Email: ${customerEmail}
Purchase: ${products.join(', ')}
Amount: $${spent}

This customer falls into the celebrity category, which may present partnership opportunities.

Recommendations:
1. Consider reaching out for a product review
2. Explore potential collaboration opportunities
3. Offer exclusive access to new products

Best practices for outreach:
- Contact within 24 hours for better response rates
- Reference their specific purchase
- Keep initial messages brief and personal
- Focus on providing value first

Sample message:
"Hi Emma, thank you for choosing our ${products.join(', ')}! I'd love to hear your thoughts on the products. Would you be interested in sharing a quick review? I'd be happy to send you something from our upcoming collection as a thank you."

---
Famous Tracker
Support: support@famoustracker.io
Unsubscribe: https://famoustracker.io/unsubscribe
`;
}