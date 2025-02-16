import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from "jwt-decode";

type Role = 'DEVELOPER' | 'PROJECT_MANAGER';

interface JWTPayloadCustom {
    userId: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}

interface AuthState {
    token: string | null;
    role: Role | null;
    userId: string | null;
    email: string | null;
    isAuthenticated: boolean;
    sessionId: string;
    setAuth: (token: string) => void;
    clearAuth: () => void;
}

const AUTH_STORAGE_KEY = 'auth-session';
const AUTH_EVENT = 'auth-session-change';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            role: null,
            userId: null,
            email: null,
            isAuthenticated: false,
            sessionId: '',
            setAuth: (token: string) => {
                console.log('🔵 Tentative de connexion...');

                try {
                    // Vérifier la session existante
                    const existingSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
                    console.log('🔍 Session existante:', existingSession ? 'Oui' : 'Non');

                    const decoded = jwtDecode<JWTPayloadCustom>(token);
                    const newSessionId = crypto.randomUUID();

                    console.log('🔑 Nouveau token décodé:', {
                        role: decoded.role,
                        email: decoded.email,
                        sessionId: newSessionId
                    });

                    // Nettoyer la session précédente
                    sessionStorage.clear();
                    console.log('🧹 Nettoyage des anciennes sessions');

                    // Émission de l'événement pour la synchronisation entre onglets
                    const event = new StorageEvent('storage', {
                        key: AUTH_EVENT,
                        oldValue: existingSession,
                        newValue: JSON.stringify({
                            sessionId: newSessionId,
                            timestamp: Date.now()
                        })
                    });
                    window.dispatchEvent(event);
                    console.log('📢 Événement de changement de session émis');

                    // Mise à jour du state
                    set({
                        token, // On garde le token dans le state pour les vérifications côté client
                        role: decoded.role,
                        userId: decoded.userId,
                        email: decoded.email,
                        isAuthenticated: true,
                        sessionId: newSessionId
                    });
                    console.log('✅ Nouvelle session établie');

                } catch (error) {
                    console.error('❌ Erreur lors de la connexion:', error);
                    set({
                        token: null,
                        role: null,
                        userId: null,
                        email: null,
                        isAuthenticated: false,
                        sessionId: ''
                    });
                }
            },
            clearAuth: async () => {
                console.log('🚪 Déconnexion...');

                try {
                    // Supprimer le cookie côté serveur
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include'
                    });
                } catch (error) {
                    console.error('❌ Erreur lors de la suppression du cookie:', error);
                }

                // Nettoyer le storage
                sessionStorage.removeItem(AUTH_STORAGE_KEY);

                // Réinitialiser le state
                set({
                    token: null,
                    role: null,
                    userId: null,
                    email: null,
                    isAuthenticated: false,
                    sessionId: ''
                });
                console.log('👋 Déconnexion effectuée');
            },
        }),
        {
            name: AUTH_STORAGE_KEY,
            storage: {
                getItem: (name) => {
                    const str = sessionStorage.getItem(name);
                    console.log(`📥 Lecture du storage (${name}):`, str ? 'Données présentes' : 'Vide');
                    if (!str) return null;
                    return JSON.parse(str);
                },
                setItem: (name, value) => {
                    console.log(`📤 Écriture dans le storage (${name})`);
                    sessionStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    console.log(`🗑️ Suppression du storage (${name})`);
                    sessionStorage.removeItem(name);
                },
            },
        }
    )
);