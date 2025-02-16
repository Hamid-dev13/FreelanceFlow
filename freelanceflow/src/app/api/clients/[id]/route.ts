import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from '@/features/auth/services/jwt';

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

type ParamsType = { id: string };

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // 👈 `params` en tant que Promise
) {
    const { id } = await params; // 👈 Attente de la résolution de `params`

    console.log("ID reçu :", id);

    return NextResponse.json({ message: `Client ID: ${id}` });
}
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // 👈 Utilisation de Promise comme en GET
) {
    const { id } = await params; // 👈 Extraction avec `await`

    try {
        console.log("🔵 Modification du client:", id);

        const payload = await verifyAuth();
        const { name, email, phone } = await request.json();

        const client = await prisma.client.update({
            where: {
                id,
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
    { params }: { params: Promise<{ id: string }> } // 👈 Utilisation de Promise comme en GET et PUT
) {
    const { id } = await params; // 👈 Extraction avec `await`

    try {
        console.log("🔵 Suppression du client:", id);

        const payload = await verifyAuth();

        await prisma.client.delete({
            where: {
                id,
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