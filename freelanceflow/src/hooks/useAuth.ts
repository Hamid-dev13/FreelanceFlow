// src/hooks/useAuth.ts
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

export const useAuth = (requiredRole: UserRole) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Appel à une nouvelle API route pour vérifier le token
                const response = await fetch('/api/auth/verify');
                const data = await response.json();

                if (!response.ok || data.role !== requiredRole) {
                    router.push('/login');
                }
            } catch (error) {
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [requiredRole, router]);

    return { isLoading };
};