import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT, signJWT } from '@/features/auth/services/jwt';
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        // Récupérer le refresh token depuis les cookies
        const cookieStore = cookies();
        const refreshToken = (await cookieStore).get('refresh_token')?.value;

        // Vérifier si le refresh token existe
        if (!refreshToken) {
            return NextResponse.json(
                { error: "Refresh token manquant" },
                { status: 401 }
            );
        }

        // Vérifier la validité du refresh token
        const payload = await verifyJWT(refreshToken);

        // Vérifier que c'est bien un refresh token
        if (payload.type !== 'refresh') {
            return NextResponse.json(
                { error: "Token invalide" },
                { status: 403 }
            );
        }

        // Vérifier que l'utilisateur existe encore
        const user = await prisma.user.findUnique({
            where: { id: payload.userId }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 403 }
            );
        }

        // Générer un nouvel access token
        const newAccessToken = await signJWT({
            userId: user.id,
            email: user.email,
            role: user.role as 'DEVELOPER' | 'PROJECT_MANAGER',
            type: 'access'
        }, '15m');

        // Retourner le nouvel access token
        return NextResponse.json({
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error("Erreur lors du refresh du token:", error);
        return NextResponse.json(
            { error: "Erreur de serveur lors du refresh" },
            { status: 500 }
        );
    }
}