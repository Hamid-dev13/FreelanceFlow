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
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

        const handleResize = () => {
            setSidebarOpen(window.innerWidth >= 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4 text-[#FF4405]">
                    <Layout className="h-12 w-12 animate-pulse" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base animate-pulse">Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-black text-gray-100 transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-50">
                <div className="max-w-7x mx-auto">
                    <div className="flex h-14 sm:h-16">
                        {/* Left section with logo and menu button - Always fixed to left */}
                        <div className="flex items-center pl-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg text-gray-400 hover:text-[#FF4405] hover:bg-gray-800 transition-all duration-200"
                                aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
                            >
                                {sidebarOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </button>
                            <div className="ml-3 flex items-center gap-2">
                                <Layout className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF4405]" />
                                <span className="font-semibold text-white text-sm sm:text-base whitespace-nowrap">Dashboard</span>
                            </div>
                        </div>

                        {/* Right section with user menu - Pushed to right */}
                        <div className="flex items-center ml-auto pr-4">
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                                >
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF4405] flex items-center justify-center text-white text-sm sm:text-base">
                                        A
                                    </div>
                                    <span className="hidden sm:inline">Admin</span>
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

            <div className="pt-14 sm:pt-16 flex">
                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } w-64 bg-gray-900/80 backdrop-blur-lg pt-14 sm:pt-16 transition-all duration-300 ease-in-out border-r border-gray-800 z-40`}
                >
                    <nav className="h-full flex flex-col">
                        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-400 hover:text-[#FF4405] hover:bg-gray-800/50 transition-all duration-200 group"
                                        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                    >
                                        <Icon className="h-5 w-5 group-hover:text-[#FF4405] transition-colors shrink-0" />
                                        <div className="min-w-0">
                                            <span className="font-medium block text-sm sm:text-base truncate">{item.name}</span>
                                            <span className="text-xs text-gray-500 group-hover:text-gray-400 hidden sm:block truncate">
                                                {item.description}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="p-3 sm:p-4 border-t border-gray-800">
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-400 hover:text-[#FF4405] hover:bg-gray-800/50 transition-all duration-200 group"
                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                >
                                    <Settings className="h-5 w-5 group-hover:text-[#FF4405] transition-colors shrink-0" />
                                    <span className="font-medium text-sm sm:text-base truncate">Paramètres</span>
                                </Link>
                                <Link
                                    href="/help"
                                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-400 hover:text-[#FF4405] hover:bg-gray-800/50 transition-all duration-200 group"
                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                >
                                    <HelpCircle className="h-5 w-5 group-hover:text-[#FF4405] transition-colors shrink-0" />
                                    <span className="font-medium text-sm sm:text-base truncate">Aide</span>
                                </Link>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Main content */}
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"
                        } p-4 sm:p-6`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}