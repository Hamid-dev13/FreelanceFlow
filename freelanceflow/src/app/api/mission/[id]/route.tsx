// app/api/mission/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/features/auth/services/jwt';

export async function PUT(
    request: NextRequest,
    context: { params: { id: string } }
) {
    // Attendre les params
    const { id } = await Promise.resolve(context.params);

    const token = request.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
        return NextResponse.json(
            { message: 'Token d\'authentification requis' },
            { status: 401 }
        );
    }

    try {
        // Vérifier le token
        const decoded = await verifyJWT(token);

        // Récupérer les données du body
        const body = await request.json();

        // Mettre à jour la mission
        const updatedMission = await prisma.mission.update({
            where: {
                id: id // Utiliser l'id extrait
            },
            data: {
                status: body.status
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        });

        return NextResponse.json(updatedMission);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la mission:', error);
        return NextResponse.json(
            {
                message: 'Erreur lors de la mise à jour de la mission',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}