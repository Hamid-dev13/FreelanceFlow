"use client";

import {
    Users,
    Briefcase,
    CheckCircle,
    TrendingUp,
    Calendar,
    Activity
} from 'lucide-react';

import {
    useFetchDashboardData,
    Project,
    ProjectManagerStats
} from '@/hooks/useFetchDashboardData';

import DashboardStatCard from '@/app/(dashboard)/dashboard/_components/shared/DashboardCard';
import DashboardSection from '@/app/(dashboard)/dashboard/_components/shared/DashboardSection';

export default function ProjectManagerDashboard() {
    const {
        data: projects,
        loading: projectsLoading
    } = useFetchDashboardData<Project>('/api/projects');

    const calculateStats = (): ProjectManagerStats => {
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();

        return {
            totalClients: projects.length,
            activeProjects: projects.filter(p => p.status === "EN_COURS").length,
            completedProjects: projects.filter(p => p.status === "TERMINE").length,
            totalProjectsThisMonth: projects.filter(p => {
                const projectDate = new Date(p.startDate);
                return projectDate.getMonth() === thisMonth &&
                    projectDate.getFullYear() === thisYear;
            }).length,
            upcomingDeadlines: projects
                .filter(p => p.endDate && new Date(p.endDate) > new Date())
                .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
                .slice(0, 3),
            recentProjects: [...projects]
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .slice(0, 5)
        };
    };

    const stats = calculateStats();

    if (projectsLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <DashboardStatCard
                    icon={Users}
                    label="Clients Totaux"
                    value={stats.totalClients}
                />
                <DashboardStatCard
                    icon={Briefcase}
                    label="Projets Actifs"
                    value={stats.activeProjects}
                />
                <DashboardStatCard
                    icon={CheckCircle}
                    label="Projets Terminés"
                    value={stats.completedProjects}
                />
                <DashboardStatCard
                    icon={TrendingUp}
                    label="Nouveaux Projets (ce mois)"
                    value={stats.totalProjectsThisMonth}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardSection
                    icon={Calendar}
                    title="Échéances à venir"
                    emptyMessage="Aucun projet à échéance proche"
                >
                    {stats.upcomingDeadlines.map((project) => (
                        <div
                            key={project.id}
                            className="flex justify-between items-center p-4 border-b border-gray-800 last:border-b-0"
                        >
                            <div>
                                <h4 className="font-semibold">{project.title}</h4>
                                <p className="text-sm text-gray-400">
                                    Client: {project.client.name}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Échéance</p>
                                <p className="text-[#FF4405]">
                                    {new Date(project.endDate!).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </DashboardSection>

                <DashboardSection
                    icon={Activity}
                    title="Activité Récente"
                    emptyMessage="Aucune activité récente"
                >
                    {stats.recentProjects.map((project) => (
                        <div
                            key={project.id}
                            className="flex justify-between items-center p-4 border-b border-gray-800 last:border-b-0"
                        >
                            <div>
                                <h4 className="font-semibold">{project.title}</h4>
                                <p className="text-sm text-gray-400">
                                    Client: {project.client.name}
                                </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'EN_COURS' ? 'bg-blue-900/50 text-blue-200' :
                                project.status === 'TERMINE' ? 'bg-green-900/50 text-green-200' :
                                    'bg-yellow-900/50 text-yellow-200'
                                }`}>
                                {project.status === 'EN_COURS' ? 'En cours' :
                                    project.status === 'TERMINE' ? 'Terminé' : 'En pause'}
                            </span>
                        </div>
                    ))}
                </DashboardSection>
            </div>
        </div>
    );
}