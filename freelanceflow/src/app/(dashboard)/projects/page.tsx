// src/app/(dashboard)/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search } from 'lucide-react';
import AddProjectModal from "@/app/components/ui/AddProjectModal";
type Project = {
    id: string;
    title: string;
    description?: string;
    status: string;
    startDate: string;
    endDate?: string;
    client: {
        id: string;
        name: string;
    };
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Projets</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Nouveau Projet</span>
                    </button>
                </div>
                <div className="mt-4 relative">
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border text-black"
                    />
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="p-6">
                <table className="w-full">
                    <thead className="bg-gray-50 text-black">
                        <tr>
                            <th className="px-4 py-3 text-left">Titre</th>
                            <th className="px-4 py-3 text-left">Client</th>
                            <th className="px-4 py-3 text-left">Statut</th>
                            <th className="px-4 py-3 text-left">Date début</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {projects.map(project => (
                            <tr key={project.id}>
                                <td className="px-4 py-3">{project.title}</td>
                                <td className="px-4 py-3">{project.client.name}</td>
                                <td className="px-4 py-3">{project.status}</td>
                                <td className="px-4 py-3">{new Date(project.startDate).toLocaleDateString()}</td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button className="text-blue-600 hover:text-blue-800">Éditer</button>
                                    <button className="text-red-600 hover:text-red-800">Supprimer</button>
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
        </div>

    );
}