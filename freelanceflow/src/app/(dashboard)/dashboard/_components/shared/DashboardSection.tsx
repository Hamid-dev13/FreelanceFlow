import { LucideIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

interface DashboardSectionProps {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
    emptyMessage?: string;
}

export default function DashboardSection({
    icon: Icon,
    title,
    children,
    emptyMessage
}: DashboardSectionProps) {
    const childrenArray = React.Children.toArray(children);

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF4405]" />
                <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
            </div>

            {childrenArray.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                    {children}
                </div>
            ) : (
                <div className="text-center text-gray-400 py-6 sm:py-8">
                    <Icon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm sm:text-base">{emptyMessage || 'Aucun élément'}</p>
                </div>
            )}
        </div>
    );
}