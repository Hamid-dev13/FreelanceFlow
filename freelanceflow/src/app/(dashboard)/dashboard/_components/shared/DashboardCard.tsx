import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
    icon: LucideIcon;
    label: string;
    value: number;
}

export default function DashboardStatCard({
    icon: Icon,
    label,
    value
}: DashboardStatCardProps) {
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
                <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#FF4405]" />
                <div>
                    <h3 className="text-gray-400 text-xs sm:text-sm">{label}</h3>
                    <p className="text-2xl sm:text-3xl font-semibold mt-1 text-white">{value}</p>
                </div>
            </div>
        </div>
    );
}