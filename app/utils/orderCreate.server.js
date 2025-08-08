import { Resend } from "resend";
import { render } from "@react-email/render";
import AlertEmail from "../emails/AlertEmail";

export const sendOrderAlertEmail = async (userName, userEmail, customerCategory, customerName, fullName, customerEmail, products, spent, createdAt, note) => {

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const emailHtml = await render(AlertEmail({ userName, customerCategory, customerName, fullName, customerEmail, products, spent, createdAt, note }));

        if (typeof emailHtml !== 'string') {
            console.error("Rendered email HTML is not a string:", typeof emailHtml);
            throw new Error("Failed to render email HTML.");
        }

        const { data, error } = await resend.emails.send({
            from: "Famous Tracker <notifications@famoustracker.io>",
            to: [ userEmail ],

            subject: `New purchase notification from Famous Tracker`,

            html: emailHtml,
            text: generatePlainTextVersion(userName, customerName, customerEmail, products, spent),

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
        console.log("Email sent successfully:", !!data);

    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
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
"Hi ${customerName.split(' ')[ 0 ]}, thank you for choosing our ${products.join(', ')}! I'd love to hear your thoughts on the products. Would you be interested in sharing a quick review? I'd be happy to send you something from our upcoming collection as a thank you."

---
Famous Tracker
Support: support@famoustracker.io
Unsubscribe: https://famoustracker.io/unsubscribe
`;
}