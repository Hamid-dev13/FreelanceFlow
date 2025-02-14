"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useLogout() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const logout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Appeler l'API de déconnexion
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include' // Important pour gérer les cookies
            });

            if (response.ok) {
                // Supprimer le token du localStorage
                localStorage.removeItem('token');

                // Rediriger vers la page de connexion
                router.push('/login');
            } else {
                // Gérer les erreurs de déconnexion
                const errorData = await response.json();
                setError(errorData.error || "Erreur de déconnexion");
            }
        } catch (err) {
            console.error("Erreur lors de la déconnexion:", err);
            setError("Impossible de se déconnecter. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return { logout, isLoading, error };
}