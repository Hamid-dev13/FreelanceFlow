import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from '@/features/auth/services/jwt';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email et mot de passe requis" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json(
                { error: "Identifiants incorrects" },
                { status: 401 }
            );
        }

        // Access Token (courte durée)
        const accessToken = await signJWT({
            userId: user.id,
            email: user.email,
            role: user.role as 'DEVELOPER' | 'PROJECT_MANAGER',
            type: 'access'
        }, '15m');

        // Refresh Token (longue durée)
        const refreshToken = await signJWT({
            userId: user.id,
            type: 'refresh'
        }, '30d');  // 30 jours

        // Créer la réponse
        const response = NextResponse.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

        // Ajouter le refresh token comme cookie HttpOnly
        response.cookies.set({
            name: 'refresh_token',
            value: refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 // 30 jours en secondes
        });

        // NOUVEAU : Ajouter le rôle comme cookie sécurisé
        response.cookies.set({
            name: 'user_role',
            value: user.role,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 // 30 jours en secondes
        });

        return response;
    } catch (error) {
        console.error("Erreur login:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}