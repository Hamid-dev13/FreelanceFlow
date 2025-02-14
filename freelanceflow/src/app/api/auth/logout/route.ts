import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Supprimer le refresh token des cookies
        const cookieStore = cookies();
        (await cookieStore).delete('refresh_token');

        // Préparer la réponse
        const response = NextResponse.json({
            message: "Déconnexion réussie"
        });

        // Supprimer le cookie de refresh token
        response.cookies.delete('refresh_token');

        return response;
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        return NextResponse.json(
            { error: "Erreur lors de la déconnexion" },
            { status: 500 }
        );
    }
}