"use client";
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    exp: number;
    userId: string;
    type: 'access' | 'refresh';
}

export function useAuthRefresh() {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            const currentToken = localStorage.getItem('token');

            console.log('🔄 Début de la vérification du token');
            console.log('Token actuel:', currentToken);

            if (!currentToken) {
                console.log('❌ Pas de token trouvé');
                return;
            }

            try {
                // Décoder le token
                const decoded = jwtDecode<TokenPayload>(currentToken);

                // Revenir à la condition originale de vérification d'expiration
                const currentTime = Math.floor(Date.now() / 1000);
                const isExpiringSoon = decoded.exp - currentTime < 5 * 60; // Expire dans moins de 5 minutes

                console.log('🕒 Temps actuel:', currentTime);
                console.log('🕰️ Expiration du token:', decoded.exp);
                console.log('⏳ Token expire dans:', decoded.exp - currentTime, 'secondes');
                console.log('🚨 Token proche de l\'expiration ?', isExpiringSoon);

                if (isExpiringSoon) {
                    console.log('🔁 Tentative de refresh du token');

                    // Appeler l'API de refresh
                    const response = await fetch('/api/auth/refresh', {
                        method: 'POST',
                        credentials: 'include' // Important pour envoyer les cookies
                    });

                    console.log('📡 Réponse du serveur:', response.status);

                    if (response.ok) {
                        const { accessToken: newToken } = await response.json();

                        console.log('✅ Nouveau token reçu');

                        // Mettre à jour le token
                        localStorage.setItem('token', newToken);
                        setAccessToken(newToken);
                    } else {
                        // Gérer l'échec du refresh (déconnexion)
                        console.log('❌ Échec du refresh du token');
                        localStorage.removeItem('token');
                        setAccessToken(null);
                    }
                }
            } catch (error) {
                console.error('🚨 Erreur lors du refresh du token:', error);
                localStorage.removeItem('token');
                setAccessToken(null);
            }
        };

        // Vérifier immédiatement
        checkAndRefreshToken();

        // Puis vérifier toutes les 5 minutes
        const intervalId = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

        // Nettoyer l'intervalle
        return () => clearInterval(intervalId);
    }, []);

    return accessToken;
}