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
import { GradientText } from '@/app/Stylecomponents/GradientText';

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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-[#FF4405]">
                    <Layout className="h-12 w-12 animate-pulse" />
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Chargement du tableau de bord...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {/* Header Section with Logo */}
                <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800 shadow-lg animate-fade-in">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <Layout className="h-8 w-8 text-[#FF4405]" />
                            <h1 className="text-3xl font-semibold">
                                <GradientText>Tableau de Bord</GradientText>
                            </h1>
                        </div>
                        <p className="text-gray-400">
                            Visualisez et gérez vos projets en un coup d'œil
                        </p>
                    </div>
                    <BarChart2 className="h-16 w-16 text-[#FF4405] opacity-50" />
                </div>

                {/* Stats Grid with Animations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="group bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 p-6 shadow-lg hover:border-[#FF4405]/50 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-4">
                            <Users className="h-8 w-8 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                            <div>
                                <h3 className="text-gray-400 text-sm">Clients Totaux</h3>
                                <p className="text-3xl font-semibold mt-1 text-white">{stats.totalClients}</p>
                            </div>
                        </div>
                    </div>
                    <div className="group bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 p-6 shadow-lg hover:border-[#FF4405]/50 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-4">
                            <Briefcase className="h-8 w-8 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                            <div>
                                <h3 className="text-gray-400 text-sm">Projets Actifs</h3>
                                <p className="text-3xl font-semibold mt-1 text-white">{stats.activeProjects}</p>
                            </div>
                        </div>
                    </div>
                    <div className="group bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 p-6 shadow-lg hover:border-[#FF4405]/50 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-4">
                            <CheckCircle className="h-8 w-8 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                            <div>
                                <h3 className="text-gray-400 text-sm">Projets Terminés</h3>
                                <p className="text-3xl font-semibold mt-1 text-white">{stats.completedProjects}</p>
                            </div>
                        </div>
                    </div>
                    <div className="group bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 p-6 shadow-lg hover:border-[#FF4405]/50 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-4">
                            <TrendingUp className="h-8 w-8 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                            <div>
                                <h3 className="text-gray-400 text-sm">Nouveaux Projets (ce mois)</h3>
                                <p className="text-3xl font-semibold mt-1 text-white">{stats.totalProjectsThisMonth}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Projects */}
                    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="h-6 w-6 text-[#FF4405]" />
                            <h3 className="text-xl font-semibold">
                                <GradientText>Échéances à venir</GradientText>
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {stats.upcomingDeadlines.map((project) => (
                                <div
                                    key={project.id}
                                    className="group flex justify-between items-center border border-gray-800/50 rounded-lg p-4 hover:bg-gray-800/30 transition-all duration-300 hover:border-[#FF4405]/30"
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                                        <div>
                                            <h4 className="font-medium text-white">{project.title}</h4>
                                            <p className="text-sm text-gray-400">Client: {project.client.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Échéance</p>
                                        <p className="font-medium text-[#FF4405]">
                                            {new Date(project.endDate!).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {stats.upcomingDeadlines.length === 0 && (
                                <div className="text-center text-gray-400 py-8">
                                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>Aucun projet à échéance proche</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="h-6 w-6 text-[#FF4405]" />
                            <h3 className="text-xl font-semibold">
                                <GradientText>Activité Récente</GradientText>
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {stats.recentProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="group flex justify-between items-center border border-gray-800/50 rounded-lg p-4 hover:bg-gray-800/30 transition-all duration-300 hover:border-[#FF4405]/30"
                                >
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-[#FF4405] group-hover:rotate-12 transition-transform duration-300" />
                                        <div>
                                            <h4 className="font-medium text-white">{project.title}</h4>
                                            <p className="text-sm text-gray-400">Client: {project.client.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Statut</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'EN_COURS' ? 'bg-blue-900/50 text-blue-200 border border-blue-500/20' :
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
                                <div className="text-center text-gray-400 py-8">
                                    <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>Aucune activité récente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}