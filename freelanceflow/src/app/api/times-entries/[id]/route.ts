// src/app/api/time-entries/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { TimeEntry } from '@prisma/client'

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = await headers()
        const userId = headersList.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const { endTime, description } = await req.json()

        // Récupérer d'abord l'entrée de temps existante
        const existingTimeEntry = await prisma.timeEntry.findUnique({
            where: {
                id: params.id,
                userId
            }
        })

        if (!existingTimeEntry) {
            return NextResponse.json({ error: 'Entrée de temps non trouvée' }, { status: 404 })
        }

        // Calculer la durée
        const duration = endTime
            ? (new Date(endTime).getTime() - new Date(existingTimeEntry.startTime).getTime()) / (1000 * 60 * 60)
            : undefined

        // Mettre à jour l'entrée de temps
        const updatedTimeEntry = await prisma.timeEntry.update({
            where: {
                id: params.id,
                userId
            },
            data: {
                endTime: endTime ? new Date(endTime) : undefined,
                description,
                duration
            }
        })

        return NextResponse.json({
            id: updatedTimeEntry.id,
            missionId: updatedTimeEntry.missionId,
            startTime: updatedTimeEntry.startTime.toISOString(),
            endTime: updatedTimeEntry.endTime?.toISOString(),
            description: updatedTimeEntry.description,
            duration: updatedTimeEntry.duration
        })
    } catch (error) {
        console.error('Erreur de mise à jour de l\'entrée de temps:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}