import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth/jwt";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        // Comprehensive validation
        const validationErrors: { [key: string]: string } = {};

        // Name validation
        if (!name || name.trim().length < 2) {
            validationErrors.name = "Nom invalide. Minimum 2 caractères.";
        }

        // Email validation
        if (!email) {
            validationErrors.email = "Email requis";
        } else if (!EMAIL_REGEX.test(email)) {
            validationErrors.email = "Format email invalide";
        }

        // Password validation
        if (!password) {
            validationErrors.password = "Mot de passe requis";
        } else if (password.length < 8) {
            validationErrors.password = "Mot de passe trop court. Minimum 8 caractères.";
        } else if (!PASSWORD_REGEX.test(password)) {
            validationErrors.password = "Mot de passe faible. Inclure majuscule, minuscule, chiffre et caractère spécial.";
        }

        // Return validation errors if any
        if (Object.keys(validationErrors).length > 0) {
            return NextResponse.json(
                { errors: validationErrors },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Un compte avec cet email existe déjà" },
                { status: 400 }
            );
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name.trim(),
            },
        });

        // Générer le token
        const token = signJWT({
            userId: user.id,
            email: user.email,
            name: user.name
        });

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création du compte" },
            { status: 500 }
        );
    }
}