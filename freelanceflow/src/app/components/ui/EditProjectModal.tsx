// components/ui/EditProjectModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type Project = {
    id: string;
    title: string;
    description: string;
    clientId: string;
    startDate: string;
    endDate?: string;
    status: string;
};
type Client = {
    id: string;
    name: string;
};
type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    project: Project | null;
};

export default function EditProjectModal({ isOpen, onClose, onSuccess, project }: Props) {
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        title: project?.title || "",
        description: project?.description || "",
        clientId: project?.clientId || "",
        startDate: project?.startDate || "",
        endDate: project?.endDate || "",
        status: project?.status || "EN_COURS"
    });

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                clientId: project.clientId,
                startDate: project.startDate.split('T')[0],
                endDate: project.endDate?.split('T')[0] || "",
                status: project.status
            });
        }
    }, [project]);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const token = localStorage.getItem("token");
        const formattedData = {
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
        };
        const res = await fetch("/api/clients", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setClients(data);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`/api/projects/${project?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Même JSX que AddProjectModal avec les champs pré-remplis
    // Suite du EditProjectModal
    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
                <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800">
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                        <h3 className="text-lg font-semibold text-white">Modifier Projet</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Titre</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Client</label>

                            <select
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                                required
                            >
                                {clients.map(client => (

                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Date de début</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Date de fin</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Statut</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                            >
                                <option value="EN_COURS">En cours</option>
                                <option value="TERMINE">Terminé</option>
                                <option value="EN_PAUSE">En pause</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                            >
                                Mettre à jour
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}