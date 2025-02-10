// src/app/(dashboard)/freelance/page.tsx
"use client"

import { useState, useEffect } from 'react'
import {
    Briefcase,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react'

export type Mission = {
    id: string
    title: string
    status: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE'
    project: {
        title: string
        client: {
            name: string
        }
    }
    timeEntries?: TimeEntry[]
}

type TimeEntry = {
    id: string
    missionId: string
    startTime: string
    endTime?: string
    duration?: number
    description?: string
}

type FreelanceDashboardStats = {
    totalMissions: number
    completedMissions: number
    currentMissionHours: number
}

export default function FreelanceDashboard() {
    const [missions, setMissions] = useState<Mission[]>([])
    const [stats, setStats] = useState<FreelanceDashboardStats>({
        totalMissions: 0,
        completedMissions: 0,
        currentMissionHours: 0
    })
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
    const [activeTimeEntry, setActiveTimeEntry] = useState<TimeEntry | null>(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Récupérer les missions du freelance
                const missionsResponse = await fetch('/api/missions')
                const missionsData = await missionsResponse.json()
                setMissions(missionsData)

                // Récupérer les statistiques
                const statsResponse = await fetch('/api/dashboard/freelance')
                const statsData = await statsResponse.json()
                setStats(statsData)

                // Vérifier s'il y a une entrée de temps active
                const activeEntryResponse = await fetch('/api/time-entries/active')
                const activeEntryData = await activeEntryResponse.json()
                if (activeEntryData) {
                    setActiveTimeEntry(activeEntryData)
                }
            } catch (error) {
                console.error('Erreur de chargement des données:', error)
            }
        }

        fetchDashboardData()
    }, [])

    const startTimeTracking = async (mission: Mission) => {
        try {
            const response = await fetch('/api/time-entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    missionId: mission.id,
                    startTime: new Date().toISOString()
                })
            })

            if (response.ok) {
                const newTimeEntry = await response.json()
                setActiveTimeEntry(newTimeEntry)
                setSelectedMission(mission)
            }
        } catch (error) {
            console.error('Erreur de démarrage du suivi de temps:', error)
        }
    }

    const stopTimeTracking = async () => {
        if (!activeTimeEntry) return

        try {
            const response = await fetch(`/api/time-entries/${activeTimeEntry.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    endTime: new Date().toISOString()
                })
            })

            if (response.ok) {
                setActiveTimeEntry(null)
                setSelectedMission(null)
            }
        } catch (error) {
            console.error('Erreur d\'arrêt du suivi de temps:', error)
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Total Missions</h3>
                    <p className="text-3xl font-bold">{stats.totalMissions}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Missions Terminées</h3>
                    <p className="text-3xl font-bold">{stats.completedMissions}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Heures Courantes</h3>
                    <p className="text-3xl font-bold">{stats.currentMissionHours.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Mes Missions</h2>
                    {missions.map(mission => (
                        <div
                            key={mission.id}
                            className={`bg-gray-800 p-4 rounded-lg mb-4 
                ${activeTimeEntry?.missionId === mission.id ? 'border-2 border-green-500' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{mission.title}</h3>
                                    <p>Projet: {mission.project.title}</p>
                                    <p>Client: {mission.project.client.name}</p>
                                </div>
                                {activeTimeEntry?.missionId !== mission.id ? (
                                    <button
                                        onClick={() => startTimeTracking(mission)}
                                        className="bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        Commencer
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopTimeTracking}
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Arrêter
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Suivi du Temps</h2>
                    {activeTimeEntry ? (
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-bold">Mission en cours</h3>
                            <p>Démarré à: {new Date(activeTimeEntry.startTime).toLocaleTimeString()}</p>
                            <input
                                type="text"
                                placeholder="Description de la tâche"
                                className="w-full p-2 mt-2 bg-gray-700 rounded"
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <Clock className="mx-auto mb-2 text-gray-400" size={40} />
                            <p className="text-gray-400">Aucune mission en cours</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}