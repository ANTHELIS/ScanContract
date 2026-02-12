"use client";

import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useState, Suspense, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { SearchProvider } from '@/context/SearchContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <SearchProvider>
            <div className="min-h-screen bg-gray-50 flex relative">
                {/* Mobile Menu Button */}
                {isMobile && !isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-brand"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}

                {/* Mobile Backdrop */}
                {isMobile && isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar Container */}
                <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} ${isMobile && !isSidebarOpen ? 'hidden' : 'block'}`}>
                    <Suspense fallback={<div className="w-64 h-screen bg-white border-r border-gray-100" />}>
                        <Sidebar
                            isOpen={isSidebarOpen}
                            toggle={() => setIsSidebarOpen(!isSidebarOpen)}
                            isMobile={isMobile}
                            closeMobile={() => setIsSidebarOpen(false)}
                        />
                    </Suspense>
                </div>

                <main
                    className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isMobile ? 'w-full ml-0' : (isSidebarOpen ? 'w-[calc(100%-16rem)]' : 'w-[calc(100%-5rem)]')
                        }`}
                >
                    <Suspense fallback={<div className="h-16 border-b border-gray-100 bg-white" />}>
                        <DashboardNavbar />
                    </Suspense>

                    <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
                        {children}
                    </div>
                </main>
            </div>
        </SearchProvider>
    );
}
