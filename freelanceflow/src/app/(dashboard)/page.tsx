/*"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Loader2 } from 'lucide-react';

export default function DashboardRootPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token) as { role: 'DEVELOPER' | 'PROJECT_MANAGER' };
            if (decoded.role === 'PROJECT_MANAGER') {
                router.push('/project-manager/dashboard');
            } else {
                router.push('/developer/dashboard');
            }
        } catch (error) {
            console.error("Erreur de décodage du token:", error);
            localStorage.removeItem("token");
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4 text-[#FF4405]">
                <Loader2 className="h-12 w-12 animate-spin" />
                <span className="text-sm sm:text-base">Redirection...</span>
            </div>
        </div>
    );
}*/