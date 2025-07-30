import { Bell, Mail, MessageSquare, Webhook, DollarSign, Users, Save, X } from "lucide-react"

export default function ConfigureAlerts({ formData, setFormData, onClose, handleFormSubmit }) {

    const handleCategoryChange = (category) => {
        setFormData((prev) => ({
            ...prev,
            categories: {
                ...prev.categories,
                [ category ]: !prev.categories[ category ],
            },
        }))
    }

    const handleSave = () => {
        // Handle save logic here
        handleFormSubmit("updateShopRecord");
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Bell className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Configure Alerts</h2>
                            <p className="text-sm text-gray-600">Set up your notification preferences</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Personal Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Alert Channels */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Channels</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">Email Alerts</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.emailAlerts}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, emailAlerts: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <MessageSquare className="h-5 w-5 text-green-600" />
                                    <span className="font-medium">Slack Alerts</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.slackAlerts}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, slackAlerts: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Webhook className="h-5 w-5 text-purple-600" />
                                    <span className="font-medium">Webhook Alerts</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.webhookAlerts}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, webhookAlerts: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Bell className="h-5 w-5 text-orange-600" />
                                    <span className="font-medium">In-App Alerts</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.inAppAlerts}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, inAppAlerts: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Alert Triggers */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Triggers</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Value ($)</label>
                                <div className="relative">
                                    <DollarSign className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        value={formData.minimumOrderValue}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, minimumOrderValue: Number.parseInt(e.target.value) }))
                                        }
                                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Followers</label>
                                <div className="relative">
                                    <Users className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        value={formData.minimumFollowers}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, minimumFollowers: Number.parseInt(e.target.value) }))
                                        }
                                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Categories</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(formData.categories).map(([ category, enabled ]) => (
                                <div key={category} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id={category}
                                        checked={enabled}
                                        onChange={() => handleCategoryChange(category)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={category} className="text-sm font-medium text-gray-700 capitalize">
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alert Frequency */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Frequency</h3>
                        <select
                            value={formData.alertFrequency}
                            onChange={(e) => setFormData((prev) => ({ ...prev, alertFrequency: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="immediate">Immediate</option>
                            <option value="hourly">Hourly Digest</option>
                            <option value="daily">Daily Digest</option>
                            <option value="weekly">Weekly Summary</option>
                        </select>
                    </div>

                    {/* Quiet Hours */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Quiet Hours</h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.quietHours.enabled}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            quietHours: { ...prev.quietHours, enabled: e.target.checked },
                                        }))
                                    }
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        {formData.quietHours.enabled && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        value={formData.quietHours.start}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                quietHours: { ...prev.quietHours, start: e.target.value },
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                    <input
                                        type="time"
                                        value={formData.quietHours.end}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                quietHours: { ...prev.quietHours, end: e.target.value },
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Save className="h-4 w-4" />
                        <span>Save Settings</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
