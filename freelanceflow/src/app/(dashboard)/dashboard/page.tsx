"use client";

import { useDashboardData } from '@/hooks/useDashboardData';
import ProjectManagerDashboard from '@/app/(dashboard)/dashboard/_components/ProjectManagerDashoard';
import DeveloperDashboard from '@/app/(dashboard)/dashboard/_components/DeveloperDashboard';
import DashboardLoading from '@/app/(dashboard)/dashboard/_components/shared/DashboardLoading';

export default function DashboardPage() {
    const { role, loading } = useDashboardData();

    console.log("Current role:", role); // Ajoutez ce log

    if (loading) {
        return <DashboardLoading />;
    }

    switch (role) {
        case 'PROJECT_MANAGER':
            console.log("Rendering Project Manager Dashboard");
            return <ProjectManagerDashboard />;
        case 'DEVELOPER':
            console.log("Rendering Developer Dashboard");
            return <DeveloperDashboard />;
        default:
            return <div>Accès non autorisé</div>;
    }
}