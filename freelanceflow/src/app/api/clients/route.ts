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

// Dans la route POST /api/clients
export async function POST(req: Request) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const { name, email, phone } = await req.json();

        // Validation de base
        if (!name || !email) {
            return NextResponse.json(
                { error: "Nom et email requis" },
                { status: 400 }
            );
        }

        // Vérifier si l'email est déjà utilisé
        const existingClientEmail = await prisma.client.findFirst({
            where: {
                email,
                userId
            }
        });

        if (existingClientEmail) {
            return NextResponse.json(
                { error: "Cette adresse email est déjà attribuée à un client" },
                { status: 400 }
            );
        }

        // Vérifier si le téléphone est déjà utilisé (si fourni)
        if (phone) {
            const existingClientPhone = await prisma.client.findFirst({
                where: {
                    phone,
                    userId
                }
            });

            if (existingClientPhone) {
                return NextResponse.json(
                    { error: "Ce numéro de téléphone est déjà attribué à un client" },
                    { status: 400 }
                );
            }
        }

        // Création du client si tout est OK
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
        return NextResponse.json(
            { error: "Erreur lors de la création du client" },
            { status: 500 }
        );
    }
}