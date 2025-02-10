"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectManagerLayout } from '@/app/(dashboard)/ProjectManagerLayout';
import { DeveloperLayout } from '@/app/(dashboard)/DeveloperLayout';
import { Layout } from "lucide-react";

type UserRole = 'CHEF_PROJET' | 'FREELANCE';

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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            try {
                const decoded = jwtDecode(token) as { role: UserRole };
                setRole(decoded.role);
                setLoading(false);
            } catch (error) {
                console.error("Erreur de décodage du token:", error);
                localStorage.removeItem("token");
                router.push("/login");
            }
        }
    }, [router]);

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

    return role === 'CHEF_PROJET' ? (
        <ProjectManagerLayout>{children}</ProjectManagerLayout>
    ) : (
        <DeveloperLayout>{children}</DeveloperLayout>
    );
}