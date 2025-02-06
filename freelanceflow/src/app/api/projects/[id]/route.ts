import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/projects/[id] - Détail d'un projet
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const project = await prisma.project.findUnique({
            where: {
                id: params.id,
                userId
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!project) {
            return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/projects/[id] - Modifier un projet
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { title, description, clientId, startDate, endDate, status } = await req.json();

        // Vérifier que le client existe et appartient à l'utilisateur si fourni
        if (clientId) {
            const client = await prisma.client.findUnique({
                where: {
                    id: clientId,
                    userId
                }
            });

            if (!client) {
                return NextResponse.json(
                    { error: "Client non trouvé" },
                    { status: 404 }
                );
            }
        }

        const project = await prisma.project.update({
            where: {
                id: params.id,
                userId
            },
            data: {
                title,
                description,
                startDate,
                endDate,
                status,
                clientId
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/projects/[id] - Supprimer un projet
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        await prisma.project.delete({
            where: {
                id: params.id,
                userId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}