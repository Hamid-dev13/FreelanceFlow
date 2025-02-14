import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createJSONStorage, StateStorage } from 'zustand/middleware';

// Types
export type ProjectStatus = 'EN_COURS' | 'TERMINE' | 'EN_PAUSE';

export type Project = {
    id: string;
    title: string;
    description?: string;
    status: ProjectStatus;
    startDate: string;
    endDate?: string;
    clientId: string;
    client: {
        id: string;
        name: string;
        email: string;
    };
};

interface ProjectState {
    projects: Project[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
    fetchProjects: () => Promise<void>;
    createProject: (projectData: Partial<Project>) => Promise<Project | null>;
    updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
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

export const useProjectStore = create<ProjectState>()(
    devtools(
        persist(
            (set, get) => ({
                projects: [],
                loading: 'idle',
                error: null,

                fetchProjects: async () => {
                    set({ loading: 'pending' });
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        const response = await fetch('/api/projects', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        });

                        if (!response.ok) {
                            throw new Error(`Erreur HTTP: ${response.status}`);
                        }

                        const data: Project[] = await response.json();
                        const validatedData = data.map(project => ({
                            ...project,
                            title: project.title || 'Sans titre',
                            description: project.description || 'Aucune description'
                        }));

                        set({
                            projects: validatedData,
                            loading: 'succeeded',
                            error: null
                        });
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
                        set({
                            loading: 'failed',
                            error: errorMessage
                        });
                    }
                },

                createProject: async (projectData) => {
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('Aucun token trouvé');

                        if (!projectData.title) {
                            throw new Error('Le titre du projet est requis');
                        }

                        const response = await fetch('/api/projects', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ...projectData,
                                status: projectData.status || 'EN_COURS',
                                title: projectData.title
                            })
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`Échec de la création du projet: ${errorText}`);
                        }

                        const newProject: Project = await response.json();
                        const currentProjects = get().projects;

                        set({
                            projects: [...currentProjects, newProject],
                            error: null
                        });

                        return newProject;
                    } catch (error) {
                        const errorMessage = error instanceof Error
                            ? error.message
                            : 'Une erreur est survenue lors de la création du projet';

                        set({ error: errorMessage });
                        console.error('Erreur de création de projet:', error);
                        return null;
                    }
                },

                updateProject: async (id, projectData) => {
                    const currentProjects = get().projects;
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('Aucun token trouvé');

                        // Mise à jour optimiste
                        set({
                            projects: currentProjects.map(project =>
                                project.id === id
                                    ? { ...project, ...projectData }
                                    : project
                            )
                        });

                        const response = await fetch(`/api/projects/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(projectData)
                        });

                        if (!response.ok) {
                            // Restaurer l'état précédent en cas d'erreur
                            set({ projects: currentProjects });
                            const errorText = await response.text();
                            throw new Error(`Échec de la mise à jour: ${errorText}`);
                        }

                        // Recharger les projets pour garantir la synchronisation
                        await get().fetchProjects();
                    } catch (error) {
                        // Restaurer l'état précédent en cas d'erreur
                        set({
                            projects: currentProjects,
                            error: error instanceof Error ? error.message : 'Erreur de mise à jour'
                        });
                        console.error('Erreur de mise à jour:', error);
                    }
                },

                deleteProject: async (id) => {
                    const currentProjects = get().projects;
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('Aucun token trouvé');

                        // Mise à jour optimiste
                        set({
                            projects: currentProjects.filter(project => project.id !== id)
                        });

                        const response = await fetch(`/api/projects/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!response.ok) {
                            // Restaurer l'état précédent en cas d'erreur
                            set({ projects: currentProjects });
                            const errorText = await response.text();
                            throw new Error(`Échec de la suppression: ${errorText}`);
                        }
                    } catch (error) {
                        // Restaurer l'état précédent en cas d'erreur
                        set({
                            projects: currentProjects,
                            error: error instanceof Error ? error.message : 'Erreur de suppression'
                        });
                        console.error('Erreur de suppression:', error);
                        throw error;
                    }
                }
            }),
            {
                name: 'project-storage',
                storage: createJSONStorage(() => storage),
                skipHydration: true,
                partialize: (state) => ({
                    projects: state.projects.map(project => ({
                        ...project,
                        title: project.title || 'Sans titre'
                    }))
                }),
                version: 1
            }
        )
    )
);