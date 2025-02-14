"use client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectManagerLayout } from '@/app/(dashboard)/_components';
import { DeveloperLayout } from '@/app/(dashboard)/_components/';
import { Layout } from "lucide-react";
import { useAuthRefresh } from '@/hooks/useAuthRefresh';
import { useSyncSession } from '@/hooks/useSyncSession'; // Importer le hook

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

    // Ajouter le hook de synchronisation de session
    useSyncSession();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedRole = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_role='))
            ?.split('=')[1];

        console.log("🔐 DEBUG - Token récupéré:", token);
        console.log("🕵️ DEBUG - Rôle stocké dans les cookies:", storedRole);

        if (!token) {
            router.push("/login");
        } else {
            try {
                const decoded = jwtDecode(token) as { role: UserRole };

                console.log("🔍 DEBUG - Token décodé:", decoded);
                console.log("🎭 DEBUG - Rôle décodé:", decoded.role);
                console.log("🍪 DEBUG - Comparaison des rôles:",
                    `Décodé: ${decoded.role}, Stocké: ${storedRole}`
                );

                // Vérification croisée des rôles
                if (storedRole && decoded.role !== storedRole) {
                    console.warn("⚠️ ALERTE : Incohérence de rôle détectée");
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }

                setRole(decoded.role);
                setLoading(false);
            } catch (error) {
                console.error("❌ Erreur de décodage du token:", error);
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