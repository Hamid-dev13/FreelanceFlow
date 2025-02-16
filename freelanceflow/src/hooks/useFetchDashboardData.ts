import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

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
    const { role } = useAuthStore(); // Utiliser le store pour l'authentification

    useEffect(() => {
        const fetchData = async () => {
            console.log("🔵 Début de la récupération des données", {
                endpoint,
                role
            });

            try {
                const response = await fetch(endpoint, {
                    credentials: 'include', // Important : inclure les cookies
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log("📡 Statut de la réponse:", response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("❌ Erreur de réponse:", errorText);
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const result = await response.json();
                console.log("✅ Données récupérées avec succès");

                setData(result);
            } catch (err) {
                console.error("❌ Erreur lors de la récupération:", err);
                setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
            } finally {
                setLoading(false);
            }
        };

        if (role) { // Ne faire l'appel que si on a un rôle
            fetchData();
        }
    }, [endpoint, role]);

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