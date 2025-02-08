// components/ui/AddProjectModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type Client = {
    id: string;
    name: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function AddProjectModal({ isOpen, onClose, onSuccess }: Props) {
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        clientId: "",
        startDate: "",
        endDate: "",
        status: "EN_COURS"
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const token = localStorage.getItem("token");
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
            const res = await fetch("/api/projects", {
                method: "POST",
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

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-lg font-semibold text-black">Nouveau Projet</h3>
                        <button onClick={onClose}>
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Titre</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 border rounded text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Client</label>
                            <select
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                className="w-full p-2 border rounded text-black"
                                required
                            >
                                <option value="">Sélectionner un client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Date de début</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full p-2 border rounded text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Date de fin (optionnel)</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full p-2 border rounded text-black"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                            >
                                Créer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}