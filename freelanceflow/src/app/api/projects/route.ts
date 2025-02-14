import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import ProjectsPage from "@/app/(dashboard)/projects/page";

// GET /api/projects - Liste des projets
export async function GET() {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const projects = await prisma.project.findMany({
            where: { userId },
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

        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }



}

// POST /api/projects - Créer un projet
export async function POST(req: Request) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { title, description, clientId, startDate, endDate, status } = await req.json();

        if (!title || !clientId) {
            return NextResponse.json(
                { error: "Titre et client requis" },
                { status: 400 }
            );
        }

        // Vérifier que le client existe et appartient à l'utilisateur
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

        const project = await prisma.project.create({
            data: {
                title,
                description,
                startDate: startDate || new Date(),
                endDate,
                status: status || "EN_COURS",
                clientId,
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
        console.log("Projet créé:", project);
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("Erreur création projet:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

