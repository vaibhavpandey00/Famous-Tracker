import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Banner,
  Button,
  Text
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import Home from "../components/Home";
import PricingPage from "../components/PricingPage";
import { authenticate } from "../shopify.server";
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";
import logger from "../utils/logger.client";

export const loader = async ({ request }) => {
  console.log("Loader: Starting authentication process...");

  const { admin, session, billing } = await authenticate.admin(request);

  console.log("Loader: Authentication attempt completed.");
  console.log("Session exists:", !!session);

  if (session) {
    console.log("Session ID:", session.id);
    console.log("Access Token present:", !!session.accessToken ? "YES" : "NO");
  } else {
    console.warn("Loader: No session object found after authenticate.admin. This might indicate an issue or a pending redirect.");
    throw new Error("Authentication failed: No session available. Please try reinstalling the app.");
  }

  if (!admin) {
    console.error("Loader: 'admin' object is unexpectedly null or undefined after successful session check. This should not happen.");
    throw new Error("Internal error: Admin context not available. Please try again.");
  }

  let checkPlans;
  let hasActiveSubscription = false;
  let subscriptionId = null;

  try {
    // This is the line that's failing
    checkPlans = await billing.check();
    hasActiveSubscription = checkPlans.hasActivePayment;
    subscriptionId = checkPlans.appSubscriptions[ 0 ]?.id;
  } catch (error) {
    console.error("Failed to check billing:", error.message);
    hasActiveSubscription = false;
    throw error;
  }

  console.log("Loader: hasActiveSubscription:", hasActiveSubscription);

  // if (hasActiveSubscription) {
  //   await billing.cancel({
  //     subscriptionId: subscriptionId,
  //     isTest: true
  //   })
  // }

  if (!hasActiveSubscription) {
    const dataToSend = { haveActiveSubscription: hasActiveSubscription };
    return dataToSend;
  }

  const { getShopData } = await import("../utils/shopUtils.server");

  try {
    const shopName = session.shop.replace(".myshopify.com", "");
    // console.log("Loader: Attempting to fetch shop data using admin.graphql...");
    const rawShopData = await getShopData(admin, shopName);
    console.log("Loader: Successfully fetched raw shop data.");

    const hasCompletedWelcome = rawShopData.termsAccepted;

    if (!hasCompletedWelcome) {
      return redirect("/app/welcome");
    }

    const modifiedShopData = { ...rawShopData };

    modifiedShopData.haveActiveSubscription = hasActiveSubscription;

    delete modifiedShopData.id;
    delete modifiedShopData.shopId;
    delete modifiedShopData.createdAt;
    delete modifiedShopData.updatedAt;
    delete modifiedShopData.subscriptionStatus;

    console.log("Loader: Returning shop data.");
    return modifiedShopData;
  } catch (error) {
    console.error("Loader: Error during shop data processing or fetching:", error);
    // Re-throw the error to be caught by the ErrorBoundary
    throw error;
  }
};

export const action = async ({ request }) => {
  // const { addCeleb } = await import("../utils/addCelebs");
  const { updateShopRecord } = await import("../utils/shopUtils.server");
  const { admin } = await authenticate.admin(request);

  const shopData = await request.json();
  const Action = shopData.Action;
  console.log("Action:", Action);

  switch (Action) {
    case "updateShopRecord":
      delete shopData.Action;
      await updateShopRecord(admin, shopData);
      break;

    case "createCelebRecord":
      console.log("Creating Celeb Record...");
      break;

    default:
      console.error("Unknown action:", Action);
      break;
  }

  return null;
};

