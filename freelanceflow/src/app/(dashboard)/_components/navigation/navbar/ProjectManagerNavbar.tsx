"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Plus, Layout, ClipboardList, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

type ProjectManagerNavbarProps = {
    onNewMission: () => void;
    isModalOpen: boolean;
};

export const ProjectManagerNavbar = ({ onNewMission, isModalOpen }: ProjectManagerNavbarProps) => {
    const router = useRouter();
    const { clearAuth } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isModalOpen) return null;

    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const NavItems = () => (
        <>
            <li>
                <Link
                    href="/dashboard/project-manager"
                    className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                </Link>
            </li>
            <li>
                <Link
                    href="/projects"
                    className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <FolderKanban className="h-5 w-5" />
                    <span>Gestion des projets</span>
                </Link>
            </li>
            <li>
                <Link
                    href="/clients"
                    className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <Users className="h-5 w-5" />
                    <span>Clients</span>
                </Link>
            </li>
            <li>
                <Link
                    href="/mission/project-manager"
                    className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <ClipboardList className="h-5 w-5" />
                    <span>Missions</span>
                </Link>
            </li>
            <li>
                <button
                    onClick={() => {
                        onNewMission();
                        setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 bg-[#FF4405]/10 text-[#FF4405] px-4 py-2 rounded-lg hover:bg-[#FF4405]/20 transition-colors w-full"
                >
                    <Plus className="h-5 w-5" />
                    <span>Nouvelle missions</span>
                </button>
            </li>
            <li>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
                </button>
            </li>
        </>
    );

    return (
        <header className="sticky top-0 z-50 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo and title */}
                        <div className="flex items-center gap-3 mr-8">
                            <Layout className="h-6 w-6 text-[#FF4405]" />
                            <span className="text-lg font-semibold">Project Manager</span>
                        </div>

                        {/* Desktop Navigation */}
                        <ul className="hidden md:flex items-center space-x-8">
                            <NavItems />
                        </ul>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-300 hover:text-[#FF4405] transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <ul className="flex flex-col space-y-4 py-4">
                            <NavItems />
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
};