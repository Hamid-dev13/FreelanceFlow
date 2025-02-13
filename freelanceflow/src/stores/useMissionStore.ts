// src/stores/useMissionStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type MissionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

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

export type CreateMissionData = {
    title: string;
    description?: string;
    deadline: string;
    assignedToId?: string;
    projectId?: string;
};

interface MissionState {
    missions: Mission[];
    loading: boolean;
    error: string | null;

    fetchMissions: (role: UserRole) => Promise<void>;
    createMission: (missionData: CreateMissionData) => Promise<void>;
    updateMission: (id: string, data: Partial<Omit<Mission, 'id' | 'createdBy'>>) => Promise<void>;
    deleteMission: (id: string) => Promise<void>;
    assignMission: (missionId: string, developerId: string) => Promise<void>;
    updateMissionStatus: (id: string, status: MissionStatus) => Promise<void>;

    getMissionById: (id: string) => Mission | undefined;
    getFilteredMissions: (status: MissionStatus) => Mission[];
    getDeveloperMissions: (developerId: string) => Mission[];
    getManagerMissions: (managerId: string) => Mission[];
}

export const useMissionStore = create<MissionState>()(
    devtools(
        persist(
            (set, get) => ({
                missions: [],
                loading: false,
                error: null,

                fetchMissions: async (role: UserRole) => {
                    set({ loading: true, error: null });
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        const response = await fetch('/api/mission', {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Impossible de récupérer les missions');
                        }

                        const data: Mission[] = await response.json();
                        console.log('Missions récupérées:', data);

                        set({ missions: data });
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
                        set({
                            error: errorMessage,
                            missions: []
                        });
                        console.error('Erreur de récupération des missions:', errorMessage);
                    } finally {
                        set({ loading: false });
                    }
                },

                createMission: async (missionData: CreateMissionData) => {
                    set({ loading: true, error: null });
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        const response = await fetch('/api/mission', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify(missionData)
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Impossible de créer la mission');
                        }

                        const newMission = await response.json();
                        set(state => ({
                            missions: [...state.missions, newMission]
                        }));
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
                        set({
                            error: errorMessage,
                            loading: false
                        });
                        console.error('Erreur de création de mission:', errorMessage);
                    } finally {
                        set({ loading: false });
                    }
                },

                updateMission: async (id: string, data: Partial<Omit<Mission, 'id' | 'createdBy'>>) => {
                    set({ loading: true, error: null });
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        const response = await fetch(`/api/mission/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify(data)
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Impossible de mettre à jour la mission');
                        }

                        const updatedMission = await response.json();
                        set(state => ({
                            missions: state.missions.map(mission =>
                                mission.id === id ? updatedMission : mission
                            )
                        }));
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
                        set({
                            error: errorMessage,
                            loading: false
                        });
                        console.error('Erreur de mise à jour de mission:', errorMessage);
                    } finally {
                        set({ loading: false });
                    }
                },

                deleteMission: async (id: string) => {
                    set({ loading: true, error: null });
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        const response = await fetch(`/api/mission/${id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Impossible de supprimer la mission');
                        }

                        set(state => ({
                            missions: state.missions.filter(mission => mission.id !== id)
                        }));
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
                        set({
                            error: errorMessage,
                            loading: false
                        });
                        console.error('Erreur de suppression de mission:', errorMessage);
                    } finally {
                        set({ loading: false });
                    }
                },

                assignMission: async (missionId: string, developerId: string) => {
                    set({ loading: true, error: null });
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        const response = await fetch(`/api/mission/${missionId}/assign`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({ developerId })
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Impossible d\'assigner la mission');
                        }

                        const updatedMission = await response.json();
                        set(state => ({
                            missions: state.missions.map(mission =>
                                mission.id === missionId ? updatedMission : mission
                            )
                        }));
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
                        set({
                            error: errorMessage,
                            loading: false
                        });
                        console.error('Erreur d\'assignation de mission:', errorMessage);
                    } finally {
                        set({ loading: false });
                    }
                },

                updateMissionStatus: async (id: string, status: MissionStatus) => {
                    set({ loading: true, error: null });
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        const response = await fetch(`/api/mission/${id}/status`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({ status })
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Impossible de mettre à jour le statut');
                        }

                        const updatedMission = await response.json();
                        set(state => ({
                            missions: state.missions.map(mission =>
                                mission.id === id ? updatedMission : mission
                            )
                        }));
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
                        set({
                            error: errorMessage,
                            loading: false
                        });
                        console.error('Erreur de mise à jour du statut:', errorMessage);
                    } finally {
                        set({ loading: false });
                    }
                },

                getMissionById: (id: string) => {
                    return get().missions.find(mission => mission.id === id);
                },

                getFilteredMissions: (status: MissionStatus) => {
                    return get().missions.filter(mission => mission.status === status);
                },

                getDeveloperMissions: (developerId: string) => {
                    return get().missions.filter(mission => mission.assignedToId === developerId);
                },

                getManagerMissions: (managerId: string) => {
                    return get().missions.filter(mission => mission.createdById === managerId);
                }
            }),
            {
                name: 'mission-storage',
                partialize: (state) => ({ missions: state.missions })
            }
        )
    )
);