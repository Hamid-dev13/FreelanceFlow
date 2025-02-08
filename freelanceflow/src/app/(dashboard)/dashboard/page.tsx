"use client";

import { useState, useEffect } from "react";





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
};

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalClients: 0,
        activeProjects: 0,
        upcomingDeadlines: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        const token = localStorage.getItem("token");
        try {
            const [clients, projects] = await Promise.all([
                fetch("/api/clients", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const clientsData = await clients.json();
            const projectsData = await projects.json() as Project[];

            setStats({
                totalClients: clientsData.length,
                activeProjects: projectsData.filter((p: Project) => p.status === "EN_COURS").length,
                upcomingDeadlines: projectsData
                    .filter((p: Project) => {
                        if (!p.endDate) return false;
                        return new Date(p.endDate) > new Date();
                    })
                    .sort((a, b) => {
                        if (!a.endDate || !b.endDate) return 0;
                        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                    })
                    .slice(0, 3)
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
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-semibold mb-2">Bienvenue sur votre Dashboard</h1>
                <p className="text-gray-100">
                    Gérez vos projets et suivez vos clients en un seul endroit.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-gray-500 text-sm">Clients Totaux</h3>
                    <p className="text-3xl font-semibold mt-2 text-black">{stats.totalClients}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-gray-500 text-sm">Projets Actifs</h3>
                    <p className="text-3xl font-semibold mt-2 text-black">{stats.activeProjects}</p>
                </div>
            </div>

            {/* Projets à échéance proche */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-black">Projets à échéance proche</h3>
                <div className="space-y-4">
                    {stats.upcomingDeadlines.map((project) => (
                        <div key={project.id} className="flex justify-between items-center border-b pb-4">
                            <div>
                                <h4 className="font-medium">{project.title}</h4>
                                <p className="text-sm text-gray-500">Client: {project.client.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Échéance</p>
                                <p className="font-medium">{new Date(project.endDate!).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
