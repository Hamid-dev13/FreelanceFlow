"use client";

import React, { useState, type ReactNode } from 'react';
import MissionForm from '@/components/features/mission/MissionForm';
import { ProjectManagerNavbar } from '@/app/(dashboard)/_components/navigation/navbar/ProjectManagerNavbar';
import { useMissionStore, type CreateMissionData } from '@/stores/useMissionStore';
import { useAuth } from '@/hooks/useAuth';

interface ProjectManagerLayoutProps {
    children: ReactNode;
    showNavbar?: boolean;
}

export const ProjectManagerLayout = ({
    children,
    showNavbar = true
}: ProjectManagerLayoutProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { createMission } = useMissionStore();
    const { isLoading } = useAuth('PROJECT_MANAGER');

    const handleMissionSubmit = async (data: CreateMissionData) => {
        try {
            await createMission(data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erreur lors de la création de la mission:', error);
        }
    };

    // Afficher un état de chargement pendant la vérification de l'auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#FF4405]"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            {showNavbar && (
                <ProjectManagerNavbar
                    onNewMission={() => setIsModalOpen(true)}
                    isModalOpen={isModalOpen}
                />
            )}

            <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {isModalOpen && (
                <MissionForm
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleMissionSubmit}
                />
            )}
        </div>
    );
};