'use client';

import { useEffect } from 'react';
import { useMissionStore } from '@/stores/useMissionStore';
import { Loader2 } from 'lucide-react';

export default function MissionsPage() {
    const { missions, loading, error, fetchMissions } = useMissionStore();

    useEffect(() => {
        console.log('Fetching missions...');
        fetchMissions('DEVELOPER');
    }, [fetchMissions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF4405]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 rounded-lg bg-red-500/10">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Mes Missions</h1>
            <div className="grid gap-4">
                {missions.map((mission) => (
                    <div
                        key={mission.id}
                        className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
                    >
                        <h2 className="text-lg font-medium">{mission.title}</h2>
                        <p className="text-gray-400 mt-2">{mission.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                                Échéance : {new Date(mission.deadline).toLocaleDateString()}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mission.status === 'COMPLETED'
                                    ? 'bg-green-900/50 text-green-200 border border-green-500/20'
                                    : mission.status === 'IN_PROGRESS'
                                        ? 'bg-blue-900/50 text-blue-200 border border-blue-500/20'
                                        : 'bg-yellow-900/50 text-yellow-200 border border-yellow-500/20'
                                }`}>
                                {mission.status === 'COMPLETED' ? 'Terminé' :
                                    mission.status === 'IN_PROGRESS' ? 'En cours' : 'En attente'}
                            </span>
                        </div>
                    </div>
                ))}

                {missions.length === 0 && (
                    <div className="text-center py-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
                        <h3 className="text-lg font-medium text-white">Aucune mission</h3>
                        <p className="text-gray-400 mt-2">Vous n'avez pas encore de missions assignées</p>
                    </div>
                )}
            </div>
        </div>
    );
}