"use client";

import React from 'react';

interface PrintableReportProps {
    contract: {
        fileName: string;
        analysis: {
            riskScore: number;
            summary: string;
            clauses: Array<{
                title: string;
                text: string;
                risk: string;
                explanation: string;
            }>;
            missingClauses?: Array<{
                clause: string;
                status: string;
                riskScore: number;
                recommendation: string;
            }>;
            complianceAlerts?: string[];
        };
    };
}

export const PrintableReport = React.forwardRef<HTMLDivElement, PrintableReportProps>(({ contract }, ref) => {
    const { fileName, analysis } = contract;

    return (
        <div ref={ref} className="p-12 font-serif text-gray-900 bg-white max-w-[210mm] mx-auto hidden print:block">
            {/* Header */}
            <div className="border-b-2 border-gray-900 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">ContractScan Audit Report</h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">Confidential Legal Analysis</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">{new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">{fileName}</p>
                </div>
            </div>

            {/* Score */}
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500">Overall Risk Score</h2>
                    <p className="text-sm text-gray-500">0-100 Scale (Lower is better)</p>
                </div>
                <div className="text-5xl font-black">{analysis.riskScore}/100</div>
            </div>

            {/* Executive Summary */}
            <div className="mb-10">
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider">Executive Summary</h2>
                <p className="text-lg leading-relaxed text-justify">{analysis.summary}</p>
            </div>

            {/* Alerts */}
            {(analysis.complianceAlerts && analysis.complianceAlerts.length > 0) || (analysis.missingClauses && analysis.missingClauses.length > 0) ? (
                <div className="mb-10 break-inside-avoid">
                    <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider text-red-700">Critical Alerts</h2>

                    {analysis.complianceAlerts && analysis.complianceAlerts.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-bold text-red-600 mb-2">Compliance Violations</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {analysis.complianceAlerts.map((alert, i) => (
                                    <li key={i} className="text-red-700 font-medium">{alert}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {analysis.missingClauses && analysis.missingClauses.filter(c => c.status === 'MISSING').length > 0 && (
                        <div>
                            <h3 className="font-bold text-amber-600 mb-2">Missing Standard Clauses</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {analysis.missingClauses.filter(c => c.status === 'MISSING').map((c, i) => (
                                    <li key={i} className="text-gray-800">
                                        <span className="font-semibold">{c.clause}:</span> {c.recommendation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : null}

            {/* Detailed Analysis */}
            <div>
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-6 uppercase tracking-wider">Detailed Clause Analysis</h2>
                <div className="space-y-6">
                    {analysis.clauses.map((clause, idx) => (
                        <div key={idx} className="break-inside-avoid mb-6">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="font-bold text-lg">{clause.title}</h3>
                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded border ${clause.risk === 'High' ? 'border-red-600 text-red-600' :
                                        clause.risk === 'Medium' ? 'border-amber-600 text-amber-600' :
                                            'border-green-600 text-green-600'
                                    }`}>{clause.risk} Risk</span>
                            </div>
                            <div className="bg-gray-50 p-4 border-l-4 border-gray-300 mb-3 italic text-gray-700 text-sm">
                                "{clause.text}"
                            </div>
                            <p className="text-gray-800 leading-relaxed">{clause.explanation}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                <p>Generated by ContractScan AI • Not Legal Advice • Professional Audit Report</p>
            </div>
        </div>
    );
});

PrintableReport.displayName = 'PrintableReport'; // Required for forwardRef