export default function Index() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData();
  const [ formData, setFormData ] = useState({
    // Personal Information
    name: "",
    email: "",

    // Alert Channels
    emailAlerts: false,
    slackAlerts: false,
    webhookAlerts: true,
    inAppAlerts: false,

    minimumOrderValue: 0,
    minimumFollowers: 0,

    // Alert Categories
    categories: {
      celebrity: true,
      influencer: true,
      athlete: false,
      musician: false,
    },

    alertFrequency: "immediate",
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
    haveActiveSubscription: false
  });
  const [ originalData, setOriginalData ] = useState(null);
  const [ activeTab, setActiveTab ] = useState("home");

  useEffect(() => {
    if (loaderData && loaderData.haveActiveSubscription) {
      const updatedFormData = {
        ...formData,
        ...loaderData,
        categories: { ...formData.categories, ...loaderData.categories },
        quietHours: { ...formData.quietHours, ...loaderData.quietHours },
      };
      setFormData(updatedFormData);

      // Store original data for comparison (excluding haveActiveSubscription)
      const originalDataCopy = { ...updatedFormData };
      delete originalDataCopy.haveActiveSubscription;
      setOriginalData(originalDataCopy);
    }
    if (loaderData && !loaderData.haveActiveSubscription) {
      setFormData({ ...formData, haveActiveSubscription: false });
      setActiveTab("pricing");
    }
  }, [ loaderData ]);

  // Deep comparison function
  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;

    if (obj1 == null || obj2 == null) return false;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!deepEqual(obj1[ key ], obj2[ key ])) return false;
    }

    return true;
  };

  // Function to check if data has changed
  const hasDataChanged = () => {
    if (!originalData) return true; // If no original data, allow submission

    const currentData = { ...formData };
    delete currentData.haveActiveSubscription;

    return !deepEqual(originalData, currentData);
  };

  // Function to get changed fields (optional - for debugging/logging)
  // const getChangedFields = () => {
  //   if (!originalData) return {};

  //   const currentData = { ...formData };
  //   delete currentData.haveActiveSubscription;

  //   const changes = {};
  //   const findChanges = (original, current, path = '') => {
  //     for (const key in current) {
  //       const currentPath = path ? `${path}.${key}` : key;

  //       if (typeof current[ key ] === 'object' && current[ key ] !== null && !Array.isArray(current[ key ])) {
  //         if (typeof original[ key ] === 'object' && original[ key ] !== null) {
  //           findChanges(original[ key ], current[ key ], currentPath);
  //         } else {
  //           changes[ currentPath ] = { from: original[ key ], to: current[ key ] };
  //         }
  //       } else if (original[ key ] !== current[ key ]) {
  //         changes[ currentPath ] = { from: original[ key ], to: current[ key ] };
  //       }
  //     }
  //   };

  //   findChanges(originalData, currentData);
  //   return changes;
  // };

  const handleFormSubmit = (getAction) => {
    logger.log("Form submit requested...");

    // Check if data has changed
    if (!hasDataChanged()) {
      logger.log("No changes detected, skipping submission");
      return;
    }

    logger.log("Changes detected, submitting form...");

    //Log what changed for debugging
    // const changedFields = getChangedFields();
    // logger.log("Changed fields:", changedFields);

    const dataToUpdate = { ...formData };
    delete dataToUpdate.haveActiveSubscription;

    const Action = getAction;
    logger.info("Action:", Action);

    dataToUpdate.Action = Action;

    fetcher.submit(JSON.stringify(dataToUpdate), {
      method: "post",
      encType: "application/json",
    });
  };

  return (
    <div className="flex flex-col items-center ">
      {/* Title bar */}
      <TitleBar title="Famous Tracker" />

      {/* Toggle tab home and pricing */}
      <div
        className="flex w-[70%] items-center justify-between mb-3 space-x-4">

        <Text as="h2" variant="headingLg">/ {activeTab === "home" ? "Dashboard" : "Pricing"}</Text>

        <div style={{ display: "flex", width: "20%", height: "60px", justifyContent: "center", gap: "20px", borderRadius: "15px", padding: "10px", background: "#2563EB" }}>

          <button
            style={{ width: "100px", borderRadius: "10px", border: "none", background: activeTab === "home" ? "#fff" : "#2563EB", color: activeTab === "home" ? "#000" : "#fff", fontWeight: "600", fontSize: "18px", cursor: "pointer" }}
            onClick={() => setActiveTab("home")}
          >Home</button>

          <button
            style={{ width: "100px", borderRadius: "10px", border: "none", background: activeTab === "pricing" ? "#fff" : "#2563EB", color: activeTab === "pricing" ? "#000" : "#fff", fontWeight: "600", fontSize: "18px", cursor: "pointer" }}
            onClick={() => setActiveTab("pricing")}
          >Pricing</button>

        </div>

      </div>

      {/* Home */}
      {activeTab === "home" && formData.haveActiveSubscription && (<Home formData={formData} setFormData={setFormData} handleFormSubmit={handleFormSubmit} />
      )}

      {/* For no active subscription */}
      {activeTab === "home" && !formData.haveActiveSubscription && <>
        <Banner title="You have no active subscription" status="critical">
          <p style={{ marginBottom: "15px" }}>Ohh no! Looks like you don't have an active subscription.</p>
          <Button onClick={() => setActiveTab("pricing")}>Subscribe now</Button>
        </Banner>
      </>}

      {/* Pricing */}
      {activeTab === "pricing" && (
        <>
          <PricingPage activeSub={formData.haveActiveSubscription} />
        </>
      )}

    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // Log the error for debugging purposes (this will appear in your server logs)
  console.error("ErrorBoundary caught an error:", error);

  // Default error message
  let errorMessage = "An unexpected error occurred.";
  let errorStatus = 500;
  let errorDetails = "Something went wrong while loading your app. Please try again or contact support.";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = `${error.status} ${error.statusText}`;
    errorDetails = error.data?.message || error.data || "The server responded with an error.";

    if (errorStatus === 401 || errorStatus === 403) {
      errorMessage = "Authentication Required";
      errorDetails = "It looks like your session expired or you're not authorized. Please try refreshing the page or reinstalling the app.";
    } else if (errorStatus === 404) {
      errorMessage = "Page Not Found";
      errorDetails = "The requested page could not be found.";
    }
  } else if (error instanceof Error) {
    errorMessage = "Application Error";
    errorDetails = error.message;

    if (error.message.includes("Missing access token") || error.message.includes("No session available")) {
      errorMessage = "App Installation Issue";
      errorDetails = "It looks like there was an issue during the app installation or initial setup. This can happen on first load or after a cold start. Please try refreshing the page. If the issue persists, try reinstalling the app from your Shopify admin.";
    } else if (error.message.includes("Admin context not available")) {
      errorMessage = "App Initialization Error";
      errorDetails = "The app failed to initialize correctly. Please refresh the page. If this continues, there might be a configuration problem.";
    }
  }

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        border: "1px solid #f5c6cb",
        borderRadius: "8px",
        margin: "20px auto",
        maxWidth: "600px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ color: "#dc3545", marginBottom: "15px" }}>
        🚨 {errorMessage} 🚨
      </h2>
      <p style={{ fontSize: "1.1em", lineHeight: "1.5" }}>{errorDetails}</p>
      <div style={{ marginTop: "20px", fontSize: "0.9em", color: "#6c757d" }}>
        <p>If you need further assistance, please contact support.</p>
        <p>
          You can also check your app's logs on deployed server for more details.
        </p>
      </div>
    </div>
  );
}
