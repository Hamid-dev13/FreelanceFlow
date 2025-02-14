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
// app/api/mission/route.ts




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
// Ajoutez cette méthode DELETE
export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
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

        // Supprimer la mission
        const deletedMission = await prisma.mission.delete({
            where: {
                id: id,
                // Optionnel : ajouter une vérification d'autorisation
                // Par exemple, seul le créateur peut supprimer
                // createdById: decoded.id 
            }
        });

        return NextResponse.json(deletedMission, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la suppression de la mission:', error);
        return NextResponse.json(
            {
                message: 'Erreur lors de la suppression de la mission',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}