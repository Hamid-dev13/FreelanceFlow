import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createJSONStorage, StateStorage } from 'zustand/middleware';

// Types
export type MissionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

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
    startAutoRefresh: (role: UserRole) => () => void;
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
                isHydrated: false, // Nouvel état pour suivre l'hydration
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

                        // S'assurer que toutes les missions ont un titre
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