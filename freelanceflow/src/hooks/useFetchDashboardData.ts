import { useState, useEffect } from 'react';

// Types partagés pour les données
export interface Project {
    id: string;
    title: string;
    status: string;
    endDate?: string;
    startDate: string;
    client: {
        id: string;
        name: string;
    };
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

// Hook personnalisé pour récupérer les données du tableau de bord
export function useFetchDashboardData<T>(endpoint: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            console.log("Token utilisé :", token); // Log du token
            console.log("Endpoint :", endpoint); // Log de l'endpoint

            try {
                const response = await fetch(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Statut de la réponse :", response.status); // Log du statut de la réponse

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Erreur de réponse :", errorText);
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const result = await response.json();
                console.log("Données récupérées :", result); // Log des données

                setData(result);
            } catch (err) {
                console.error("Erreur de fetch :", err);
                setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    return { data, loading, error };
}

// Types pour les statistiques
export interface ProjectManagerStats {
    totalClients: number;
    activeProjects: number;
    completedProjects: number;
    totalProjectsThisMonth: number;
    upcomingDeadlines: Project[];
    recentProjects: Project[];
}

export interface DeveloperStats {
    totalMissions: number;
    inProgressMissions: number;
    pendingMissions: number;
    upcomingDeadlines: Mission[];
}