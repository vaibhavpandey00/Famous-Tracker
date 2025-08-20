import React, { useState, useEffect } from 'react';
import {
    User,
    Crown,
    MapPin,
    Trophy,
    Star,
    Plus,
    X,
    PlusCircle,
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Linkedin,
    Globe,
    Users,
    Award,
    FileText,
    Target,
} from "lucide-react"
import logger from '../utils/logger.client';

// --- Enums from your schema ---
const CATEGORIES = [
    "ATHLETE",
    "INFLUENCER",
    "MUSICIAN",
    "ACTOR",
    "ENTREPRENEUR"
];

const SUBCATEGORIES = [
    // Athlete
    "NFL", "NBA", "WNBA", "MLB", "MLS", "PREMIER_LEAGUE", "NHL", "PGA_TOUR", "FORMULA_1",
    // Influencer
    "INSTAGRAM", "YOUTUBE", "TIKTOK"
];

// --- Initial State for the Form ---
const initialFormData = {
    fullName: "",
    normalizedName: "",
    categories: [],
    subcategories: [],
    socials: [ { platform: "", link: "" } ],
    location: { city: "", state: "", country: "" },
    league: "",
    team: "",
    position: "",
    maxFollowerCount: 0,
    maxFollowerDisplay: "",
    notableAchievements: [ "" ],
    notes: ""
};


