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

// GET /api/projects - Liste de tous les projets
export async function GET() {
    try {
        console.log("🔵 Récupération des projets");
        const payload = await verifyAuth();

        const projects = await prisma.project.findMany({
            where: {
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
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log("✅ Projets récupérés:", projects.length);
        return NextResponse.json(projects);
    } catch (error) {
        console.error("❌ Erreur GET projects:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            { status: error instanceof Error && error.message === "Non authentifié" ? 401 : 500 }
        );
    }
}

// POST /api/projects - Créer un nouveau projet
export async function POST(req: Request) {
    try {
        console.log("🔵 Création d'un nouveau projet");
        const payload = await verifyAuth();

        const { title, description, clientId, startDate, endDate, status } = await req.json();

        if (!title || !clientId) {
            console.log("❌ Données manquantes");
            return NextResponse.json(
                { error: "Titre et client requis" },
                { status: 400 }
            );
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                startDate: startDate || new Date(),
                endDate,
                status: status || "EN_COURS",
                clientId,
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

        console.log("✅ Projet créé:", project.id);
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur POST project:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            { status: error instanceof Error && error.message === "Non authentifié" ? 401 : 500 }
        );
    }
}