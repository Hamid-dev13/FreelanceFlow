// src/app/api/mission/route.ts
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

        // Vérifier que decoded.userId est bien une chaîne
        if (typeof decoded.userId !== 'string') {
            return NextResponse.json(
                { message: 'ID utilisateur invalide' },
                { status: 403 }
            );
        }

        // Récupérer les missions spécifiquement assignées à l'utilisateur
        const missions = await prisma.mission.findMany({
            where: {
                assignedToId: decoded.userId  // Utiliser userId au lieu de id
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
                        name: true,
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
                createdById: decoded.userId, // Utiliser l'ID de l'utilisateur connecté
                status: 'PENDING', // Statut initial par défaut
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
                        name: true,
                        status: true
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