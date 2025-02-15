// src/app/(dashboard)/layout.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLoading from '@/app/(dashboard)/dashboard/_components/shared/DashboardLoading'; // Ajustez le chemin selon votre structure

type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch('/api/auth/verify', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    setRole(null);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setRole(data.role);
                setLoading(false);
            } catch (error) {
                console.error('Erreur de vérification:', error);
                setRole(null);
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    // Effet séparé pour la redirection
    useEffect(() => {
        if (!loading && !role) {
            router.push('/login');
        }
    }, [loading, role, router]);

    if (loading) {
        return <DashboardLoading />; // Ou votre composant de chargement
    }

    // Si pas de rôle mais en chargement, on montre le loading
    if (!role) {
        return null; // On retourne null pendant que la redirection se fait
    }

    return <>{children}</>;
}