import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/features/auth/services/jwt';

export async function GET(req: Request) {
    try {
        console.log("🔍 Début de la vérification du token");

        // Récupérer le cookie de manière asynchrone
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        console.log("🍪 Token du cookie:", token ? "présent" : "absent");

        if (!token) {
            console.log("❌ Pas de token trouvé dans les cookies");
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        // Vérifier le token
        const payload = await verifyJWT(token.value);
        console.log("✅ Token vérifié avec succès, payload:", {
            role: payload.role,
            email: payload.email
        });

        return NextResponse.json({
            role: payload.role,
            userId: payload.userId,
            email: payload.email
        });
    } catch (error) {
        console.error("❌ Erreur de vérification:", error);
        return NextResponse.json(
            { error: "Token invalide", details: error instanceof Error ? error.message : "Erreur inconnue" },
            { status: 401 }
        );
    }
}