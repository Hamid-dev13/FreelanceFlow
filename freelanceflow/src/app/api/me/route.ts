// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { verifyJWT } from "@/lib/auth/jwt";  // Assurez-vous d'importer la fonction verifyJWT

export async function GET(req: Request) {
    try {
        // Récupérer le token JWT dans les en-têtes
        const headersList = await headers();
        const authHeader = headersList.get("Authorization");

        if (!authHeader) {
            return NextResponse.json({ error: "Token requis" }, { status: 401 });
        }

        // Extraire le token du header 'Authorization'
        const token = authHeader.split(" ")[1];  // Le format attendu est "Bearer <token>"

        // Vérifier le token JWT
        const userData = await verifyJWT(token);
        if (!userData) {
            return NextResponse.json({ error: "Token invalide" }, { status: 401 });
        }

        // Récupérer l'utilisateur dans la base de données à partir de l'ID extrait du token
        const user = await prisma.user.findUnique({
            where: { id: userData.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        // Si l'utilisateur n'est pas trouvé
        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Erreur serveur:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
