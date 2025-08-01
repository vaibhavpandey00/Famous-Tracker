import { useState } from "react"
import {
    Check,
    Star,
    Users,
    Bell,
    BarChart3,
    Database,
    Zap,
    Shield,
    ArrowRight,
    Crown,
    TrendingUp,
    Mail,
    MessageSquare,
} from "lucide-react"
import { useNavigate } from "@remix-run/react"

const features = [
    {
        icon: Users,
        title: "Unlimited Celebrity Tracking",
        description: "Monitor purchases from celebrities, influencers, athletes, and musicians",
    },
    {
        icon: Bell,
        title: "Real-time Alerts",
        description: "Instant notifications via email, Slack, SMS, and webhooks",
    },
    {
        icon: Database,
        title: "Comprehensive Database",
        description: "Access to our extensive celebrity and influencer database",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Detailed insights, trends, and performance metrics",
    },
    {
        icon: Zap,
        title: "Multiple Integrations",
        description: "Connect with Klaviyo, Postscript, Gorgias, and more",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-level security with data encryption and compliance",
    },
    {
        icon: Mail,
        title: "Automated Outreach",
        description: "Smart email campaigns and follow-up sequences",
    },
    {
        icon: MessageSquare,
        title: "Priority Support",
        description: "24/7 dedicated support with 1-hour response time",
    },
]

const faqs = [
    {
        question: "How does the celebrity detection work?",
        answer:
            "Our advanced algorithm cross-references customer data with our comprehensive database of celebrities, influencers, athletes, and musicians, providing real-time matches with high accuracy.",
    },
    {
        question: "What integrations are supported?",
        answer:
            "We support major platforms including Klaviyo, Slack, Postscript, Gorgias, webhooks, and custom API integrations. New integrations are added regularly based on customer requests.",
    },
    {
        question: "How quickly do I receive alerts?",
        answer:
            "Alerts are sent in real-time, typically within 30 seconds of a celebrity purchase. You can customize alert frequency and quiet hours to match your workflow.",
    },
    {
        question: "Is there a setup fee or contract?",
        answer:
            "No setup fees or long-term contracts required. You can start immediately and cancel anytime. Our team provides free onboarding assistance.",
    },
    {
        question: "What kind of support do you provide?",
        answer:
            "All plans include 24/7 priority support with dedicated account management, live chat, email support, and comprehensive documentation.",
    },
]

export default function PricingPage() {
    const [ expandedFaq, setExpandedFaq ] = useState(null);
    const navigate = useNavigate();

    const handleSubscribe = () => {
        // Handle subscription logic here
        console.log("Subscribing...")
        navigate("/app/subscribe");
    }

    const monthlyPrice = 10
    const currentPrice = monthlyPrice

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index)
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">

            <div className="min-h-screen w-[70%] bg-gray-50">

                <div className="max-w-8xl mx-auto px-6 py-12 border">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Everything you need to track celebrity purchases, engage with influencers, and grow your business. No hidden
                            fees, no complicated tiers.
                        </p>
                    </div>

                    {/* Main Pricing Card */}
                    <div className="max-w-lg mx-auto mb-16">
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 relative overflow-hidden">
                            {/* Popular Badge */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                                    ⭐ Most Popular
                                </div>
                            </div>

                            <div className="p-8 pt-12 mt-4">
                                {/* Plan Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                        <Crown className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Plan</h3>
                                    <p className="text-gray-600">Perfect for growing e-commerce businesses</p>
                                </div>

                                {/* Pricing */}
                                <div className="text-center mb-8">
                                    <div className="flex items-baseline justify-center space-x-2">
                                        <span className="text-5xl font-bold text-gray-900">${currentPrice}</span>
                                        <span className="text-gray-600">/month</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">Billed monthly</p>
                                </div>

                                {/* CTA Button */}
                                <a>
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 mb-6" onClick={handleSubscribe}>
                                        <span>Subscribe Now</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </a>

                                <p className="text-center text-sm text-gray-500 mb-8">
                                    No credit card required • Cancel anytime • Full access during trial
                                </p>

                                {/* Key Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">10K+</div>
                                        <div className="text-xs text-gray-600">Celebrities Tracked</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">99.9%</div>
                                        <div className="text-xs text-gray-600">Uptime</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">24/7</div>
                                        <div className="text-xs text-gray-600">Support</div>
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 text-center mb-4">Everything included:</h4>
                                    {features.map((feature, index) => {
                                        const IconComponent = feature.icon
                                        return (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <IconComponent className="h-4 w-4 text-blue-600" />
                                                        <span className="font-medium text-gray-900 text-sm">{feature.title}</span>
                                                    </div>
                                                    <p className="text-gray-600 text-xs">{feature.description}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Value Proposition */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16 text-white text-center">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-80" />
                        <h3 className="text-2xl font-bold mb-4">Average ROI: 400% in First Month</h3>
                        <p className="text-blue-100 max-w-2xl mx-auto">
                            Our customers typically see immediate returns through celebrity partnerships, influencer collaborations, and
                            targeted marketing campaigns.
                        </p>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
                        <div className="max-w-3xl mx-auto">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-lg border border-gray-200 mb-4">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900">{faq.question}</span>
                                        <div className={`transform transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}>
                                            <ArrowRight className="h-5 w-5 text-gray-400 rotate-90" />
                                        </div>
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="px-6 pb-4">
                                            <p className="text-gray-600">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>


    )
}
