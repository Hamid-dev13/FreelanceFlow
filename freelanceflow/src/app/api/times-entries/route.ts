// src/app/api/time-entries/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(req: Request) {
    try {
        const headersList = await headers()
        const userId = headersList.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const { missionId, startTime, description } = await req.json()

        // Vérifier que la mission existe et appartient au bon utilisateur
        const mission = await prisma.mission.findUnique({
            where: {
                id: missionId,
                assignedToId: userId
            }
        })

        if (!mission) {
            return NextResponse.json({ error: 'Mission non trouvée' }, { status: 404 })
        }

        // Créer l'entrée de temps
        const timeEntry = await prisma.timeEntry.create({
            data: {
                missionId,
                userId,
                startTime: new Date(startTime),
                description
            }
        })

        return NextResponse.json({
            id: timeEntry.id,
            missionId: timeEntry.missionId,
            startTime: timeEntry.startTime.toISOString(),
            description: timeEntry.description
        })
    } catch (error) {
        console.error('Erreur de création de l\'entrée de temps:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}

// Route pour récupérer l'entrée de temps active
export async function GET() {
    try {
        const headersList = await headers()
        const userId = headersList.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        // Rechercher une entrée de temps active (sans endTime)
        const activeTimeEntry = await prisma.timeEntry.findFirst({
            where: {
                userId,
                endTime: null
            },
            include: {
                mission: {
                    include: {
                        project: {
                            include: {
                                client: true
                            }
                        }
                    }
                }
            }
        })

        if (!activeTimeEntry) {
            return NextResponse.json(null)
        }

        return NextResponse.json({
            id: activeTimeEntry.id,
            missionId: activeTimeEntry.missionId,
            startTime: activeTimeEntry.startTime.toISOString(),
            description: activeTimeEntry.description
        })
    } catch (error) {
        console.error('Erreur de récupération de l\'entrée de temps active:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}