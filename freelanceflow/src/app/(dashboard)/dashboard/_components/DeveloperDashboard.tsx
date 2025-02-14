"use client";

import {
    Clock,
    AlertCircle,
    Calendar,
    Activity,
    Users,
} from 'lucide-react';

import {
    useFetchDashboardData,
    Mission,
    DeveloperStats
} from '@/hooks/useFetchDashboardData';

import DashboardStatCard from '@/app/(dashboard)/dashboard/_components/shared/DashboardCard';
import DashboardSection from './shared/DashboardSection';

export default function DeveloperDashboard() {
    const {
        data: missions,
        loading: missionsLoading
    } = useFetchDashboardData<Mission>('/api/mission');

    const calculateStats = (): DeveloperStats => {
        return {
            totalMissions: missions.length,
            inProgressMissions: missions.filter(m => m.status === 'IN_PROGRESS').length,
            pendingMissions: missions.filter(m => m.status === 'PENDING').length,
            upcomingDeadlines: missions
                .filter(m => m.status !== 'COMPLETED')
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 3)
        };
    };

    const stats = calculateStats();

    if (missionsLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardStatCard
                    icon={Users}
                    label="Missions Totales"
                    value={stats.totalMissions}
                />
                <DashboardStatCard
                    icon={Clock}
                    label="En Cours"
                    value={stats.inProgressMissions}
                />
                <DashboardStatCard

                    icon={AlertCircle}
                    label="En Attente"
                    value={stats.pendingMissions}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardSection
                    icon={Calendar}
                    title="Échéances à venirr"
                    emptyMessage="Aucune mission à échéance proche"
                >
                    {stats.upcomingDeadlines.map((mission) => (
                        <div
                            key={mission.id}
                            className="flex justify-between items-center p-4 border-b border-gray-800 last:border-b-0"
                        >
                            <div>
                                <h4 className="font-semibold">{mission.title}</h4>
                                <p className="text-sm text-gray-400">{mission.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Échéance</p>
                                <p className="text-[#FF4405]">
                                    {new Date(mission.deadline).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </DashboardSection>

                <DashboardSection
                    icon={Activity}
                    title="Activité Récente"
                    emptyMessage="Aucune activité récente"
                >
                    {missions.map((mission) => (
                        <div
                            key={mission.id}
                            className="flex justify-between items-center p-4 border-b border-gray-800 last:border-b-0"
                        >
                            <div>
                                <h4 className="font-semibold">{mission.title}</h4>
                                <p className="text-sm text-gray-400">{mission.description}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mission.status === 'COMPLETED' ? 'bg-green-900/50 text-green-200' :
                                mission.status === 'IN_PROGRESS' ? 'bg-blue-900/50 text-blue-200' :
                                    'bg-yellow-900/50 text-yellow-200'
                                }`}>
                                {mission.status === 'COMPLETED' ? 'Terminé' :
                                    mission.status === 'IN_PROGRESS' ? 'En cours' :
                                        'En attente'}
                            </span>
                        </div>
                    ))}
                </DashboardSection>
            </div>
        </div>
    );
}