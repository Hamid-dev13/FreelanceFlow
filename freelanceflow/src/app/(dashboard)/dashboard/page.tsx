"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, Users, FolderKanban, LogOut, Bell, Search, UserPlus } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentView, setCurrentView] = useState<'dashboard' | 'clients' | 'projects'>('dashboard');
    const [pageLoaded, setPageLoaded] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const handleViewChange = (view: 'dashboard' | 'clients' | 'projects') => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentView(view);
            setIsTransitioning(false);
        }, 200); // Match this with the animation duration
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [router]);
    useEffect(() => {
        setPageLoaded(true);
    }, []);

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, onClick: () => setCurrentView('dashboard') },
        { name: "Clients", icon: Users, onClick: () => setCurrentView('clients') },
        { name: "Projets", icon: FolderKanban, onClick: () => setCurrentView('projects') },
    ];

    const renderContent = () => {
        const contentClasses = `transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`;

        if (currentView === 'dashboard') {
            return (
                <div className={`max-w-7xl mx-auto ${contentClasses}`}>
                    <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] transform">
                        <h1 className="text-2xl font-semibold mb-2">Bienvenue sur votre Dashboard</h1>
                        <p className="text-blue-50">
                            Gérez vos projets et suivez vos clients en un seul endroit.
                        </p>
                    </div>
                </div>
            );
        }

        if (currentView === 'clients') {
            return (
                <div className={`max-w-7xl mx-auto ${contentClasses}`}>
                    <div className="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                        {/* Clients Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h2 className="text-xl font-semibold text-gray-800">Gestion des Clients</h2>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 hover:scale-105">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Nouveau Client</span>
                                </button>
                            </div>
                            <div className="mt-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Rechercher un client..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 hover:shadow-md"
                                    />
                                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>
                            </div>
                        </div>

                        {/* Clients Table */}
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 text-gray-600 text-sm">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Nom</th>
                                            <th className="px-4 py-3 text-left font-medium">Email</th>
                                            <th className="px-4 py-3 text-left font-medium">Téléphone</th>
                                            <th className="px-4 py-3 text-left font-medium">Projets</th>
                                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {/* Les clients seront affichés ici */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className={`min-h-screen bg-gray-50 transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 transition-all duration-300 ease-in-out">
                <div className="mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 hover:rotate-180"
                            >
                                {sidebarOpen ? (
                                    <X className="h-5 w-5 transition-transform duration-300" />
                                ) : (
                                    <Menu className="h-5 w-5 transition-transform duration-300" />
                                )}
                            </button>
                            <div className="flex items-center">
                                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
                                    Freelanceflow
                                </span>
                            </div>
                        </div>

                        {/* Search and Actions */}
                        <div className="flex items-center gap-6">
                            <div className="relative hidden md:block">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 hover:shadow-md"
                                />
                                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>

                            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 hover:rotate-12">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                            </button>

                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content wrapper */}
            <div className="flex pt-6">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } w-64 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out pt-16 z-40`}
                >
                    <nav className="mt-5 px-3 space-y-1">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.name}
                                    onClick={item.onClick}
                                    style={{
                                        transitionDelay: `${index * 100}ms`
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50/50 hover:text-blue-600 group transition-all duration-300 hover:scale-105 ${currentView === item.name.toLowerCase()
                                        ? "bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-600"
                                        : "text-gray-700"
                                        } ${pageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
                                >
                                    <Icon className={`h-5 w-5 transition-colors duration-200 ${currentView === item.name.toLowerCase()
                                        ? "text-blue-500"
                                        : "group-hover:text-blue-500"
                                        }`} />
                                    <span className="font-medium">{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main content */}
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}
                >
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
