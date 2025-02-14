"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectManagerLayout } from '@/app/(dashboard)/_components';
import { DeveloperLayout } from '@/app/(dashboard)/_components/';
import { Layout } from "lucide-react";
import { useAuthRefresh } from '@/hooks/useAuthRefresh'; // Importer le nouveau hook

type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [role, setRole] = useState<UserRole | null>(null);

    // Utiliser le hook de refresh de token
    const refreshedToken = useAuthRefresh();

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("DEBUG - Token récupéré:", token);
        if (!token) {
            router.push("/login");
        } else {
            try {
                const decoded = jwtDecode(token) as { role: UserRole };
                console.log("DEBUG - Token décodé:", decoded);
                setRole(decoded.role);
                setLoading(false);
            } catch (error) {
                console.error("Erreur de décodage du token:", error);
                localStorage.removeItem("token");
                router.push("/login");
            }
        }
    }, [router, refreshedToken]); // Ajouter refreshedToken comme dépendance

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4 text-[#FF4405]">
                    <Layout className="h-12 w-12 animate-pulse" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base animate-pulse">Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }
    return role === 'PROJECT_MANAGER' ? (
        <ProjectManagerLayout>
            {children}
        </ProjectManagerLayout>
    ) : (
        <DeveloperLayout>{children}</DeveloperLayout>
    );
}