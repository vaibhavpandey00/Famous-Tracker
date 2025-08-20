import { useState } from "react"
import { Database, Search, Plus, Edit, Trash2, X, Star, Users, TrendingUp } from "lucide-react"
import { useNavigate } from "@remix-run/react";

const dummyInfluencers = [
    {
        id: 1,
        name: "Emma Stone",
        email: "e.stone@email.com",
        category: "Celebrity",
        platform: "Instagram",
        followers: "2.1M",
        engagementRate: "3.2%",
        verified: true,
        lastUpdated: "2024-01-15",
        status: "active",
    },
    {
        id: 2,
        name: "Marcus Johnson",
        email: "mjohnson@sports.com",
        category: "Athlete",
        platform: "TikTok",
        followers: "850K",
        engagementRate: "5.8%",
        verified: true,
        lastUpdated: "2024-01-14",
        status: "active",
    },
    {
        id: 3,
        name: "Sarah Chen",
        email: "sarahc@influence.co",
        category: "Influencer",
        platform: "YouTube",
        followers: "1.3M",
        engagementRate: "4.1%",
        verified: false,
        lastUpdated: "2024-01-13",
        status: "pending",
    },
    {
        id: 4,
        name: "David Rodriguez",
        email: "d.rodriguez@music.com",
        category: "Musician",
        platform: "Instagram",
        followers: "3.8M",
        engagementRate: "2.9%",
        verified: true,
        lastUpdated: "2024-01-12",
        status: "active",
    },
]

export default function ManageDatabase({ onClose }) {
    const [ searchTerm, setSearchTerm ] = useState("");
    const navigate = useNavigate();
    const [ filterCategory, setFilterCategory ] = useState("all")
    const [ filterStatus, setFilterStatus ] = useState("all")
    const [ selectedInfluencers, setSelectedInfluencers ] = useState([])
    const [ showAddForm, setShowAddForm ] = useState(false)

    const filteredInfluencers = dummyInfluencers.filter((influencer) => {
        const matchesSearch =
            influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            influencer.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === "all" || influencer.category.toLowerCase() === filterCategory
        const matchesStatus = filterStatus === "all" || influencer.status === filterStatus
        return matchesSearch && matchesCategory && matchesStatus
    })

    const handleSelectInfluencer = (id) => {
        setSelectedInfluencers((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [ ...prev, id ],
        )
    }

    const handleSelectAll = () => {
        if (selectedInfluencers.length === filteredInfluencers.length) {
            setSelectedInfluencers([])
        } else {
            setSelectedInfluencers(filteredInfluencers.map((inf) => inf.id))
        }
    }

    const getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case "celebrity":
                return <Star className="h-4 w-4 text-yellow-500" />
            case "athlete":
                return <TrendingUp className="h-4 w-4 text-green-500" />
            case "influencer":
                return <Users className="h-4 w-4 text-blue-500" />
            case "musician":
                return <Star className="h-4 w-4 text-purple-500" />
            default:
                return <Users className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 border-green-200"
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "inactive":
                return "bg-gray-100 text-gray-800 border-gray-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Database className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Manage Database</h2>
                            <p className="text-sm text-gray-600">Manage your custom celebrity and influencer database</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                />
                            </div>
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
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate("/app/admin/addcelebs/new")}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add New</span>
                            </button>
                        </div>
                    </div>

                    {selectedInfluencers.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-blue-900">{selectedInfluencers.length} selected</span>
                            <div className="flex items-center space-x-2">
                                <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded transition-colors">
                                    Delete Selected
                                </button>
                                <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                    Bulk Edit
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedInfluencers.length === filteredInfluencers.length && filteredInfluencers.length > 0
                                        }
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Followers
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Engagement
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInfluencers.map((influencer) => (
                                <tr key={influencer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedInfluencers.includes(influencer.id)}
                                            onChange={() => handleSelectInfluencer(influencer.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-gray-900">{influencer.name}</span>
                                                {influencer.verified && (
                                                    <div className="p-1 bg-blue-100 rounded-full">
                                                        <Star className="h-3 w-3 text-blue-600 fill-current" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">{influencer.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {getCategoryIcon(influencer.category)}
                                            <span className="text-sm text-gray-900">{influencer.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{influencer.followers}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{influencer.engagementRate}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(influencer.status)}`}
                                        >
                                            {influencer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Showing {filteredInfluencers.length} of {dummyInfluencers.length} entries
                        </span>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                Previous
                            </button>
                            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">1</button>
                            <button className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                2
                            </button>
                            <button className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
