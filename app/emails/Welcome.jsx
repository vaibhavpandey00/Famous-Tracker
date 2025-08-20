import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
  Hr,
  Section,
  Row,
  Column,
  Img,
} from "@react-email/components";
import * as React from "react";

const WelcomeEmail = ({
  userName = "Sarah Johnson",
}) => (
  <Html>
    <Head />
    <Preview>🎉 Welcome to the Celebrity Club! Your VIP access is now LIVE</Preview>
    <Body style={main}>
      <Container style={container}>

        {/* Hero Header */}
        <Section style={heroSection}>
          <Text style={heroTitle}>🎉 Welcome to the Celebrity Club!</Text>
          <Text style={heroSubtitle}>Hi {userName}!</Text>
          <Text style={heroDescription}>Your VIP access to celebrity customers is now LIVE</Text>
        </Section>

        {/* Stats Section */}
        <Section style={statsSection}>
          <Row>
            <Column style={statColumn}>
              <Text style={statNumber}>10K+</Text>
              <Text style={statLabel}>Celebrities Tracked</Text>
            </Column>
            <Column style={statColumn}>
              <Text style={statNumber}>99.9%</Text>
              <Text style={statLabel}>Uptime Guarantee</Text>
            </Column>
            <Column style={statColumn}>
              <Text style={statNumber}>24/7</Text>
              <Text style={statLabel}>Expert Support</Text>
            </Column>
            <Column style={statColumn}>
              <Text style={statNumber}>400%</Text>
              <Text style={statLabel}>Average ROI</Text>
            </Column>
          </Row>
        </Section>

        {/* Success Message */}
        <Section style={successSection}>
          <Text style={successTitle}>You're All Set! 🚀</Text>
          <Text style={successDescription}>
            Your Nova-Famous Tracker is now monitoring your store for celebrity purchases
          </Text>
        </Section>

        {/* ---- WHAT HAPPENS NEXT ---- */}
        <Section style={contentSection}>
          <Text style={sectionTitle}>What Happens Next?</Text>
          <Text style={sectionDescription}>
            Our system is now active. Here’s the simple, 3-step process:
          </Text>

          {/* Step 1 */}
          <Section style={stepCard}>
            <Text style={stepNumber}>1</Text>
            <Text style={stepTitle}>We Monitor New Orders</Text>
            <Text style={stepText}>
              Famous Tracker will now automatically check every **new order** placed on your store against our VIP database in real-time.
            </Text>
          </Section>

          {/* Step 2 */}
          <Section style={stepCard}>
            <Text style={stepNumber}>2</Text>
            <Text style={stepTitle}>A Match Is Found</Text>
            <Text style={stepText}>
              When a customer's name and location match a profile, we identify them as a potential high-value customer.
            </Text>
          </Section>

          {/* Step 3 */}
          <Section style={stepCard}>
            <Text style={stepNumber}>3</Text>
            <Text style={stepTitle}>You Get an Instant Alert</Text>
            <Text style={stepText}>
              You'll receive a detailed email notification immediately, giving you the opportunity to create a personalized experience.
            </Text>
          </Section>
        </Section>

        {/* Another spacer */}
        <Hr style={spacer} />

        {/* Main CTA */}
        <Section style={ctaSection}>
          <Text style={ctaTitle}>Ready to Meet Your First Celebrity Customer?</Text>
          <Text style={ctaDesc}>
            Your dashboard is live and ready. Start exploring the power of celebrity customer intelligence!
          </Text>
          <div style={buttonContainer}>
            <Button style={primaryButton} href="https://famoustracker.io/app">
              Open Dashboard
            </Button>
          </div>
        </Section>

        {/* Support */}
        <Section style={supportSection}>
          <Text style={supportText}>
            📧 support@nova-famous.com | 💬 Live Chat Available
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footerTitle}>👑 Nova-Famous Tracker</Text>
          <Text style={footerDesc}>Turning celebrity purchases into marketing gold since 2024</Text>
          <Text style={footerLinks}>
            <Link href="https://famoustracker.io/dashboard" style={footerLink}>Dashboard</Link> |
            <Link href="https://famoustracker.io/help" style={footerLink}> Help Center</Link> |
            <Link href="https://famoustracker.io/unsubscribe" style={footerLink}> Unsubscribe</Link>
          </Text>
        </Section>

      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// Email-compatible styles (inline CSS)
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "630px",
  border: "1px solid #e1e5e9",
  borderRadius: "8px",
};

const heroSection = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "40px 10px",
  textAlign: "center",
  color: "#ffffff",
};

const heroTitle = {
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 10px",
  color: "#ffffff",
};

const heroSubtitle = {
  fontSize: "20px",
  margin: "0 0 5px",
  color: "#ffffff",
};

const heroDescription = {
  fontSize: "16px",
  margin: "0",
  color: "#e6f3ff",
};

const statsSection = {
  backgroundColor: "#1a1a1a",
  padding: "30px 20px",
};

const statColumn = {
  textAlign: "center",
  width: "25%",
};

const statNumber = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0 0 5px",
};

const statLabel = {
  fontSize: "12px",
  color: "#999999",
  margin: "0",
};

const successSection = {
  textAlign: "center",
  padding: "40px 30px",
  backgroundColor: "#f8fffe",
};

const successTitle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 10px",
};

const successDescription = {
  fontSize: "16px",
  color: "#666666",
  margin: "0",
};

const contentSection = {
  padding: '30px',
};

const sectionTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center",
  color: "#1a1a1a",
  margin: "0 0 30px",
};

const sectionDescription = {
  fontSize: '16px',
  color: '#475569',
  margin: '0 0 25px',
  textAlign: 'center',
};

const stepCard = {
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '15px',
  position: 'relative',
};

const stepNumber = {
  position: 'absolute',
  top: '12px',
  left: '15px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#4f46e5',
  backgroundColor: '#e0e7ff',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  lineHeight: '28px',
  textAlign: 'center',
};

const stepTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1e293b',
  margin: '0 0 5px 40px',
};

const stepText = {
  fontSize: '14px',
  color: '#475569',
  lineHeight: '1.6',
  margin: '0 0 0 40px',
};

// This new style creates the vertical gap between cards
const spacer = {
  borderColor: '#e2e8f0',
  margin: "30px 0",
};

const ctaSection = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "40px 30px",
  textAlign: "center",
  color: "#ffffff",
  borderRadius: "8px",
};

const ctaTitle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0 0 10px",
};

const ctaDesc = {
  fontSize: "16px",
  color: "#e6f3ff",
  margin: "0 0 30px",
};

const buttonContainer = {
  textAlign: "center",
};

const primaryButton = {
  backgroundColor: "#ffffff",
  color: "#667eea",
  padding: "14px 28px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 10px 10px",
  display: "inline-block",
};

const supportSection = {
  textAlign: "center",
  padding: "20px",
  backgroundColor: "#f8f9fa",
};

const supportText = {
  fontSize: "14px",
  color: "#666666",
  margin: "0",
};

const footerSection = {
  backgroundColor: "#1a1a1a",
  padding: "30px",
  textAlign: "center",
  color: "#ffffff",
};

const footerTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0 0 10px",
};

const footerDesc = {
  fontSize: "12px",
  color: "#999999",
  margin: "0 0 15px",
};

const footerLinks = {
  fontSize: "12px",
  color: "#999999",
  margin: "0",
};

const footerLink = {
  color: "#667eea",
  textDecoration: "none",
};