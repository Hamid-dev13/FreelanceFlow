"use client";
import { ProjectManagerLayout } from '@/app/(dashboard)/_components/layouts/project-manager-layout'
import ProjectManagerDashboard from '@/app/(dashboard)/dashboard/_components/ProjectManagerDashboard';

export default function Page() {
    return (
        <ProjectManagerLayout showNavbar={false}>
            <ProjectManagerDashboard />
        </ProjectManagerLayout>
    );
}