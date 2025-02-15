// app/api/mission/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/features/auth/services/jwt';




export async function GET(request: NextRequest) {
    // Récupérer le token d'authentification
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

        // Vérifier que decoded.id est bien une chaîne
        if (typeof decoded.id !== 'string') {
            return NextResponse.json(
                { message: 'ID utilisateur invalide' },
                { status: 403 }
            );
        }

        // Récupérer les missions spécifiquement assignées à l'utilisateur
        const missions = await prisma.mission.findMany({
            where: {
                assignedToId: decoded.id
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
            },
            orderBy: {
                createdAt: 'desc' // Trier par date de création décroissante
            }
        });

        return NextResponse.json(missions);
    } catch (error) {
        console.error('Erreur lors de la récupération des missions:', error);
        return NextResponse.json(
            {
                message: 'Erreur lors de la récupération des missions',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
