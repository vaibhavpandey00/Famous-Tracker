import { useEffect, useState } from "react"
import { authenticate } from "../shopify.server";
import { redirect, useFetcher, useRouteError, isRouteErrorResponse, useLoaderData } from "@remix-run/react";
import WelcomePage from "../components/WelcomePage";
import logger from "../utils/logger.client";
import { Resend } from "resend";
import { render } from "@react-email/render";
import WelcomeEmail from "../emails/Welcome";

export const loader = async ({ request }) => {
    const { admin, session, billing } = await authenticate.admin(request);
    // Check whether the store has an active subscription
    const checkPlans = await billing.check();

    const hasActiveSubscription = checkPlans.hasActivePayment;

    if (!hasActiveSubscription) {
        return redirect("/app/subscribe");
    }

    const { getShopData } = await import("../utils/shopUtils.server");

    try {
        const shopName = session.shop.replace(".myshopify.com", "");
        const rawShopData = await getShopData(admin, shopName);
        // console.log("Welcome Loader: Successfully fetched raw shop data.");

        delete rawShopData.id;
        delete rawShopData.hasActiveSubscription;
        // delete all the alert channels
        delete rawShopData.emailAlerts;
        delete rawShopData.slackAlerts;
        delete rawShopData.webhookAlerts;
        delete rawShopData.inAppAlerts;
        delete rawShopData.createdAt;
        delete rawShopData.updatedAt;
        delete rawShopData.subscriptionStatus;

        // console.log("Welcome Loader: Returning shop data.");
        return rawShopData;
    } catch (error) {
        console.error("Loader: Error during shop data processing or fetching:", error);
        throw error;
    }
};

export const action = async ({ request }) => {
    const { admin, billing } = await authenticate.admin(request);

    // Check whether the store has an active subscription
    const checkPlans = await billing.check();
    const haveActiveSubscription = checkPlans.hasActivePayment || false;
    const subscriptionId = checkPlans.appSubscriptions?.[ 0 ]?.id || null;

    let data = await request.json();
    data.subscriptionStatus = { active: haveActiveSubscription, subId: subscriptionId };

    // console.log("Welcome Action: Form data:", data);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { updateShopRecord } = await import("../utils/shopUtils.server");

    try {
        await updateShopRecord(admin, data);

        const userName = data.name || "there";
        const recipientEmail = data.email;

        if (!recipientEmail) {
            return json({ error: "Email address is required." }, { status: 400 });
        }
        const emailHtml = await render(WelcomeEmail({ userName }));

        // Additional safety check to ensure emailHtml is a string
        if (typeof emailHtml !== 'string') {
            console.error("Rendered email HTML is not a string:", typeof emailHtml);
            return json({ success: false, error: "Failed to render email template." }, { status: 500 });
        }

        const { error } = await resend.emails.send({
            from: "Famous Tracker <noreply@famoustracker.io>",
            to: [ recipientEmail ],
            subject: "Welcome to Famous Tracker - Get Started with Celebrity Insights",
            html: emailHtml,
            headers: {
                'X-Entity-Ref-ID': `welcome-${Date.now()}`,
                'List-Unsubscribe': '<https://famoustracker.io/unsubscribe>',
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
            tags: [
                { name: 'category', value: 'welcome' },
                { name: 'environment', value: process.env.NODE_ENV || 'development' }
            ],
        });

        if (error) {
            console.error("Resend error:", error);
            return json({ success: false, error: "Failed to send email." }, { status: 500 });
        }
        console.log("Email sent successfully ✅");

        return redirect("/app");
    } catch (error) {
        console.error("Error updating shop data:", error);
        throw error;
    }
};

export default function Welcome() {
    const loaderData = useLoaderData();
    const fetcher = useFetcher();
    const [ formData, setFormData ] = useState({
        // Personal Information
        name: "",
        email: "",
        termsAccepted: false,
    });

    useEffect(() => {
        if (loaderData) {
            const updatedFormData = {
                ...formData,
                ...loaderData
            };
            setFormData(updatedFormData);
        }
    }, [ loaderData ]);

    const handleComplete = () => {
        logger.log("Onboarding completed with data:", formData);
        handleSubmit();
    }

    const handleSubmit = () => {
        logger.log("Submitting data:", formData);
        fetcher.submit(JSON.stringify(formData), {
            method: "post",
            encType: "application/json",
        });
    }

    return <div className="flex items-center justify-center w-full">
        <WelcomePage formData={formData} setFormData={setFormData} onComplete={handleComplete} />
    </div>
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