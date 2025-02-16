import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/features/auth/services/jwt';
import { cookies } from 'next/headers';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Wait for the params to resolve
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { message: 'ID de la mission requis' },
            { status: 400 }
        );
    }

    // Vérifier le token dans les en-têtes
    const headerToken = request.headers.get('authorization')?.split('Bearer ')[1];

    // Vérifier le token dans les cookies
    const cookieToken = request.cookies.get('auth-token')?.value;

    const token = headerToken || cookieToken;

    if (!token) {
        return NextResponse.json(
            { message: "Token d'authentification requis" },
            { status: 401 }
        );
    }

    try {
        // Vérifier le token JWT
        const decoded = await verifyJWT(token);

        // Récupérer les données du body de la requête
        const body = await request.json();

        // Mettre à jour la mission dans la base de données avec Prisma
        const updatedMission = await prisma.mission.update({
            where: {
                id: id,
            },
            data: {
                status: body.status,
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedMission);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la mission:', error);
        return NextResponse.json(
            {
                message: 'Erreur lors de la mise à jour de la mission',
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

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

        if (typeof decoded.id !== 'string') {
            return NextResponse.json(
                { message: 'ID utilisateur invalide' },
                { status: 403 }
            );
        }

        const missions = await prisma.mission.findMany({
            where: {
                assignedToId: decoded.id
            },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true, email: true } },
                project: { select: { id: true, status: true } },
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(missions);
    } catch (error) {
        console.error('Erreur lors de la récupération des missions:', error);
        return NextResponse.json(
            { message: 'Erreur lors de la récupération des missions', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        console.log("🔍 Début de la suppression de la mission");

        // Attendre la résolution des paramètres
        const { id } = await params;
        console.log("🆔 ID de la mission à supprimer:", id);

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

        // Supprimer la mission
        const deletedMission = await prisma.mission.delete({
            where: { id: id }
        });

        console.log("🗑️ Mission supprimée:", deletedMission);

        return NextResponse.json(deletedMission, { status: 200 });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de la mission:", error);
        return NextResponse.json(
            {
                message: 'Erreur lors de la suppression de la mission',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}