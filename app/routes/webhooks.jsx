import { authenticate } from '../shopify.server';

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const { topic, shop, payload } = await authenticate.webhook(request);

    console.log("A new webhook has been received!");

    switch (topic) {
        case 'CUSTOMERS_DATA_REQUEST':
            console.log(`Received ${topic} webhook for shop: ${shop}`);
            // TODO: Implement logic for customer data request (GDPR compliance)
            return new Response('Customer data request', { status: 200 });

        case 'CUSTOMERS_REDACT':
            console.log(`Received ${topic} webhook for shop: ${shop}`);
            // TODO: Implement logic for customer data redaction (GDPR compliance)
            return new Response('Customer redact', { status: 200 });

        case 'SHOP_REDACT':
            console.log(`Received ${topic} webhook for shop: ${shop}`);
            // TODO: Implement logic for shop data redaction (GDPR compliance)
            return new Response('Shop redact', { status: 200 });

        // New webhooks for Famous Tracker functionality
        case 'ORDERS_CREATE':
            console.log(`Received ${topic} webhook for shop: ${shop}`);
            handleOrderCreate(session, shop, payload);
            return new Response('Order created successfully processed', { status: 200 });

        case 'CUSTOMERS_UPDATE':
            console.log(`Received ${topic} webhook for shop: ${shop}`);
            handleCustomerUpdate(session, shop, payload);
            return new Response('Customer updated successfully processed', { status: 200 });

        case 'CUSTOMERS_CREATE':
            console.log(`Received ${topic} webhook for shop: ${shop}`);
            handleCustomerCreate(session, shop, payload);
            return new Response('Customer created successfully processed', { status: 200 });

        default:
            console.warn(`Unhandled webhook topic: ${topic} for shop: ${shop}`);
            return new Response('Unhandled webhook topic', { status: 404 });
    }
};

const handleOrderCreate = async (session, shop, payload) => {
    // TODO: Implement logic for new order processing
    console.log("Session:", session);
    console.log("Shop:", shop);
    console.log("New order payload:", payload);
    return;
}

const handleCustomerCreate = async (session, shop, payload) => {
    // TODO: Implement logic for new customer creation
    console.log("Session:", session);
    console.log("Shop:", shop);
    console.log("New customer payload:", payload);
    return;
}

const handleCustomerUpdate = async (session, shop, payload) => {
    // TODO: Implement logic for customer profile updates
    console.log("Session:", session);
    console.log("Shop:", shop);
    console.log("Customer updated payload:", payload);
    return;
}