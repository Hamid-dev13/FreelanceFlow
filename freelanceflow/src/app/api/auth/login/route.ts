// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth/jwt";

export async function POST(req: Request) {
    try {
        // Parsing the request body
        const { email, password } = await req.json();

        // Check if both email and password are provided
        if (!email || !password) {
            return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
        }

        // Find the user in the database by email, and include the role field
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true // Include the role field
            }
        });

        // If user not found or password doesn't match
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
        }

        // Create a JWT token that includes the user's id, email, and role
        const token = await signJWT({
            userId: user.id,
            email: user.email,
            role: user.role // Add role to the JWT payload
        });

        // Return the token in the response
        return NextResponse.json({ token });

    } catch (error) {
        console.error("Erreur login:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
