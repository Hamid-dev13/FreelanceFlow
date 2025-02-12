// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyJWT, signJWT } from '@/features/auth/services/jwt';

interface LoginPayload {
    email: string;
    password: string;
}

export async function POST(req: Request) {
    try {
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

        // Générer le token JWT avec le rôle
        const token = await signJWT({
            userId: user.id,
            email: user.email,
            role: user.role as 'DEVELOPER' | 'PROJECT_MANAGER',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 heures
        });

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Erreur login:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}