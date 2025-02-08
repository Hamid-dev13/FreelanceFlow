"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search } from 'lucide-react';
import AddProjectModal from "@/app/components/ui/AddProjectModal";
import EditProjectModal from "@/app/components/ui/EditProjectModal";
import DeleteProjectModal from "@/app/components/ui/DeleteProjectModal";

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
    const [projects, setProjects] = useState<Project[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
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
        const res = await fetch("/api/projects", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setProjects(data);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Projets</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-[0_0_15px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.5)] transition-all"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Nouveau Projet</span>
                    </button>
                </div>
                <div className="mt-4 relative">
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="p-6">
                <table className="w-full">
                    <thead className="bg-gray-800/50 text-gray-300 text-sm">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Titre</th>
                            <th className="px-4 py-3 text-left font-medium">Client</th>
                            <th className="px-4 py-3 text-left font-medium">Statut</th>
                            <th className="px-4 py-3 text-left font-medium">Date début</th>
                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                        {projects.map(project => (
                            <tr key={project.id} className="border-gray-800">
                                <td className="px-4 py-3">{project.title}</td>
                                <td className="px-4 py-3">{project.client.name}</td>
                                <td className="px-4 py-3">{project.status}</td>
                                <td className="px-4 py-3">{new Date(project.startDate).toLocaleDateString()}</td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800">
                                        Éditer
                                    </button>
                                    <button
                                        onClick={() => {
                                            setProjectToDelete(project);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="text-secondary hover:text-secondary-light transition-colors">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
    );
}