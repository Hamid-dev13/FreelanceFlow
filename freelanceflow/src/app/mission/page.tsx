"use client";

import { useEffect, useState } from 'react';
import { Activity, Calendar, CheckCircle, Clock, Filter, X } from 'lucide-react';
import { useMissionStore } from '@/stores/useMissionStore';
import { DeveloperLayout } from '@/app/(dashboard)/_components/layouts/developer-layout';
import type { Mission, MissionStatus } from '@/stores/useMissionStore';
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { GradientText } from '@/app/(auth)/Stylecomponents/GradientText';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = ({ className, sideOffset = 4, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & { sideOffset?: number }) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            sideOffset={sideOffset}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
);

const DropdownMenuItem = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }) => (
    <DropdownMenuPrimitive.Item
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    />
);

interface StatusBadgeProps {
    status: MissionStatus;
    isUpdating: boolean;
}

const StatusBadge = ({ status, isUpdating }: StatusBadgeProps) => {
    const statusConfig = {
        'COMPLETED': {
            bgColor: 'bg-green-900/50',
            textColor: 'text-green-200',
            borderColor: 'border-green-500/20',
            icon: CheckCircle
        },
        'IN_PROGRESS': {
            bgColor: 'bg-primary/20',
            textColor: 'text-primary',
            borderColor: 'border-primary/20',
            icon: Clock
        },
        'PENDING': {
            bgColor: 'bg-yellow-900/50',
            textColor: 'text-yellow-200',
            borderColor: 'border-yellow-500/20',
            icon: Clock
        }
    }[status];

    const Icon = statusConfig.icon;

    return (
        <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
            ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}
            transition-all duration-200 hover:opacity-80
        `}>
            <span className="flex items-center gap-1.5">
                <Icon className="w-3 h-3" />
                {status === 'COMPLETED' ? 'Terminé' :
                    status === 'IN_PROGRESS' ? 'En cours' : 'En attente'}
            </span>
        </div>
    );
};

interface MissionCardProps {
    mission: Mission;
    onStatusChange: (mission: Mission, newStatus: MissionStatus) => Promise<void>;
    onDelete: (mission: Mission) => Promise<void>;
    updatingId: string | null;
    deletingId: string | null;
}

const MissionCard = ({ mission, onStatusChange, onDelete, updatingId, deletingId }: MissionCardProps) => (
    <div key={mission.id} className="group relative overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl" />
        <div className="relative p-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 transition-all duration-300 group-hover:border-primary/50 h-full">
            <button
                onClick={() => onDelete(mission)}
                disabled={deletingId === mission.id}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <DropdownMenu>
                <DropdownMenuTrigger
                    className="absolute top-4 right-14 focus:outline-none"
                    disabled={updatingId === mission.id}
                >
                    <StatusBadge
                        status={mission.status}
                        isUpdating={updatingId === mission.id}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 bg-gray-900 border border-gray-800"
                >
                    <DropdownMenuItem
                        onClick={() => onStatusChange(mission, 'IN_PROGRESS')}
                        className="flex items-center gap-2 focus:bg-gray-800 hover:bg-gray-800 text-gray-200"
                        disabled={mission.status === 'IN_PROGRESS'}
                    >
                        <Clock className="w-4 h-4" />
                        <span>En cours</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onStatusChange(mission, 'COMPLETED')}
                        className="flex items-center gap-2 focus:bg-gray-800 hover:bg-gray-800 text-gray-200"
                        disabled={mission.status === 'COMPLETED'}
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span>Terminé</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="space-y-4">
                <GradientText className="text-xl font-semibold pr-24">
                    {mission.title}
                </GradientText>

                <p className="text-gray-400 line-clamp-2">
                    {mission.description || 'Aucune description'}
                </p>
                <div className="pt-4 border-t border-gray-800/50">
                    <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        Échéance : {new Date(mission.deadline).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

function MissionsContent() {
    const { missions, fetchMissions, updateMissionStatus, deleteMission, startAutoRefresh } = useMissionStore();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchMissions('DEVELOPER').catch(console.error);
        const stopRefresh = startAutoRefresh('DEVELOPER');
        return () => stopRefresh();
    }, [fetchMissions, startAutoRefresh]);

    const handleStatusChange = async (mission: Mission, newStatus: MissionStatus) => {
        if (updatingId || mission.status === newStatus) return;

        setUpdatingId(mission.id);
        try {
            await updateMissionStatus(mission.id, newStatus);
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (mission: Mission) => {
        if (deletingId) return;

        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
            setDeletingId(mission.id);
            try {
                await deleteMission(mission.id);
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-900/50 p-6 rounded-2xl border border-gray-800/50">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Activity className="h-8 w-8 text-primary" />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Mes Missions
                        </span>
                    </h1>
                    <p className="mt-2 text-gray-400">Gérez et suivez vos missions en cours</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrer
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {missions.map((mission) => (
                    <MissionCard
                        key={mission.id}
                        mission={mission}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        updatingId={updatingId}
                        deletingId={deletingId}
                    />
                ))}
            </div>
        </div>
    );
}

export default function MissionsPage() {
    return (
        <DeveloperLayout>
            <MissionsContent />
        </DeveloperLayout>
    );
}