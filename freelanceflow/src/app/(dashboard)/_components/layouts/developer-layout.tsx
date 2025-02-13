import React, { type ReactNode } from 'react';
import { LayoutDashboard, FolderKanban, Layout } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type DeveloperLayoutProps = {
    children: ReactNode;
};

export const DeveloperLayout = ({ children }: DeveloperLayoutProps) => {
    const pathname = usePathname();

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            <header className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo et titre */}
                            <div className="flex items-center gap-3 mr-8">
                                <Layout className="h-6 w-6 text-[#FF4405]" />
                                <span className="text-lg font-semibold">FreelanceFlow</span>
                            </div>

                            {/* Navigation */}
                            <ul className="flex items-center space-x-8">
                                <li>
                                    <Link
                                        href="/dashboard"
                                        className={`flex items-center gap-2 transition-colors ${pathname === '/dashboard'
                                            ? 'text-[#FF4405]'
                                            : 'text-gray-300 hover:text-[#FF4405]'
                                            }`}
                                    >
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/mission"
                                        className={`flex items-center gap-2 transition-colors ${pathname === '/missions'
                                            ? 'text-[#FF4405]'
                                            : 'text-gray-300 hover:text-[#FF4405]'
                                            }`}
                                    >
                                        <FolderKanban className="h-5 w-5" />
                                        <span>Mes missions</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};