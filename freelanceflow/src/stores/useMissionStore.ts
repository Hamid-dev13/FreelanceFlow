import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createMission as createMissionService } from '@/features/missions/services/missionService';
export type MissionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

export type CreateMissionData = {
    title: string;
    description: string;
    deadline: string;
    assignedToId: string | null;
};

export type Mission = {
    id: string;
    title: string;
    description: string | null;
    deadline: string;
    status: MissionStatus;
    assignedToId?: string | null;
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
        name: string;
        status: string;
    } | null;
};

interface MissionState {
    missions: Mission[];
    error: string | null;
    fetchMissions: (role: UserRole) => Promise<void>;
    updateMissionStatus: (id: string, status: MissionStatus) => Promise<void>;
    startAutoRefresh: (role: UserRole) => () => void;
}

export const useMissionStore = create<MissionState>()(
    devtools(
        persist(
            (set, get) => ({
                missions: [],
                error: null,

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
                                'Cache-Control': 'no-cache'
                            }
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`Impossible de récupérer les missions. Status: ${response.status}, Message: ${errorText}`);
                        }

                        const data: Mission[] = await response.json();
                        set({ missions: data, error: null });
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
                        set({ error: errorMessage });
                        console.error('Erreur:', errorMessage);
                    }
                },

                startAutoRefresh: (role: UserRole) => {
                    const interval = setInterval(() => {
                        get().fetchMissions(role);
                    }, 30000); // Toutes les 30 secondes

                    // Retourne une fonction pour arrêter le refresh
                    return () => clearInterval(interval);
                },
                createMission: async (data: CreateMissionData) => {
                    try {
                        // Utiliser le service existant
                        const newMission = await createMissionService(data);

                        // Mise à jour optimiste de la liste des missions
                        set(state => ({
                            missions: [newMission, ...state.missions]
                        }));

                        return newMission;
                    } catch (error) {
                        console.error('Erreur lors de la création de la mission:', error);
                        throw error;
                    }
                },
                updateMissionStatus: async (id: string, status: MissionStatus) => {
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        // Mise à jour optimiste
                        set(state => ({
                            missions: state.missions.map(mission =>
                                mission.id === id ? { ...mission, status } : mission
                            )
                        }));

                        const response = await fetch(`/api/mission/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({ status })
                        });

                        if (!response.ok) {
                            throw new Error('Impossible de mettre à jour le statut');
                        }

                        const updatedMission = await response.json();

                        // Mise à jour finale avec les données du serveur
                        set(state => ({
                            missions: state.missions.map(mission =>
                                mission.id === id ? updatedMission : mission
                            )
                        }));
                    } catch (error) {
                        // En cas d'erreur, on recharge les missions
                        console.error('Erreur de mise à jour:', error);
                        // Recharger les missions en cas d'erreur
                        fetch('/api/mission').then(r => r.json()).then(data => {
                            set({ missions: data });
                        });
                        throw error;
                    }
                }
            }),
            {
                name: 'mission-storage',
                partialize: (state) => ({ missions: state.missions })
            }
        )
    )
);