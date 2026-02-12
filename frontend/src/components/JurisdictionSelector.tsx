"use client";

import { Check, Globe } from "lucide-react";

interface JurisdictionSelectorProps {
    files: any; // Using basic type to avoid complex props interface for now
    selected: string;
    onSelect: (value: string) => void;
}

export default function JurisdictionSelector({ selected, onSelect }: JurisdictionSelectorProps) {
    const jurisdictions = [
        { id: 'Global', label: 'Global / General', flag: '🌐', desc: 'Standard analysis' },
        { id: 'India', label: 'India', flag: '🇮🇳', desc: 'Contract Act 1872 & Stamp Duty' },
        { id: 'US', label: 'United States', flag: '🇺🇸', desc: 'UCC & State Laws' },
        { id: 'UK', label: 'United Kingdom', flag: '🇬🇧', desc: 'English Common Law' },
    ];

    return (
        <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Legal Jurisdiction
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jurisdictions.map((jurisdiction) => (
                    <div
                        key={jurisdiction.id}
                        onClick={() => onSelect(jurisdiction.id)}
                        className={`
              relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all
              ${selected === jurisdiction.id
                                ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50/30'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
            `}
                    >
                        <span className="flex flex-1">
                            <span className="flex flex-col">
                                <span className="block text-sm font-medium text-gray-900 flex items-center gap-2">
                                    <span className="text-xl">{jurisdiction.flag}</span>
                                    {jurisdiction.label}
                                </span>
                                <span className="mt-1 flex items-center text-xs text-gray-500">
                                    {jurisdiction.desc}
                                </span>
                            </span>
                        </span>
                        {selected === jurisdiction.id && (
                            <Check className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
