import { useState } from "react"
import {
    Bell,
    TrendingUp,
    Users,
    DollarSign,
    Search,
    ExternalLink,
    Mail,
    MessageCircle,
    Gift,
    AlertCircle,
    CheckCircle,
    Clock,
} from "lucide-react"
import QuickActions from "./QuickActions"
import ErrorComponents from "./ErrorComponents"
import ProblematicComponent from "./ProblematicComponent"

// Dummy data
// const recentMatches = [
//     {
//         id: 1,
//         customerName: "Emma Stone",
//         email: "e.stone@email.com",
//         orderValue: 156.99,
//         platform: "Instagram",
//         followers: "2.1M",
//         engagementRate: "3.2%",
//         category: "Celebrity",
//         matchTime: "2 minutes ago",
//         status: "new",
//         profileImage: "/",
//         orderItems: [ "Organic Face Serum", "Vitamin C Cleanser" ],
//     },
//     {
//         id: 2,
//         customerName: "Marcus Johnson",
//         email: "mjohnson@sports.com",
//         orderValue: 89.5,
//         platform: "TikTok",
//         followers: "850K",
//         engagementRate: "5.8%",
//         category: "Athlete",
//         matchTime: "15 minutes ago",
//         status: "contacted",
//         profileImage: "/",
//         orderItems: [ "Protein Powder", "Recovery Drink" ],
//     },
//     {
//         id: 3,
//         customerName: "Sarah Chen",
//         email: "sarahc@influence.co",
//         orderValue: 234.75,
//         platform: "YouTube",
//         followers: "1.3M",
//         engagementRate: "4.1%",
//         category: "Influencer",
//         matchTime: "1 hour ago",
//         status: "processed",
//         profileImage: "/",
//         orderItems: [ "Skincare Bundle", "Hair Treatment", "Supplements" ],
//     },
//     {
//         id: 4,
//         customerName: "David Rodriguez",
//         email: "d.rodriguez@music.com",
//         orderValue: 67.25,
//         platform: "Instagram",
//         followers: "3.8M",
//         engagementRate: "2.9%",
//         category: "Musician",
//         matchTime: "3 hours ago",
//         status: "new",
//         profileImage: "/",
//         orderItems: [ "Concert Tee", "Accessories" ],
//     },
// ]

// const stats = [
//     {
//         title: "Total Matches",
//         value: "47",
//         change: "+12%",
//         changeType: "positive",
//         icon: Users,
//         period: "This month",
//     },
//     {
//         title: "Revenue from Influencers",
//         value: "$12,450",
//         change: "+23%",
//         changeType: "positive",
//         icon: DollarSign,
//         period: "This month",
//     },
//     {
//         title: "Avg. Order Value",
//         value: "$156.80",
//         change: "+8%",
//         changeType: "positive",
//         icon: TrendingUp,
//         period: "Celebrity orders",
//     }
// ]

const iconMap = {
    totalMatches: Users,
    revenue: DollarSign,
    avgOrderValue: TrendingUp,
};

