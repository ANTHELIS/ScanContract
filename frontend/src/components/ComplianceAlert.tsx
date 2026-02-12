"use client";

import { ShieldAlert, AlertCircle } from "lucide-react";

interface ComplianceAlertProps {
    alerts: string[];
}

export default function ComplianceAlert({ alerts }: ComplianceAlertProps) {
    if (!alerts || alerts.length === 0) return null;

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 animate-in slide-in-from-top-2">
            <div className="flex">
                <div className="flex-shrink-0">
                    <ShieldAlert className="h-5 w-5 text-red-600" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">
                        Critical Compliance Alerts
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-1">
                            {alerts.map((alert, index) => (
                                <li key={index} className="font-medium">
                                    {alert}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
