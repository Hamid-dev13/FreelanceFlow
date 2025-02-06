import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/clients - Liste des clients
export async function GET() {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const clients = await prisma.client.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/clients - Créer un client
export async function POST(req: Request) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { name, email, phone } = await req.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: "Nom et email requis" },
                { status: 400 }
            );
        }

        const client = await prisma.client.create({
            data: {
                name,
                email,
                phone,
                userId
            }
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}