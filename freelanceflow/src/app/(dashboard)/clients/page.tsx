// src/app/(dashboard)/clients/page.tsx
"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search } from 'lucide-react';
import AddClientModal from '@/app/components/ui/addClientModal';

type Client = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
};

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    // Dans clients/page.tsx
    const handleDeleteClient = async (clientId: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/clients/${clientId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            fetchClients();
        }
    };
    const fetchClients = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/clients", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des clients:", error);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">Gestion des Clients</h2>
                    <button
                        onClick={() => setIsAddClientModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 hover:scale-105"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span>Nouveau Client</span>
                    </button>
                </div>
                <div className="mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 hover:shadow-md"
                        />
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Nom</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Téléphone</th>
                                <th className="px-4 py-3 text-left font-medium">Projets</th>
                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {clients.map((client) => (
                                <tr key={client.id}>
                                    <td className="px-4 py-3">{client.name}</td>
                                    <td className="px-4 py-3">{client.email}</td>
                                    <td className="px-4 py-3">{client.phone || '-'}</td>
                                    <td className="px-4 py-3">-</td>
                                    <td className="px-4 py-3">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            Éditer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddClientModal
                isOpen={isAddClientModalOpen}
                onClose={() => {
                    setIsAddClientModalOpen(false);
                    fetchClients(); // Rafraîchir la liste après ajout
                }}
            />
        </div>
    );
}