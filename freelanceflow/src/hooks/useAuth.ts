"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

export const useAuth = (requiredRole: UserRole) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { clearAuth, role } = useAuthStore();

    useEffect(() => {
        console.log('🔍 useAuth effect démarré', { requiredRole, currentRole: role });

        const checkAuth = async () => {
            try {
                console.log('🔵 Vérification de l\'authentification');
                const response = await fetch('/api/auth/verify', {
                    credentials: 'include' // Important pour envoyer les cookies
                });

                const data = await response.json();
                console.log('✅ Réponse de vérification:', { ok: response.ok, role: data.role });

                if (!response.ok || data.role !== requiredRole) {
                    console.log('❌ Authentification échouée ou mauvais rôle', {
                        responseOk: response.ok,
                        dataRole: data.role,
                        requiredRole
                    });
                    clearAuth();
                    router.push('/login');
                }
            } catch (error) {
                console.error('❌ Erreur lors de la vérification:', error);
                clearAuth();
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();

        const handleStorageChange = (e: StorageEvent) => {
            console.log('🔄 Événement storage détecté:', {
                key: e.key,
                hasNewValue: !!e.newValue
            });

            if (e.key === 'auth-session') {
                try {
                    const newValue = e.newValue ? JSON.parse(e.newValue) : null;
                    const newState = newValue?.state;

                    if (!newState || newState.role !== requiredRole) {
                        console.log('🚪 Session changée, déconnexion');
                        clearAuth();
                        router.push('/login');
                    }
                } catch (error) {
                    console.error('❌ Erreur traitement storage:', error);
                    clearAuth();
                    router.push('/login');
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        console.log('👂 Écouteur storage ajouté');

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            console.log('🧹 Nettoyage écouteur storage');
        };
    }, [requiredRole, router, clearAuth, role]);

    return { isLoading };
};
