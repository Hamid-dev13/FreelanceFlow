'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Loader2 } from 'lucide-react';

interface DecodedToken {
    role: 'DEVELOPER' | 'PROJECT_MANAGER';
}

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            if (decoded.role === 'PROJECT_MANAGER') {
                router.push('/project-manager/dashboard');
            } else {
                router.push('/developer/dashboard');
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 text-primary">
                <Loader2 className="h-12 w-12 animate-spin" />
                <span className="text-sm sm:text-base">Redirecting...</span>
            </div>
        </div>
    );
}