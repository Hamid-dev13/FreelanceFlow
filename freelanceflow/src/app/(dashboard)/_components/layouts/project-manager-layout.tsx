"use client";

import React, { useState, type ReactNode } from 'react';

import MissionForm from '@/components/features/mission/MissionForm';
import { ProjectManagerNavbar } from '@/app/(dashboard)/_components/navigation/navbar/ProjectManagerNavbar'; // Assurez-vous du bon chemin d'import
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
            {/* Remplacez la navigation inline par le composant ProjectManagerNavbar */}
            <ProjectManagerNavbar
                onNewMission={() => setIsModalOpen(true)}
                isModalOpen={isModalOpen}
            />

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