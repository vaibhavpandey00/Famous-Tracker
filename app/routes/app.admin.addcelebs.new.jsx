import { json, useLoaderData, useNavigate } from '@remix-run/react';
import { authenticate } from "../shopify.server";
import React, { useEffect, useState } from 'react'
import {
    Page,
    Text,
    Card,
    CalloutCard,
    InlineGrid,
    Divider,
    BlockStack,
    Banner,
    Button,
    InlineStack
} from "@shopify/polaris";
import { TitleBar } from '@shopify/app-bridge-react';
import {
    User,
    Mail,
    MapPin,
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Linkedin,
    Plus,
    Trash2,
    Save,
    X,
    Users,
    ExternalLink,
} from "lucide-react"

export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);

    console.log("Session:", session);

    return json({ session });
}

export const action = async ({ request }) => {
    return null;
}

const socialPlatforms = [
    {
        id: "instagram",
        name: "Instagram",
        icon: Instagram,
        color: "text-pink-600",
        placeholder: "https://instagram.com/username",
    },
    {
        id: "twitter",
        name: "Twitter",
        icon: Twitter,
        color: "text-blue-400",
        placeholder: "https://twitter.com/username",
    },
    {
        id: "facebook",
        name: "Facebook",
        icon: Facebook,
        color: "text-blue-600",
        placeholder: "https://facebook.com/username",
    },
    {
        id: "youtube",
        name: "YouTube",
        icon: Youtube,
        color: "text-red-600",
        placeholder: "https://youtube.com/@username",
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: Linkedin,
        color: "text-blue-700",
        placeholder: "https://linkedin.com/in/username",
    },
]

