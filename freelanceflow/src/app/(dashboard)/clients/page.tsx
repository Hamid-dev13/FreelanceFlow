"use client";

import { useState, useEffect } from "react";
import {
    UserPlus,
    Search,
    Users,
    Mail,
    Phone,
    Edit2,
    Trash2,
    AlertCircle,
    Loader2
} from 'lucide-react';
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
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.phone && client.phone.includes(searchQuery))
    );

    if (loading) {
        return (
            <div className="min-h-[400px] bg-gray-900 rounded-xl shadow-lg border border-gray-800 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-[#FF4405]">
                    <Users className="h-12 w-12 animate-pulse" />
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Chargement des clients...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            {/* Header Section */}
            <div className="p-4 sm:p-6 border-b border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-[#FF4405]" />
                        <h2 className="text-xl font-semibold text-white">Gestion des Clients</h2>
                    </div>
                    <button
                        onClick={() => setIsAddClientModalOpen(true)}
                        className="w-full sm:w-auto group flex items-center justify-center gap-2 px-4 py-2 bg-[#FF4405] hover:bg-[#ff5c26] text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        <UserPlus className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Nouveau Client</span>
                    </button>
                </div>
                <div className="mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-[#FF4405] focus:ring-1 focus:ring-[#FF4405] transition-all duration-300"
                        />
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>
            </div>

            {/* Clients List */}
            <div className="p-4 sm:p-6">
                {filteredClients.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {/* Desktop View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-[#FF4405]" />
                                                <span className="text-sm font-medium text-gray-300">Nom</span>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-[#FF4405]" />
                                                <span className="text-sm font-medium text-gray-300">Email</span>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-[#FF4405]" />
                                                <span className="text-sm font-medium text-gray-300">Téléphone</span>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-right">
                                            <span className="text-sm font-medium text-gray-300">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredClients.map((client) => (
                                        <tr
                                            key={client.id}
                                            className="group hover:bg-gray-800/50 transition-colors duration-200"
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {client.name}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {client.email}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {client.phone || '-'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedClient(client);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                        <span>Éditer</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setClientToDelete(client);
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
                            {filteredClients.map((client) => (
                                <div
                                    key={client.id}
                                    className="bg-gray-800/50 rounded-lg p-4 space-y-3 border border-gray-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-medium">{client.name}</h3>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-[#FF4405]" />
                                            <span>{client.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-[#FF4405]" />
                                            <span>{client.phone || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-700">
                                        <button
                                            onClick={() => {
                                                setSelectedClient(client);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            <span>Éditer</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setClientToDelete(client);
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
                        <p className="text-gray-400">Aucun client trouvé</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <div className="fixed inset-0 flex items-center justify-center z-50"
                style={{ display: isAddClientModalOpen || isEditModalOpen || isDeleteModalOpen ? 'flex' : 'none' }}>
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
        </div>
    );
}