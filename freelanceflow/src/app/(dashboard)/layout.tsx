"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Menu,
    X,
    LayoutDashboard,
    Users,
    FolderKanban,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    Settings,
    HelpCircle,
    Layout
} from 'lucide-react';
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
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

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
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            description: "Vue d'ensemble de vos activités"
        },
        {
            name: "Clients",
            href: "/clients",
            icon: Users,
            description: "Gestion de votre clientèle"
        },
        {
            name: "Projets",
            href: "/projects",
            icon: FolderKanban,
            description: "Suivi de vos projets"
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-[#FF4405]">
                    <Layout className="h-12 w-12 animate-pulse" />
                    <div className="flex items-center gap-2">
                        <span className="animate-pulse">Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-black text-gray-100 transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg text-gray-400 hover:text-[#FF4405] hover:bg-gray-800 transition-all duration-200"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div className="ml-4 flex items-start gap-2">
                                <Layout className="h-6 w-6 text-[#FF4405]" />
                                <span className="font-semibold text-white ">Dashboard</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-[#FF4405] hover:bg-gray-800 transition-all duration-200"
                                >
                                    <Bell className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#FF4405] flex items-center justify-center text-white">
                                        A
                                    </div>
                                    <span>Admin</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-900 border border-gray-800 shadow-lg py-1">
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem("token");
                                                router.push("/login");
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Déconnexion</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-16 flex">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } w-64 bg-gray-900/80 backdrop-blur-lg pt-16 transition-all duration-300 ease-in-out border-r border-gray-800 z-40`}
                >
                    <nav className="h-full flex flex-col">
                        <div className="flex-1 px-3 py-4 space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-[#FF4405] hover:bg-gray-800/50 transition-all duration-200 group"
                                    >
                                        <Icon className="h-5 w-5 group-hover:text-[#FF4405] transition-colors" />
                                        <div>
                                            <span className="font-medium block">{item.name}</span>
                                            <span className="text-xs text-gray-500 group-hover:text-gray-400">
                                                {item.description}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-gray-800">
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-[#FF4405] hover:bg-gray-800/50 transition-all duration-200 group"
                                >
                                    <Settings className="h-5 w-5 group-hover:text-[#FF4405] transition-colors" />
                                    <span className="font-medium">Paramètres</span>
                                </Link>
                                <Link
                                    href="/help"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-[#FF4405] hover:bg-gray-800/50 transition-all duration-200 group"
                                >
                                    <HelpCircle className="h-5 w-5 group-hover:text-[#FF4405] transition-colors" />
                                    <span className="font-medium">Aide</span>
                                </Link>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Main content */}
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
                        } p-6`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}