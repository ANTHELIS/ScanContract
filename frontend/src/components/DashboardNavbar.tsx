"use client";

import { useState, useRef, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Bell, HelpCircle, Search, FileText, CheckCircle, ExternalLink } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';

export default function DashboardNavbar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams?.get('tab');
    const { searchQuery, setSearchQuery } = useSearch();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    // Close dropdowns when clicking outside
    const notifRef = useRef<HTMLDivElement>(null);
    const helpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
                setShowHelp(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getTitle = () => {
        if (pathname === '/dashboard') {
            return tab === 'new' ? 'New Analysis' : 'Dashboard';
        }
        if (pathname === '/dashboard/history') return 'Scan History';
        if (pathname === '/dashboard/profile') return 'Settings';
        if (pathname?.startsWith('/scan')) return 'Analysis Result';
        return 'Dashboard';
    };

    return (
        <header className="bg-white border-b border-gray-100 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 transition-all">
            {/* Page Title */}
            {!showMobileSearch && (
                <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate ml-8 md:ml-0 transition-opacity">
                    {getTitle()}
                </h1>
            )}

            {/* Mobile Search Input Overlay */}
            {showMobileSearch && (
                <div className="absolute inset-0 bg-white px-4 flex items-center z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Search className="w-4 h-4 text-brand mr-2" />
                    <input
                        type="text"
                        placeholder="Search filename..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none w-full h-full"
                        autoFocus
                    />
                    <button
                        onClick={() => setShowMobileSearch(false)}
                        className="ml-2 text-sm text-gray-500 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Right Actions */}
            <div className={`flex items-center gap-2 md:gap-4 ${showMobileSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200 focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search filename..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none text-sm text-gray-600 placeholder-gray-400 focus:outline-none w-48"
                    />
                </div>

                {/* Mobile Search Button */}
                <button
                    onClick={() => setShowMobileSearch(true)}
                    className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full"
                >
                    <Search className="w-5 h-5" />
                </button>

                <div className="h-6 w-px bg-gray-200 mx-1 md:mx-2"></div>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                                <span className="text-xs text-brand font-medium cursor-pointer hover:underline">Mark all read</span>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-green-50 text-green-600 rounded-full shrink-0 mt-0.5">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-medium">Analysis Complete</p>
                                            <p className="text-xs text-gray-500 mt-1">Your contract "Service_Agreement_v2.pdf" has been analyzed successfully.</p>
                                            <p className="text-[10px] text-gray-400 mt-2">2 mins ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-full shrink-0 mt-0.5">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-medium">New Feature Available</p>
                                            <p className="text-xs text-gray-500 mt-1">Try our new "Risk Score" comparison tool in the dashboard.</p>
                                            <p className="text-[10px] text-gray-400 mt-2">1 hour ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-2 border-t border-gray-50 text-center">
                                <button className="text-xs text-gray-500 hover:text-gray-800 font-medium">View all notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help Dropdown */}
                <div className="relative" ref={helpRef}>
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className={`p-2 rounded-full transition-colors ${showHelp ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    {showHelp && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-2 border-b border-gray-50 bg-gray-50/50">
                                <span className="font-semibold text-gray-800 text-sm">Help & Support</span>
                            </div>
                            <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group">
                                <FileText className="w-4 h-4 text-gray-400 group-hover:text-brand" />
                                Documentation
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group">
                                <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-brand" />
                                Support Center
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group border-t border-gray-50 mt-1 pt-2">
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand" />
                                Contact Us
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
