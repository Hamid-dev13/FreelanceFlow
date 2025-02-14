import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createJSONStorage, StateStorage } from 'zustand/middleware';

export type Client = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
};

interface ClientState {
    clients: Client[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
    fetchClients: () => Promise<void>;
    createClient: (clientData: Partial<Client>) => Promise<Client | null>;
    updateClient: (id: string, clientData: Partial<Client>) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
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

export const useClientStore = create<ClientState>()(
    devtools(
        persist(
            (set, get) => ({
                clients: [],
                loading: 'idle',
                error: null,

                fetchClients: async () => {
                    set({ loading: 'pending' });
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            throw new Error('Aucun token trouvé');
                        }

                        const response = await fetch('/api/clients', {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        });

                        if (!response.ok) {
                            throw new Error(`Erreur HTTP: ${response.status}`);
                        }

                        const data: Client[] = await response.json();
                        set({
                            clients: data,
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

                createClient: async (clientData) => {
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('Aucun token trouvé');

                        const response = await fetch('/api/clients', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(clientData)
                        });

                        if (!response.ok) {
                            throw new Error(`Échec de la création du client`);
                        }

                        const newClient: Client = await response.json();
                        const currentClients = get().clients;

                        set({
                            clients: [...currentClients, newClient],
                            error: null
                        });

                        return newClient;
                    } catch (error) {
                        const errorMessage = error instanceof Error
                            ? error.message
                            : 'Une erreur est survenue lors de la création du client';

                        set({ error: errorMessage });
                        return null;
                    }
                },

                updateClient: async (id, clientData) => {
                    const currentClients = get().clients;
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('Aucun token trouvé');

                        set({
                            clients: currentClients.map(client =>
                                client.id === id
                                    ? { ...client, ...clientData }
                                    : client
                            )
                        });

                        const response = await fetch(`/api/clients/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(clientData)
                        });

                        if (!response.ok) {
                            set({ clients: currentClients });
                            throw new Error(`Échec de la mise à jour`);
                        }

                        await get().fetchClients();
                    } catch (error) {
                        set({
                            clients: currentClients,
                            error: error instanceof Error ? error.message : 'Erreur de mise à jour'
                        });
                    }
                },

                deleteClient: async (id) => {
                    const currentClients = get().clients;
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('Aucun token trouvé');

                        set({
                            clients: currentClients.filter(client => client.id !== id)
                        });

                        const response = await fetch(`/api/clients/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!response.ok) {
                            set({ clients: currentClients });
                            throw new Error(`Échec de la suppression`);
                        }
                    } catch (error) {
                        set({
                            clients: currentClients,
                            error: error instanceof Error ? error.message : 'Erreur de suppression'
                        });
                        throw error;
                    }
                }
            }),
            {
                name: 'client-storage',
                storage: createJSONStorage(() => storage),
                skipHydration: true,
                partialize: (state) => ({
                    clients: state.clients
                }),
                version: 1
            }
        )
    )
);