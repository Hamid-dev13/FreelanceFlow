// src/stores/useMissionStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type MissionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

export type Mission = {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: MissionStatus;
    assignedToId?: string;
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
};

export type CreateMissionData = {
    title: string;
    description: string;
    deadline: string;
    assignedToId?: string;
};

interface MissionState {
    missions: Mission[];
    loading: boolean;
    error: string | null;

    // Actions communes
    fetchMissions: (role: UserRole) => Promise<void>;

    // Actions Project Manager
    createMission: (missionData: CreateMissionData) => Promise<void>;
    updateMission: (id: string, data: Partial<Omit<Mission, 'id' | 'createdBy'>>) => Promise<void>;
    deleteMission: (id: string) => Promise<void>;
    assignMission: (missionId: string, developerId: string) => Promise<void>;

    // Actions Developer
    updateMissionStatus: (id: string, status: MissionStatus) => Promise<void>;

    // Getters
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
                        const endpoint = role === 'DEVELOPER' ? '/api/mission/assigned' : '/api/mission';
                        console.log('Fetching from endpoint:', endpoint);

                        const response = await fetch(endpoint, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (!response.ok) {
                            throw new Error('Failed to fetch missions');
                        }

                        const data = await response.json();
                        set({ missions: data });
                    } catch (error) {
                        set({ error: error instanceof Error ? error.message : 'An error occurred' });
                    } finally {
                        set({ loading: false });
                    }
                },

                createMission: async (missionData: CreateMissionData) => {
                    set({ loading: true, error: null });
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('/api/mission', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify(missionData)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to create mission');
                        }

                        const newMission = await response.json();
                        set(state => ({
                            missions: [...state.missions, newMission]
                        }));
                    } catch (error) {
                        set({ error: error instanceof Error ? error.message : 'An error occurred' });
                    } finally {
                        set({ loading: false });
                    }
                },

                updateMission: async (id: string, data: Partial<Omit<Mission, 'id' | 'createdBy'>>) => {
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`/api/mission/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify(data)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to update mission');
                        }

                        set(state => ({
                            missions: state.missions.map(mission =>
                                mission.id === id ? { ...mission, ...data } : mission
                            )
                        }));
                    } catch (error) {
                        set({ error: error instanceof Error ? error.message : 'An error occurred' });
                    }
                },

                deleteMission: async (id: string) => {
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`/api/mission/${id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (!response.ok) {
                            throw new Error('Failed to delete mission');
                        }

                        set(state => ({
                            missions: state.missions.filter(mission => mission.id !== id)
                        }));
                    } catch (error) {
                        set({ error: error instanceof Error ? error.message : 'An error occurred' });
                    }
                },

                assignMission: async (missionId: string, developerId: string) => {
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`/api/mission/${missionId}/assign`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({ developerId })
                        });

                        if (!response.ok) {
                            throw new Error('Failed to assign mission');
                        }

                        const updatedMission = await response.json();
                        set(state => ({
                            missions: state.missions.map(mission =>
                                mission.id === missionId ? updatedMission : mission
                            )
                        }));
                    } catch (error) {
                        set({ error: error instanceof Error ? error.message : 'An error occurred' });
                    }
                },

                updateMissionStatus: async (id: string, status: MissionStatus) => {
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`/api/mission/${id}/status`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({ status })
                        });

                        if (!response.ok) {
                            throw new Error('Failed to update mission status');
                        }

                        set(state => ({
                            missions: state.missions.map(mission =>
                                mission.id === id ? { ...mission, status } : mission
                            )
                        }));
                    } catch (error) {
                        set({ error: error instanceof Error ? error.message : 'An error occurred' });
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