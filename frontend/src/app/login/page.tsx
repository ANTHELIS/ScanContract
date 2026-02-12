"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px]">

                {/* Left Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xl mb-8">
                            <ShieldCheck className="w-8 h-8" />
                            <span>ContractScan</span>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-600">Please enter your details to sign in.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                                <span className="mr-2">⚠️</span> {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up for free
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Right Side - Decor */}
                <div className="hidden md:flex bg-indigo-600 relative overflow-hidden items-center justify-center p-12 text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
                    <div className="relative z-10 max-w-sm">
                        <h3 className="text-3xl font-bold mb-4">Contract review, simplified.</h3>
                        <p className="text-indigo-100 text-lg mb-8">
                            Join thousands of professionals who save hours every week using our AI-powered analysis tools.
                        </p>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-green-400 flex items-center justify-center font-bold text-green-900">
                                    98
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-white">Risk Score Analysis</div>
                                    <div className="text-xs text-indigo-200">Just now</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-white/20 rounded w-3/4"></div>
                                <div className="h-2 bg-white/20 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>
            </div>
        </div>
    );
}
