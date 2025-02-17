import { Search } from 'lucide-react';

interface ClientSearchProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const ClientSearch = ({ value, onChange, className = '' }: ClientSearchProps) => {
    return (
        <div className={`mt-4 px-4 sm:px-6 ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-[#FF4405] focus:ring-1 focus:ring-[#FF4405] transition-all duration-300"
                />
                <Search
                    className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                />
            </div>
        </div>
    );
};