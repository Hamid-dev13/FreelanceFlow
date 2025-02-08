"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Users, FolderKanban, LogOut, Bell, Search } from 'lucide-react';
import '../styles/theme.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [pageLoaded, setPageLoaded] = useState(false);

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
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Clients", href: "/clients", icon: Users },
        { name: "Projets", href: "/projects", icon: FolderKanban },
    ];

    return (
        <div className={`min-h-screen bg-gray-900 text-gray-100 transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Navbar avec thème sombre */}
            <nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Bouton toggle sidebar */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-gray-400 hover:text-primary transition-colors"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    router.push("/login");
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex mt-2">
                {/* Sidebar avec thème sombre */}
                <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out pt-16 shadow-xl`}>
                    <nav className="mt-5 px-3 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-800/50 transition-all duration-200 group"
                                >
                                    <Icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main content */}
                <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}