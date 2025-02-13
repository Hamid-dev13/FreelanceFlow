'use client';

import { useEffect } from 'react';
import { useMissionStore } from '@/stores/useMissionStore';
import { Activity, Calendar, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { GradientText } from '@/components/common/ui/GradientText';
import { FeatureCard } from '@/components/common/ui/FeatureCard';

export default function MissionsPage() {
    const { missions, loading, error, fetchMissions } = useMissionStore();

    useEffect(() => {
        console.log('Fetching missions...');
        fetchMissions('DEVELOPER');
    }, [fetchMissions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-gray-400">Chargement des missions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Activity className="h-8 w-8 text-primary" />
                        <GradientText>Mes Missions</GradientText>
                    </h1>
                    <p className="mt-2 text-gray-400">Gérez et suivez vos missions en cours</p>
                </div>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:from-primary-light hover:to-secondary-light transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40">
                    Nouvelle Mission
                </button>
            </div>

            {/* Missions Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {missions.map((mission) => (
                    <div
                        key={mission.id}
                        className="group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl transform transition-transform group-hover:scale-105" />
                        <div className="relative p-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 transition-all duration-300 group-hover:border-primary/50">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {mission.title}
                                </h2>
                                <span className={`
                                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                    ${mission.status === 'COMPLETED'
                                        ? 'bg-green-900/50 text-green-200 border border-green-500/20'
                                        : mission.status === 'IN_PROGRESS'
                                            ? 'bg-primary/20 text-primary border border-primary/20'
                                            : 'bg-yellow-900/50 text-yellow-200 border border-yellow-500/20'
                                    }
                                `}>
                                    <span className="flex items-center gap-1.5">
                                        {mission.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {mission.status === 'COMPLETED' ? 'Terminé' :
                                            mission.status === 'IN_PROGRESS' ? 'En cours' : 'En attente'}
                                    </span>
                                </span>
                            </div>

                            <p className="text-gray-400 mb-4">{mission.description}</p>

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
                ))}
            </div>

            {/* Empty State */}
            {missions.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800">
                    <Activity className="h-16 w-16 text-gray-700 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300">Aucune mission en cours</h3>
                    <p className="text-gray-400 mt-2 text-center max-w-md">
                        Vous n'avez pas encore de missions assignées. Les nouvelles missions apparaîtront ici.
                    </p>
                </div>
            )}
        </div>
    );
}