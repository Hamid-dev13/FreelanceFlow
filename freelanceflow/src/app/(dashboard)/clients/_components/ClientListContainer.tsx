import { AlertCircle } from 'lucide-react';
import type { Client } from '@/stores/useClientStore';
import { ClientTable } from './table/ClientTable';
import { ClientMobileList } from './table/ClientMobileList';

interface ClientListContainerProps {
    clients: Client[];
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
}

export const ClientListContainer = ({ clients, onEdit, onDelete }: ClientListContainerProps) => {
    if (clients.length === 0) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-[#FF4405] mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">Aucun client trouvé</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            <ClientTable clients={clients} onEdit={onEdit} onDelete={onDelete} />
            <ClientMobileList clients={clients} onEdit={onEdit} onDelete={onDelete} />
        </div>
    );
};