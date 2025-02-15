"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeveloperLayout } from '@/app/(dashboard)/_components/layouts/developer-layout';
import { ProjectManagerLayout } from '@/app/(dashboard)/_components/layouts/project-manager-layout';

type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch('/api/auth/verify', {
                    credentials: 'include',
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

    // Si pas de rôle mais en chargement, on montre le loading
    if (loading) {
        return <div>Chargement...</div>;
    }

    // Retourner le layout approprié en fonction du rôle
    switch (role) {
        case 'DEVELOPER':
            return <DeveloperLayout>{children}</DeveloperLayout>;
        case 'PROJECT_MANAGER':
            return <ProjectManagerLayout>{children}</ProjectManagerLayout>;
        default:
            return null; // Redirection vers login gérée dans useEffect
    }
}
