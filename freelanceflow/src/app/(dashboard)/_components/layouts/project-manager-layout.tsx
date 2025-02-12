
import React from 'react';
import { LayoutDashboard, FolderKanban, Plus, BarChart2, Layout } from 'lucide-react';
import AddMissionButton from '@/components/features/mission/AddMissionButton';

export const ProjectManagerLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo et titre */}
                            <div className="flex items-center gap-3 mr-8">
                                <Layout className="h-6 w-6 text-[#FF4405]" />
                                <span className="text-lg font-semibold">Project Manager</span>
                            </div>

                            {/* Navigation */}
                            <ul className="flex items-center space-x-8">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                                    >
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span>Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 text-gray-300 hover:text-[#FF4405] transition-colors"
                                    >
                                        <FolderKanban className="h-5 w-5" />
                                        <span>Gestion des projets</span>
                                    </a>
                                </li>
                                <li>
                                    <AddMissionButton onClick={() => console.log('Bouton cliqué')} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête du Dashboard */}
                <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-800 shadow-lg mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <BarChart2 className="h-8 w-8 text-[#FF4405]" />
                            <h1 className="text-2xl font-semibold">
                                Dashboard Chef de Projet
                            </h1>
                        </div>
                        <p className="text-gray-400">
                            Visualisez et gérez vos projets en un coup d'œil
                        </p>
                    </div>
                </div>

                {/* Grille des statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="group bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 p-6 shadow-lg hover:border-[#FF4405]/50 transition-all duration-300">
                        <h2 className="text-lg font-medium text-white mb-4">Projets en cours</h2>
                        <div className="text-gray-400">
                            <p>Aucun projet en cours</p>
                        </div>
                    </div>

                    <div className="group bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 p-6 shadow-lg hover:border-[#FF4405]/50 transition-all duration-300">
                        <h2 className="text-lg font-medium text-white mb-4">Missions à valider</h2>
                        <div className="text-gray-400">
                            <p>Aucune mission en attente</p>
                        </div>
                    </div>

                    <div className="group bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 p-6 shadow-lg hover:border-[#FF4405]/50 transition-all duration-300">
                        <h2 className="text-lg font-medium text-white mb-4">Statistiques</h2>
                        <div className="text-gray-400">
                            <p>Chargement des statistiques...</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};