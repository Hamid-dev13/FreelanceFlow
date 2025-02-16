import { create } from 'zustand';
import { devtools, persist, createJSONStorage, StateStorage } from 'zustand/middleware';

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
    searchQuery: string;
    fetchClients: () => Promise<void>;
    setSearchQuery: (query: string) => void;
    createClient: (clientData: Partial<Client>) => Promise<Client | null>;
    updateClient: (id: string, clientData: Partial<Client>) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
}

const storage: StateStorage = {
    getItem: (name: string): string | null => {
        try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            return null;
        }
    },
    setItem: (name: string, value: string): void => {
        try {
            localStorage.setItem(name, JSON.stringify(value));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    },
    removeItem: (name: string): void => {
        try {
            localStorage.removeItem(name);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    },
};

export const useClientStore = create<ClientState>()(
    devtools(
        persist(
            (set, get) => ({
                clients: [],
                loading: 'idle',
                error: null,
                searchQuery: '',

                setSearchQuery: (query) => set({ searchQuery: query }),

                fetchClients: async () => {
                    console.log('🔵 Début de fetchClients');
                    console.log('🔵 État actuel:', {
                        clientsLength: get().clients.length,
                        loading: get().loading,
                        error: get().error
                    });

                    set({ loading: 'pending' });
                    try {
                        const response = await fetch('/api/clients', {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        console.log('📡 Réponse de la requête:', response.status);

                        if (!response.ok) {
                            if (response.status === 401) {
                                throw new Error('Authentification requise');
                            }
                            const errorData = await response.json();
                            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
                        }

                        const data: Client[] = await response.json();
                        console.log('✅ Clients récupérés:', data.length);

                        set({
                            clients: data,
                            loading: 'succeeded',
                            error: null
                        });
                    } catch (error) {
                        console.error('❌ Erreur fetchClients:', error);
                        set({
                            loading: 'failed',
                            error: error instanceof Error ? error.message : 'Erreur de récupération des clients'
                        });
                    }
                },

                createClient: async (clientData) => {
                    try {
                        const response = await fetch('/api/clients', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(clientData)
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Échec de la création du client');
                        }

                        const newClient: Client = await response.json();
                        set(state => ({
                            clients: [...state.clients, newClient],
                            error: null
                        }));

                        return newClient;
                    } catch (error) {
                        console.error('❌ Erreur createClient:', error);
                        set({
                            error: error instanceof Error ? error.message : 'Erreur lors de la création du client'
                        });
                        return null;
                    }
                },

                updateClient: async (id, clientData) => {
                    const currentClients = get().clients;
                    try {
                        // Optimistic update
                        set({
                            clients: currentClients.map(client =>
                                client.id === id
                                    ? { ...client, ...clientData, updatedAt: new Date().toISOString() }
                                    : client
                            )
                        });

                        const response = await fetch(`/api/clients/${id}`, {
                            method: 'PUT',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(clientData)
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Échec de la mise à jour');
                        }

                        await get().fetchClients(); // Refetch pour assurer la cohérence
                    } catch (error) {
                        console.error('❌ Erreur updateClient:', error);
                        set({
                            clients: currentClients,
                            error: error instanceof Error ? error.message : 'Erreur de mise à jour'
                        });
                    }
                },

                deleteClient: async (id) => {
                    const currentClients = get().clients;
                    try {
                        // Optimistic deletion
                        set({
                            clients: currentClients.filter(client => client.id !== id)
                        });

                        const response = await fetch(`/api/clients/${id}`, {
                            method: 'DELETE',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Échec de la suppression');
                        }
                    } catch (error) {
                        console.error('❌ Erreur deleteClient:', error);
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

export const useFilteredClients = () => {
    const { clients, searchQuery } = useClientStore();

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.phone && client.phone.includes(searchQuery))
    );

    console.log('🔍 Clients filtrés:', filteredClients.length);
    return filteredClients;
};