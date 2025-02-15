// src/app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { verifyJWT } from '@/features/auth/services/jwt';

export async function GET(req: Request) {
    try {
        // Log des headers reçus
        const cookieHeader = req.headers.get('cookie');
        console.log("🍪 Headers de cookies reçus:", cookieHeader);

        const authToken = cookieHeader?.split(';')
            .find(c => c.trim().startsWith('auth-token='))
            ?.split('=')[1];

        console.log("🔑 Token extrait:", authToken);

        if (!authToken) {
            console.log("❌ Aucun token trouvé dans les cookies");
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const payload = await verifyJWT(authToken);
        console.log("✅ Payload vérifié:", payload);

        return NextResponse.json({
            role: payload.role,
            userId: payload.userId,
            email: payload.email
        });

    } catch (error) {
        console.error('❌ Erreur détaillée:', error);
        return NextResponse.json(
            {
                error: 'Token invalide',
                details: error instanceof Error ? error.message : 'Erreur inconnue'
            },
            { status: 401 }
        );
    }
}