import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from '@/features/auth/services/jwt';

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://freelance-flow-theta.vercel.app/",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
};

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
        console.log("✅ Token vérifié pour l'utilisateur:", payload.userId);
        return payload;
    } catch (error) {
        console.error("❌ Erreur de vérification du token:", error);
        throw error;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clientId = params.id; // Récupérer l'ID immédiatement
        console.log("🔵 Récupération du client:", clientId);

        const payload = await verifyAuth();

        const client = await prisma.client.findUnique({
            where: {
                id: clientId,
                userId: payload.userId
            }
        });

        if (!client) {
            console.log("❌ Client non trouvé");
            return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error("❌ Erreur GET client:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            { status: error instanceof Error && error.message === "Non authentifié" ? 401 : 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clientId = params.id;
        console.log("🔵 Modification du client:", clientId);

        const payload = await verifyAuth();
        const { name, email, phone } = await request.json();

        const client = await prisma.client.update({
            where: {
                id: clientId,
                userId: payload.userId
            },
            data: {
                name,
                email,
                phone
            }
        });

        console.log("✅ Client modifié");
        return NextResponse.json(client);
    } catch (error) {
        console.error("❌ Erreur PUT client:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            { status: error instanceof Error && error.message === "Non authentifié" ? 401 : 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clientId = params.id;
        console.log("🔵 Suppression du client:", clientId);

        const payload = await verifyAuth();

        await prisma.client.delete({
            where: {
                id: clientId,
                userId: payload.userId
            }
        });

        console.log("✅ Client supprimé");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erreur DELETE client:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur serveur" },
            { status: error instanceof Error && error.message === "Non authentifié" ? 401 : 500 }
        );
    }
}