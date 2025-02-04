import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth/jwt";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email et mot de passe requis" },
                { status: 400 }
            );
        }

        // Chercher l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Identifiants incorrects" },
                { status: 401 }
            );
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json(
                { error: "Identifiants incorrects" },
                { status: 401 }
            );
        }

        // Générer le JWT
        const token = signJWT({
            userId: user.id,
            email: user.email
        });

        return NextResponse.json({ token });

    } catch (error) {
        console.error("Erreur login:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}