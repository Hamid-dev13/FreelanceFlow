console.log("Signup route loaded");

// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth/jwt";

export async function POST(req: Request) {
    try {
        console.log("🔹 Requête reçue pour inscription");

        const { email, password, name } = await req.json();
        console.log("🔹 Données reçues :", { email, password: "********", name });

        // Validation basique
        if (!email || !password || !name) {
            console.warn("⚠️ Champs manquants");
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur existe
        console.log("🔹 Vérification de l'existence de l'utilisateur...");
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.warn("⚠️ Utilisateur déjà existant :", email);
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hasher le mot de passe
        console.log("🔹 Hashing du mot de passe...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔹 Mot de passe hashé avec succès");

        // Créer l'utilisateur
        console.log("🔹 Création de l'utilisateur...");
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        console.log("✅ Utilisateur créé avec succès :", user);

        // Générer le token
        console.log("🔹 Génération du token JWT...");
        const token = await signJWT({ userId: user.id, email: user.email });
        console.log("✅ Token généré :", token);

        return NextResponse.json({ token }, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        return NextResponse.json(
            { error: "Error creating user" },
            { status: 500 }
        );
    }
}
