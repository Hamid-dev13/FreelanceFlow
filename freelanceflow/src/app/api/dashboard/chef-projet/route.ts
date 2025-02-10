import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");
        const userRole = headersList.get("x-user-role");

        if (!userId || userRole !== 'CHEF_PROJET') {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        // Statistiques pour le dashboard chef de projet
        const totalProjects = await prisma.project.count({ where: { userId } });
        const totalMissions = await prisma.mission.count({
            where: { createdById: userId }
        });
        const unassignedMissions = await prisma.mission.count({
            where: {
                createdById: userId,
                assignedToId: null
            }
        });

        return NextResponse.json({
            totalProjects,
            totalMissions,
            unassignedMissions
        });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}