import { Users, UserPlus } from 'lucide-react';

interface ClientHeaderProps {
    onAddClick: () => void;
}

export const ClientHeader = ({ onAddClick }: ClientHeaderProps) => {
    return (
        <div className="p-4 sm:p-6 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-[#FF4405]" />
                    <h2 className="text-xl font-semibold text-white">Gestion des Clients</h2>
                </div>
                <button
                    onClick={onAddClick}
                    className="w-full sm:w-auto group flex items-center justify-center gap-2 px-4 py-2 bg-[#FF4405] hover:bg-[#ff5c26] text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                >
                    <UserPlus className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Nouveau Client</span>
                </button>
            </div>
        </div>
    );
};