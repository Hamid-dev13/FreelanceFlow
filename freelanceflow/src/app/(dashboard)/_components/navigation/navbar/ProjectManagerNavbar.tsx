"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Plus, Layout, ClipboardList, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

type ProjectManagerNavbarProps = {
    onNewMission: () => void;
    isModalOpen: boolean;
};

export const ProjectManagerNavbar = ({ onNewMission, isModalOpen }: ProjectManagerNavbarProps) => {
    const router = useRouter();
    const { clearAuth } = useAuthStore();

    if (isModalOpen) return null;

    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo et titre */}
                        <div className="flex items-center gap-3 mr-8">
                            <Layout className="h-6 w-6 text-[#FF4405]" />
                            <span className="text-lg font-semibold">Project Manager</span>
                        </div>

                        {/* Navigation */}
                        <ul className="flex items-center space-x-8">
                            <li>
                                <Link
                                    href="/dashboard/project-manager"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/projects"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                                >
                                    <FolderKanban className="h-5 w-5" />
                                    <span>Gestion des projets</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/clients"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                                >
                                    <Users className="h-5 w-5" />
                                    <span>Clients</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mission/project-manager"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                                >
                                    <ClipboardList className="h-5 w-5" />
                                    <span>Missions</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={onNewMission}
                                    className="flex items-center gap-2 bg-[#FF4405]/10 text-[#FF4405] px-4 py-2 rounded-lg hover:bg-[#FF4405]/20 transition-colors"
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
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};