const newCelebs = ({ onSave, initialData = null }) => {
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    const [ formData, setFormData ] = useState({
        // Name details
        designation: initialData?.designation || "",
        firstName: initialData?.firstName || "",
        middleName: initialData?.middleName || "",
        lastName: initialData?.lastName || "",

        // Contact details
        email: initialData?.email || "",

        // Address details
        flatStreetName: initialData?.flatStreetName || "",
        state: initialData?.state || "",
        country: initialData?.country || "",
        pincode: initialData?.pincode || "",

        // Social media profiles
        socials: initialData?.socials || {
            instagram: { profileLink: "", followerCount: "" },
            twitter: { profileLink: "", followerCount: "" },
            facebook: { profileLink: "", followerCount: "" },
            youtube: { profileLink: "", followerCount: "" },
            linkedin: { profileLink: "", followerCount: "" },
        },

        // Custom social platforms
        customSocials: initialData?.customSocials || [],
    })

    const [ errors, setErrors ] = useState({})
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [ field ]: value,
        }))

        // Clear error when user starts typing
        if (errors[ field ]) {
            setErrors((prev) => ({
                ...prev,
                [ field ]: "",
            }))
        }
    }

    const handleSocialChange = (platform, field, value) => {
        setFormData((prev) => ({
            ...prev,
            socials: {
                ...prev.socials,
                [ platform ]: {
                    ...prev.socials[ platform ],
                    [ field ]: value,
                },
            },
        }))
    }

    const handleCustomSocialChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            customSocials: prev.customSocials.map((social, i) => (i === index ? { ...social, [ field ]: value } : social)),
        }))
    }

    const addCustomSocial = () => {
        setFormData((prev) => ({
            ...prev,
            customSocials: [ ...prev.customSocials, { platform: "", profileLink: "", followerCount: "" } ],
        }))
    }

    const removeCustomSocial = (index) => {
        setFormData((prev) => ({
            ...prev,
            customSocials: prev.customSocials.filter((_, i) => i !== index),
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        // Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required"
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required"
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Address validation
        if (!formData.flatStreetName.trim()) {
            newErrors.flatStreetName = "Address is required"
        }
        if (!formData.state.trim()) {
            newErrors.state = "State is required"
        }
        if (!formData.country.trim()) {
            newErrors.country = "Country is required"
        }
        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required"
        }

        // Social media validation (optional but if provided, should be valid URLs)
        Object.keys(formData.socials).forEach((platform) => {
            const social = formData.socials[ platform ]
            if (social.profileLink && !isValidUrl(social.profileLink)) {
                newErrors[ `${platform}_link` ] = "Please enter a valid URL"
            }
            if (social.followerCount && isNaN(social.followerCount.replace(/[,\s]/g, ""))) {
                newErrors[ `${platform}_followers` ] = "Please enter a valid number"
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isValidUrl = (string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    const formatFollowerCount = (count) => {
        if (!count) return ""
        const num = Number.parseInt(count.replace(/[,\s]/g, ""))
        if (isNaN(num)) return count
        return num.toLocaleString()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
    }


    return (
        <div className="flex flex-col items-center">
            {/* Title bar */}
            <TitleBar title="Famous Tracker Admin" />

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Celebrity Details Form</h2>
                                <p className="text-sm text-gray-600">Enter comprehensive user information</p>
                            </div>
                        </div>
                        <button onClick={() => { navigate('..') }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
                        <div className="p-6 space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <span>Personal Information</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                                        <select
                                            value={formData.designation}
                                            onChange={(e) => handleInputChange("designation", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select</option>
                                            <option value="Mr.">Mr.</option>
                                            <option value="Ms.">Ms.</option>
                                            <option value="Mrs.">Mrs.</option>
                                            <option value="Dr.">Dr.</option>
                                            <option value="Prof.">Prof.</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? "border-red-300" : "border-gray-300"
                                                }`}
                                            placeholder="Enter first name"
                                        />
                                        {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                                        <input
                                            type="text"
                                            value={formData.middleName}
                                            onChange={(e) => handleInputChange("middleName", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter middle name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? "border-red-300" : "border-gray-300"
                                                }`}
                                            placeholder="Enter last name"
                                        />
                                        {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Mail className="h-5 w-5 text-green-600" />
                                    <span>Contact Information</span>
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? "border-red-300" : "border-gray-300"
                                            }`}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <MapPin className="h-5 w-5 text-purple-600" />
                                    <span>Address Information</span>
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Flat/Street Name/Number *</label>
                                        <input
                                            type="text"
                                            value={formData.flatStreetName}
                                            onChange={(e) => handleInputChange("flatStreetName", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.flatStreetName ? "border-red-300" : "border-gray-300"
                                                }`}
                                            placeholder="Enter flat/street name or number"
                                        />
                                        {errors.flatStreetName && <p className="text-red-600 text-xs mt-1">{errors.flatStreetName}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                            <input
                                                type="text"
                                                value={formData.state}
                                                onChange={(e) => handleInputChange("state", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? "border-red-300" : "border-gray-300"
                                                    }`}
                                                placeholder="Enter state"
                                            />
                                            {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                                            <input
                                                type="text"
                                                value={formData.country}
                                                onChange={(e) => handleInputChange("country", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.country ? "border-red-300" : "border-gray-300"
                                                    }`}
                                                placeholder="Enter country"
                                            />
                                            {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                                            <input
                                                type="text"
                                                value={formData.pincode}
                                                onChange={(e) => handleInputChange("pincode", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.pincode ? "border-red-300" : "border-gray-300"
                                                    }`}
                                                placeholder="Enter pincode"
                                            />
                                            {errors.pincode && <p className="text-red-600 text-xs mt-1">{errors.pincode}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Profiles */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-orange-600" />
                                    <span>Social Media Profiles</span>
                                </h3>

                                <div className="space-y-6">
                                    {socialPlatforms.map((platform) => {
                                        const IconComponent = platform.icon
                                        return (
                                            <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <IconComponent className={`h-5 w-5 ${platform.color}`} />
                                                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Link</label>
                                                        <div className="relative">
                                                            <input
                                                                type="url"
                                                                value={formData.socials[ platform.id ]?.profileLink || ""}
                                                                onChange={(e) => handleSocialChange(platform.id, "profileLink", e.target.value)}
                                                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[ `${platform.id}_link` ] ? "border-red-300" : "border-gray-300"
                                                                    }`}
                                                                placeholder={platform.placeholder}
                                                            />
                                                            <ExternalLink className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                        </div>
                                                        {errors[ `${platform.id}_link` ] && (
                                                            <p className="text-red-600 text-xs mt-1">{errors[ `${platform.id}_link` ]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Follower Count</label>
                                                        <div className="relative">
                                                            <Users className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                value={formData.socials[ platform.id ]?.followerCount || ""}
                                                                onChange={(e) => handleSocialChange(platform.id, "followerCount", e.target.value)}
                                                                onBlur={(e) =>
                                                                    handleSocialChange(platform.id, "followerCount", formatFollowerCount(e.target.value))
                                                                }
                                                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[ `${platform.id}_followers` ] ? "border-red-300" : "border-gray-300"
                                                                    }`}
                                                                placeholder="e.g., 10,000 or 1.2M"
                                                            />
                                                        </div>
                                                        {errors[ `${platform.id}_followers` ] && (
                                                            <p className="text-red-600 text-xs mt-1">{errors[ `${platform.id}_followers` ]}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Custom Social Platforms */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-900">Other Platforms</h4>
                                            <button
                                                type="button"
                                                onClick={addCustomSocial}
                                                className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2 transition-colors"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>Add Platform</span>
                                            </button>
                                        </div>

                                        {formData.customSocials.map((social, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h5 className="font-medium text-gray-700">Custom Platform {index + 1}</h5>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCustomSocial(index)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                                                        <input
                                                            type="text"
                                                            value={social.platform}
                                                            onChange={(e) => handleCustomSocialChange(index, "platform", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="e.g., TikTok, Snapchat"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Link</label>
                                                        <input
                                                            type="url"
                                                            value={social.profileLink}
                                                            onChange={(e) => handleCustomSocialChange(index, "profileLink", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="https://platform.com/username"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Follower Count</label>
                                                        <input
                                                            type="text"
                                                            value={social.followerCount}
                                                            onChange={(e) => handleCustomSocialChange(index, "followerCount", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="e.g., 50,000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => { navigate('..') }}
                                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="h-4 w-4" />
                                <span>{isSubmitting ? "Saving..." : "Save Details"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default newCelebs;