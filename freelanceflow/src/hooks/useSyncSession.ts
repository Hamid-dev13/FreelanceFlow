"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export function useSyncSession() {
    const router = useRouter();

    useEffect(() => {
        const syncSession = (e: StorageEvent) => {
            if (e.key === 'token') {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const decoded = jwtDecode(token) as { role: string };
                        // Vérifier le rôle
                        if (decoded.role !== 'PROJECT_MANAGER') {
                            localStorage.removeItem('token');
                            router.push('/login');
                        }
                    } catch (error) {
                        localStorage.removeItem('token');
                        router.push('/login');
                    }
                }
            }
        };

        window.addEventListener('storage', syncSession);
        return () => window.removeEventListener('storage', syncSession);
    }, [router]);
}