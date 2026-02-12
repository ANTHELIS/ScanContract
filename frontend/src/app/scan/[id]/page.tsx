"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AlertTriangle, CheckCircle, Info, FileText, ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import ComplianceAlert from '@/components/ComplianceAlert';
import MissingClauseAlert from '@/components/MissingClauseAlert';
import { useReactToPrint } from 'react-to-print';
import { PrintableReport } from '@/components/PrintableReport';
import { useRef } from 'react';

interface AnalysisResult {
    _id: string;
    fileName: string;
    originalText: string;
    analysis: {
        riskScore: number;
        summary: string;
        clauses: Array<{
            title: string;
            text: string;
            risk: 'High' | 'Medium' | 'Low';
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
}

export default function ScanResult({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [contract, setContract] = useState<AnalysisResult | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: contract ? `${contract.fileName}_Analysis_Report` : 'ContractScan_Report',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const { data } = await api.get(`/contracts/${id}`);
                setContract(data);
            } catch (error) {
                console.error('Failed to fetch contract', error);
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem('token')) {
            fetchContract();
        } else {
            router.push('/login');
        }
    }, [id, router]);

    const handleDownload = () => {
        try {
            if (!contract) return;
            // Trigger PDF print/download
            handlePrint();
        } catch (error) {
            console.error("Print failed:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading analysis...</p>
            </div>
        </div>
    );

    if (!contract) return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Contract not found</h2>
                <Link href="/dashboard" className="text-indigo-600 hover:underline mt-2 inline-block">Return to Dashboard</Link>
            </div>
        </div>
    );

    const score = contract.analysis.riskScore;
    let scoreColor = 'text-green-700';
    let scoreBg = 'bg-green-50 border-green-200';
    let riskLabel = 'Low Risk';

    if (score > 70) {
        scoreColor = 'text-red-700';
        scoreBg = 'bg-red-50 border-red-200';
        riskLabel = 'High Risk';
    } else if (score > 40) {
        scoreColor = 'text-amber-700';
        scoreBg = 'bg-amber-50 border-amber-200';
        riskLabel = 'Medium Risk';
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 pt-16">
            {/* Hidden Printable Report */}
            {contract && (
                <div style={{ display: 'none' }}>
                    <PrintableReport ref={componentRef} contract={contract} />
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center overflow-hidden">
                    <Link href="/dashboard" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2 truncate">
                            <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                            {contract.fileName}
                        </h1>
                        <p className="text-xs text-gray-500">Analyzed on {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`flex flex-col items-end px-4 py-1.5 rounded-lg border ${scoreBg}`}>
                        <span className={`text-xs font-bold uppercase tracking-wider ${scoreColor} opacity-80`}>Risk Score</span>
                        <span className={`text-xl font-black ${scoreColor} leading-none`}>{score}/100</span>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 rounded-lg transition-colors font-medium border border-indigo-100"
                        title="Download Professional PDF"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download PDF</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Col: Text */}
                <div className="w-1/2 overflow-y-auto p-8 border-r border-gray-200 bg-white scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center">
                            <FileText className="w-4 h-4 mr-2" /> Original Document
                        </h2>
                        <div className="prose prose-sm max-w-none font-mono text-gray-700 leading-relaxed bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-inner">
                            {contract.originalText}
                        </div>
                    </div>
                </div>

                {/* Right Col: Analysis */}
                <div className="w-1/2 overflow-y-auto bg-gray-50/50 p-8 scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="max-w-2xl mx-auto space-y-8">
                        {/* Summary */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                <Info className="w-5 h-5 text-indigo-500 mr-2" /> Executive Summary
                            </h2>
                            <p className="text-gray-600 leading-relaxed">{contract.analysis.summary}</p>
                        </div>

                        {/* Analysis Alerts */}
                        <ComplianceAlert alerts={contract.analysis.complianceAlerts || []} />
                        <MissingClauseAlert missingClauses={contract.analysis.missingClauses || []} />

                        {/* Clauses */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <AlertTriangle className="w-5 h-5 text-indigo-500 mr-2" /> Risk Analysis
                            </h2>
                            <div className="space-y-4">
                                {contract.analysis.clauses.map((clause, idx) => (
                                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                                        <div className={`px-4 py-3 border-b flex justify-between items-center ${clause.risk === 'High' ? 'bg-red-50 border-red-100' :
                                            clause.risk === 'Medium' ? 'bg-amber-50 border-amber-100' :
                                                'bg-green-50 border-green-100'
                                            }`}>
                                            <h3 className="font-semibold text-gray-900 text-sm">{clause.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${clause.risk === 'High' ? 'bg-red-100 text-red-700' :
                                                clause.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {clause.risk}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="text-xs text-gray-500 font-mono mb-1">Clause Text:</p>
                                                <p className="text-sm text-gray-800 italic">"{clause.text}"</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Analysis:</p>
                                                <p className="text-sm text-gray-600">{clause.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
