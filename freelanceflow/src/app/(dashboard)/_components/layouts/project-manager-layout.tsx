"use client";
import React, { useState, type ReactNode, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import MissionForm from '@/components/features/mission/MissionForm';
import { ProjectManagerNavbar } from '@/app/(dashboard)/_components/navigation/navbar/ProjectManagerNavbar';
import { useMissionStore, type CreateMissionData } from '@/stores/useMissionStore';
import { useSyncSession } from '@/hooks/useSyncSession'; // Importer le hook

interface ProjectManagerLayoutProps {
    children: ReactNode;
}

export const ProjectManagerLayout = ({ children }: ProjectManagerLayoutProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { createMission } = useMissionStore();

    // Ajouter le hook de synchronisation de session
    useSyncSession();

    // Ajout d'un useEffect pour logger le rôle
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedRole = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_role='))
            ?.split('=')[1];

        console.log("🕵️ ProjectManagerLayout - Token présent:", !!token);
        console.log("🍪 ProjectManagerLayout - Rôle stocké:", storedRole);

        if (token) {
            try {
                const decoded = jwtDecode(token) as { role: string, email: string };

                console.log("🔐 ProjectManagerLayout - Rôle connecté:", decoded.role);
                console.log("📧 ProjectManagerLayout - Email connecté:", decoded.email);
                console.log("🍪 DEBUG - Comparaison des rôles:",
                    `Décodé: ${decoded.role}, Stocké: ${storedRole}`
                );

                // Vérification croisée des rôles
                if (storedRole && decoded.role !== storedRole) {
                    console.warn("⚠️ ALERTE : Incohérence de rôle détectée dans ProjectManagerLayout");
                    localStorage.removeItem("token");
                    window.location.href = '/login'; // Redirection directe
                }
            } catch (error) {
                console.error("❌ Erreur de décodage du token:", error);
            }
        }
    }, []);

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
            <ProjectManagerNavbar
                onNewMission={() => setIsModalOpen(true)}
                isModalOpen={isModalOpen}
            />

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