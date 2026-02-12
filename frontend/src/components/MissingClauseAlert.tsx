"use client";

import { FileWarning, PlusCircle } from "lucide-react";

interface MissingClause {
    clause: string;
    status: string;
    riskScore: number;
    recommendation: string;
}

interface MissingClauseAlertProps {
    missingClauses: MissingClause[];
}

export default function MissingClauseAlert({ missingClauses }: MissingClauseAlertProps) {
    // Filter only actually missing or high risk items
    const missing = missingClauses?.filter(c => c.status === 'MISSING') || [];

    if (missing.length === 0) return null;

    return (
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileWarning className="w-5 h-5 text-amber-600 mr-2" />
                Missing Standard Clauses
            </h2>
            <div className="space-y-4">
                {missing.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800 text-sm">{item.clause}</h3>
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded">
                                MISSING
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{item.recommendation}</p>
                        <div className="flex items-center text-indigo-600 text-xs font-medium cursor-pointer hover:underline">
                            <PlusCircle className="w-3 h-3 mr-1" />
                            Generate this clause
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
