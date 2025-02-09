import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// Définition des headers CORS
const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://freelance-flow-theta.vercel.app/", // Remplace par ton vrai domaine Vercel
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id",
    "Access-Control-Allow-Credentials": "true"
};

// Gestion de la requête OPTIONS (prévol CORS)
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
    });
}

// GET /api/clients - Liste des clients
export async function GET() {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401, headers: CORS_HEADERS });
        }

        const clients = await prisma.client.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(clients, { headers: CORS_HEADERS });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS_HEADERS });
    }
}

// POST /api/clients - Création d'un client
export async function POST(req: Request) {
    try {
        // Récupération des en-têtes
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        console.log("User ID:", userId);  // Log pour vérifier la valeur de x-user-id

        if (!userId) {
            console.log("User ID manquant, accès non autorisé.");  // Log pour voir pourquoi l'accès est refusé
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401, headers: CORS_HEADERS }
            );
        }

        const { name, email, phone } = await req.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: "Nom et email requis" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        const existingClientEmail = await prisma.client.findFirst({
            where: { email, userId }
        });

        if (existingClientEmail) {
            return NextResponse.json(
                { error: "Cette adresse email est déjà attribuée à un client" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        if (phone) {
            const existingClientPhone = await prisma.client.findFirst({
                where: { phone, userId }
            });

            if (existingClientPhone) {
                return NextResponse.json(
                    { error: "Ce numéro de téléphone est déjà attribué à un client" },
                    { status: 400, headers: CORS_HEADERS }
                );
            }
        }

        const client = await prisma.client.create({
            data: { name, email, phone, userId }
        });

        return NextResponse.json(client, { status: 201, headers: CORS_HEADERS });
    } catch (error) {
        console.error("Erreur lors de la création du client:", error);  // Log pour afficher l'erreur
        return NextResponse.json(
            { error: "Erreur lors de la création du client" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
