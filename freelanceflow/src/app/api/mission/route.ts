// src/app/api/mission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/features/auth/services/jwt';
import { cookies } from 'next/headers';
export async function GET(request: NextRequest) {
    try {
        console.log("🔍 Début de la vérification du token pour GET");

        // Récupérer le token d'authentification depuis les cookies
        const cookieStore = cookies();
        const tokenCookie = (await cookieStore).get('auth-token');

        const token = tokenCookie ? tokenCookie.value : request.headers.get('authorization')?.split('Bearer ')[1];

        console.log("🍪 Token récupéré:", token ? "présent" : "absent");

        if (!token) {
            console.log("❌ Pas de token trouvé");
            return NextResponse.json(
                { message: 'Token d\'authentification requis' },
                { status: 401 }
            );
        }

        // Vérifier le token
        const decoded = await verifyJWT(token);
        console.log("✅ Token vérifié avec succès, payload:", {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email
        });

        if (typeof decoded.userId !== 'string') {
            console.log("❌ ID utilisateur invalide");
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

        console.log("👤 Utilisateur trouvé:", user);

        // Définir les conditions de recherche selon le rôle
        const whereCondition = user?.role === 'PROJECT_MANAGER'
            ? { createdById: decoded.userId }  // Project Manager voit ses missions créées
            : { assignedToId: decoded.userId }; // Developer voit ses missions assignées

        console.log("🔍 Condition de recherche:", whereCondition);

        // Récupérer les missions
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
                        title: true,
                        description: true,
                        status: true,
                        startDate: true,
                        endDate: true,
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

        console.log("📋 Missions récupérées:", JSON.stringify(missions, null, 2));

        return NextResponse.json(missions);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des missions:", error);
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
    try {
        console.log("🔍 Début de la création de la mission");

        // Récupérer le token d'authentification depuis les cookies
        const cookieStore = cookies();
        const tokenCookie = (await cookieStore).get('auth-token');

        const token = tokenCookie ? tokenCookie.value : request.headers.get('authorization')?.split('Bearer ')[1];

        console.log("🍪 Token récupéré:", token ? "présent" : "absent");

        if (!token) {
            console.log("❌ Pas de token trouvé");
            return NextResponse.json(
                { message: 'Token d\'authentification requis' },
                { status: 401 }
            );
        }

        // Vérifier le token
        const decoded = await verifyJWT(token);
        console.log("✅ Token vérifié avec succès, payload:", {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email
        });

        // Valider les données de la mission
        const missionData = await request.json();
        console.log("📝 Données de la mission reçues:", missionData);

        // Convertir la deadline en format ISO-8601 avec heure par défaut
        const formattedMissionData = {
            ...missionData,
            deadline: new Date(missionData.deadline + 'T00:00:00.000Z').toISOString()
        };

        console.log("📅 Deadline formatée:", formattedMissionData.deadline);

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

        console.log("🆕 Nouvelle mission créée:", newMission);
        return NextResponse.json(newMission);
    } catch (error) {
        console.error("❌ Erreur lors de la création de la mission:", error);
        return NextResponse.json(
            {
                message: 'Erreur lors de la création de la mission',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}