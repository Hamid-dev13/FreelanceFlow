// src/app/(dashboard)/clients/_components/ClientMobileList.tsx
import { Edit2, Mail, Phone, Trash2 } from 'lucide-react';
import type { Client } from '@/stores/useClientStore';

interface ClientMobileListProps {
    clients: Client[];
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
}

export const ClientMobileList = ({ clients, onEdit, onDelete }: ClientMobileListProps) => {
    return (
        <div className="sm:hidden space-y-4">
            {clients.map((client) => (
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
                            onClick={() => onEdit(client)}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                        >
                            <Edit2 className="h-4 w-4" />
                            <span>Éditer</span>
                        </button>
                        <button
                            onClick={() => onDelete(client)}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Supprimer</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};