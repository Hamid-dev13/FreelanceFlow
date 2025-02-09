// src/app/api/auth/reset-password/route.ts
import { resetPassword } from "@/lib/auth/passwordResetService";
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json(
                { error: "Token et nouveau mot de passe requis" },
                { status: 400 }
            );
        }

        await resetPassword(token, newPassword);

        return NextResponse.json({
            message: "Mot de passe réinitialisé avec succès"
        });
    } catch (error) {
        console.error('Erreur de réinitialisation:', error);
        return NextResponse.json(
            { error: "Impossible de réinitialiser le mot de passe" },
            { status: 400 }
        );
    }
}