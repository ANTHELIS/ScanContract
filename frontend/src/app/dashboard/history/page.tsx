"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Clock, Search, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import ContractCard from '@/components/ContractCard';
import { useRouter } from 'next/navigation';

interface Contract {
    _id: string;
    fileName: string;
    analysis: {
        riskScore: number;
        summary: string;
    };
    createdAt: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }

        const fetchContracts = async () => {
            try {
                const { data } = await api.get('/contracts');
                setContracts(data);
                setFilteredContracts(data);
            } catch (error) {
                console.error('Failed to fetch contracts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, [router]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredContracts(contracts);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = contracts.filter(c =>
                c.fileName.toLowerCase().includes(lowerQuery) ||
                c.analysis.summary.toLowerCase().includes(lowerQuery)
            );
            setFilteredContracts(filtered);
        }
    }, [searchQuery, contracts]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to permanently delete this contract? This action cannot be undone.")) {
            try {
                await api.delete(`/contracts/${id}`);
                const updated = contracts.filter(c => c._id !== id);
                setContracts(updated);
                // Filtering will update automatically via useEffect dependency
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete contract.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Clock className="w-8 h-8 text-brand" />
                        Scan History
                    </h1>
                    <p className="text-gray-500">View and manage all your past contract analyses.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search contracts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand w-full md:w-64 transition-all"
                    />
                </div>
            </div>

            {filteredContracts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-16 text-center">
                    <div className="mx-auto h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Search className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">
                        {searchQuery ? 'No matching contracts found' : 'No history yet'}
                    </h3>
                    <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                        {searchQuery ? 'Try adjusting your search terms.' : 'Documents you analyze will appear here for future reference.'}
                    </p>
                    {!searchQuery && (
                        <div className="mt-8">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-brand hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
                            >
                                Start New Scan
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContracts.map((contract) => (
                        <ContractCard key={contract._id} contract={contract} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}
