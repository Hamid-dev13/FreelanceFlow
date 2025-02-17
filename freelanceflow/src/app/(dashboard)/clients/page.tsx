"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Loader2 } from 'lucide-react';
import { Client, useClientStore } from '@/stores/useClientStore';
import { useMissionStore, type CreateMissionData } from '@/stores/useMissionStore';
import {
    ClientHeader,
    ClientSearch,
    ClientListContainer
} from './_components';
import AddClientModal from '@/app/(dashboard)/clients/_components/modals/AddClientModal';
import EditClientModal from '@/app/(dashboard)/clients/_components/modals/EditClientModal';
import DeleteClientModal from '@/app/(dashboard)/clients/_components/modals/DeleteClientModal';
import MissionForm from '@/components/features/mission/MissionForm';

export default function ClientsPage() {
    const {
        clients,
        loading,
        error,
        fetchClients,
        deleteClient
    } = useClientStore();

    // États pour la recherche et les modales
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);

    // Chargement initial des données
    useEffect(() => {
        if (clients.length === 0 && loading === 'idle') {
            fetchClients();
        }
    }, [fetchClients, clients.length, loading]);

    // Filtrage des clients
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.phone && client.phone.includes(searchQuery))
    );

    // Gestionnaires d'événements
    const handleDeleteClient = async () => {
        if (!selectedClient) return;
        try {
            await deleteClient(selectedClient.id);
            setIsDeleteModalOpen(false);
            setSelectedClient(null);
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        }
    };

    // Rendu des états de chargement et d'erreur
    if (loading === 'pending' && clients.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900">
                <Loader2 className="h-12 w-12 text-[#FF4405] animate-spin" />
            </div>
        );
    }

    if (loading === 'failed' && error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-red-500">{error}</p>
                <button
                    onClick={fetchClients}
                    className="mt-4 px-4 py-2 bg-[#FF4405] hover:bg-[#ff5c26] text-white rounded-lg"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
                    <ClientHeader
                        onAddClick={() => setIsAddClientModalOpen(true)}
                    />

                    <ClientSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />

                    <div className="p-4 sm:p-6">
                        <ClientListContainer
                            clients={filteredClients}
                            onEdit={(client) => {
                                setSelectedClient(client);
                                setIsEditModalOpen(true);
                            }}
                            onDelete={(client) => {
                                setSelectedClient(client);
                                setIsDeleteModalOpen(true);
                            }}
                        />
                    </div>
                </div>
            </main>

            {/* Modales */}
            <AddClientModal
                isOpen={isAddClientModalOpen}
                onClose={() => setIsAddClientModalOpen(false)}
                onSuccess={fetchClients}
            />
            <EditClientModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedClient(null);
                }}
                onSuccess={fetchClients}
                client={selectedClient}
            />
            <DeleteClientModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedClient(null);
                }}
                onConfirm={handleDeleteClient}
                clientName={selectedClient?.name || ""}
            />
            {isMissionModalOpen && (
                <MissionForm
                    onClose={() => setIsMissionModalOpen(false)}
                    onSubmit={async (data) => {
                        try {
                            await useMissionStore.getState().createMission(data);
                            setIsMissionModalOpen(false);
                        } catch (error) {
                            console.error('Erreur lors de la création de la mission:', error);
                        }
                    }}
                />
            )}
        </div>
    );
}