"use client";

import Link from 'next/link';
import { FileText, ArrowRight, ShieldCheck, AlertTriangle, Trash2 } from 'lucide-react';

interface ContractCardProps {
    contract: {
        _id: string;
        fileName: string;
        analysis: {
            riskScore: number;
            summary: string;
        };
        createdAt: string;
    };
    onDelete?: (id: string) => void;
}

export default function ContractCard({ contract, onDelete }: ContractCardProps) {
    const score = contract.analysis.riskScore;
    let scoreColor = 'text-green-600';
    let scoreBg = 'bg-green-100';
    let borderColor = 'border-green-200';
    let Icon = ShieldCheck;

    if (score > 70) {
        scoreColor = 'text-red-600';
        scoreBg = 'bg-red-100';
        borderColor = 'border-red-200';
        Icon = AlertTriangle;
    } else if (score > 40) {
        scoreColor = 'text-amber-600';
        scoreBg = 'bg-amber-100';
        borderColor = 'border-amber-200';
        Icon = AlertTriangle;
    }

    return (
        <div className="relative group">
            <Link href={`/scan/${contract._id}`} className="block">
                <div className={`bg-white rounded-xl border ${borderColor} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden h-full flex flex-col`}>
                    {/* Status Stripe */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${score > 70 ? 'bg-red-500' : score > 40 ? 'bg-amber-500' : 'bg-green-500'}`} />

                    <div className="flex justify-between items-start mb-4 pl-3">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                <FileText className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight line-clamp-1 pr-2" title={contract.fileName}>
                                    {contract.fileName}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(contract.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${scoreBg} ${scoreColor}`}>
                            <Icon className="w-3 h-3" />
                            Risk: {score}
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 pl-3 leading-relaxed flex-grow">
                        {contract.analysis.summary}
                    </p>

                    <div className="flex items-center pl-3 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform mt-auto">
                        Full Analysis <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                </div>
            </Link>

            {/* Zero-Retention Delete Button */}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(contract._id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-transparent hover:border-red-100 z-10"
                    title="Permanently Delete Contract"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
