'use client';

import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import ProjectManagerDashboard from '@/app/(dashboard)/dashboard/_components/ProjectManagerDashoard';
import DeveloperDashboard from '@/app/(dashboard)/dashboard/_components/DeveloperDashboard';
import DashboardLoading from '@/app/(dashboard)/dashboard/_components/shared/DashboardLoading';

export default function DashboardPage() {
    const { role, loading } = useDashboardData();

    if (loading) {
        return <DashboardLoading />;
    }

    switch (role) {
        case 'PROJECT_MANAGER':
            return <ProjectManagerDashboard />;
        case 'DEVELOPER':
            return <DeveloperDashboard />;
        default:
            return <div>Accès non autorisé</div>;
    }
}