const AddGlobalCelebrities = ({ formData, setFormData, onSubmit }) => {

    // --- Effect to auto-generate the normalizedName ---
    useEffect(() => {
        const namePart = formData.fullName.toLowerCase().replace(/\s+/g, '_');
        const cityPart = formData.location.city.toLowerCase().replace(/\s+/g, '_');
        const statePart = formData.location.state.toLowerCase().replace(/\s+/g, '_');

        const parts = [ namePart, cityPart, statePart ].filter(Boolean);
        setFormData(prev => ({ ...prev, normalizedName: parts.join('_') }));

    }, [ formData.fullName, formData.location.city, formData.location.state ]);


    // --- Generic Handlers ---
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [ name ]: type === 'number' ? parseInt(value, 10) || 0 : value }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location, [ name ]: value }
        }));
    };

    // --- Handlers for Enum Checkboxes (Categories/Subcategories) ---
    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        // Ensure the value is a valid enum value before processing
        const enumList = field === 'categories' ? CATEGORIES : SUBCATEGORIES;
        if (!enumList.includes(value)) return;

        setFormData(prev => {
            const currentValues = prev[ field ];
            if (checked) {
                return { ...prev, [ field ]: [ ...currentValues, value ] };
            } else {
                return { ...prev, [ field ]: currentValues.filter(item => item !== value) };
            }
        });
    };

    // --- Handlers for Dynamic Arrays (Socials / Achievements) ---
    const handleDynamicChange = (index, event, field) => {
        const { name, value } = event.target;
        const list = [ ...formData[ field ] ];
        if (typeof list[ index ] === 'object') {
            list[ index ][ name ] = value;
        } else {
            list[ index ] = value;
        }
        setFormData(prev => ({ ...prev, [ field ]: list }));
    };

    const addDynamicItem = (field, item) => {
        setFormData(prev => ({ ...prev, [ field ]: [ ...prev[ field ], item ] }));
    };

    const removeDynamicItem = (index, field) => {
        if (formData[ field ].length <= 1) return; // Always keep at least one item
        const list = formData[ field ].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [ field ]: list }));
    };

    const getSocialIcon = (platform) => {
        const platformLower = platform.toLowerCase()
        if (platformLower.includes("instagram")) return Instagram
        if (platformLower.includes("twitter") || platformLower.includes("x")) return Twitter
        if (platformLower.includes("facebook")) return Facebook
        if (platformLower.includes("youtube")) return Youtube
        if (platformLower.includes("linkedin")) return Linkedin
        return Globe
    }

    // --- Form Submission ---
    const handleSubmit = (e) => {
        e.preventDefault();

        // logger.log("Form Data Submitted:", formData);
        onSubmit();
        setFormData(initialFormData);
    };

    const isAthlete = formData.categories.includes("ATHLETE");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4">
            <div className="max-w-6xl mx-auto">

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                                    <p className="text-sm text-gray-600">Essential celebrity details</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Enter celebrity's full name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="normalizedName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Normalized Name
                                    </label>
                                    <input
                                        type="text"
                                        name="normalizedName"
                                        value={formData.normalizedName}
                                        readOnly
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        placeholder="Auto-generated from full name"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This field is automatically generated</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories & Subcategories */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Categories */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Star className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                                        <p className="text-sm text-gray-600">Select primary categories</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {CATEGORIES.map((cat) => (
                                        <label
                                            key={cat}
                                            className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                value={cat}
                                                checked={formData.categories.includes(cat)}
                                                onChange={(e) => handleCheckboxChange(e, "categories")}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Subcategories */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Target className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Subcategories</h3>
                                        <p className="text-sm text-gray-600">Specific specializations</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {SUBCATEGORIES.map((sub) => (
                                        <label
                                            key={sub}
                                            className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                value={sub}
                                                checked={formData.subcategories.includes(sub)}
                                                onChange={(e) => handleCheckboxChange(e, "subcategories")}
                                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {sub
                                                    .replace("_", " ")
                                                    .toLowerCase()
                                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Social Media Profiles</h3>
                                    <p className="text-sm text-gray-600">Add social media links and handles</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {formData.socials.map((social, index) => {
                                    const IconComponent = getSocialIcon(social.platform)
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                                        >
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="p-2 bg-white rounded-lg border">
                                                    <IconComponent className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="platform"
                                                    placeholder="Platform (e.g., Instagram)"
                                                    value={social.platform}
                                                    onChange={(e) => handleDynamicChange(index, e, "socials")}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <input
                                                type="url"
                                                name="link"
                                                placeholder="https://platform.com/username"
                                                value={social.link}
                                                onChange={(e) => handleDynamicChange(index, e, "socials")}
                                                className="flex-[2] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeDynamicItem(index, "socials")}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )
                                })}
                                <button
                                    type="button"
                                    onClick={() => addDynamicItem("socials", { platform: "", link: "" })}
                                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Social Media Profile</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Location & Athlete Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Location */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <MapPin className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                                        <p className="text-sm text-gray-600">Geographic information</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.location.city}
                                    onChange={handleLocationChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State / Province"
                                    value={formData.location.state}
                                    onChange={handleLocationChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Country *"
                                    value={formData.location.country}
                                    onChange={handleLocationChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Athlete Details */}
                        <div
                            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${isAthlete ? "opacity-100" : "opacity-60"}`}
                        >
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Trophy className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Athlete Details
                                            <span
                                                className={`ml-2 text-xs px-2 py-1 rounded-full ${isAthlete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                            >
                                                {isAthlete ? "Enabled" : "Disabled"}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-gray-600">Sports-specific information</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <input
                                    type="text"
                                    name="league"
                                    placeholder="League (e.g., NBA, NFL)"
                                    value={formData.league}
                                    onChange={handleInputChange}
                                    disabled={!isAthlete}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                                />
                                <input
                                    type="text"
                                    name="team"
                                    placeholder="Team (e.g., Lakers, Patriots)"
                                    value={formData.team}
                                    onChange={handleInputChange}
                                    disabled={!isAthlete}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                                />
                                <input
                                    type="text"
                                    name="position"
                                    placeholder="Position (e.g., Point Guard)"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    disabled={!isAthlete}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notable Achievements */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Award className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Notable Achievements</h3>
                                    <p className="text-sm text-gray-600">Awards, records, and accomplishments</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {formData.notableAchievements.map((ach, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="p-2 bg-white rounded-lg border">
                                            <Award className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="e.g., 10-time world champion, Grammy winner"
                                            value={ach}
                                            onChange={(e) => handleDynamicChange(index, e, "notableAchievements")}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeDynamicItem(index, "notableAchievements")}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addDynamicItem("notableAchievements", "")}
                                    className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Achievement</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Followers & Notes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Followers */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-pink-100 rounded-lg">
                                        <Users className="h-5 w-5 text-pink-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Follower Count</h3>
                                        <p className="text-sm text-gray-600">Social media reach</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Follower Count</label>
                                    <input
                                        type="number"
                                        name="maxFollowerCount"
                                        placeholder="398000000"
                                        value={formData.maxFollowerCount}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Format</label>
                                    <input
                                        type="text"
                                        name="maxFollowerDisplay"
                                        placeholder="398M"
                                        value={formData.maxFollowerDisplay}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        How the follower count should be displayed (e.g., 1.2M, 500K)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <FileText className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
                                        <p className="text-sm text-gray-600">Extra information and context</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="6"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                                    placeholder="Add any additional notes, context, or important information about this celebrity..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-8">
                        <button
                            type="submit"
                            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusCircle className="h-5 w-5 mr-3" />
                            Create Celebrity Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGlobalCelebrities;