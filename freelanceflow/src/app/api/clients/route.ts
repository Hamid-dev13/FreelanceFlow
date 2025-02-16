import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from '@/features/auth/services/jwt';

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://freelance-flow-theta.vercel.app/",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
    });
}

// Fonction utilitaire pour vérifier l'authentification
async function verifyAuth() {
    console.log("🔍 Vérification de l'authentification");

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
        console.log("❌ Pas de token trouvé");
        throw new Error("Non authentifié");
    }

    try {
        const payload = await verifyJWT(token.value);
        console.log("✅ Token vérifié, utilisateur:", payload.userId);
        return payload;
    } catch (error) {
        console.error("❌ Erreur de vérification du token:", error);
        throw error;
    }
}

export async function GET() {
    try {
        const payload = await verifyAuth();
        console.log("👤 Récupération des clients pour l'utilisateur:", payload.userId);

        const clients = await prisma.client.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(clients, { headers: CORS_HEADERS });
    } catch (error) {
        console.error("❌ Erreur GET clients:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            { status: 401, headers: CORS_HEADERS }
        );
    }
}

export async function POST(req: Request) {
    try {
        const payload = await verifyAuth();
        const { name, email, phone } = await req.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: "Nom et email requis" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        // Vérification de l'existence du client
        const existingClientEmail = await prisma.client.findFirst({
            where: { email, userId: payload.userId }
        });

        if (existingClientEmail) {
            return NextResponse.json(
                { error: "Cette adresse email est déjà attribuée à un client" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        if (phone) {
            const existingClientPhone = await prisma.client.findFirst({
                where: { phone, userId: payload.userId }
            });

            if (existingClientPhone) {
                return NextResponse.json(
                    { error: "Ce numéro de téléphone est déjà attribué à un client" },
                    { status: 400, headers: CORS_HEADERS }
                );
            }
        }

        const client = await prisma.client.create({
            data: {
                name,
                email,
                phone,
                userId: payload.userId
            }
        });

        return NextResponse.json(client, {
            status: 201,
            headers: CORS_HEADERS
        });
    } catch (error) {
        console.error("❌ Erreur POST client:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            {
                status: error instanceof Error && error.message === "Non authentifié" ? 401 : 500,
                headers: CORS_HEADERS
            }
        );
    }
}