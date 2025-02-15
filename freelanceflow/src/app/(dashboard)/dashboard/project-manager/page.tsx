"use client";

import { ProjectManagerLayout } from '@/app/(dashboard)/_components/layouts/project-manager-layout'

import ProjectManagerDashboard from '@/app/(dashboard)/dashboard/_components/ProjectManagerDashoard';


export default function Page() {
    return (
        <ProjectManagerLayout>
            <ProjectManagerDashboard />
        </ProjectManagerLayout>
    );
}