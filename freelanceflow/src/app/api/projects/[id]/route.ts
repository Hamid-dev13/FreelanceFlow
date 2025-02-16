import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from '@/features/auth/services/jwt';

// Fonction utilitaire pour la vérification d'authentification
async function verifyAuth() {
    console.log("🔍 Vérification de l'authentification");

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
        console.log("❌ Pas de token trouvé dans les cookies");
        throw new Error("Non authentifié");
    }

    try {
        const payload = await verifyJWT(token.value);
        console.log("✅ Token vérifié pour l'utilisateur:", payload.userId);
        return payload;
    } catch (error) {
        console.error("❌ Erreur de vérification du token:", error);
        throw error;
    }
}

// GET /api/projects/[id] - Détail d'un projet
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Utilisation de Promise comme en GET et PUT
) {
    const { id } = await params; // Extraction avec `await`

    try {
        console.log("🔵 Récupération du projet:", id);
        const payload = await verifyAuth();

        const project = await prisma.project.findUnique({
            where: {
                id,
                userId: payload.userId
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
            console.log("❌ Projet non trouvé");
            return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
        }

        console.log("✅ Projet récupéré");
        return NextResponse.json(project);
    } catch (error) {
        console.error("❌ Erreur GET project:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            { status: error instanceof Error && error.message === "Non authentifié" ? 401 : 500 }
        );
    }
}
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Utilisation de Promise
) {
    const { id } = await params; // Extraction avec `await`

    try {
        console.log("🔵 Modification du projet:", id);
        const payload = await verifyAuth();

        const { title, description, clientId, startDate, endDate, status } = await request.json();

        const project = await prisma.project.update({
            where: {
                id,
                userId: payload.userId
            },
            data: {
                title,
                description,
                startDate: new Date(startDate).toISOString(),
                endDate: endDate ? new Date(endDate).toISOString() : null,
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

        console.log("✅ Projet modifié");
        return NextResponse.json(project);
    } catch (error) {
        console.error("❌ Erreur PUT project:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            { status: error instanceof Error && error.message === "Non authentifié" ? 401 : 500 }
        );
    }
}

// DELETE /api/projects/[id] - Supprimer un projet
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Utilisation de Promise
) {
    const { id } = await params; // Extraction avec `await`

    try {
        console.log("🔵 Suppression du projet:", id);
        const payload = await verifyAuth();

        await prisma.project.delete({
            where: {
                id,
                userId: payload.userId
            }
        });

        console.log("✅ Projet supprimé");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erreur DELETE project:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            { status: error instanceof Error && error.message === "Non authentifié" ? 401 : 500 }
        );
    }
}