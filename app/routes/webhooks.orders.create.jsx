import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
    // Renamed loader to action to handle POST requests
    const { topic, shop, payload, webhookId } = await authenticate.webhook(request);

    if (topic === "ORDERS_CREATE" && webhookId.includes("test-webhook")) {
        console.log("Received test webhook. No action taken.");
        return new Response("Test webhook received", { status: 200 });
    }

    console.log(`✅ Received ${topic} webhook for ${shop} with ID: ${webhookId}`);
    console.log(`📦 Order payload: ${JSON.stringify(payload, null, 2)}`);

    return json({ message: "Webhook processed successfully." }, { status: 200 });
};