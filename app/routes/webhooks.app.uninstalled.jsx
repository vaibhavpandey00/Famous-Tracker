import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { appUninstalled } = await import("../utils/shopUtils.server");
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  if (session) {
    console.log("Uninstalling app...");
    const shopName = session.shop.replace(".myshopify.com", "");
    await appUninstalled(shopName);
  }

  return new Response();
};
