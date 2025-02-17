// src/app/(dashboard)/clients/_components/ClientTable.tsx
import { Edit2, Mail, Phone, Trash2, Users } from 'lucide-react';
import type { Client } from '@/stores/useClientStore';

interface ClientTableProps {
    clients: Client[];
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
}

export const ClientTable = ({ clients, onEdit, onDelete }: ClientTableProps) => {
    return (
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
                    {clients.map((client) => (
                        <tr key={client.id} className="group hover:bg-gray-800/50 transition-colors duration-200">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{client.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{client.email}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{client.phone || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => onEdit(client)}
                                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        <span>Éditer</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(client)}
                                        className="inline-flex items-center gap-1 text-red-400 hover:text-red-300"
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
    );
};