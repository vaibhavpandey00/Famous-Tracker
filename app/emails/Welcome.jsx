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
  userName = "Emma Rodriguez",
  setupData = {
    minimumOrderValue: 200,
    minimumFollowers: 50000,
    categories: [ "Celebrity", "Musician" ],
    alertChannels: [ "Email", "Slack" ],
  }
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

        <Section style={setupContainer}>
          {/* Setup Configuration Card */}
          <Section style={setupSection}>
            <Heading style={setupTitle}>⚡ Celebrity Radar is Active</Heading>
            <Row>
              <Column style={setupColumn}>
                <Text style={setupLabel}>Tracking Orders Above</Text>
                <Text style={setupValue}>${setupData.minimumOrderValue}</Text>
              </Column>
              <Column style={setupColumn}>
                <Text style={setupLabel}>Min. Followers</Text>
                <Text style={setupValue}>
                  {setupData.minimumFollowers.toLocaleString()}
                </Text>
              </Column>
            </Row>
            <Text style={categoriesText}>
              Tracking: {setupData.categories.join(", ")}
            </Text>
          </Section>
        </Section>

        {/* Timeline Section */}
        <Section style={timelineSection}>
          <Heading style={sectionTitle}>What Happens Next</Heading>

          <div style={timelineItem}>
            <Text style={timelineTime}>🔵 Right Now</Text>
            <Text style={timelineTitle}>We're scanning your store</Text>
            <Text style={timelineDesc}>Our AI is analyzing your customer database for celebrity matches</Text>
          </div>

          <div style={timelineItem}>
            <Text style={timelineTime}>🟢 Within 24 hours</Text>
            <Text style={timelineTitle}>First celebrity detected</Text>
            <Text style={timelineDesc}>You'll receive your first celebrity purchase alert</Text>
          </div>

          <div style={timelineItem}>
            <Text style={timelineTime}>🟣 This week</Text>
            <Text style={timelineTitle}>Partnership opportunities</Text>
            <Text style={timelineDesc}>Start reaching out to celebrities for collaborations</Text>
          </div>

          <div style={timelineItem}>
            <Text style={timelineTime}>🟠 This month</Text>
            <Text style={timelineTitle}>Measurable results</Text>
            <Text style={timelineDesc}>See increased engagement and revenue from celebrity partnerships</Text>
          </div>
        </Section>


        <Section style={cardsContainer}>

          {/* This Hr is our reliable spacer */}
          <Hr style={spacer} />

          {/* Video Section Card */}
          <Section style={videoSection}>
            <Text style={videoTitle}>
              ▶️ Watch: How to Turn Celebrity Purchases into Gold
            </Text>
            <Text style={videoDesc}>
              Learn the exact strategies our top customers use to convert
              celebrity purchases into partnerships
            </Text>
            <Button
              style={videoButton}
              href="https://famoustracker.io/tutorial"
            >
              ▶️ Watch 3-Minute Tutorial
            </Button>
          </Section>

          {/* Another spacer */}
          <Hr style={spacer} />

          {/* Special Offer Card */}
          <Section style={offerSection}>
            <Text style={offerTitle}>
              🎁 Welcome Bonus: Free Celebrity Outreach Templates
            </Text>
            <Text style={offerDesc}>
              Get our proven email templates that convert 40% of celebrity
              outreach into partnerships
            </Text>
            <Button
              style={offerButton}
              href="https://famoustracker.io/templates"
            >
              Download Templates
            </Button>
          </Section>
        </Section>


        {/* Quick Start Checklist */}
        <Section style={checklistSection}>
          <Heading style={sectionTitle}>Your 5-Minute Quick Start Checklist</Heading>
          <div style={checklistItem}>☐ Check your dashboard for any existing celebrity matches</div>
          <div style={checklistItem}>☐ Set up Slack notifications for your team</div>
          <div style={checklistItem}>☐ Download celebrity outreach templates</div>
          <div style={checklistItem}>☐ Watch the 3-minute tutorial video</div>
          <div style={checklistItem}>☐ Bookmark your analytics dashboard</div>
        </Section>

        {/* Main CTA */}
        <Section style={ctaSection}>
          <Text style={ctaTitle}>Ready to Meet Your First Celebrity Customer?</Text>
          <Text style={ctaDesc}>
            Your dashboard is live and ready. Start exploring the power of celebrity customer intelligence!
          </Text>
          <div style={buttonContainer}>
            <Button style={primaryButton} href="https://famoustracker.io/dashboard">
              📊 Open Dashboard
            </Button>
            <Button style={secondaryButton} href="https://famoustracker.io/demo">
              💬 Get Live Demo
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
  maxWidth: "650px",
  border: "1px solid #e1e5e9",
  borderRadius: "8px",
};

const heroSection = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "40px 30px",
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

const timelineSection = {
  padding: "30px",
  backgroundColor: "#ffffff",
};

const sectionTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center",
  color: "#1a1a1a",
  margin: "0 0 30px",
};

const timelineItem = {
  marginBottom: "20px",
  padding: "15px",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  borderLeft: "4px solid #667eea",
};

const timelineTime = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#667eea",
  margin: "0 0 5px",
};

const timelineTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 5px",
};

const timelineDesc = {
  fontSize: "14px",
  color: "#666666",
  margin: "0",
};

const setupContainer = {
  padding: "40px 30px",
  backgroundColor: "#f8f9fa",
}

const cardsContainer = {
  padding: "40px 30px",
};

// This new style creates the vertical gap between cards
const spacer = {
  borderColor: "transparent",
  borderWidth: "10px 0",
  margin: "0",
};

// I've created a generic 'card' style for consistency
const card = {
  borderRadius: "8px",
  padding: "30px",
  textAlign: "center",
};

// Specific styles for each card
const setupSection = {
  ...card,
  padding: "20px",
  backgroundColor: "#f0f7ff",
  border: "1px solid #b3d9ff",
};

const videoSection = {
  ...card,
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
};

const offerSection = {
  ...card,
  background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
  color: "#ffffff",
};

const setupTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 20px",
};

const setupColumn = {
  width: "50%",
  textAlign: "center",
  padding: "15px",
  backgroundColor: "#ffffff",
  margin: "5px",
  borderRadius: "8px",
  border: "1px solid #e1e5e9",
};

const setupLabel = {
  fontSize: "12px",
  color: "#666666",
  margin: "0 0 5px",
};

const setupValue = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
};

const categoriesText = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#000",
  textAlign: "center",
  margin: "15px 0 0",
  padding: "8px 16px",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  border: "1px solid #b3d9ff",
};

const videoTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0 0 10px",
};

const videoDesc = {
  fontSize: "14px",
  color: "#cccccc",
  margin: "0 0 20px",
};

const videoButton = {
  backgroundColor: "#667eea",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "bold",
};

const offerTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0 0 10px",
};

const offerDesc = {
  fontSize: "14px",
  color: "#ffe6d9",
  margin: "0 0 20px",
};

const offerButton = {
  backgroundColor: "#ffffff",
  color: "#ff6b35",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "bold",
};

const checklistSection = {
  padding: "30px",
  backgroundColor: "#ffffff",
};

const checklistItem = {
  fontSize: "14px",
  color: "#333333",
  margin: "10px 0",
  padding: "12px",
  backgroundColor: "#f8f9fa",
  borderRadius: "6px",
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

const secondaryButton = {
  backgroundColor: "#5a67d8",
  color: "#ffffff",
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