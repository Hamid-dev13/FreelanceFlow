"use client";

import React, { useState, type ReactNode } from 'react';
import { LayoutDashboard, FolderKanban, Plus, Layout } from 'lucide-react';
import MissionForm from '@/components/features/mission/MissionForm';
import { useMissionStore, type CreateMissionData } from '@/stores/useMissionStore';

interface ProjectManagerLayoutProps {
    children: ReactNode;
}

export const ProjectManagerLayout = ({ children }: ProjectManagerLayoutProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { createMission } = useMissionStore();

    const handleMissionSubmit = async (data: CreateMissionData) => {
        try {
            await createMission(data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erreur lors de la création de la mission:', error);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            {/* Navigation - on la cache quand la modale est ouverte */}
            <header className={`sticky top-0 z-10 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 ${isModalOpen ? 'hidden' : ''}`}>
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
                                    <a href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors">
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span>Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/projects" className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors">
                                        <FolderKanban className="h-5 w-5" />
                                        <span>Gestion des projets</span>
                                    </a>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center gap-2 bg-[#FF4405]/10 text-[#FF4405] px-4 py-2 rounded-lg hover:bg-[#FF4405]/20 transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span>Nouvelle mission</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Modale */}
            {isModalOpen && (
                <MissionForm
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleMissionSubmit}
                />
            )}
        </div>
    );
};