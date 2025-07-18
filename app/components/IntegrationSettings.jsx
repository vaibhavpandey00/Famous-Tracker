import { useState } from "react"
import { Settings, Check, X, Key, Webhook, Mail, MessageSquare, Zap, Save } from "lucide-react"

const integrations = [
    {
        id: "klaviyo",
        name: "Klaviyo",
        description: "Email marketing automation",
        icon: Mail,
        status: "connected",
        color: "bg-orange-500",
        settings: {
            apiKey: "kl_***************",
            listId: "WzXyAb",
            autoTrigger: true,
            webhookUrl: "https://a.klaviyo.com/api/track",
        },
    },
    {
        id: "slack",
        name: "Slack",
        description: "Team communication",
        icon: MessageSquare,
        status: "connected",
        color: "bg-purple-500",
        settings: {
            webhookUrl: "https://hooks.slack.com/services/***",
            channel: "#celebrity-alerts",
            mentionUsers: "@marketing-team",
            includeDetails: true,
        },
    },
    {
        id: "postscript",
        name: "Postscript",
        description: "SMS marketing",
        icon: MessageSquare,
        status: "disconnected",
        color: "bg-blue-500",
        settings: {
            apiKey: "",
            shopId: "",
            autoSubscribe: false,
            smsTemplate: "Hey {name}! Thanks for your order!",
        },
    },
    {
        id: "gorgias",
        name: "Gorgias",
        description: "Customer support",
        icon: MessageSquare,
        status: "connected",
        color: "bg-green-500",
        settings: {
            apiKey: "gor_***************",
            domain: "your-store.gorgias.com",
            createTicket: true,
            priority: "medium",
        },
    },
    {
        id: "webhooks",
        name: "Custom Webhooks",
        description: "Custom integrations",
        icon: Webhook,
        status: "connected",
        color: "bg-gray-500",
        settings: {
            endpoints: [
                { url: "https://your-app.com/webhook/celebrity", active: true },
                { url: "https://analytics.com/track", active: false },
            ],
            retryAttempts: 3,
            timeout: 30,
        },
    },
]

export default function IntegrationSettings({ onClose }) {
    const [ selectedIntegration, setSelectedIntegration ] = useState(null)
    const [ settings, setSettings ] = useState({})

    const handleConnect = (integrationId) => {
        // Handle connection logic
        console.log("Connecting to", integrationId)
    }

    const handleDisconnect = (integrationId) => {
        // Handle disconnection logic
        console.log("Disconnecting from", integrationId)
    }

    const handleSaveSettings = () => {
        // Handle save settings logic
        console.log("Saving settings for", selectedIntegration?.id, settings)
        setSelectedIntegration(null)
    }

    const getStatusIcon = (status) => {
        return status === "connected" ? (
            <Check className="h-4 w-4 text-green-600" />
        ) : (
            <X className="h-4 w-4 text-red-600" />
        )
    }

    const getStatusColor = (status) => {
        return status === "connected"
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-red-100 text-red-800 border-red-200"
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Settings className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Integration Settings</h2>
                            <p className="text-sm text-gray-600">Manage your third-party integrations</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    {!selectedIntegration ? (
                        <div className="p-6">
                            <div className="grid gap-6">
                                {integrations.map((integration) => {
                                    const IconComponent = integration.icon
                                    return (
                                        <div
                                            key={integration.id}
                                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 ${integration.color} rounded-lg`}>
                                                        <IconComponent className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                                                        <p className="text-sm text-gray-600">{integration.description}</p>
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            {getStatusIcon(integration.status)}
                                                            <span
                                                                className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(integration.status)}`}
                                                            >
                                                                {integration.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    {integration.status === "connected" && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedIntegration(integration)
                                                                setSettings(integration.settings)
                                                            }}
                                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2 transition-colors"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                            <span>Configure</span>
                                                        </button>
                                                    )}
                                                    {integration.status === "connected" ? (
                                                        <button
                                                            onClick={() => handleDisconnect(integration.id)}
                                                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            Disconnect
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleConnect(integration.id)}
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                        >
                                                            Connect
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Add Custom Integration */}
                            <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Need a Custom Integration?</h3>
                                <p className="text-gray-600 mb-4">
                                    We can help you connect Nova-Famous Tracker with any platform using webhooks or API integrations.
                                </p>
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                    Request Integration
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <button
                                    onClick={() => setSelectedIntegration(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                                <div className={`p-2 ${selectedIntegration.color} rounded-lg`}>
                                    <selectedIntegration.icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedIntegration.name} Settings</h3>
                                    <p className="text-sm text-gray-600">Configure your {selectedIntegration.name} integration</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {selectedIntegration.id === "klaviyo" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                            <div className="relative">
                                                <Key className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="password"
                                                    value={settings.apiKey || ""}
                                                    onChange={(e) => setSettings((prev) => ({ ...prev, apiKey: e.target.value }))}
                                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter your Klaviyo API key"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">List ID</label>
                                            <input
                                                type="text"
                                                value={settings.listId || ""}
                                                onChange={(e) => setSettings((prev) => ({ ...prev, listId: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your Klaviyo list ID"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                id="autoTrigger"
                                                checked={settings.autoTrigger || false}
                                                onChange={(e) => setSettings((prev) => ({ ...prev, autoTrigger: e.target.checked }))}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="autoTrigger" className="text-sm font-medium text-gray-700">
                                                Auto-trigger email campaigns for celebrity purchases
                                            </label>
                                        </div>
                                    </>
                                )}

                                {selectedIntegration.id === "slack" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                                            <input
                                                type="url"
                                                value={settings.webhookUrl || ""}
                                                onChange={(e) => setSettings((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="https://hooks.slack.com/services/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                                            <input
                                                type="text"
                                                value={settings.channel || ""}
                                                onChange={(e) => setSettings((prev) => ({ ...prev, channel: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="#celebrity-alerts"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mention Users</label>
                                            <input
                                                type="text"
                                                value={settings.mentionUsers || ""}
                                                onChange={(e) => setSettings((prev) => ({ ...prev, mentionUsers: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="@marketing-team"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setSelectedIntegration(null)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveSettings}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span>Save Settings</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
