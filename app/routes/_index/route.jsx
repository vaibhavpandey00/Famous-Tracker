import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Crown,
  Database,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { login } from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();
  const [ shopDomain, setShopDomain ] = useState("");

  // UI V01

  const features = [
    {
      icon: Users,
      title: "Real-time Celebrity Detection",
      description:
        "Instantly identify when celebrities, influencers, athletes, or musicians make purchases in your store with our advanced matching algorithm.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Bell,
      title: "Multi-Channel Alert System",
      description:
        "Get notified immediately via email, Slack, SMS, or webhooks so you can reach out to celebrity customers while their purchase is fresh.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics & Insights",
      description:
        "Track celebrity purchase patterns, measure ROI from influencer outreach, and identify trends to optimize your marketing strategy.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Database,
      title: "Comprehensive Celebrity Database",
      description:
        "Access our extensive database of 10,000+ celebrities, influencers, and public figures with real-time updates and verification.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Zap,
      title: "Seamless Integrations",
      description:
        "Connect with Klaviyo, Postscript, Gorgias, and other marketing tools to automate your celebrity outreach campaigns.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description:
        "Your customer data is protected with bank-level encryption, GDPR compliance, and secure API connections to ensure privacy.",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <Star className="h-4 w-4" />
            <span>Shopify App Installation</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Celebrity Purchases Into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Marketing Gold
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Automatically detect when celebrities and influencers shop your store, then get instant alerts to turn those
            purchases into powerful marketing opportunities and authentic partnerships.
          </p>

          {/* Installation Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12 max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Install Nova-Famous Tracker</h3>
                <p className="text-sm text-gray-600">Connect your Shopify store in seconds</p>
              </div>

              <Form method="post" action="/auth/login" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shop Domain</label>
                  <input
                    type="text"
                    name="shop"
                    value={shopDomain}
                    onChange={(e) => setShopDomain(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="my-shop-domain.myshopify.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">e.g: my-shop-domain.myshopify.com</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Install App</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Form>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Secure installation • No credit card required
                </p>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 mb-12">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span>500+ Stores</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Track Celebrity Customers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform gives you all the tools to identify, track, and engage with celebrity customers
              effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-lg mb-4`}
                  >
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ROI Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-16">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-4">Average ROI: 400% in First Month</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            Our customers typically see immediate returns through celebrity partnerships, influencer collaborations, and
            targeted marketing campaigns that convert at 10x higher rates.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm opacity-80">Celebrities Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm opacity-80">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-80">Support</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        {showForm && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Tracking Celebrity Purchases?</h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of Shopify stores already using Nova-Famous Tracker to identify and engage with celebrity
              customers.
            </p>
            <button
              onClick={() => document.querySelector('input[name="shop"]')?.focus()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Install Now - Free Trial</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center text-center gap-5">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Nova-Famous Tracker</span>
            </div>

            {/* Copyright & Propero Credit */}
            <div className="text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} Nova-Famous Tracker. All rights reserved.</p>
              <p>
                Powered by{" "}
                <a
                  href="https://www.propero.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:text-purple-300 transition"
                >
                  Propero
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
