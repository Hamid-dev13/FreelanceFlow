// src/app/api/reports/monthly/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const year = parseInt(searchParams.get('year') || '')
        const month = parseInt(searchParams.get('month') || '')

        const headersList = await headers()
        const userId = headersList.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        // Calculer le début et la fin du mois
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0)

        // Récupérer les missions avec leurs entrées de temps
        const missions = await prisma.mission.findMany({
            where: {
                assignedToId: userId,
                timeEntries: {
                    some: {
                        startTime: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                }
            },
            include: {
                project: {
                    include: {
                        client: true
                    }
                },
                timeEntries: {
                    where: {
                        startTime: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    orderBy: {
                        startTime: 'asc'
                    }
                }
            }
        })

        // Transformer les données
        const transformedMissions = missions.map(mission => ({
            mission: {
                id: mission.id,
                title: mission.title,
                project: {
                    title: mission.project.title,
                    client: {
                        name: mission.project.client.name
                    }
                }
            },
            totalHours: mission.timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0),
            timeEntries: mission.timeEntries.map(entry => ({
                id: entry.id,
                startTime: entry.startTime.toISOString(),
                endTime: entry.endTime?.toISOString() || '',
                duration: entry.duration || 0,
                description: entry.description || ''
            }))
        }))

        // Calculer le total des heures
        const totalHours = transformedMissions.reduce((sum, mission) => sum + mission.totalHours, 0)

        return NextResponse.json({
            missions: transformedMissions,
            totalHours
        })
    } catch (error) {
        console.error('Erreur de récupération du rapport mensuel:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}