import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Resend } from "resend";
import { render } from "@react-email/render";
import AlertEmail from "../emails/AlertEmail";

export const action = async ({ request }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const formData = await request.formData();
    const recipientEmail = formData.get("email");
    const userName = formData.get("name") || "there";

    if (!recipientEmail) {
        return json({ error: "Email address is required." }, { status: 400 });
    }

    try {
        const emailHtml = await render(AlertEmail({ userName }));

        if (typeof emailHtml !== 'string') {
            console.error("Rendered email HTML is not a string:", typeof emailHtml);
            return json({ success: false, error: "Failed to render email template." }, { status: 500 });
        }

        const { data, error } = await resend.emails.send({
            from: "Famous Tracker <notifications@famoustracker.io>",
            to: [ recipientEmail ],

            subject: `New purchase notification from Famous Tracker`,

            html: emailHtml,
            text: generatePlainTextVersion(userName),

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
        return json({
            success: true,
            message: `Purchase notification sent to ${recipientEmail}!`,
            emailId: data.id
        });

    } catch (exception) {
        console.error("Server error:", exception);
        return json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
    }
};

// IMPROVED: Natural plain text version
function generatePlainTextVersion(userName) {
    return `Hi ${userName},

You have a new purchase notification from Famous Tracker.

Customer Details:
Name: Emma Stone
Email: e.stone@email.com
Purchase: Organic Face Serum & Vitamin C Cleanser Bundle
Amount: $156.99

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
"Hi Emma, thank you for choosing our Organic Face Serum Bundle! I'd love to hear your thoughts on the products. Would you be interested in sharing a quick review? I'd be happy to send you something from our upcoming collection as a thank you."

---
Famous Tracker
Support: support@famoustracker.io
Unsubscribe: https://famoustracker.io/unsubscribe
`;
}

// UI COMPONENT
export default function SendTestEmailPage() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ui-title-bar title="Send a Test Email via Resend" />
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <Form method="post" className="space-y-6">
                        {actionData?.success && (
                            <div className="p-4 bg-green-50 text-green-800 border-l-4 border-green-400 rounded-md">
                                <p className="font-medium">{actionData.message}</p>
                            </div>
                        )}
                        {actionData?.error && (
                            <div className="p-4 bg-red-50 text-red-800 border-l-4 border-red-400 rounded-md">
                                <p className="font-medium">{actionData.error}</p>
                            </div>
                        )}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Recipient Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., Jane Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Recipient Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="jane.doe@example.com"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                The address that will receive the test email.
                            </p>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Sending..." : "Send Test Email"}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}