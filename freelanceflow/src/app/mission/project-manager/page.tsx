"use client"
import React, { useEffect, useState } from 'react';
import { Activity, Calendar, CheckCircle, Clock, Filter, ChevronDown, ChevronRight, Briefcase } from 'lucide-react';
import { useMissionStore } from '@/stores/useMissionStore';
import { ProjectManagerLayout } from '@/app/(dashboard)/_components/layouts/project-manager-layout';
import type { Mission, MissionStatus } from '@/stores/useMissionStore';
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GradientText } from '@/app/(auth)/Stylecomponents/GradientText';
type Project = {
    id: string;
    title: string;
    description?: string;
    status: string;
    startDate: string;
    endDate?: string;
    clientId: string;
    client: {
        id: string;
        name: string;
    };
};
type ProjectSectionProps = {
    project: Project;
    missions: Mission[];
    onStatusChange: (mission: Mission, newStatus: MissionStatus) => Promise<void>;
    updatingId: string | null;
};
type ProjectGroup = {
    project: Project;
    missions: Mission[];
};

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

const StatusBadge = ({ status, isUpdating }: { status: MissionStatus, isUpdating: boolean }) => {
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

const MissionCard = ({ mission, onStatusChange, updatingId }: {
    mission: Mission,
    onStatusChange: (mission: Mission, newStatus: MissionStatus) => Promise<void>,
    updatingId: string | null
}) => {
    // Vérification de sécurité pour le title
    const safeTitle = mission.title || 'Sans titre';

    // Formater la date en toute sécurité
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return 'Date invalide';
        }
    };

    return (
        <div className="group relative overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl" />
            <div className="relative p-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 transition-all duration-300 group-hover:border-primary/50 h-full">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="absolute top-4 right-4 focus:outline-none"
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
                        {safeTitle}
                    </GradientText>
                    <p className="text-gray-400 line-clamp-2">
                        {mission.description || 'Aucune description'}
                    </p>
                    <div className="pt-4 border-t border-gray-800/50">
                        <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            Échéance : {formatDate(mission.deadline)}
                        </div>
                        {mission.assignedTo && (
                            <div className="mt-2 text-sm text-gray-400">
                                Assigné à : {mission.assignedTo.name}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Types

// Composant ProjectSection séparé avec état persistant
const ProjectSection = ({ project, missions, onStatusChange, updatingId }: ProjectSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem(`project-${project.id}-expanded`);
        if (savedState) {
            setIsExpanded(savedState === 'true');
        }
    }, [project.id]);

    const toggleExpand = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem(`project-${project.id}-expanded`, String(newState));
    };

    return (
        <div className="space-y-4">
            <div
                onClick={toggleExpand}
                className="flex items-center justify-between p-4 bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800/50 cursor-pointer transition-all duration-300 hover:border-primary/50"
            >
                <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <div>
                        <GradientText className="text-xl font-semibold pr-24">
                            {project.title}
                        </GradientText>
                        <div className="text-sm text-gray-400">
                            {missions.length} mission{missions.length > 1 ? 's' : ''}
                            {project.client && ` - Client: ${project.client.name}`}
                        </div>
                    </div>
                </div>
                {isExpanded ?
                    <ChevronDown className="w-5 h-5 text-gray-400" /> :
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                }
            </div>

            {isExpanded && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pl-2">
                    {missions.map((mission) => (
                        <MissionCard
                            key={mission.id}
                            mission={mission}
                            onStatusChange={onStatusChange}
                            updatingId={updatingId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

function ProjectManagerMissionsContent() {
    const { missions, fetchMissions, updateMissionStatus, startAutoRefresh } = useMissionStore();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchMissions('PROJECT_MANAGER');
            } catch (error) {
                console.error('Error fetching missions:', error);
            }
        };

        fetchData();
        const stopRefresh = startAutoRefresh('PROJECT_MANAGER');
        return stopRefresh;
    }, [fetchMissions, startAutoRefresh]);

    const handleStatusChange = async (mission: Mission, newStatus: MissionStatus) => {
        if (updatingId || mission.status === newStatus) return;

        setUpdatingId(mission.id);
        try {
            await updateMissionStatus(mission.id, newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const missionsByProject = missions.reduce<Record<string, ProjectGroup>>((acc, mission) => {
        if (!mission.project) return acc;

        const projectId = mission.project.id;

        if (!acc[projectId]) {
            const projectData: Project = {
                id: mission.project.id,
                title: mission.project.title || 'Projet sans titre',
                description: mission.project.description ?? undefined,
                status: mission.project.status,
                startDate: mission.project.startDate,
                endDate: mission.project.endDate ?? undefined,
                clientId: mission.project.clientId,
                client: mission.project.client
            };

            acc[projectId] = {
                project: projectData,
                missions: []
            };
        }

        acc[projectId].missions.push(mission);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-900/50 p-6 rounded-2xl border border-gray-800/50">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Activity className="h-8 w-8 text-primary" />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Missions du Projet
                        </span>
                    </h1>
                    <p className="mt-2 text-gray-400">Suivez et gérez l'avancement des missions</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrer
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {Object.values(missionsByProject).map(({ project, missions }) => (
                    <ProjectSection
                        key={project.id}
                        project={project}
                        missions={missions}
                        onStatusChange={handleStatusChange}
                        updatingId={updatingId}
                    />
                ))}
            </div>
        </div>
    );
}

export default function ProjectManagerMissionsPage() {
    return (
        <ProjectManagerLayout>
            <ProjectManagerMissionsContent />
        </ProjectManagerLayout>
    );
}