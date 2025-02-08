"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search } from 'lucide-react';
import AddClientModal from '@/app/components/ui/addClientModal';
import EditClientModal from '@/app/components/ui/EditClientModal';
import DeleteClientModal from "@/app/components/ui/DeleteClientModal";

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
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    const handleDeleteClient = async () => {
        if (!clientToDelete) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/clients/${clientToDelete.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                fetchClients();
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error("Erreur:", error);
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
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-white">Gestion des Clients</h2>
                    <button
                        onClick={() => setIsAddClientModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
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
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800/50 text-gray-300 text-sm">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Nom</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Téléphone</th>
                                <th className="px-4 py-3 text-left font-medium">Projets</th>
                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-gray-300">
                            {clients.map((client) => (
                                <tr key={client.id} className="border-gray-800">
                                    <td className="px-4 py-3">{client.name}</td>
                                    <td className="px-4 py-3">{client.email}</td>
                                    <td className="px-4 py-3">{client.phone || '-'}</td>
                                    <td className="px-4 py-3">-</td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedClient(client);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-primary hover:text-primary-light"
                                        >
                                            Éditer
                                        </button>
                                        <button
                                            onClick={() => {
                                                setClientToDelete(client);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="text-secondary hover:text-secondary-light"
                                        >
                                            Supprimer
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
                    fetchClients();
                }}
            />
            <EditClientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchClients}
                client={selectedClient}
            />
            <DeleteClientModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteClient}
                clientName={clientToDelete?.name || ""}
            />
        </div>
    );
}