// src/app/api/mission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/features/auth/services/jwt';
export async function GET(request: NextRequest) {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
        return NextResponse.json(
            { message: 'Token d\'authentification requis' },
            { status: 401 }
        );
    }

    try {
        const decoded = await verifyJWT(token);

        if (typeof decoded.userId !== 'string') {
            return NextResponse.json(
                { message: 'ID utilisateur invalide' },
                { status: 403 }
            );
        }

        // Récupérer l'utilisateur et son rôle
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { role: true }
        });

        // Définir les conditions de recherche selon le rôle
        const whereCondition = user?.role === 'PROJECT_MANAGER'
            ? { createdById: decoded.userId }  // Project Manager voit ses missions créées
            : { assignedToId: decoded.userId }; // Developer voit ses missions assignées

        // Dans route.ts
        const missions = await prisma.mission.findMany({
            where: whereCondition,
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
                        title: true,         // Correspond au schéma Prisma
                        description: true,
                        status: true,
                        startDate: true,     // Ajouté depuis le schéma
                        endDate: true,       // Ajouté depuis le schéma
                        clientId: true,
                        client: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Log pour debug
        console.log('Première mission:', JSON.stringify(missions[0], null, 2));

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


export async function POST(request: NextRequest) {
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

        // Valider les données de la mission
        const missionData = await request.json();

        // Convertir la deadline en format ISO-8601 avec heure par défaut
        const formattedMissionData = {
            ...missionData,
            deadline: new Date(missionData.deadline + 'T00:00:00.000Z').toISOString()
        };

        // Créer la mission
        const newMission = await prisma.mission.create({
            data: {
                ...formattedMissionData,
                createdById: decoded.userId,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
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
                        title: true,
                        status: true,
                        description: true,
                        client: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        return NextResponse.json(newMission);
    } catch (error) {
        console.error('Erreur lors de la création de la mission:', error);
        return NextResponse.json(
            {
                message: 'Erreur lors de la création de la mission',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}