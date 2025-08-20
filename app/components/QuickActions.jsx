import React, { useState } from 'react'
import { Bell, Database, BarChart3, Settings } from "lucide-react"
import ConfigureAlerts from "./ConfigureAlert"
import ManageDatabase from "./ManageDatabase"
import ViewAnalytics from "./ViewAnalytics"
import IntegrationSettings from "./IntegrationSettings"

const QuickActions = ({ formData, setFormData, handleFormSubmit }) => {
    const [ activeModal, setActiveModal ] = useState(null);

    const quickActions = [
        {
            id: "alerts",
            title: "Configure Alerts",
            icon: Bell,
            color: "text-blue-600",
            bgColor: "bg-blue-50 hover:bg-blue-100",
            component: ConfigureAlerts,
        },
        // {
        //     id: "database",
        //     title: "Manage Database",
        //     icon: Database,
        //     color: "text-green-600",
        //     bgColor: "bg-green-50 hover:bg-green-100",
        //     component: ManageDatabase,
        // },
        // {
        //     id: "analytics",
        //     title: "View Analytics",
        //     icon: BarChart3,
        //     color: "text-purple-600",
        //     bgColor: "bg-purple-50 hover:bg-purple-100",
        //     component: ViewAnalytics,
        // },
        // {
        //     id: "integrations",
        //     title: "Integration Settings",
        //     icon: Settings,
        //     color: "text-orange-600",
        //     bgColor: "bg-orange-50 hover:bg-orange-100",
        //     component: IntegrationSettings,
        // },
    ]

    const openModal = (actionId) => {
        setActiveModal(actionId)
    }

    const closeModal = () => {
        setActiveModal(null)
    }

    const ActiveComponent = quickActions.find((action) => action.id === activeModal)?.component

    return (
        <div className="bg-gray-50">
            <div className="mx-auto">

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map((action) => {
                            const IconComponent = action.icon
                            return (
                                <button
                                    key={action.id}
                                    onClick={() => openModal(action.id)}
                                    className={`w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors ${action.bgColor}`}
                                >
                                    <div className="flex-shrink-0">
                                        <IconComponent className={`h-6 w-6 ${action.color}`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Render active modal */}
                {ActiveComponent && <ActiveComponent onClose={closeModal} formData={formData} setFormData={setFormData} handleFormSubmit={handleFormSubmit} />}
            </div>
        </div>
    )
}

export default QuickActions