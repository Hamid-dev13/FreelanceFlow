import React, { type ReactNode } from 'react';
import { LayoutDashboard, FolderKanban, Layout } from 'lucide-react';

type DeveloperLayoutProps = {
    children: ReactNode;
};

export const DeveloperLayout = ({ children }: DeveloperLayoutProps) => {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            <header className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo et titre */}
                            <div className="flex items-center gap-3 mr-8">
                                <Layout className="h-6 w-6 text-[#FF4405]" />
                                <span className="text-lg font-semibold">Project Manager</span>
                            </div>

                            {/* Navigation - Sans le bouton Nouvelle mission */}
                            <ul className="flex items-center space-x-8">
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors">
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span>Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors">
                                        <FolderKanban className="h-5 w-5" />
                                        <span>Mes missions</span>
                                    </a>
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