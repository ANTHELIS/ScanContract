"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, User, Shield, Award, Calendar } from 'lucide-react';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    stats: {
        totalContracts: number;
    };
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                    <div className="px-8 pb-8 relative">
                        <div className="relative -top-16 flex flex-col md:flex-row md:items-end md:justify-between px-4">
                            <div className="flex items-center">
                                <div className="h-32 w-32 bg-white rounded-full p-2 shadow-lg">
                                    <div className="h-full w-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                        <User className="w-16 h-16" />
                                    </div>
                                </div>
                                <div className="ml-6 mb-4 md:mb-2 pt-16 md:pt-0">
                                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                                    <p className="text-gray-500">{profile.email}</p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 mb-4 md:mb-6">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                    <Award className="w-4 h-4 mr-2" /> PRO Plan (Hackathon Edition)
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Membership Card */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Shield className="w-32 h-32 transform rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Membership ID</p>
                                    <p className="font-mono text-lg mb-6 text-indigo-300">{profile._id}</p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-wider">Status</p>
                                            <div className="font-bold text-green-400 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                                Active
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-xs uppercase tracking-wider">Valid Thru</p>
                                            <p className="font-bold">Lifetime</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <Award className="w-5 h-5 mr-2 text-indigo-500" /> Account Statistics
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Contracts Audited</p>
                                        <p className="text-3xl font-black text-indigo-600">{profile.stats.totalContracts}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Member Since</p>
                                        <p className="text-xl font-bold text-gray-800 flex items-center h-9">
                                            {new Date().getFullYear()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
