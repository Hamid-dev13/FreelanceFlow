"use client";

import { useState, useEffect } from "react";
import {
    PlusCircle,
    Search,
    Briefcase,
    Calendar,
    User,
    Activity,
    Edit2,
    Trash2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { ProjectManagerNavbar } from '@/app/(dashboard)/_components/navigation/navbar/ProjectManagerNavbar';
import MissionForm from '@/components/features/mission/MissionForm';
import { useMissionStore, type CreateMissionData } from '@/stores/useMissionStore';
import AddProjectModal from "@/app/(dashboard)/projects/_components/AddProjectModal";
import EditProjectModal from "@/app/(dashboard)/projects/_components/EditProjectModal";
import DeleteProjectModal from "@/app/(dashboard)/projects/_components/DeleteProjectModal";

type Project = {
    id: string;
    title: string;
    description?: string;
    status: string;
    startDate: string;
    endDate?: string;
    clientId: string;
    client: {
        id: string;
        name: string;
    };
};

export default function ProjectsPage() {
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
    const { createMission } = useMissionStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const handleMissionSubmit = async (data: CreateMissionData) => {
        try {
            await createMission(data);
            setIsMissionModalOpen(false);
        } catch (error) {
            console.error('Erreur lors de la création de la mission:', error);
        }
    };
    const handleDeleteProject = async () => {
        if (!projectToDelete) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/projects/${projectToDelete.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchProjects();
                setIsDeleteModalOpen(false);
            } else {
                console.error("Erreur de suppression");
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const fetchProjects = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/projects", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des projets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'EN_COURS':
                return 'bg-blue-900/50 text-blue-200 border border-blue-500/20';
            case 'TERMINE':
                return 'bg-green-900/50 text-green-200 border border-green-500/20';
            default:
                return 'bg-yellow-900/50 text-yellow-200 border border-yellow-500/20';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'EN_COURS':
                return 'En cours';
            case 'TERMINE':
                return 'Terminé';
            default:
                return 'En pause';
        }
    };


    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">

            <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
                    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
                        {/* Header Section */}
                        <div className="p-4 sm:p-6 border-b border-gray-800">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="h-6 w-6 text-[#FF4405]" />
                                    <h2 className="text-xl font-semibold text-white">Gestion des Projets</h2>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="w-full sm:w-auto group flex items-center justify-center gap-2 px-4 py-2 bg-[#FF4405] hover:bg-[#ff5c26] text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    <PlusCircle className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                                    <span>Nouveau Projet</span>
                                </button>
                            </div>
                            <div className="mt-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Rechercher un projet..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-[#FF4405] focus:ring-1 focus:ring-[#FF4405] transition-all duration-300"
                                    />
                                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>
                            </div>
                        </div>

                        {/* Projects List */}
                        <div className="p-4 sm:p-6">
                            {filteredProjects.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Desktop View */}
                                    <div className="hidden sm:block overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-800">
                                            <thead className="bg-gray-800">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 text-left">
                                                        <div className="flex items-center gap-2">
                                                            <Briefcase className="h-4 w-4 text-[#FF4405]" />
                                                            <span className="text-sm font-medium text-gray-300">Titre</span>
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-left">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-[#FF4405]" />
                                                            <span className="text-sm font-medium text-gray-300">Client</span>
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-left">
                                                        <div className="flex items-center gap-2">
                                                            <Activity className="h-4 w-4 text-[#FF4405]" />
                                                            <span className="text-sm font-medium text-gray-300">Statut</span>
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-left">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-[#FF4405]" />
                                                            <span className="text-sm font-medium text-gray-300">Date début</span>
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-right">
                                                        <span className="text-sm font-medium text-gray-300">Actions</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800">
                                                {filteredProjects.map(project => (
                                                    <tr
                                                        key={project.id}
                                                        className="group hover:bg-gray-800/50 transition-colors duration-200"
                                                    >
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {project.title}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {project.client.name}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                                {getStatusText(project.status)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {new Date(project.startDate).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedProject(project);
                                                                        setIsEditModalOpen(true);
                                                                    }}
                                                                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                    <span>Éditer</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setProjectToDelete(project);
                                                                        setIsDeleteModalOpen(true);
                                                                    }}
                                                                    className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span>Supprimer</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile View */}
                                    <div className="sm:hidden space-y-4">
                                        {filteredProjects.map(project => (
                                            <div
                                                key={project.id}
                                                className="bg-gray-800/50 rounded-lg p-4 space-y-3 border border-gray-700"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-white font-medium">{project.title}</h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                        {getStatusText(project.status)}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-300">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-[#FF4405]" />
                                                        <span>{project.client.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-[#FF4405]" />
                                                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-700">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProject(project);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                        <span>Éditer</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setProjectToDelete(project);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span>Supprimer</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle className="h-12 w-12 text-[#FF4405] mx-auto mb-4 opacity-50" />
                                    <p className="text-gray-400">Aucun projet trouvé</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            {/* Modals */}
            {isMissionModalOpen && (
                <MissionForm
                    onClose={() => setIsMissionModalOpen(false)}
                    onSubmit={handleMissionSubmit}
                />
            )}
            <div className="fixed inset-0 flex items-center justify-center z-50"
                style={{ display: isAddModalOpen || isEditModalOpen || isDeleteModalOpen ? 'flex' : 'none' }}>
                <AddProjectModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={fetchProjects}
                />
                <EditProjectModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={fetchProjects}
                    project={selectedProject}
                />
                <DeleteProjectModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteProject}
                    projectTitle={projectToDelete?.title || ""}
                />
            </div>
        </div>
    );
}