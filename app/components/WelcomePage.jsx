import { useState } from "react"
import {
    User,
    Mail,
    DollarSign,
    Users,
    Star,
    Trophy,
    Music,
    Bell,
    FileText,
    Check,
    ArrowRight,
    ArrowLeft,
    X,
    CheckCircle,
    Sparkles,
} from "lucide-react"

const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Alert Settings", icon: Bell },
    { id: 3, title: "Terms & Conditions", icon: FileText },
    { id: 4, title: "Review & Start", icon: CheckCircle },
]

const alertCategories = [
    {
        id: "celebrity",
        name: "Celebrity",
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        description: "Movie stars, TV personalities, and A-list celebrities",
    },
    {
        id: "influencer",
        name: "Influencer",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Social media influencers and content creators",
    },
    {
        id: "athlete",
        name: "Athlete",
        icon: Trophy,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "Professional athletes and sports personalities",
    },
    {
        id: "musician",
        name: "Musician",
        icon: Music,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        description: "Recording artists, bands, and music industry figures",
    },
]

const WelcomePage = ({ formData, setFormData, onComplete }) => {
    const [ currentStep, setCurrentStep ] = useState(0);
    const [ isOnboarding, setIsOnboarding ] = useState(false);

    const [ errors, setErrors ] = useState({});

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [ field ]: value,
        }))

        // Clear errors
        if (errors[ field ]) {
            setErrors((prev) => ({
                ...prev,
                [ field ]: "",
            }))
        }
    }

    const handleCategoryToggle = (categoryId) => {
        setFormData((prev) => ({
            ...prev,
            categories: {
                ...prev.categories,
                [ categoryId ]: !prev.categories[ categoryId ],
            },
        }))
    }

    const validateStep = (step) => {
        const newErrors = {}

        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = "Name is required"
            if (!formData.email.trim()) {
                newErrors.email = "Email is required"
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = "Please enter a valid email"
            }
        }

        if (step === 2) {
            if (formData.minimumOrderValue < 0) {
                newErrors.minimumOrderValue = "Order value must be positive"
            }
            if (formData.minimumFollowers < 0) {
                newErrors.minimumFollowers = "Follower count must be positive"
            }
            const hasSelectedCategory = Object.values(formData.categories).some((selected) => selected)
            if (!hasSelectedCategory) {
                newErrors.categories = "Please select at least one category"
            }
        }

        if (step === 3) {
            if (!formData.termsAccepted) {
                newErrors.termsAccepted = "You must accept the terms and conditions"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(currentStep + 1)) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1)
    }

    const handleGetStarted = () => {
        if (validateStep(4)) {
            onComplete();
        }
    }

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
        return num.toString()
    }

    if (!isOnboarding) {
        // Welcome Screen
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

                <div className="max-w-4xl mx-auto px-6 py-16">
                    <div className="text-center">
                        {/* Success Animation */}
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🎉 Welcome to Nova-Famous Tracker!</h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Congratulations! Your subscription is active and you're ready to start tracking celebrity purchases. Let's
                            get you set up in just a few quick steps.
                        </p>

                        {/* What's Next */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">What's Next?</h3>
                            <div className="grid md:grid-cols-2 gap-6 text-left">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Personal Information</h4>
                                        <p className="text-sm text-gray-600">Tell us about yourself for personalized alerts</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                        <Bell className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Alert Preferences</h4>
                                        <p className="text-sm text-gray-600">Configure when and how you want to be notified</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                                        <FileText className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Terms & Conditions</h4>
                                        <p className="text-sm text-gray-600">Review and accept our service terms</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                                        <Sparkles className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Start Tracking</h4>
                                        <p className="text-sm text-gray-600">Begin monitoring celebrity purchases immediately</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOnboarding(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-3 text-lg"
                        >
                            <span>Start Setup</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>

                        <p className="text-sm text-gray-500 mt-4">Takes less than 3 minutes to complete</p>
                    </div>
                </div>
            </div>
        )
    }

    // Onboarding Flow
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                        </div>
                        <button
                            onClick={() => setIsOnboarding(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon
                            const isActive = index === currentStep
                            const isCompleted = index < currentStep

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted
                                            ? "bg-green-500 border-green-500 text-white"
                                            : isActive
                                                ? "bg-blue-500 border-blue-500 text-white"
                                                : "bg-white border-gray-300 text-gray-400"
                                            }`}
                                    >
                                        {isCompleted ? <Check className="h-5 w-5" /> : <IconComponent className="h-5 w-5" />}
                                    </div>
                                    <div className="ml-3 hidden sm:block">
                                        <p
                                            className={`text-sm font-medium ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                                                }`}
                                        >
                                            {step.title}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-12 h-0.5 mx-4 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    {currentStep === 0 && (
                        /* Step 1: Personal Information */
                        <div>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <User className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                                <p className="text-gray-600">Tell us about yourself so we can personalize your experience</p>
                            </div>

                            <div className="max-w-md mx-auto space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-300" : "border-gray-300"
                                            }`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? "border-red-300" : "border-gray-300"
                                                }`}
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                    <p className="text-gray-500 text-sm mt-1">We'll use this for alerts and notifications</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        /* Step 2: Alert Settings */
                        <div>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <Bell className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Alert Triggers</h2>
                                <p className="text-gray-600">Configure when you want to be notified about celebrity purchases</p>
                            </div>

                            <div className="space-y-8">
                                {/* Alert Thresholds */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Value ($)</label>
                                        <div className="relative">
                                            <DollarSign className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                value={formData.minimumOrderValue}
                                                onChange={(e) => handleInputChange("minimumOrderValue", Number.parseInt(e.target.value))}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.minimumOrderValue ? "border-red-300" : "border-gray-300"
                                                    }`}
                                                placeholder="100"
                                                min="0"
                                            />
                                        </div>
                                        {errors.minimumOrderValue && (
                                            <p className="text-red-600 text-sm mt-1">{errors.minimumOrderValue}</p>
                                        )}
                                        <p className="text-gray-500 text-sm mt-1">Only alert for orders above this amount</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Followers</label>
                                        <div className="relative">
                                            <Users className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                value={formData.minimumFollowers}
                                                onChange={(e) => handleInputChange("minimumFollowers", Number.parseInt(e.target.value))}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.minimumFollowers ? "border-red-300" : "border-gray-300"
                                                    }`}
                                                placeholder="10000"
                                                min="0"
                                            />
                                        </div>
                                        {errors.minimumFollowers && <p className="text-red-600 text-sm mt-1">{errors.minimumFollowers}</p>}
                                        <p className="text-gray-500 text-sm mt-1">Only alert for influencers with this many followers</p>
                                    </div>
                                </div>

                                {/* Alert Categories */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Categories</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {alertCategories.map((category) => {
                                            const IconComponent = category.icon
                                            const isSelected = formData.categories[ category.id ]

                                            return (
                                                <div
                                                    key={category.id}
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${isSelected
                                                        ? `${category.borderColor} ${category.bgColor}`
                                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                                        }`}
                                                    onClick={() => handleCategoryToggle(category.id)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start space-x-3">
                                                            <IconComponent className={`h-6 w-6 ${isSelected ? category.color : "text-gray-400"}`} />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{category.name}</h4>
                                                                <p className="text-sm text-gray-600">{category.description}</p>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? `border-blue-500 bg-blue-500` : "border-gray-300"
                                                                }`}
                                                        >
                                                            {isSelected && <Check className="h-4 w-4 text-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {errors.categories && <p className="text-red-600 text-sm mt-2">{errors.categories}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        /* Step 3: Terms & Conditions */
                        <div>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                                    <FileText className="h-8 w-8 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms & Conditions</h2>
                                <p className="text-gray-600">Please review and accept our terms of service</p>
                            </div>

                            <div className="max-w-3xl mx-auto">
                                <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto border border-gray-200 mb-6">
                                    <div className="prose prose-sm max-w-none">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova-Famous Tracker Terms of Service</h3>

                                        <h4 className="font-medium text-gray-900 mb-2">1. Service Description</h4>
                                        <p className="text-gray-700 mb-4">
                                            Nova-Famous Tracker provides celebrity and influencer purchase detection services for e-commerce
                                            stores. Our service monitors customer data to identify potential celebrity purchases and provides
                                            real-time alerts.
                                        </p>

                                        <h4 className="font-medium text-gray-900 mb-2">2. Data Privacy & Security</h4>
                                        <p className="text-gray-700 mb-4">
                                            We are committed to protecting your customer data. All data is encrypted in transit and at rest.
                                            We comply with GDPR, CCPA, and other applicable privacy regulations. Customer data is never shared
                                            with third parties without explicit consent.
                                        </p>

                                        <h4 className="font-medium text-gray-900 mb-2">3. Service Availability</h4>
                                        <p className="text-gray-700 mb-4">
                                            We strive to maintain 99.9% uptime for our service. Scheduled maintenance will be announced in
                                            advance. We are not liable for any business losses due to service interruptions.
                                        </p>

                                        <h4 className="font-medium text-gray-900 mb-2">4. Acceptable Use</h4>
                                        <p className="text-gray-700 mb-4">
                                            You agree to use our service only for legitimate business purposes. You will not attempt to
                                            reverse engineer, hack, or abuse our service. Any misuse may result in immediate account
                                            termination.
                                        </p>

                                        <h4 className="font-medium text-gray-900 mb-2">5. Billing & Cancellation</h4>
                                        <p className="text-gray-700 mb-4">
                                            Subscription fees are billed monthly or annually as selected. You may cancel your subscription at
                                            any time. Refunds are provided on a pro-rated basis for annual subscriptions cancelled within 30
                                            days.
                                        </p>

                                        <h4 className="font-medium text-gray-900 mb-2">6. Limitation of Liability</h4>
                                        <p className="text-gray-700 mb-4">
                                            Our liability is limited to the amount paid for our service in the preceding 12 months. We are not
                                            responsible for any indirect, incidental, or consequential damages.
                                        </p>

                                        <h4 className="font-medium text-gray-900 mb-2">7. Changes to Terms</h4>
                                        <p className="text-gray-700 mb-4">
                                            We may update these terms from time to time. Users will be notified of significant changes via
                                            email. Continued use of the service constitutes acceptance of updated terms.
                                        </p>

                                        <p className="text-gray-600 text-sm mt-6">
                                            Last updated: January 2024
                                            <br />
                                            For questions, contact us at legal@nova-famous.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={formData.termsAccepted}
                                        onChange={(e) => handleInputChange("termsAccepted", e.target.checked)}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-700">
                                        I have read and agree to the <span className="font-medium text-blue-600">Terms & Conditions</span>{" "}
                                        and <span className="font-medium text-blue-600">Privacy Policy</span>
                                    </label>
                                </div>
                                {errors.termsAccepted && <p className="text-red-600 text-sm mt-2">{errors.termsAccepted}</p>}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        /* Step 4: Review & Start */
                        <div>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                                    <CheckCircle className="h-8 w-8 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Settings</h2>
                                <p className="text-gray-600">Everything looks good! Review your configuration and start tracking</p>
                            </div>

                            <div className="max-w-2xl mx-auto space-y-6">
                                {/* Personal Info Summary */}
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        <span>Personal Information</span>
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Name:</span>
                                            <span className="ml-2 font-medium text-gray-900">{formData.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Email:</span>
                                            <span className="ml-2 font-medium text-gray-900">{formData.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Alert Settings Summary */}
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                        <Bell className="h-5 w-5 text-green-600" />
                                        <span>Alert Configuration</span>
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-600">Minimum Order Value:</span>
                                                <span className="ml-2 font-medium text-gray-900">${formData.minimumOrderValue}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Minimum Followers:</span>
                                                <span className="ml-2 font-medium text-gray-900">
                                                    {formatNumber(formData.minimumFollowers)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Alert Categories:</span>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {Object.entries(formData.categories)
                                                    .filter(([ _, selected ]) => selected)
                                                    .map(([ category, _ ]) => {
                                                        const categoryData = alertCategories.find((c) => c.id === category)
                                                        return (
                                                            <span
                                                                key={category}
                                                                className={`px-3 py-1 rounded-full text-xs font-medium ${categoryData.bgColor} ${categoryData.color} border ${categoryData.borderColor}`}
                                                            >
                                                                {categoryData.name}
                                                            </span>
                                                        )
                                                    })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms Summary */}
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-purple-600" />
                                        <span>Terms & Conditions</span>
                                    </h3>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <span className="text-gray-700">Terms and conditions accepted</span>
                                    </div>
                                </div>

                                {/* Get Started CTA */}
                                <div className="text-center pt-6">
                                    <button
                                        onClick={handleGetStarted}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-3 text-lg"
                                    >
                                        <Sparkles className="h-6 w-6" />
                                        <span>Get Started</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                    <p className="text-sm text-gray-500 mt-3">
                                        You're all set! Start tracking celebrity purchases immediately.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors ${currentStep === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Previous</span>
                        </button>

                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <span>Continue</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage;