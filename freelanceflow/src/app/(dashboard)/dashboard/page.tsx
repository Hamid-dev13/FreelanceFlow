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

type Stats = {
    totalClients: number;
    activeProjects: number;
    upcomingDeadlines: Project[];
    completedProjects: number;
    totalProjectsThisMonth: number;
    recentProjects: Project[];
};

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalClients: 0,
        activeProjects: 0,
        upcomingDeadlines: [],
        completedProjects: 0,
        totalProjectsThisMonth: 0,
        recentProjects: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        const token = localStorage.getItem("token");
        try {
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
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white relative z-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
                {/* Header Section with Logo */}
                <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-800 shadow-lg animate-fade-in relative z-10">
                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                            <Layout className="h-6 w-6 sm:h-8 sm:w-8 text-[#FF4405]" />
                            <h1 className="text-2xl sm:text-3xl font-semibold">
                                Tableau de Bord
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base text-gray-400">
                            Visualisez et gérez vos projets en un coup d'œil
                        </p>
                    </div>
                    <BarChart2 className="h-12 w-12 sm:h-16 sm:w-16 text-[#FF4405] opacity-50" />
                </div>

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
        </div>
    );
}