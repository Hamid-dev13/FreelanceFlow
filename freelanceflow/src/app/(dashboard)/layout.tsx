"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">

                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    router.push("/login");
                                }}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar & Main content */}
            <div className="flex">
                {/* Sidebar */}


                {/* Main content */}
                <main className="flex-1 mx-6">
                    {children}
                </main>
            </div>
        </div>
    );
}