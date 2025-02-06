// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth/jwt";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
        }

        // Générer le JWT avec jose (async)
        const token = await signJWT({
            userId: user.id,
            email: user.email
        });

        return NextResponse.json({ token });
    } catch (error) {
        console.error("Erreur login:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}