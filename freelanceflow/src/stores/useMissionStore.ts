import { verifyJWT } from '@/features/auth';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createJSONStorage, StateStorage } from 'zustand/middleware';

// Types
export type MissionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';
export type CreateMissionData = {
    title: string;
    description: string;
    assignedToId?: string | null;
    projectId?: string | null;
    deadline?: string; // Ajout de la propriété deadline
};
export type Mission = {
    id: string;
    title: string;
    description: string | null;
    status: MissionStatus;
    deadline: string;
    projectId: string | null;
    assignedToId: string | null;
    createdById: string;
    createdAt: string;
    updatedAt: string;
    assignedTo?: {
        id: string;
        name: string;
        email: string;
    } | null;
    createdBy: {
        id: string;
        name: string;
        email: string;
    };
    project?: {
        id: string;
        title: string;
        description?: string;
        status: string;
        startDate: string;
        endDate?: string;
        clientId: string;
        client: {
            id: string;
            name: string;
            email: string;
        };
    } | null;
};

interface MissionState {
    missions: Mission[];
    error: string | null;
    fetchMissions: (role: UserRole) => Promise<void>;
    updateMissionStatus: (id: string, status: MissionStatus) => Promise<void>;
    createMission: (missionData: Partial<Mission>) => Promise<Mission | null>;
    startAutoRefresh: (role: UserRole) => () => void;
    deleteMission: (id: string) => Promise<void>;
}

const storage: StateStorage = {
    getItem: (name: string): string | null => {
        try {
            const value = localStorage.getItem(name);
            if (!value) return null;
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed);
        } catch {
            return null;
        }
    },
    setItem: (name: string, value: string): void => {
        try {
            localStorage.setItem(name, value);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    },
    removeItem: (name: string): void => {
        localStorage.removeItem(name);
    },
};

export const useMissionStore = create<MissionState>()(
    devtools(
        persist(
            (set, get) => ({
                missions: [],
                error: null,
                fetchMissions: async (role: UserRole) => {
                    try {
                        console.log('📡 Début de fetchMissions pour le rôle:', role);

                        const response = await fetch('/api/mission', {
                            method: 'GET',
                            credentials: 'include', // Utilisation des cookies
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        console.log('🔍 Détails de la réponse:', {
                            status: response.status,
                            statusText: response.statusText,
                            headers: Object.fromEntries(response.headers.entries())
                        });

                        if (!response.ok) {
                            // Récupérer le texte d'erreur pour plus de détails
                            const errorText = await response.text();
                            console.error('❌ Erreur de réponse:', {
                                status: response.status,
                                errorText: errorText
                            });

                            throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
                        }

                        const data: Mission[] = await response.json();
                        console.log('✅ Données reçues de l\'API:', data);

                        const validatedData = data.map(mission => ({
                            ...mission,
                            title: mission.title || 'Sans titre',
                            description: mission.description || null,
                            project: mission.project ? {
                                ...mission.project,
                                title: mission.project.title || 'Sans titre'
                            } : null
                        }));

                        set({ missions: validatedData, error: null });
                    } catch (error) {
                        console.error('❌ Erreur complète de fetchMissions:', error);

                        const errorMessage = error instanceof Error
                            ? error.message
                            : 'Une erreur est survenue';

                        set({
                            missions: [],
                            error: errorMessage
                        });

                        // Optionnel : relancer l'erreur pour qu'elle puisse être gérée par le composant
                        throw error;
                    }
                },
                updateMissionStatus: async (id: string, status: MissionStatus) => {
                    const currentMissions = get().missions;
                    try {
                        // Mise à jour optimiste
                        set({
                            missions: currentMissions.map(mission =>
                                mission.id === id ? { ...mission, status } : mission
                            )
                        });

                        const response = await fetch(`/api/mission/${id}`, {
                            method: 'PUT',
                            credentials: 'include', // Utilisation des cookies
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ status })
                        });

                        if (!response.ok) {
                            // Restaurer l'état précédent en cas d'erreur
                            set({ missions: currentMissions });
                            const errorText = await response.text();
                            throw new Error(`Failed to update mission status: ${errorText}`);
                        }

                        // Recharger les missions pour assurer la synchronisation
                        await get().fetchMissions('PROJECT_MANAGER');
                    } catch (error) {
                        console.error('Full Error in Update Mission Status:', {
                            errorMessage: error instanceof Error ? error.message : 'Unknown error',
                            errorStack: error instanceof Error ? error.stack : undefined
                        });

                        // Restaurer l'état précédent en cas d'erreur
                        set({ missions: currentMissions });
                        throw error;
                    }
                },

                deleteMission: async (id: string) => {
                    const currentMissions = get().missions;
                    try {
                        // Mise à jour optimiste
                        set({
                            missions: currentMissions.filter(mission => mission.id !== id)
                        });

                        const response = await fetch(`/api/mission/${id}`, {
                            method: 'DELETE',
                            credentials: 'include', // Utilisation des cookies
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!response.ok) {
                            // Restaurer l'état précédent en cas d'erreur
                            set({ missions: currentMissions });
                            const errorText = await response.text();
                            throw new Error(`Failed to delete mission: ${errorText}`);
                        }

                    } catch (error) {
                        console.error('Full Error in Delete Mission:', {
                            errorMessage: error instanceof Error ? error.message : 'Unknown error',
                            errorStack: error instanceof Error ? error.stack : undefined
                        });

                        // Restaurer l'état précédent en cas d'erreur
                        set({ missions: currentMissions });
                        throw error;
                    }
                },

                createMission: async (missionData: Partial<Mission>) => {
                    try {
                        // Validate required fields
                        if (!missionData.title) {
                            throw new Error('Mission title is required');
                        }

                        const response = await fetch('/api/mission', {
                            method: 'POST',
                            credentials: 'include', // Utilisation des cookies
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ...missionData,
                                status: missionData.status || 'PENDING',
                                title: missionData.title,
                                description: missionData.description || null
                            })
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`Failed to create mission: ${errorText}`);
                        }

                        const newMission: Mission = await response.json();

                        // Optimistically update the local state
                        const currentMissions = get().missions;
                        set({
                            missions: [...currentMissions, newMission],
                            error: null
                        });

                        // Refresh missions to ensure full synchronization
                        await get().fetchMissions('PROJECT_MANAGER');

                        return newMission;
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'An error occurred while creating the mission';
                        set({ error: errorMessage });
                        console.error('Error creating mission:', error);
                        return null;
                    }
                },

                startAutoRefresh: (role: UserRole) => {
                    // Désactivé temporairement pour debug
                    return () => { };
                }
            }),
            {
                name: 'mission-storage',
                skipHydration: true,
                storage: createJSONStorage(() => storage),
                partialize: (state) => ({
                    missions: state.missions.map(mission => ({
                        ...mission,
                        title: mission.title || 'Sans titre',
                        project: mission.project ? {
                            ...mission.project,
                            title: mission.project.title || 'Sans titre'
                        } : null
                    }))
                }),
                version: 1
            }
        )
    )
);