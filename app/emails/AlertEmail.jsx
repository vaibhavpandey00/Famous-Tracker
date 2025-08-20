import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Hr,
} from "@react-email/components";
import * as React from 'react';

const AlertEmail = ({
    userName = "Sarah Johnson",
    customerName = "Emma Stone",
    customerEmail = "e.stone@email.com",
    orderId = "1052",
    products = [ "Organic Face Serum", "Vitamin C Cleanser Bundle" ],
    shippingAddress = "123 Main St, Anytown, USA",
    spent = 156.99,
    socials = [],
    acceptsMarketing = true,
    matches = [ { fullName: "Emma Stone", score: 0.0 } ],
    customerCategory = [ "Celebrity", "Artist" ],
    notableAchievements = [],
    note = "This customer falls into the celebrity category, which may present partnership opportunities.",
    createdAt = "August 5, 2025 at 05:17 PM",
}) => {

    // Determine if it's a direct match based on the score
    const isDirectMatch = matches.length === 1 && matches[ 0 ].score < 0.01;

    // Get the category from the best match
    const bestMatch = matches[ 0 ];

    // --- Content for the mailto link ---
    const subject = `Thank you for your recent purchase (#${orderId})`;

    const body = `
Hi ${customerName},

Thank you for choosing our store! We noticed you recently purchased the following items:
• ${products.join('\n• ')}

We hope you're enjoying your new products. We'd love to hear about your experience when you've had a chato try them.

Best regards,
${userName}
`;

    // URL-encode the subject and body to handle special characters, spaces, and line breaks.
    const mailtoLink = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return (
        <Html>
            <Head />
            <Preview>New purchase from {customerName} - Famous Tracker notification</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/*---- Header ----*/}
                    <Section style={header}>
                        <Text style={headerText}>
                            Famous Tracker
                        </Text>
                        <Text style={headerSubText}>
                            High-Value Customer Notification
                        </Text>
                    </Section>

                    {/* Main Content */}
                    <Section style={contentSection}>
                        <Text style={greetingText}>
                            Hello {userName},
                        </Text>
                        <Text style={mainText}>
                            You have a new order from a customer who matches a profile in our tracking list. Here are the details:
                        </Text>

                        {/* Customer Information Card */}
                        <Section style={customerCard}>
                            <Text style={cardHeader}>Order & Customer Details</Text>

                            <Row style={infoRow}>
                                <Column style={labelColumn}><Text style={labelText}>Order ID:</Text></Column>
                                <Column style={valueColumn}><Text style={valueText}>#{orderId}</Text></Column>
                            </Row>

                            <Row style={infoRow}>
                                <Column style={labelColumn}><Text style={labelText}>Customer:</Text></Column>
                                <Column style={valueColumn}><Text style={valueText}>{customerName}</Text></Column>
                            </Row>

                            <Row style={infoRow}>
                                <Column style={labelColumn}><Text style={labelText}>Email:</Text></Column>
                                <Column style={valueColumn}><Text style={valueText}>{customerEmail}</Text></Column>
                            </Row>

                            <Row style={infoRow}>
                                <Column style={labelColumn}><Text style={labelText}>Shipping Address:</Text></Column>
                                <Column style={valueColumn}><Text style={valueText}>{shippingAddress}</Text></Column>
                            </Row>

                            <Row style={infoRow}>
                                <Column style={labelColumn}><Text style={labelText}>Marketing Consent:</Text></Column>
                                <Column style={valueColumn}>
                                    <Text style={valueText}>
                                        {acceptsMarketing ? '🟢 Yes' : '⭕ No'}
                                    </Text>
                                </Column>
                            </Row>

                            <Hr style={hr} />

                            {/* ---- DYNAMIC MATCH SECTION ---- */}
                            {isDirectMatch ? (
                                // --- Renders for a SINGLE, direct match ---
                                <Row style={infoRow}>
                                    <Column style={labelColumn}><Text style={labelText}>Exact Match:</Text></Column>
                                    <Column style={valueColumn}><Text style={valueTextBold}>{bestMatch.fullName}</Text></Column>
                                </Row>
                            ) : (
                                // --- Renders for MULTIPLE, fuzzy matches ---
                                <Section style={purchaseSectionNoBorder}>
                                    <Text style={labelText}>Potential Matches:</Text>
                                    {matches.map((match, index) => {
                                        const matchPercentage = Math.round((1 - match.score) * 100);
                                        return (
                                            <Text key={index} style={productText}>
                                                {match.fullName} <span style={scoreText}>({matchPercentage}% match)</span>
                                            </Text>
                                        );
                                    })}
                                </Section>
                            )}

                            <Row style={infoRow}>
                                <Column style={labelColumn}>
                                    <Text style={labelText}>Category:</Text>
                                </Column>
                                <Column style={valueColumn}>
                                    <Text style={valueText}>{customerCategory.join(", ")}</Text>
                                </Column>
                            </Row>

                            {/* ---- SOCIALS ROW ---- */}
                            {socials && socials.length > 0 && (
                                <Row style={infoRow}>
                                    <Column style={labelColumn}>
                                        <Text style={labelText}>Socials:</Text>
                                    </Column>
                                    <Column style={valueColumn}>
                                        <Text style={valueText}>
                                            {socials.map((social, index) => (
                                                <React.Fragment key={social.link}>
                                                    <Link href={social.link} style={socialLink}>
                                                        {social.platform}
                                                    </Link>
                                                    {/* Add a separator unless it's the last item */}
                                                    {index < socials.length - 1 && ' | '}
                                                </React.Fragment>
                                            ))}
                                        </Text>
                                    </Column>
                                </Row>
                            )}

                            <Hr style={hr} />

                            <Row style={infoRow}>
                                <Column style={labelColumn}>
                                    <Text style={labelText}>Amount:</Text>
                                </Column>
                                <Column style={valueColumn}>
                                    <Text style={valueTextBold}>${spent}</Text>
                                </Column>
                            </Row>

                            <Section style={purchaseSection}>
                                <Text style={labelText}>Purchased Items:</Text>
                                {products.map((product, index) => (
                                    <Text key={index} style={productText}>• {product}</Text>
                                ))}
                            </Section>

                            {notableAchievements && notableAchievements.length > 0 && (
                                <Section style={purchaseSection}>
                                    <Text style={labelText}>Notable Achievements:</Text>
                                    {notableAchievements.map((achievement, index) => (
                                        <Text key={index} style={productText}>• {achievement}</Text>
                                    ))}
                                </Section>
                            )}

                            <Section style={purchaseSection}>
                                <Text style={labelText}>Note:</Text>
                                <Text style={productText}>{note}</Text>
                            </Section>

                            <Text style={timestampText}>
                                Purchase Date: {createdAt}
                            </Text>
                        </Section>

                        {acceptsMarketing &&
                            <>
                                {/* /* Recommendations Section */}
                                <Section style={recommendationsSection}>
                                    <Text style={sectionTitle}>Suggested Next Steps</Text>

                                    <Text style={recommendationText}>
                                        Based on this customer's profile, you may want to consider:
                                    </Text>

                                    <Section style={suggestionCard}>
                                        <Text style={suggestionTitle}>Product Review Request</Text>
                                        <Text style={suggestionDesc}>
                                            Reach out to request feedback on their purchase experience.
                                        </Text>
                                    </Section>

                                    <Section style={suggestionCard}>
                                        <Text style={suggestionTitle}>Partnership Opportunity</Text>
                                        <Text style={suggestionDesc}>
                                            Consider exploring collaboration possibilities.
                                        </Text>
                                    </Section>

                                    <Section style={suggestionCard}>
                                        <Text style={suggestionTitle}>Exclusive Offers</Text>
                                        <Text style={suggestionDesc}>
                                            Provide early access to new products or special collections.
                                        </Text>
                                    </Section>
                                </Section>

                                {/* Best Practices */}
                                <Section style={tipsSection}>
                                    <Text style={sectionTitle}>Best Practices</Text>
                                    <Text style={tipText}>
                                        • Contact customers within 24 hours for better response rates
                                    </Text>
                                    <Text style={tipText}>
                                        • Reference their specific purchase in your message
                                    </Text>
                                    <Text style={tipText}>
                                        • Keep initial outreach brief and personalized
                                    </Text>
                                    <Text style={tipText}>
                                        • Focus on providing value rather than immediate asks
                                    </Text>
                                </Section>

                                {/* Sample Message */}
                                <Section style={sampleSection}>
                                    <Text style={sectionTitle}>Sample Outreach Message</Text>
                                    <Section style={sampleMessage}>
                                        <Text style={sampleText}>
                                            <strong>Subject:</strong> Thank you for your recent purchase
                                        </Text>
                                        <Text style={sampleText}>
                                            Hi {customerName},
                                        </Text>
                                        <Text style={sampleText}>
                                            Thank you for choosing {products.join(", ")} from our collection.
                                            I hope you're enjoying your purchase.
                                        </Text>
                                        <Text style={sampleText}>
                                            I'd love to hear about your experience with the products when you've
                                            had a chance to try them. Your feedback helps us continue improving
                                            our offerings.
                                        </Text>
                                        <Text style={sampleText}>
                                            Best regards,<br />
                                            {userName}
                                        </Text>
                                    </Section>
                                </Section>
                            </>
                        }

                        {/* Single CTA */}
                        <Section style={ctaSection}>
                            <Button
                                style={primaryButton}
                                // href={`mailto:${customerEmail}`}
                                href={mailtoLink}
                            >
                                Contact Customer
                            </Button>
                        </Section>
                    </Section>

                    {/* Simple Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Famous Tracker - Customer Relationship Management
                        </Text>
                        <Text style={unsubscribeText}>
                            <Link style={unsubscribeLink} href="#">Manage email preferences</Link> |
                            <Link style={unsubscribeLink} href="#">Unsubscribe</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: "#f8fafc",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    maxWidth: "630px",
};

const header = {
    background: "linear-gradient(90deg, #ef4444 0%, #f97316 50%, #eab308 100%)",
    padding: "20px",
    textAlign: "center",
    borderBottom: "1px solid #e2e8f0",
};

const headerText = {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "bold",
    margin: "0 0 5px 0",
};

const headerSubText = {
    fontSize: "14px",
    color: "#fed7aa",
    margin: "0",
};

const contentSection = {
    backgroundColor: "#ffffff",
    padding: "30px",
};

const greetingText = { fontSize: "18px", margin: "0 0 15px 0" };

const mainText = {
    fontSize: "16px",
    color: "#475569",
    margin: "0 0 25px 0",
    lineHeight: "1.5",
};

const customerCard = {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    backdropFilter: "blur(10px)",
    borderRadius: "8px",
    padding: "20px",
    margin: "0 0 25px 0",
};

const cardHeader = {
    fontSize: "16px",
    fontWeight: "600",
    // color: "#1e293b",
    margin: "0 0 15px 0",
};

const infoRow = {
    margin: "8px 0",
};

const labelColumn = {
    width: "30%",
};

const valueColumn = {
    width: "70%",
};

const labelText = {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
    margin: "0",
};

const valueText = {
    fontSize: "14px",
    color: "#1e293b",
    margin: "0",
};

const valueTextBold = { ...valueText, fontWeight: "600" };

const socialLink = {
    color: "#007bff",
    textDecoration: "underline",
    fontSize: "14px",
};

const hr = { borderColor: "#e2e8f0", margin: "16px 0" };

const purchaseSection = {
    margin: "15px 0"
};

const productText = {
    fontSize: "14px",
    color: "#1e293b",
    margin: "5px 0 0 0",
    fontWeight: "500",
};

const timestampText = {
    fontSize: "12px",
    color: "#94a3b8",
    margin: "15px 0 0 0",
    paddingTop: "15px",
    borderTop: "1px solid #e2e8f0",
};

const recommendationsSection = {
    margin: "25px 0",
};

const sectionTitle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 15px 0",
};

const recommendationText = {
    fontSize: "14px",
    color: "#475569",
    margin: "0 0 15px 0",
};

const suggestionCard = {
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
    backdropFilter: "blur(10px)",
    borderRadius: "6px",
    padding: "15px",
    margin: "10px 0",
};

const suggestionTitle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 5px 0",
};

const suggestionDesc = {
    fontSize: "13px",
    color: "#64748b",
    margin: "0",
};

const tipsSection = {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    margin: "25px 0",
};

const tipText = {
    fontSize: "14px",
    color: "#475569",
    margin: "8px 0",
    lineHeight: "1.4",
};

const sampleSection = {
    margin: "25px 0",
};

const sampleMessage = {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    margin: "15px 0",
};

const sampleText = {
    fontSize: "14px",
    color: "#374151",
    margin: "0 0 10px 0",
    lineHeight: "1.5",
};

const ctaSection = {
    textAlign: "center",
    margin: "30px 0",
};

const primaryButton = {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
};

const footer = {
    backgroundColor: "#f1f5f9",
    padding: "20px",
    textAlign: "center",
    borderTop: "1px solid #e2e8f0",
};

const footerText = {
    fontSize: "14px",
    color: "#64748b",
    margin: "0 0 10px 0",
};

const footerLinks = {
    margin: "10px 0",
};

const footerLink = {
    color: "#2563eb",
    fontSize: "12px",
    textDecoration: "none",
    margin: "0 5px",
};

const unsubscribeText = {
    margin: "10px 0 0 0",
};

const unsubscribeLink = {
    color: "#64748b",
    fontSize: "11px",
    textDecoration: "none",
    margin: "0 5px",
};

export default AlertEmail;