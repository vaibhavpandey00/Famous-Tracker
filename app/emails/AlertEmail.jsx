
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
} from "@react-email/components";

const AlertEmail = ({
    userName = "Sarah Johnson",
    customerCategory = [ "Celebrity", "Artist" ],
    customerName = "Emma Stone",
    fullName = "Emma Stone",
    customerEmail = "e.stone@email.com",
    products = [ "Organic Face Serum", "Vitamin C Cleanser Bundle" ],
    spent = 156.99,
    createdAt = "August 5, 2025 at 05:17 PM",
    note = "This customer falls into the celebrity category, which may present partnership opportunities.",
}) => {
    return (
        <Html>
            <Head />
            <Preview>New purchase from {customerName} - Famous Tracker notification</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Simple Header */}
                    <Section style={header}>
                        <Text style={headerText}>
                            Famous Tracker
                        </Text>
                        <Text style={headerSubText}>
                            Purchase Notification
                        </Text>
                    </Section>

                    {/* Main Content */}
                    <Section style={contentSection}>
                        <Text style={greetingText}>
                            Hello {userName},
                        </Text>
                        <Text style={mainText}>
                            You have received a new purchase notification. Here are the details:
                        </Text>

                        {/* Customer Information Card */}
                        <Section style={customerCard}>
                            <Text style={cardHeader}>Customer Information</Text>

                            <Row style={infoRow}>
                                <Column style={labelColumn}>
                                    <Text style={labelText}>Name:</Text>
                                </Column>
                                <Column style={valueColumn}>
                                    <Text style={valueText}>{customerName}</Text>
                                </Column>
                            </Row>

                            <Row style={infoRow}>
                                <Column style={labelColumn}>
                                    <Text style={labelText}>Matches with:</Text>
                                </Column>
                                <Column style={valueColumn}>
                                    <Text style={valueText}>{fullName}</Text>
                                </Column>
                            </Row>

                            <Row style={infoRow}>
                                <Column style={labelColumn}>
                                    <Text style={labelText}>Email:</Text>
                                </Column>
                                <Column style={valueColumn}>
                                    <Text style={valueText}>{customerEmail}</Text>
                                </Column>
                            </Row>

                            <Row style={infoRow}>
                                <Column style={labelColumn}>
                                    <Text style={labelText}>Category:</Text>
                                </Column>
                                <Column style={valueColumn}>
                                    <Text style={valueText}>{customerCategory.join(", ")}</Text>
                                </Column>
                            </Row>

                            <Row style={infoRow}>
                                <Column style={labelColumn}>
                                    <Text style={labelText}>Amount:</Text>
                                </Column>
                                <Column style={valueColumn}>
                                    <Text style={valueText}>${spent}</Text>
                                </Column>
                            </Row>

                            <Section style={purchaseSection}>
                                <Text style={labelText}>Purchase:</Text>
                                {/* <Text style={productText}>{product}</Text> */}
                                {products.map((product, index) => (
                                    <Text key={index} style={productText}>{index + 1}. {product.slice(0, 45) + (product.length > 10 ? "..." : "")}</Text>
                                ))}
                            </Section>

                            <Section style={purchaseSection}>
                                <Text style={labelText}>Note:</Text>
                                {/* <Text style={productText}>{product}</Text> */}
                                <Text style={productText}>{note}</Text>
                            </Section>

                            <Text style={timestampText}>
                                Purchase Date: {createdAt}
                            </Text>
                        </Section>

                        {/* Recommendations Section */}
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

                        {/* Single CTA */}
                        <Section style={ctaSection}>
                            <Button style={primaryButton} href={`mailto:${customerEmail}`}>
                                Contact Customer
                            </Button>
                        </Section>
                    </Section>

                    {/* Simple Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Famous Tracker - Customer Relationship Management
                        </Text>
                        <Text style={footerLinks}>
                            <Link style={footerLink} href="https://famoustracker.io">Dashboard</Link> |
                            <Link style={footerLink} href="https://famoustracker.io">Settings</Link> |
                            <Link style={footerLink} href="mailto:support@famoustracker.io">Support</Link>
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

const greetingText = {
    fontSize: "18px",
    color: "#1e293b",
    margin: "0 0 15px 0",
};

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
    color: "#1e293b",
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

const purchaseSection = {
    margin: "15px 0",
    paddingTop: "15px",
    borderTop: "1px solid #e2e8f0",
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