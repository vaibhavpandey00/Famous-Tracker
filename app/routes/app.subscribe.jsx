import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { BlockStack, Page, Spinner } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    if (!admin) return redirect("/app");
    return json({
        confirmationUrl: "https://admin.shopify.com/charges/famous-tracker/pricing_plans",
    })
};

export const action = async ({ request }) => {
    await authenticate.admin(request);
    return null;
};

// Main component
export default function Pricing() {
    const { confirmationUrl, error } = useLoaderData();
    const [ billingRedirect, setBillingRedirect ] = useState(false);

    const [ errorMessage, setErrorMessage ] = useState(error);
    const [ errorAction, setErrorAction ] = useState("");

    useEffect(() => {
        if (confirmationUrl && !billingRedirect) {
            setBillingRedirect(true);
            setTimeout(() => {
                window.top.location.href = confirmationUrl;
            }, 2000);
        }
        if (error) {
            setErrorMessage(error);
        }
    }, [ confirmationUrl ]);


    if (errorMessage || errorAction) {
        return (
            <Page>
                <TitleBar
                    title="Pricing Plans"
                    primaryAction={{
                        content: "Help",
                        onAction: () => {
                            // Help action
                        },
                    }}
                />
                <BlockStack gap="800">
                    <CalloutCard
                        title="Error"
                        illustration="https://cdn.shopify.com/s/files/1/0583/6465/7734/files/tag.png?v=1705280535"
                    >
                        <p>{errorMessage}</p>
                        <p>{errorAction}</p>
                    </CalloutCard>
                </BlockStack>
            </Page>
        )
    }

    if (billingRedirect) {
        return (
            <Page>
                <TitleBar
                    title="Pricing Plans"
                    primaryAction={{
                        content: "Help",
                        onAction: () => {
                            // Help action
                        },
                    }}
                />
                <BlockStack gap="400" align="center">
                    <Spinner size="large" />
                    <p>Please wait while we connect you to Shopify's secure billing service.</p>
                    <p>You'll be automatically redirected in a moment.</p>
                </BlockStack>
            </Page>
        );
    }
}