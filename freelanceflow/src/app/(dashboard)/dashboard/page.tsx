"use client";

import React from 'react'; // Ajoutez cet import
import { useDashboardData } from '@/hooks/useDashboardData';
import ProjectManagerDashboard from '@/app/(dashboard)/dashboard/_components/ProjectManagerDashoard';
import DeveloperDashboard from '@/app/(dashboard)/dashboard/_components/DeveloperDashboard';
import DashboardLoading from '@/app/(dashboard)/dashboard/_components/shared/DashboardLoading';

// Supprimez toute définition de DashboardPageProps si elle existe ailleurs

export default function DashboardPage(): React.JSX.Element {
    const { role, loading } = useDashboardData();

    console.log("Current role:", role);

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