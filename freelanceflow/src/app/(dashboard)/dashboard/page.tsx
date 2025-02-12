"use client";

import { useState, useEffect } from "react";
import {
    Loader2,
    Users,
    Briefcase,
    CheckCircle,
    TrendingUp,
    Calendar,
    Clock,
    AlertCircle,
    Activity,
    BarChart2,
    Layout
} from 'lucide-react';

type Project = {
    id: string;
    title: string;
    status: string;
    endDate?: string;
    startDate: string;
    client: {
        id: string;
        name: string;
    };
};

type Mission = {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
};

type Stats = {
    totalClients: number;
    activeProjects: number;
    upcomingDeadlines: Project[];
    completedProjects: number;
    totalProjectsThisMonth: number;
    recentProjects: Project[];
};

interface DashboardPageProps {
    userRole: 'DEVELOPER' | 'PROJECT_MANAGER';
}

export default function DashboardPage({ userRole }: DashboardPageProps) {
    const [stats, setStats] = useState<Stats>({
        totalClients: 0,
        activeProjects: 0,
        upcomingDeadlines: [],
        completedProjects: 0,
        totalProjectsThisMonth: 0,
        recentProjects: []
    });
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        const token = localStorage.getItem("token");
        try {
            if (userRole === 'PROJECT_MANAGER') {
                const [clients, projects] = await Promise.all([
                    fetch("/api/clients", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const thisMonth = new Date().getMonth();
                const thisYear = new Date().getFullYear();

                const clientsData = await clients.json();
                const projectsData = await projects.json() as Project[];

                setStats({
                    totalClients: clientsData.length,
                    activeProjects: projectsData.filter(p => p.status === "EN_COURS").length,
                    completedProjects: projectsData.filter(p => p.status === "TERMINE").length,
                    totalProjectsThisMonth: projectsData.filter(p => {
                        const projectDate = new Date(p.startDate);
                        return projectDate.getMonth() === thisMonth &&
                            projectDate.getFullYear() === thisYear;
                    }).length,
                    upcomingDeadlines: projectsData
                        .filter((p: Project) => {
                            if (!p.endDate) return false;
                            return new Date(p.endDate) > new Date();
                        })
                        .sort((a, b) => {
                            if (!a.endDate || !b.endDate) return 0;
                            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                        })
                        .slice(0, 3),
                    recentProjects: [...projectsData]
                        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                        .slice(0, 5)
                });
            } else {
                // Pour les développeurs, charger leurs missions
                const missionsResponse = await fetch("/api/missions", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const missionsData = await missionsResponse.json();
                setMissions(missionsData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [userRole]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4 text-[#FF4405]">
                    <Layout className="h-12 w-12 animate-pulse" />
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-sm sm:text-base">Chargement du tableau de bord...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (userRole === 'PROJECT_MANAGER') {
        return (
            <div className="space-y-6 sm:space-y-8">
                {/* Stats Grid with Animations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
                    {[
                        { icon: Users, label: "Clients Totaux", value: stats.totalClients },
                        { icon: Briefcase, label: "Projets Actifs", value: stats.activeProjects },
                        { icon: CheckCircle, label: "Projets Terminés", value: stats.completedProjects },
                        { icon: TrendingUp, label: "Nouveaux Projets (ce mois)", value: stats.totalProjectsThisMonth }
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="group bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 sm:p-6 shadow-lg hover:border-[#FF4405]/50 transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                                <div>
                                    <h3 className="text-gray-400 text-xs sm:text-sm">{label}</h3>
                                    <p className="text-2xl sm:text-3xl font-semibold mt-1 text-white">{value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                    {/* Upcoming Projects */}
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 sm:p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF4405]" />
                            <h3 className="text-lg sm:text-xl font-semibold">Échéances à venir</h3>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {stats.upcomingDeadlines.map((project) => (
                                <div
                                    key={project.id}
                                    className="group flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-800/50 rounded-lg p-3 sm:p-4 hover:bg-gray-800/30 transition-all duration-300 hover:border-[#FF4405]/30 space-y-2 sm:space-y-0"
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                                        <div>
                                            <h4 className="font-medium text-sm sm:text-base text-white">{project.title}</h4>
                                            <p className="text-xs sm:text-sm text-gray-400">Client: {project.client.name}</p>
                                        </div>
                                    </div>
                                    <div className="ml-8 sm:ml-0 sm:text-right">
                                        <p className="text-xs sm:text-sm text-gray-400">Échéance</p>
                                        <p className="font-medium text-xs sm:text-sm text-[#FF4405]">
                                            {new Date(project.endDate!).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {stats.upcomingDeadlines.length === 0 && (
                                <div className="text-center text-gray-400 py-6 sm:py-8">
                                    <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm sm:text-base">Aucun projet à échéance proche</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 sm:p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF4405]" />
                            <h3 className="text-lg sm:text-xl font-semibold">Activité Récente</h3>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {stats.recentProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="group flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-800/50 rounded-lg p-3 sm:p-4 hover:bg-gray-800/30 transition-all duration-300 hover:border-[#FF4405]/30 space-y-2 sm:space-y-0"
                                >
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                                        <div>
                                            <h4 className="font-medium text-sm sm:text-base text-white">{project.title}</h4>
                                            <p className="text-xs sm:text-sm text-gray-400">Client: {project.client.name}</p>
                                        </div>
                                    </div>
                                    <div className="ml-8 sm:ml-0 sm:text-right">
                                        <p className="text-xs sm:text-sm text-gray-400">Statut</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${project.status === 'EN_COURS' ? 'bg-blue-900/50 text-blue-200 border border-blue-500/20' :
                                            project.status === 'TERMINE' ? 'bg-green-900/50 text-green-200 border border-green-500/20' :
                                                'bg-yellow-900/50 text-yellow-200 border border-yellow-500/20'
                                            }`}>
                                            {project.status === 'EN_COURS' ? 'En cours' :
                                                project.status === 'TERMINE' ? 'Terminé' : 'En pause'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {stats.recentProjects.length === 0 && (
                                <div className="text-center text-gray-400 py-6 sm:py-8">
                                    <Activity className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm sm:text-base">Aucune activité récente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header principal */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Layout className="h-6 w-6 text-[#FF4405]" />
                        <h1 className="text-xl font-semibold text-white">Tableau de Bord</h1>
                    </div>
                    <p className="text-gray-400 mt-1">Visualisez et gérez vos projets en un coup d'œil</p>
                </div>
                <div className="text-[#FF4405] opacity-50">
                    <BarChart2 className="h-12 w-12" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center gap-4">
                        <Users className="h-8 w-8 text-[#FF4405]" />
                        <div>
                            <p className="text-gray-400 text-sm">Missions Totales</p>
                            <p className="text-2xl font-semibold">{missions.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center gap-4">
                        <Clock className="h-8 w-8 text-[#FF4405]" />
                        <div>
                            <p className="text-gray-400 text-sm">En Cours</p>
                            <p className="text-2xl font-semibold">
                                {missions.filter(m => m.status === 'IN_PROGRESS').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center gap-4">
                        <AlertCircle className="h-8 w-8 text-[#FF4405]" />
                        <div>
                            <p className="text-gray-400 text-sm">En Attente</p>
                            <p className="text-2xl font-semibold">
                                {missions.filter(m => m.status === 'PENDING').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid à deux colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Échéances à venir */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="h-6 w-6 text-[#FF4405]" />
                        <h2 className="text-xl font-semibold">Échéances à venir</h2>
                    </div>
                    {missions.filter(m => m.status !== 'COMPLETED').length > 0 ? (
                        <div className="space-y-4">
                            {missions
                                .filter(m => m.status !== 'COMPLETED')
                                .map(mission => (
                                    <div
                                        key={mission.id}
                                        className="group flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-800/50 rounded-lg p-4 hover:bg-gray-800/30 transition-all duration-300 hover:border-[#FF4405]/30"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                                            <div>
                                                <h4 className="font-medium text-white">{mission.title}</h4>
                                                <p className="text-sm text-gray-400">{mission.description}</p>
                                            </div>
                                        </div>
                                        <div className="ml-8 sm:ml-0 text-right">
                                            <p className="text-sm text-gray-400">Échéance</p>
                                            <p className="font-medium text-[#FF4405]">
                                                {new Date(mission.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Aucun projet à échéance proche</p>
                        </div>
                    )}
                </div>

                {/* Activité Récente */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="h-6 w-6 text-[#FF4405]" />
                        <h2 className="text-xl font-semibold">Activité Récente</h2>
                    </div>
                    {missions.length > 0 ? (
                        <div className="space-y-4">
                            {missions.map(mission => (
                                <div
                                    key={mission.id}
                                    className="group flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-800/50 rounded-lg p-4 hover:bg-gray-800/30 transition-all duration-300 hover:border-[#FF4405]/30"
                                >
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                                        <div>
                                            <h4 className="font-medium text-white">{mission.title}</h4>
                                            <p className="text-sm text-gray-400">{mission.description}</p>
                                        </div>
                                    </div>
                                    <div className="ml-8 sm:ml-0 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mission.status === 'COMPLETED' ? 'bg-green-900/50 text-green-200 border border-green-500/20' :
                                            mission.status === 'IN_PROGRESS' ? 'bg-blue-900/50 text-blue-200 border border-blue-500/20' :
                                                'bg-yellow-900/50 text-yellow-200 border border-yellow-500/20'
                                            }`}>
                                            {mission.status === 'COMPLETED' ? 'Terminé' :
                                                mission.status === 'IN_PROGRESS' ? 'En cours' :
                                                    'En attente'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Aucune activité récente</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}