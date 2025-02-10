import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET Missions
export async function GET() {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");
        const userRole = headersList.get("x-user-role");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        // Logique différente selon le rôle
        if (userRole === 'CHEF_PROJET') {
            const missions = await prisma.mission.findMany({
                include: {
                    project: true,
                    assignedTo: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(missions);
        }

        if (userRole === 'FREELANCE') {
            const missions = await prisma.mission.findMany({
                where: { assignedToId: userId },
                include: {
                    project: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(missions);
        }

        return NextResponse.json({ error: "Rôle non autorisé" }, { status: 403 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST Création de mission
export async function POST(req: Request) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");
        const userRole = headersList.get("x-user-role");

        if (!userId || userRole !== 'CHEF_PROJET') {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { title, description, projectId, assignedToId } = await req.json();

        const mission = await prisma.mission.create({
            data: {
                title,
                description,
                projectId,
                createdById: userId,
                assignedToId,
                status: 'EN_ATTENTE'
            }
        });

        return NextResponse.json(mission, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}