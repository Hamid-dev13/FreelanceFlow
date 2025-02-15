import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createJSONStorage, StateStorage } from 'zustand/middleware';

// Types
export type MissionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';
export type CreateMissionData = {
    title: string;
    description: string | null;
    deadline: string;
    projectId: string | null;
    assignedToId: string | null;
    status?: MissionStatus;
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
                isHydrated: false,
                fetchMissions: async (role: UserRole) => {
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        const response = await fetch('/api/mission', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        });

                        if (!response.ok) {
                            throw new Error(`Erreur HTTP: ${response.status}`);
                        }

                        const data: Mission[] = await response.json();
                        console.log('Données reçues de l\'API:', data);

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
                        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
                        set({ error: errorMessage });
                    }
                },

                updateMissionStatus: async (id: string, status: MissionStatus) => {
                    const currentMissions = get().missions;
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('No token found');

                        // Mise à jour optimiste
                        set({
                            missions: currentMissions.map(mission =>
                                mission.id === id ? { ...mission, status } : mission
                            )
                        });

                        const response = await fetch(`/api/mission/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ status })
                        });

                        if (!response.ok) {
                            // Restaurer l'état précédent en cas d'erreur
                            set({ missions: currentMissions });
                            throw new Error('Failed to update status');
                        }

                        // Recharger les missions pour assurer la synchronisation
                        await get().fetchMissions('PROJECT_MANAGER');
                    } catch (error) {
                        // Restaurer l'état précédent en cas d'erreur
                        set({ missions: currentMissions });
                        console.error('Error updating status:', error);
                    }
                },

                deleteMission: async (id: string) => {
                    const currentMissions = get().missions;
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('No token found');

                        // Mise à jour optimiste
                        set({
                            missions: currentMissions.filter(mission => mission.id !== id)
                        });

                        const response = await fetch(`/api/mission/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        // Log additional details about the response
                        console.log('Delete Response Status:', response.status);
                        console.log('Delete Response Headers:', Object.fromEntries(response.headers.entries()));

                        if (!response.ok) {
                            // Get more detailed error information
                            const errorText = await response.text();
                            console.error('Delete Mission Error Details:', {
                                status: response.status,
                                statusText: response.statusText,
                                errorText: errorText
                            });

                            // Restaurer l'état précédent en cas d'erreur
                            set({ missions: currentMissions });
                            throw new Error(`Failed to delete mission: ${errorText}`);
                        }

                    } catch (error) {
                        // More comprehensive error logging
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
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('No token found');

                        // Validate required fields
                        if (!missionData.title) {
                            throw new Error('Mission title is required');
                        }

                        const response = await fetch('/api/mission', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
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