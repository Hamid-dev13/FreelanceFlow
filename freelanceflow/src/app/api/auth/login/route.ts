// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from '@/features/auth/services/jwt';

interface LoginPayload {
    email: string;
    password: string;
}

export async function POST(req: Request) {
    try {
        if (!req.body) {
            return NextResponse.json(
                { error: "Requête invalide" },
                { status: 400 }
            );
        }

        const { email, password }: LoginPayload = await req.json();

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

        const token = await signJWT({
            userId: user.id,
            email: user.email,
            role: user.role as 'DEVELOPER' | 'PROJECT_MANAGER'
            // On retire iat et exp car ils sont gérés par la fonction signJWT
        });

        console.log("🔐 Token généré:", token); // Debug

        // Création de la réponse
        const response = NextResponse.json({
            token, // On inclut le token dans la réponse pour le debug
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

        // Configuration du cookie avec des options plus permissives pour le développement
        response.cookies.set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Changed from 'strict' to 'lax' for development
            path: '/',
            maxAge: 60 * 60 * 24 // 24 heures
        });

        console.log("🍪 Cookie défini avec le token"); // Debug
        return response;

    } catch (error) {
        console.error("❌ Erreur login:", error);
        return NextResponse.json(
            {
                error: "Erreur serveur",
                details: error instanceof Error ? error.message : 'Erreur inconnue'
            },
            { status: 500 }
        );
    }
}