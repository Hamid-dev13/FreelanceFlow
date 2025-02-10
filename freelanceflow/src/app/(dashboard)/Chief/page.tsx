// src/app/(dashboard)/chef-de-projet/page.tsx
"use client"

import { useState, useEffect } from 'react'
import {
    Briefcase,
    Users,
    PlusCircle,
    ListChecks,
    Calendar
} from 'lucide-react'

type Project = {
    id: string
    title: string
    missions: Mission[]
    client: {
        name: string
    }
}

type Mission = {
    id: string
    title: string
    status: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE'
    assignedTo?: {
        id: string
        name: string
    }
    project: {
        title: string
    }
}

type Freelance = {
    id: string
    name: string
    email: string
}

type DashboardStats = {
    totalProjects: number
    totalMissions: number
    unassignedMissions: number
}

export default function ChefDeProjetDashboard() {
    const [projects, setProjects] = useState<Project[]>([])
    const [missions, setMissions] = useState<Mission[]>([])
    const [freelances, setFreelances] = useState<Freelance[]>([])
    const [stats, setStats] = useState<DashboardStats>({
        totalProjects: 0,
        totalMissions: 0,
        unassignedMissions: 0
    })
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null)

    /*
 useEffect(() => {
     const fetchDashboardData = async () => {
         try {
             // Récupérer les projets
             const projectsResponse = await fetch('/api/projects')
             const projectsData = await projectsResponse.json()
             setProjects(projectsData)
 
             // Récupérer les missions
             const missionsResponse = await fetch('/api/missions')
             const missionsData = await missionsResponse.json()
             setMissions(missionsData)
 
             // Récupérer les freelances
             const freelancesResponse = await fetch('/api/users?role=FREELANCE')
             const freelancesData = await freelancesResponse.json()
             setFreelances(freelancesData)
 
             // Récupérer les statistiques du dashboard
             const statsResponse = await fetch('/api/dashboard/chef-projet')
             const statsData = await statsResponse.json()
             setStats(statsData)
         } catch (error) {
             console.error('Erreur de chargement des données:', error)
         }
     }
 
     fetchDashboardData()
 }, [])
 */

    const handleAssignMission = async (missionId: string, freelanceId: string) => {
        try {
            const response = await fetch('/api/missions/attribuer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ missionId, freelanceId })
            })

            if (response.ok) {
                // Mettre à jour l'état local
                const updatedMission = await response.json()
                setMissions(missions.map(m =>
                    m.id === updatedMission.id ? updatedMission : m
                ))
                setSelectedMission(null)
            }
        } catch (error) {
            console.error('Erreur d\'attribution de mission:', error)
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Projets Total</h3>
                    <p className="text-3xl font-bold">{stats.totalProjects}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Missions Total</h3>
                    <p className="text-3xl font-bold">{stats.totalMissions}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Missions Non Assignées</h3>
                    <p className="text-3xl font-bold">{stats.unassignedMissions}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Missions Non Assignées</h2>
                    {missions.filter(m => !m.assignedTo).map(mission => (
                        <div
                            key={mission.id}
                            className="bg-gray-800 p-4 rounded-lg mb-4 cursor-pointer"
                            onClick={() => setSelectedMission(mission)}
                        >
                            <h3 className="font-bold">{mission.title}</h3>
                            <p>Projet: {mission.project.title}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Freelances Disponibles</h2>
                    {freelances.map(freelance => (
                        <div
                            key={freelance.id}
                            className="bg-gray-800 p-4 rounded-lg mb-4"
                        >
                            <h3 className="font-bold">{freelance.name}</h3>
                            <p>{freelance.email}</p>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Assigner Mission</h2>
                        <div className="mb-4">
                            <h3 className="font-semibold">{selectedMission.title}</h3>
                            <p>Projet: {selectedMission.project.title}</p>
                        </div>
                        <select
                            onChange={(e) => handleAssignMission(selectedMission.id, e.target.value)}
                            className="w-full p-2 bg-gray-800 rounded mb-4"
                        >
                            <option value="">Sélectionner un freelance</option>
                            {freelances.map(freelance => (
                                <option key={freelance.id} value={freelance.id}>
                                    {freelance.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setSelectedMission(null)}
                            className="w-full bg-red-600 text-white p-2 rounded"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}