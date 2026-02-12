"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, Clock, Settings, LogOut, FileText, ChevronLeft, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SidebarProps {
    isOpen: boolean;
    toggle: () => void;
    isMobile?: boolean;
    closeMobile?: () => void;
}

export default function Sidebar({ isOpen, toggle, isMobile, closeMobile }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isNewAnalysis = searchParams?.get('tab') === 'new';

    const [user, setUser] = useState<{ name: string; email: string; plan?: string } | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard' && !isNewAnalysis;
        }
        return pathname === path;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const handleItemClick = () => {
        if (isMobile && closeMobile) {
            closeMobile();
        }
    };

    return (

        <div
            className={`h-screen bg-white border-r border-gray-100 flex flex-col justify-between transition-all duration-300 ease-in-out ${isMobile
                ? 'w-64'
                : (isOpen ? 'w-64' : 'w-20')
                }`}
        >
            <div>
                {/* Logo Area */}
                <div className={`p-6 flex items-center ${isOpen || isMobile ? 'justify-between' : 'justify-center'} h-24`}>
                    {isOpen || isMobile ? (
                        <div className="flex items-center gap-2 text-brand font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap">
                            <div className="p-1.5 bg-brand rounded-lg text-white shrink-0">
                                <FileText size={20} strokeWidth={3} />
                            </div>
                            ContractScan
                        </div>
                    ) : (
                        <div className="p-1.5 bg-brand rounded-lg text-white shrink-0">
                            <FileText size={20} strokeWidth={3} />
                        </div>
                    )}

                    {!isMobile && (
                        <button
                            onClick={toggle}
                            className={`p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors ${!isOpen && 'hidden'}`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}
                    {!isOpen && !isMobile && (
                        <button
                            onClick={toggle}
                            className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-400 hover:text-brand"
                        >
                            <Menu size={12} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="px-3 space-y-2 mt-2">
                    <SidebarItem
                        icon={<Home size={20} />}
                        label="Dashboard"
                        href="/dashboard"
                        active={isActive('/dashboard')}
                        isOpen={isOpen || !!isMobile}
                        onClick={handleItemClick}
                    />

                    <SidebarItem
                        icon={<FileText size={20} />}
                        label="New Analysis"
                        href="/dashboard?tab=new"
                        active={pathname === '/dashboard' && isNewAnalysis}
                        isOpen={isOpen || !!isMobile}
                        onClick={(e) => {
                            // Let the Link handle navigation but maybe force param update if needed
                            // Actually Link with href is enough, but to support the "Reset" behavior:
                            e.preventDefault();
                            window.location.href = '/dashboard?tab=new';
                            handleItemClick();
                        }}
                    />

                    <SidebarItem
                        icon={<Clock size={20} />}
                        label="History"
                        href="/dashboard/history"
                        active={isActive('/dashboard/history')}
                        isOpen={isOpen || !!isMobile}
                        onClick={handleItemClick}
                    />

                    <SidebarItem
                        icon={<Settings size={20} />}
                        label="Settings"
                        href="/dashboard/profile"
                        active={isActive('/dashboard/profile')}
                        isOpen={isOpen || !!isMobile}
                        onClick={handleItemClick}
                    />
                </nav>
            </div>

            {/* User Profile & Actions */}
            <div className={`p-4 border-t border-gray-50 flex flex-col gap-2 ${(!isOpen && !isMobile) && 'items-center'}`}>
                {/* User Info */}
                {(isOpen || isMobile) && user && (
                    <Link href="/dashboard/profile" className="block mb-2 group">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-brand font-bold text-xs uppercase group-hover:bg-indigo-200 transition-colors">
                                {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-brand transition-colors" title={user.name}>{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.plan || 'Free Plan'}</p>
                            </div>
                        </div>
                    </Link>
                )}

                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm ${(!isOpen && !isMobile) && 'justify-center p-2'}`}
                    title="Sign Out"
                >
                    <LogOut size={18} />
                    {(isOpen || isMobile) && <span>Sign Out</span>}
                </button>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, href, active, isOpen, onClick }: {
    icon: React.ReactNode,
    label: string,
    href: string,
    active: boolean,
    isOpen: boolean,
    onClick?: (e: React.MouseEvent) => void
}) {
    return (
        <Link href={href} onClick={onClick} className="block group relative cursor-pointer">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${active
                ? 'bg-brand text-white shadow-md shadow-brand/30'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                } ${!isOpen && 'justify-center'}`}>
                <div className="shrink-0">{icon}</div>

                {isOpen ? (
                    <span className="whitespace-nowrap overflow-hidden transition-all duration-300 opacity-100">{label}</span>
                ) : (
                    // Tooltip for collapsed state
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {label}
                    </div>
                )}
            </div>
        </Link>
    );
}
