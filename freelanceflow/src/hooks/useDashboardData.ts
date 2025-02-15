// hooks/useDashboardData.ts
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

export const useDashboardData = () => {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch('/api/auth/verify');

                if (!response.ok) {
                    router.push('/login');
                    return;
                }

                const data = await response.json();
                setRole(data.role);
            } catch (error) {
                console.error('Erreur de vérification:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [router]);

    return { role, loading };
};