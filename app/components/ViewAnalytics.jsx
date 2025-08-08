import { useState } from "react"
import { BarChart3, TrendingUp, Users, DollarSign, Download, X, ArrowUp, ArrowDown } from "lucide-react"

const analyticsData = {
    overview: {
        totalMatches: { value: 47, change: 12, changeType: "positive" },
        totalRevenue: { value: 12450, change: 23, changeType: "positive" },
        avgOrderValue: { value: 156.8, change: 8, changeType: "positive" },
        conversionRate: { value: 68, change: -3, changeType: "negative" },
    },
    monthlyData: [
        { month: "Jan", matches: 12, revenue: 2800, orders: 18 },
        { month: "Feb", matches: 15, revenue: 3200, orders: 22 },
        { month: "Mar", matches: 18, revenue: 4100, orders: 28 },
        { month: "Apr", matches: 22, revenue: 5300, orders: 35 },
        { month: "May", matches: 28, revenue: 6800, orders: 42 },
        { month: "Jun", matches: 35, revenue: 8200, orders: 48 },
    ],
    categoryBreakdown: [
        { category: "Celebrity", matches: 18, percentage: 38.3, revenue: 5200 },
        { category: "Influencer", matches: 15, percentage: 31.9, revenue: 3800 },
        { category: "Athlete", matches: 9, percentage: 19.1, revenue: 2100 },
        { category: "Musician", matches: 5, percentage: 10.6, revenue: 1350 },
    ]
}

export default function ViewAnalytics({ onClose }) {
    const [ dateRange, setDateRange ] = useState("30d")
    const [ activeTab, setActiveTab ] = useState("overview")

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    const formatPercentage = (value, changeType) => {
        const color = changeType === "positive" ? "text-green-600" : "text-red-600"
        const icon = changeType === "positive" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        return (
            <div className={`flex items-center space-x-1 ${color}`}>
                {icon}
                <span>{Math.abs(value)}%</span>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
                            <p className="text-sm text-gray-600">Track your celebrity marketing performance</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[ "overview", "trends", "categories" ].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Matches</p>
                                            <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalMatches.value}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="mt-4">
                                        {formatPercentage(
                                            analyticsData.overview.totalMatches.change,
                                            analyticsData.overview.totalMatches.changeType,
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(analyticsData.overview.totalRevenue.value)}
                                            </p>
                                        </div>
                                        <DollarSign className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="mt-4">
                                        {formatPercentage(
                                            analyticsData.overview.totalRevenue.change,
                                            analyticsData.overview.totalRevenue.changeType,
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(analyticsData.overview.avgOrderValue.value)}
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="mt-4">
                                        {formatPercentage(
                                            analyticsData.overview.avgOrderValue.change,
                                            analyticsData.overview.avgOrderValue.changeType,
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Response Rate</p>
                                            <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.conversionRate.value}%</p>
                                        </div>
                                        <BarChart3 className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <div className="mt-4">
                                        {formatPercentage(
                                            analyticsData.overview.conversionRate.change,
                                            analyticsData.overview.conversionRate.changeType,
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Trend Chart */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
                                <div className="h-64 flex items-end justify-between space-x-2">
                                    {analyticsData.monthlyData.map((data, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div className="w-full bg-gray-200 rounded-t relative" style={{ height: "200px" }}>
                                                <div
                                                    className="bg-blue-500 rounded-t absolute bottom-0 w-full"
                                                    style={{ height: `${(data.matches / 35) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 mt-2">{data.month}</span>
                                            <span className="text-xs text-gray-500">{data.matches}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "categories" && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
                                <div className="space-y-4">
                                    {analyticsData.categoryBreakdown.map((category, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Users className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{category.category}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {category.matches} matches • {category.percentage}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{formatCurrency(category.revenue)}</p>
                                                <p className="text-sm text-gray-600">Revenue</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}