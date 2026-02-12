"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, UploadCloud, FileText, AlertCircle, Loader2, FileSearch } from 'lucide-react';
import api from '@/lib/api';
import ContractCard from '@/components/ContractCard';
import { useRouter, useSearchParams } from 'next/navigation';
import JurisdictionSelector from '@/components/JurisdictionSelector';
import { useSearch } from '@/context/SearchContext';

interface Contract {
    _id: string;
    fileName: string;
    analysis: {
        riskScore: number;
        summary: string;
    };
    createdAt: string;
}

export default function Dashboard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { searchQuery } = useSearch(); // Consume search query

    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string } | null>(null);

    // Upload State
    const [file, setFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [jurisdiction, setJurisdiction] = useState('Global');

    // Filtered contracts
    const filteredContracts = contracts.filter(c =>
        c.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const fetchContracts = async () => {
            try {
                const { data } = await api.get('/contracts');
                setContracts(data);
            } catch (error) {
                console.error('Failed to fetch contracts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, [router]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to permanently delete this contract? This action cannot be undone.")) {
            try {
                await api.delete(`/contracts/${id}`);
                setContracts(contracts.filter(c => c._id !== id));
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete contract.");
            }
        }
    };

    // Upload Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError('Please upload a PDF file.');
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploadLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('jurisdiction', jurisdiction);

        try {
            const { data } = await api.post('/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            router.push(`/scan/${data._id}`);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Analysis failed. Please try again.');
            setUploadLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero & Upload Section */}
            <div className={`mb-8 md:mb-12 ${searchQuery ? 'hidden' : ''}`}>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
                </h1>
                <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">Upload a contract for instant risk analysis and clause detection.</p>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Scan New Document</h2>
                    {/* Jurisdiction Toggle - Compact */}
                    <div className="mb-6">
                        <JurisdictionSelector selected={jurisdiction} onSelect={setJurisdiction} files={null} />
                    </div>

                    <div
                        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${dragActive
                            ? 'border-brand bg-indigo-50/50 scale-[1.01]'
                            : 'border-gray-200 hover:border-brand/50 hover:bg-gray-50'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />

                        {!file ? (
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-brand">
                                    <UploadCloud className="h-10 w-10" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900 mb-2">Drag & drop your PDF contract here</span>
                                <span className="text-base text-gray-500">or click to browse from your computer</span>
                            </label>
                        ) : (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                <div className="h-16 w-16 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-brand shadow-sm">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <span className="text-lg font-bold text-gray-900 mb-1">{file.name}</span>
                                <span className="text-sm text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</span>

                                <div className="flex gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setFile(null);
                                        }}
                                        className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline transition-all px-4 py-2"
                                    >
                                        Remove
                                    </button>

                                    {uploadLoading ? (
                                        <div className="flex items-center text-brand px-6 py-2 bg-indigo-50 rounded-lg">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Analyzing...
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleUpload}
                                            className="bg-brand text-white px-6 py-2 rounded-lg font-semibold shadow-md shadow-brand/20 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
                                        >
                                            Run Analysis
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-100 text-sm">
                            <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            {!searchParams?.get('tab') && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            {searchQuery ? `Search Results: "${searchQuery}"` : 'Recent Activity'}
                        </h2>
                    </div>

                    {filteredContracts.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-100">
                            <LayoutDashboard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-gray-900 font-medium">
                                {searchQuery ? 'No matching contracts found' : 'No recent scans'}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                {searchQuery ? 'Try a different keyword.' : 'Uploaded contracts will appear here.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredContracts.map((contract) => (
                                <ContractCard key={contract._id} contract={contract} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