export default function HomeDashboard({ formData, setFormData, stats, recentMatches, handleFormSubmit }) {
    const [ filterCategory, setFilterCategory ] = useState("all");
    const [ searchTerm, setSearchTerm ] = useState("");

    const filteredMatches = recentMatches?.filter((match) => {
        const matchesCategory = filterCategory === "all" || match.category.toLowerCase() === filterCategory
        const matchesSearch =
            match.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.email.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Helper functions to get status icon
    // const getStatusIcon = (status) => {
    //     switch (status) {
    //         case "new":
    //             return <AlertCircle className="h-4 w-4 text-orange-500" />
    //         case "contacted":
    //             return <Clock className="h-4 w-4 text-blue-500" />
    //         case "processed":
    //             return <CheckCircle className="h-4 w-4 text-green-500" />
    //         default:
    //             return <AlertCircle className="h-4 w-4 text-gray-500" />
    //     }
    // }

    const getStatusColor = (status) => {
        switch (status) {
            case "new":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "contacted":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "processed":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <div className="min-h-screen w-[80%] bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Famous Tracker</h1>
                            <p className="text-gray-600 mt-1">Monitor celebrity and influencer purchases in real-time</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                                <Bell className="h-4 w-4" />
                                <span>Alert Settings</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <ErrorComponents name={"Stats Grid"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {stats?.map((stat, index) => {
                            const IconComponent = iconMap[ stat.iconId ];

                            return (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            {IconComponent && <IconComponent className="h-6 w-6 text-blue-600" />}
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <span
                                            className={`text-sm font-medium ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                                                }`}
                                        >
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">{stat.period}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ErrorComponents>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Matches */}
                    <div className="lg:col-span-2">
                        <ErrorComponents name={"Recent Matches"}>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900 mx-3">Recent Celebrity Matches</h2>
                                        <div className="flex items-center space-x-3">
                                            {/* <div className="relative">
                                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search matches..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div> */}
                                            <select
                                                value={filterCategory}
                                                onChange={(e) => setFilterCategory(e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="all">All Categories</option>
                                                <option value="celebrity">Celebrity</option>
                                                <option value="athlete">Athlete</option>
                                                <option value="influencer">Influencer</option>
                                                <option value="musician">Musician</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {filteredMatches.length > 0 && filteredMatches.map((match) => (
                                        <div key={match.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <h3 className="font-semibold text-gray-900 text-lg">{match.customerName}</h3>
                                                            <span
                                                                className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(match.status)}`}
                                                            >
                                                                {match.status}
                                                            </span>
                                                        </div>
                                                        {/* <p className="text-sm text-gray-600">{match.email}</p> */}
                                                        <div className="flex items-center space-x-4 mt-2">
                                                            <span className="text-sm text-gray-500">
                                                                <strong>${match.orderValue}</strong> • {match.matchTime}
                                                            </span>
                                                            <span className="text-sm text-blue-600 font-medium">
                                                                {match.platform} • {match.followers} followers
                                                            </span>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="flex flex-col text-sm text-gray-600">
                                                                <strong>Items:</strong>
                                                                {match.orderItems.map((item, index) => (
                                                                    <span key={index}>
                                                                        {index + 1}. {item.slice(0, 50) + (item.length > 50 ? "..." : "")}
                                                                    </span>
                                                                ))}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Followup Actions */}
                                                {/* <div className="flex items-center space-x-2">
                                                    {getStatusIcon(match.status)}
                                                    <div className="flex items-center space-x-1">
                                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <Mail className="h-4 w-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                            <MessageCircle className="h-4 w-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                            <Gift className="h-4 w-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 border-t border-gray-200">
                                    <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
                                        Load more
                                    </button>
                                </div>
                            </div>
                        </ErrorComponents>
                    </div>


                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <ErrorComponents name="Quick Actions">
                            <QuickActions formData={formData} setFormData={setFormData} handleFormSubmit={handleFormSubmit} />
                        </ErrorComponents>

                        {/* Integration Status */}
                        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <ErrorComponents name="Integration Status">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h3>
                                <div className="space-y-3">
                                    {integrations.map((integration, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">{integration.name}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className={`h-2 w-2 rounded-full ${integration.color}`}></div>
                                                <span
                                                    className={`text-xs font-medium ${integration.status === "connected" ? "text-green-600" : "text-gray-500"
                                                        }`}
                                                >
                                                    {integration.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ErrorComponents>
                        </div> */}

                        {/* Recent Activity */}
                        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <ErrorComponents name="Recent Activity">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="p-1 bg-green-100 rounded-full">
                                            <CheckCircle className="h-3 w-3 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Emma Stone contacted</p>
                                            <p className="text-xs text-gray-500">2 minutes ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-1 bg-blue-100 rounded-full">
                                            <Bell className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">New match detected</p>
                                            <p className="text-xs text-gray-500">15 minutes ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-1 bg-purple-100 rounded-full">
                                            <Gift className="h-3 w-3 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Coupon sent to Marcus</p>
                                            <p className="text-xs text-gray-500">1 hour ago</p>
                                        </div>
                                    </div>
                                </div>
                            </ErrorComponents>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
