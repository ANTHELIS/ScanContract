"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide Navbar on dashboard and scan pages where Sidebar is used
    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/scan')) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        router.push('/login');
        // Force refresh to update state if needed, or stick to this simple logic
        window.location.href = '/';
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <div className="bg-primary-600 p-1.5 rounded-lg mr-2 group-hover:bg-primary-700 transition-colors">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">Contract<span className="text-primary-600">Scan</span></span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`flex items-center text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-1.5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors">
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
